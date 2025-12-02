const pool = require('../db');

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // Run every hour

async function cleanupReservations() {
    console.log('Ejecutando limpieza de reservas...');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Cancelar "Pendiente de Pago" > 24 horas
        const pendingResult = await client.query(`
      UPDATE reservas 
      SET estado = 'cancelada' 
      WHERE estado = 'pendiente_pago' 
      AND fecha_reserva < NOW() - INTERVAL '24 hours'
      RETURNING id
    `);

        if (pendingResult.rows.length > 0) {
            console.log(`Canceladas ${pendingResult.rows.length} reservas pendientes de pago expiradas.`);
            for (const row of pendingResult.rows) {
                await client.query(
                    'INSERT INTO historial_reservas (reserva_id, estado_anterior, estado_nuevo, comentario) VALUES ($1, $2, $3, $4)',
                    [row.id, 'pendiente_pago', 'cancelada', 'Cancelación automática por falta de pago (24h)']
                );
            }
        }

        // 2. Caducar "Borrador" > 3 días
        const draftResult = await client.query(`
      UPDATE reservas 
      SET estado = 'cancelada' 
      WHERE estado = 'borrador' 
      AND fecha_reserva < NOW() - INTERVAL '3 days'
      RETURNING id
    `);

        if (draftResult.rows.length > 0) {
            console.log(`Caducadas ${draftResult.rows.length} reservas en borrador.`);
            for (const row of draftResult.rows) {
                await client.query(
                    'INSERT INTO historial_reservas (reserva_id, estado_anterior, estado_nuevo, comentario) VALUES ($1, $2, $3, $4)',
                    [row.id, 'borrador', 'cancelada', 'Caducidad automática de borrador (3 días)']
                );
            }
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error en limpieza de reservas:', err);
    } finally {
        client.release();
    }
}

function startCleanupJob() {
    // Run immediately on start
    cleanupReservations();
    // Schedule
    setInterval(cleanupReservations, CLEANUP_INTERVAL_MS);
}

module.exports = { startCleanupJob };
