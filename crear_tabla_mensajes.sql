-- ============================================
-- Tabla para almacenar mensajes de WhatsApp
-- ============================================

-- Crear tabla de mensajes
CREATE TABLE IF NOT EXISTS comunicacion_mensajes (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  mensaje TEXT NOT NULL,
  remitente VARCHAR(50) NOT NULL,  -- 'usuario' o 'cliente'
  tipo VARCHAR(20) NOT NULL,       -- 'enviado' o 'recibido'
  estado VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'sent', 'delivered', 'read'
  whapi_message_id VARCHAR(255),   -- ID del mensaje en whapi
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_comunicacion_cliente_id ON comunicacion_mensajes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_comunicacion_tipo ON comunicacion_mensajes(tipo);
CREATE INDEX IF NOT EXISTS idx_comunicacion_creado_en ON comunicacion_mensajes(creado_en);

-- Crear tabla para almacenar conexiones activas
CREATE TABLE IF NOT EXISTS comunicacion_conexiones (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  usuario_id INTEGER,
  telefono VARCHAR(20) NOT NULL,
  conectado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  desconectado_en TIMESTAMP,
  activa BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_comunicacion_conexiones_cliente ON comunicacion_conexiones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_comunicacion_conexiones_activa ON comunicacion_conexiones(activa);

-- Verificar que las tablas fueron creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('comunicacion_mensajes', 'comunicacion_conexiones');
