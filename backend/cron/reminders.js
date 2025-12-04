const cron = require('node-cron');
const db = require('../db');
const { enviarMensaje } = require('../services/whatsappService');

const startReminderJob = () => {
    // Ejecutar todos los días a las 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('⏰ Ejecutando job de recordatorios de reservas...');
        try {
            // Buscar reservas que inician MAÑANA
            // Asumimos que la fecha de inicio está en paquetes.fecha_inicio (para tours fijos)
            // Ojo: Si la reserva tiene fecha específica diferente, ajustar query.
            // Por ahora, usamos paquetes.fecha_inicio

            const query = `
        SELECT r.id, r.cliente_id, r.numero_reserva, c.nombres, c.telefono, p.nombre as paquete_nombre, p.fecha_inicio
        FROM reservas r
        JOIN clientes c ON r.cliente_id = c.id
        JOIN paquetes p ON r.paquete_id = p.id
        WHERE r.estado IN ('confirmada', 'en_servicio')
        AND p.fecha_inicio::date = (CURRENT_DATE + INTERVAL '1 day')::date
      `;

            const result = await db.query(query);

            if (result.rows.length === 0) {
                console.log('✅ No hay recordatorios para enviar hoy.');
                return;
            }

            console.log(`📨 Enviando ${result.rows.length} recordatorios...`);

            for (const reserva of result.rows) {
                if (reserva.telefono) {
                    const mensaje = `¡Hola ${reserva.nombres}! 🌟 Te recordamos que tu tour *${reserva.paquete_nombre}* comienza mañana. Por favor revisa los detalles y prepárate para la aventura. ¡Nos vemos pronto!`;

                    try {
                        await enviarMensaje(reserva.cliente_id, reserva.telefono, mensaje);
                        console.log(`   -> Recordatorio enviado a ${reserva.nombres} (${reserva.numero_reserva})`);
                    } catch (err) {
                        console.error(`   ❌ Error enviando a ${reserva.nombres}:`, err.message);
                    }
                }
            }

        } catch (error) {
            console.error('❌ Error en job de recordatorios:', error);
        }
    });
};

module.exports = { startReminderJob };
