-- TABLA: Mensajes de Comunicación
CREATE TABLE IF NOT EXISTS comunicacion_mensajes (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    remitente VARCHAR(50), -- 'usuario' (agente) o número de teléfono (cliente)
    tipo VARCHAR(20),      -- 'enviado', 'recibido'
    estado VARCHAR(20) DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
    whapi_message_id VARCHAR(100),
    creado_en TIMESTAMP DEFAULT NOW()
);

-- TABLA: Conexiones (Sesiones de WhatsApp)
CREATE TABLE IF NOT EXISTS comunicacion_conexiones (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    telefono VARCHAR(20),
    conectado_en TIMESTAMP DEFAULT NOW(),
    activo BOOLEAN DEFAULT TRUE
);

-- INDICES
CREATE INDEX idx_comunicacion_cliente ON comunicacion_mensajes(cliente_id);
CREATE INDEX idx_comunicacion_whapi_id ON comunicacion_mensajes(whapi_message_id);
