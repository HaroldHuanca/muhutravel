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

-- TABLA INTERMEDIA: Relación muchos a muchos entre reservas y proveedores
CREATE TABLE reserva_proveedores (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    proveedor_id INTEGER NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
    tipo_servicio VARCHAR(100),   -- hotel, transporte, tours, etc.
    costo DECIMAL(10,2),          -- costo facturado por el proveedor
    notas TEXT,
    creado_en TIMESTAMP DEFAULT NOW(),

    -- Evitar duplicados del mismo proveedor en la misma reserva
    UNIQUE (reserva_id, proveedor_id)
);




-- TABLA: Pasajeros (Detalle de personas en la reserva)
CREATE TABLE pasajeros (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    tipo_documento VARCHAR(50), -- DNI, Pasaporte, CE
    documento VARCHAR(50),      -- Número de documento
    fecha_nacimiento DATE,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- TABLA: Pagos (Control de abonos y saldos)
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT NOW(),
    metodo_pago VARCHAR(100),   -- Efectivo, Transferencia, Tarjeta, Yape/Plin
    referencia VARCHAR(100),    -- Código de operación, nro recibo
    estado VARCHAR(50) DEFAULT 'completado', -- completado, pendiente, rechazado
    registrado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    notas TEXT
);

-- TABLA: Historial de Reservas (Auditoría de estados)
CREATE TABLE historial_reservas (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    fecha_cambio TIMESTAMP DEFAULT NOW(),
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    comentario TEXT
);

-- INDICES (opcionales)
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_paquete ON reservas(paquete_id);
CREATE INDEX idx_paquetes_destino ON paquetes(destino);
CREATE INDEX idx_pasajeros_reserva ON pasajeros(reserva_id);
CREATE INDEX idx_pagos_reserva ON pagos(reserva_id);

