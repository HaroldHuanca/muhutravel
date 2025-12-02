const fs = require('fs');
const path = require('path');
const pool = require('../db');

const SEEDS_DIR = path.join(__dirname, '../seeds');

async function seed() {
    const client = await pool.connect();
    try {
        if (!fs.existsSync(SEEDS_DIR)) {
            console.log('No se encontró el directorio de seeds.');
            return;
        }

        const files = fs.readdirSync(SEEDS_DIR)
            .filter(f => f.endsWith('.js') || f.endsWith('.sql'))
            .sort();

        for (const file of files) {
            console.log(`Ejecutando seed: ${file}...`);
            try {
                await client.query('BEGIN');

                if (file.endsWith('.sql')) {
                    const sql = fs.readFileSync(path.join(SEEDS_DIR, file), 'utf8');
                    await client.query(sql);
                } else if (file.endsWith('.js')) {
                    const seedModule = require(path.join(SEEDS_DIR, file));
                    if (seedModule.seed) {
                        await seedModule.seed(client);
                    } else {
                        console.warn(`Advertencia: ${file} no exporta una función 'seed'.`);
                    }
                }

                await client.query('COMMIT');
                console.log(`Seed ${file} completado.`);
            } catch (err) {
                await client.query('ROLLBACK');
                console.error(`Error en seed ${file}:`, err);
                // No salimos del proceso, intentamos los siguientes seeds?
                // Generalmente si un seed falla, queremos saberlo.
                process.exit(1);
            }
        }

        console.log('Todos los seeds se ejecutaron correctamente.');
    } catch (err) {
        console.error('Error general de seeding:', err);
        process.exit(1);
    } finally {
        client.release();
        pool.end();
    }
}

seed();
