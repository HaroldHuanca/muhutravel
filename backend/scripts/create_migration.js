const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

const name = process.argv[2];
if (!name) {
    console.error('Por favor proporcione un nombre para la migración.');
    console.error('Uso: npm run migrate:create <nombre_descriptivo>');
    process.exit(1);
}

// Asegurar que el directorio existe
if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
const filename = `${timestamp}_${name}.js`;
const filepath = path.join(MIGRATIONS_DIR, filename);

const template = `const pool = require('../db');

async function up(client) {
    const db = client || pool;
    // Escribe tu lógica de migración aquí
    // await db.query('...');
}

async function down(client) {
    const db = client || pool;
    // Escribe la lógica para revertir la migración aquí (opcional)
}

module.exports = { up, down };
`;

fs.writeFileSync(filepath, template);
console.log(`Migración creada: ${filepath}`);
