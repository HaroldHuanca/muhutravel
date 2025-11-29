const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las reservas
router.get('/', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT 
        r.id, r.numero_reserva, r.cliente_id, r.paquete_id, r.empleado_id,
        r.fecha_reserva, r.cantidad_personas, r.precio_total, r.estado, r.comentario,
        c.nombres as cliente_nombres, c.apellidos as cliente_apellidos,
        p.nombre as paquete_nombre,
        e.nombres as empleado_nombres, e.apellidos as empleado_apellidos
      FROM reservas r
      LEFT JOIN clientes c ON r.cliente_id = c.id
      LEFT JOIN paquetes p ON r.paquete_id = p.id
      LEFT JOIN empleados e ON r.empleado_id = e.id
      WHERE r.numero_reserva ILIKE $1 OR c.nombres ILIKE $1 OR p.nombre ILIKE $1
      ORDER BY r.fecha_reserva DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// ============ RUTAS CON /proveedores (MÁS ESPECÍFICAS) ============

// Obtener proveedores de una reserva
router.get('/:id/proveedores', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('Obteniendo proveedores para reserva ID:', id);
    
    const result = await pool.query(
      `SELECT rp.id, rp.reserva_id, rp.proveedor_id, rp.tipo_servicio, rp.costo, rp.notas, rp.creado_en,
              pr.nombre as proveedor_nombre, pr.tipo as proveedor_tipo, pr.email, pr.telefono
       FROM reserva_proveedores rp
       LEFT JOIN proveedores pr ON rp.proveedor_id = pr.id
       WHERE rp.reserva_id = $1
       ORDER BY rp.creado_en DESC`,
      [id]
    );
    console.log('Proveedores encontrados:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener proveedores:', err);
    res.status(500).json({ error: 'Error al obtener proveedores de la reserva', details: err.message });
  }
});

// Agregar proveedor a reserva
router.post('/:id/proveedores', verifyToken, async (req, res) => {
  try {
    const { proveedor_id, tipo_servicio, costo, notas } = req.body;
    const reserva_id = parseInt(req.params.id);

    if (!proveedor_id) {
      return res.status(400).json({ error: 'proveedor_id es requerido' });
    }

    const result = await pool.query(
      `INSERT INTO reserva_proveedores (reserva_id, proveedor_id, tipo_servicio, costo, notas)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [reserva_id, proveedor_id, tipo_servicio, costo, notas]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Este proveedor ya está asignado a esta reserva' });
    }
    res.status(500).json({ error: 'Error al agregar proveedor a la reserva' });
  }
});

// Actualizar proveedor en reserva
router.put('/:id/proveedores/:rp_id', verifyToken, async (req, res) => {
  try {
    const { tipo_servicio, costo, notas } = req.body;
    const result = await pool.query(
      `UPDATE reserva_proveedores 
       SET tipo_servicio = $1, costo = $2, notas = $3
       WHERE id = $4 AND reserva_id = $5
       RETURNING *`,
      [tipo_servicio, costo, notas, req.params.rp_id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Relación reserva-proveedor no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar proveedor de la reserva' });
  }
});

// Eliminar proveedor de reserva
router.delete('/:id/proveedores/:rp_id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM reserva_proveedores 
       WHERE id = $1 AND reserva_id = $2
       RETURNING id`,
      [req.params.rp_id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Relación reserva-proveedor no encontrada' });
    }

    res.json({ message: 'Proveedor removido de la reserva' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar proveedor de la reserva' });
  }
});

// ============ RUTAS SIN /proveedores (MENOS ESPECÍFICAS) ============

// Obtener reserva por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('Buscando reserva con ID:', id);
    
    const result = await pool.query(
      `SELECT 
        r.id, r.numero_reserva, r.cliente_id, r.paquete_id, r.empleado_id,
        r.fecha_reserva, r.cantidad_personas, r.precio_total, r.estado, r.comentario,
        c.nombres as cliente_nombres, c.apellidos as cliente_apellidos,
        p.nombre as paquete_nombre,
        e.nombres as empleado_nombres, e.apellidos as empleado_apellidos,
        COALESCE((SELECT SUM(monto) FROM pagos WHERE reserva_id = r.id AND estado = 'completado'), 0) as total_pagado
      FROM reservas r
      LEFT JOIN clientes c ON r.cliente_id = c.id
      LEFT JOIN paquetes p ON r.paquete_id = p.id
      LEFT JOIN empleados e ON r.empleado_id = e.id
      WHERE r.id = $1`,
      [id]
    );
    
    console.log('Resultado de la consulta:', result.rows);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada', id: id });
    }

    const reserva = result.rows[0];

    // Obtener pasajeros
    const pasajeros = await pool.query('SELECT * FROM pasajeros WHERE reserva_id = $1', [id]);
    reserva.pasajeros = pasajeros.rows;

    // Obtener pagos
    const pagos = await pool.query('SELECT * FROM pagos WHERE reserva_id = $1 ORDER BY fecha_pago DESC', [id]);
    reserva.pagos = pagos.rows;

    // Obtener historial
    const historial = await pool.query(`
      SELECT h.*, u.username as usuario_nombre 
      FROM historial_reservas h
      LEFT JOIN usuarios u ON h.usuario_id = u.id
      WHERE h.reserva_id = $1 
      ORDER BY h.fecha_cambio DESC`, 
      [id]
    );
    reserva.historial = historial.rows;

    res.json(reserva);
  } catch (err) {
    console.error('Error al obtener reserva:', err);
    res.status(500).json({ error: 'Error al obtener reserva', details: err.message });
  }
});

// Crear reserva
router.post('/', verifyToken, async (req, res) => {
  try {
    const { numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario } = req.body;

    if (!numero_reserva || !cliente_id || !paquete_id || !cantidad_personas || !precio_total) {
      return res.status(400).json({ error: 'Campos requeridos: numero_reserva, cliente_id, paquete_id, cantidad_personas, precio_total' });
    }

    const result = await pool.query(
      'INSERT INTO reservas (numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado || 'pendiente', comentario]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// Actualizar reserva (con historial)
router.put('/:id', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario, usuario_id } = req.body;
    const reserva_id = req.params.id;

    // Obtener estado anterior
    const oldReserva = await client.query('SELECT estado FROM reservas WHERE id = $1', [reserva_id]);
    if (oldReserva.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    const estadoAnterior = oldReserva.rows[0].estado;

    const result = await client.query(
      'UPDATE reservas SET numero_reserva = $1, cliente_id = $2, paquete_id = $3, empleado_id = $4, cantidad_personas = $5, precio_total = $6, estado = $7, comentario = $8 WHERE id = $9 RETURNING *',
      [numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario, reserva_id]
    );

    // Registrar en historial si hubo cambio de estado
    if (estado && estado !== estadoAnterior) {
      await client.query(
        'INSERT INTO historial_reservas (reserva_id, estado_anterior, estado_nuevo, usuario_id, comentario) VALUES ($1, $2, $3, $4, $5)',
        [reserva_id, estadoAnterior, estado, usuario_id || req.user?.id, comentario] // Asumiendo que req.user tiene el ID del usuario logueado
      );
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar reserva' });
  } finally {
    client.release();
  }
});

// ============ RUTAS PARA PASAJEROS ============

// Agregar pasajero
router.post('/:id/pasajeros', verifyToken, async (req, res) => {
  try {
    const { nombres, apellidos, tipo_documento, documento, fecha_nacimiento } = req.body;
    const reserva_id = req.params.id;

    const result = await pool.query(
      'INSERT INTO pasajeros (reserva_id, nombres, apellidos, tipo_documento, documento, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [reserva_id, nombres, apellidos, tipo_documento, documento, fecha_nacimiento]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar pasajero' });
  }
});

// Eliminar pasajero
router.delete('/:id/pasajeros/:pid', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM pasajeros WHERE id = $1 AND reserva_id = $2', [req.params.pid, req.params.id]);
    res.json({ message: 'Pasajero eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar pasajero' });
  }
});

// ============ RUTAS PARA PAGOS ============

// Registrar pago
router.post('/:id/pagos', verifyToken, async (req, res) => {
  try {
    const { monto, metodo_pago, referencia, notas, usuario_id } = req.body;
    const reserva_id = req.params.id;

    const result = await pool.query(
      'INSERT INTO pagos (reserva_id, monto, metodo_pago, referencia, notas, registrado_por) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [reserva_id, monto, metodo_pago, referencia, notas, usuario_id || req.user?.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar pago' });
  }
});

// Actualizar estado de pago (ej. anular)
router.put('/:id/pagos/:pid', verifyToken, async (req, res) => {
  try {
    const { estado } = req.body;
    const result = await pool.query(
      'UPDATE pagos SET estado = $1 WHERE id = $2 AND reserva_id = $3 RETURNING *',
      [estado, req.params.pid, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar pago' });
  }
});

// Eliminar reserva
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM reservas WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
});

module.exports = router;
