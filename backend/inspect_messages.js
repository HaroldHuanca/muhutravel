const db = require('./db');

async function inspectMessages() {
    try {
        console.log('--- CLIENTES ---');
        const clients = await db.query("SELECT id, nombres, apellidos, telefono FROM clientes WHERE nombres ILIKE '%Angelo%' OR nombres ILIKE '%Harol%'");
        console.log(clients.rows);

        console.log('\n--- MENSAJES ---');
        const messages = await db.query(`
      SELECT m.id, m.cliente_id, c.nombres, m.mensaje, m.tipo, m.remitente 
      FROM comunicacion_mensajes m 
      LEFT JOIN clientes c ON m.cliente_id = c.id
      ORDER BY m.creado_en DESC LIMIT 20
    `);
        console.log(messages.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectMessages();
