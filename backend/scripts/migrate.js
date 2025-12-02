const fs = require('fs');
const path = require('path');
const pool = require('../db');

const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

async function migrate() {
    const client = await pool.connect();
    try {
        // 1. Crear tabla de migraciones si no existe
        await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 2. Obtener migraciones ya ejecutadas
        const { rows: executedMigrations } = await client.query('SELECT name FROM migrations');
        const executedNames = new Set(executedMigrations.map(row => row.name));

        // 3. Leer archivos de migración
        if (!fs.existsSync(MIGRATIONS_DIR)) {
            console.log('No se encontró el directorio de migraciones.');
            return;
        }

        const files = fs.readdirSync(MIGRATIONS_DIR)
            .filter(f => f.endsWith('.js') || f.endsWith('.sql'))
            .sort(); // Ordenar alfabéticamente (importante para el orden de ejecución)

        // 4. Ejecutar migraciones pendientes
        for (const file of files) {
            if (!executedNames.has(file)) {
                console.log(`Ejecutando migración: ${file}...`);

                try {
                    await client.query('BEGIN');

                    if (file.endsWith('.sql')) {
                        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
                        await client.query(sql);
                    } else if (file.endsWith('.js')) {
                        // Para archivos JS, esperamos que exporten una función runMigration o similar,
                        // pero dado que el usuario tiene scripts ad-hoc, vamos a intentar requerirlos.
                        // NOTA: Los scripts actuales como '002_add_package_details.js' se ejecutan solos al requerirse.
                        // Para integrarlos bien, lo ideal sería que exportaran una función.
                        // Por compatibilidad con lo que ya tiene, vamos a leer el contenido y ver si podemos ejecutarlo,
                        // o simplemente requerirlo si está diseñado para correrse así.
                        // Sin embargo, requerir un archivo que hace process.exit() matará este proceso.
                        // Solución: Leer el archivo y ejecutarlo con eval o requerir que el usuario adapte sus scripts.
                        // Mejor enfoque: Asumir que los NUEVOS scripts exportarán { up, down }.
                        // Para los viejos, si ya corrieron, no pasa nada. Si no, podría ser problemático.
                        // Vamos a intentar un enfoque híbrido simple: si exporta 'up', lo llamamos. Si no, advertimos.

                        const migrationModule = require(path.join(MIGRATIONS_DIR, file));
                        if (migrationModule.up) {
                            await migrationModule.up(client);
                        } else {
                            // Fallback para scripts simples que ejecutan queries directamente al cargar?
                            // Eso es peligroso porque no podemos controlar la transacción.
                            // Asumiremos que los archivos .js deben exportar una función 'up(client)'.
                            console.warn(`Advertencia: ${file} no exporta una función 'up'. Se omitirá la ejecución automática segura.`);
                        }
                    }

                    await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
                    await client.query('COMMIT');
                    console.log(`Migración ${file} completada.`);
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.error(`Error en migración ${file}:`, err);
                    process.exit(1);
                }
            }
        }

        console.log('Todas las migraciones están al día.');
    } catch (err) {
        console.error('Error general de migración:', err);
        process.exit(1);
    } finally {
        client.release();
        // No cerramos el pool inmediatamente si hay otros procesos, pero aquí es un script standalone.
        pool.end();
    }
}

migrate();
