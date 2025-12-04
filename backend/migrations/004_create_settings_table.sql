-- TABLA: Configuración del Sistema (Key-Value Store)
CREATE TABLE IF NOT EXISTS configuracion (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT,
    descripcion TEXT,
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Insertar configuración inicial (opcional)
INSERT INTO configuracion (clave, valor, descripcion)
VALUES ('WHAPI_TOKEN', '', 'Token de autenticación para Whapi.cloud')
ON CONFLICT (clave) DO NOTHING;
