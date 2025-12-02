const request = require('supertest');
const express = require('express');
const pool = require('../db');
const reservaRoutes = require('../routes/reservas');
const paqueteRoutes = require('../routes/paquetes');
const clienteRoutes = require('../routes/clientes');
const authRoutes = require('../routes/auth');

// Mock auth middleware
jest.mock('../middleware/auth', () => ({
    verifyToken: (req, res, next) => {
        req.user = { id: 1, rol: 'admin' };
        next();
    }
}));

const app = express();
app.use(express.json());
app.use('/api/reservas', reservaRoutes);
app.use('/api/paquetes', paqueteRoutes);

// Helper to create test data
async function createTestData() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Clean tables
        await client.query('DELETE FROM pagos');
        await client.query('DELETE FROM historial_reservas');
        await client.query('DELETE FROM reservas');
        await client.query('DELETE FROM paquetes');
        await client.query('DELETE FROM clientes');

        // Create Client
        const cli = await client.query("INSERT INTO clientes (nombres, apellidos, documento) VALUES ('Test', 'User', '12345678') RETURNING id");
        const clientId = cli.rows[0].id;

        // Create Regular Package
        const pkgReg = await client.query(`
          INSERT INTO paquetes (
            nombre, destino, duracion_dias, precio, cupos, min_cupos, tipo, 
            descripcion, fecha_inicio, fecha_fin, activo
          ) 
          VALUES (
            'Regular Tour', 'Cusco', 1, 100, 10, 1, 'REGULAR', 
            'Descripcion regular', NOW() + INTERVAL '10 days', NOW() + INTERVAL '11 days', true
          ) 
          RETURNING id
        `);
        const pkgRegId = pkgReg.rows[0].id;

        // Create Private Package
        const pkgPriv = await client.query(`
          INSERT INTO paquetes (
            nombre, destino, duracion_dias, precio_grupo, max_pasajeros_recomendado, precio_adicional_persona, tipo, 
            descripcion, fecha_inicio, fecha_fin, activo, cupos, precio
          ) 
          VALUES (
            'Private Tour', 'Sacred Valley', 1, 500, 4, 50, 'PRIVADO', 
            'Descripcion privada', NOW() + INTERVAL '20 days', NOW() + INTERVAL '21 days', true, 1, 0
          ) 
          RETURNING id
        `);
        const pkgPrivId = pkgPriv.rows[0].id;

        await client.query('COMMIT');
        return { clientId, pkgRegId, pkgPrivId };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

describe('Business Rules Tests', () => {
    let testData;

    beforeAll(async () => {
        testData = await createTestData();
    });

    afterAll(async () => {
        await pool.end();
    });

    test('Should create a reservation successfully', async () => {
        const res = await request(app)
            .post('/api/reservas')
            .send({
                numero_reserva: 'RES-001',
                cliente_id: testData.clientId,
                paquete_id: testData.pkgRegId,
                cantidad_personas: 2,
                precio_total: 200
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.estado).toBe('borrador');
    });

    test('Should fail to create reservation if client has debt', async () => {
        // First reservation is unpaid (borrador/pendiente), so it counts as debt?
        // Rule: "Si el cliente tiene pagos pendientes...".
        // Our logic checks: sum(pagado) < sum(precio) OR estado='pendiente_pago'.
        // The previous test created a 'borrador'. Does 'borrador' count as debt?
        // Usually draft doesn't count as debt until confirmed/pending payment.
        // Let's update the first reservation to 'pendiente_pago'.

        // Manually update first reservation to 'pendiente_pago'
        await pool.query("UPDATE reservas SET estado = 'pendiente_pago' WHERE numero_reserva = 'RES-001'");

        const res = await request(app)
            .post('/api/reservas')
            .send({
                numero_reserva: 'RES-002',
                cliente_id: testData.clientId,
                paquete_id: testData.pkgRegId,
                cantidad_personas: 1,
                precio_total: 100
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/deudas|pagos pendientes/);
    });

    test('Should auto-confirm reservation on 30% payment', async () => {
        // Get the ID of RES-001
        const r = await pool.query("SELECT id FROM reservas WHERE numero_reserva = 'RES-001'");
        const resId = r.rows[0].id;

        // Pay 30% (60 of 200)
        const res = await request(app)
            .post(`/api/reservas/${resId}/pagos`)
            .send({
                monto: 60,
                metodo_pago: 'Efectivo',
                referencia: 'REF001'
            });

        expect(res.statusCode).toBe(201);

        // Check status
        const updated = await pool.query("SELECT estado FROM reservas WHERE id = $1", [resId]);
        expect(updated.rows[0].estado).toBe('confirmada');
    });

    test('Should fail to move to "En Servicio" if not fully paid', async () => {
        const r = await pool.query("SELECT id FROM reservas WHERE numero_reserva = 'RES-001'");
        const resId = r.rows[0].id;

        const res = await request(app)
            .put(`/api/reservas/${resId}`)
            .send({
                estado: 'en_servicio'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/pago total/);
    });

    test('Should succeed to move to "En Servicio" if fully paid', async () => {
        const r = await pool.query("SELECT id FROM reservas WHERE numero_reserva = 'RES-001'");
        const resId = r.rows[0].id;

        // Pay remaining 140
        await request(app)
            .post(`/api/reservas/${resId}/pagos`)
            .send({
                monto: 140,
                metodo_pago: 'Efectivo',
                referencia: 'REF002'
            });

        const res = await request(app)
            .put(`/api/reservas/${resId}`)
            .send({
                estado: 'en_servicio'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.estado).toBe('en_servicio');
    });

});
