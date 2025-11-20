-- =====================================
-- BASE DE DATOS SIMPLE PARA TURISMO
-- =====================================

-- TABLA: Usuarios (para login)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'agente',   -- admin / agente / manager
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- TABLA: Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL, -- DNI, CE o pasaporte
    telefono VARCHAR(20),
    email VARCHAR(150),
    ciudad VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Peru',
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- TABLA: Empleados
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    puesto VARCHAR(100),     -- Ej: Asesor, Guía, Soporte
    telefono VARCHAR(20),
    email VARCHAR(150),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- TABLA: Proveedores
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo VARCHAR(100),       -- hotel, transporte, agencia local, etc
    telefono VARCHAR(20),
    email VARCHAR(150),
    pais VARCHAR(100),
    ciudad VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- TABLA: Paquetes Turísticos
CREATE TABLE paquetes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    destino VARCHAR(150) NOT NULL,
    duracion_dias INTEGER NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cupos INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE SET NULL, -- quien lo gestiona
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- TABLA: Reservas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    numero_reserva VARCHAR(50) UNIQUE NOT NULL,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    paquete_id INTEGER NOT NULL REFERENCES paquetes(id) ON DELETE RESTRICT,
    empleado_id INTEGER REFERENCES empleados(id) ON DELETE SET NULL, -- quien realizó la reserva
    fecha_reserva TIMESTAMP DEFAULT NOW(),
    cantidad_personas INTEGER NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',  -- pendiente, confirmada, cancelada
    comentario TEXT
);

-- INDICES (opcionales)
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_paquete ON reservas(paquete_id);
CREATE INDEX idx_paquetes_destino ON paquetes(destino);
