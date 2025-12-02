const pool = require('../db');

async function up(client) {
    // Si se pasa un cliente (dentro de una transacción del runner), usarlo.
    // Si no, usar el pool global (para compatibilidad o ejecución manual, aunque idealmente siempre debería ser via runner).
    // Nota: El runner pasa 'client', que es una conexión específica.
    const db = client || pool;

    try {
        console.log('Iniciando migración de paquetes...');

        const queries = [
            "ALTER TABLE paquetes ADD COLUMN IF NOT EXISTS descripcion TEXT;",
            "ALTER TABLE paquetes ADD COLUMN IF NOT EXISTS precio_grupo DECIMAL(10,2);",
            "ALTER TABLE paquetes ADD COLUMN IF NOT EXISTS max_pasajeros_recomendado INTEGER;",
            "ALTER TABLE paquetes ADD COLUMN IF NOT EXISTS precio_adicional_persona DECIMAL(10,2);"
        ];

        for (const query of queries) {
            await db.query(query);
            console.log(`Ejecutado: ${query}`);
        }

        console.log('Migración completada con éxito.');
    } catch (err) {
        console.error('Error durante la migración:', err);
        throw err; // Re-lanzar para que el runner sepa que falló
    }
}

module.exports = { up };

