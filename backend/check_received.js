const db = require('./db');

async function checkReceivedMessages() {
    try {
        console.log('--- MENSAJES RECIBIDOS ---');
        const messages = await db.query(`
      SELECT m.id, m.cliente_id, c.nombres, m.mensaje, m.tipo, m.remitente 
      FROM comunicacion_mensajes m 
      LEFT JOIN clientes c ON m.cliente_id = c.id
      WHERE m.tipo = 'recibido'
      ORDER BY m.creado_en DESC
    `);
        console.log(messages.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkReceivedMessages();
