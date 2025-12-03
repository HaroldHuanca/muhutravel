-- ============================================================
-- 1. LIMPIEZA TOTAL (Borra datos antiguos para evitar conflictos)
-- ============================================================
TRUNCATE TABLE 
    historial_reservas, 
    pagos, 
    pasajeros, 
    reserva_proveedores, 
    reservas, 
    paquetes, 
    clientes, 
    proveedores, 
    empleados, 
    usuarios 
RESTART IDENTITY CASCADE;

-- ============================================================
-- 2. INSERCIÓN DE DATOS MAESTROS (Con IDs explícitos)
-- Usamos (id, col1, col2...) para asegurar que el ID sea 1
-- ============================================================

-- USUARIOS
INSERT INTO usuarios (id, username, password_hash, rol) VALUES
  (1, 'admin', 'hash123', 'admin'),
  (2, 'agente1', 'hash123', 'agente'),
  (3, 'agente2', 'hash123', 'agente'),
  (4, 'manager', 'hash123', 'manager');

-- EMPLEADOS
INSERT INTO empleados (id, nombres, apellidos, puesto, telefono, email) VALUES
  (1, 'Carlos', 'Lopez Rivas', 'Asesor', '989111222', 'carlos.lopez@agencia.com'),
  (2, 'Ana', 'Torres Vega', 'Guía', '989222333', 'ana.torres@agencia.com'),
  (3, 'Roberto', 'Paredes Silva', 'Soporte', '989333444', 'roberto.paredes@agencia.com');

-- PROVEEDORES
INSERT INTO proveedores (id, nombre, tipo, telefono, email, pais, ciudad) VALUES
  (1, 'Hotel Miraflores', 'hotel', '014444444', 'contacto@mirafloreshotel.com', 'Peru', 'Lima'),
  (2, 'Transporte Andino', 'transporte', '014555555', 'info@transporteandino.com', 'Peru', 'Cusco'),
  (3, 'Agency Local Cusco', 'agencia local', '014666666', 'reservas@cuscoagency.com', 'Peru', 'Cusco');

-- CLIENTES
INSERT INTO clientes (id, nombres, apellidos, documento, telefono, email, ciudad, pais) VALUES
  (1, 'Juan', 'Quispe Mamani', '12345678', '987111222', 'juan.quispe@example.com', 'Lima', 'Peru'),
  (2, 'María', 'Flores Huamán', '87654321', '987222333', 'maria.flores@example.com', 'Cusco', 'Peru'),
  (3, 'Luis', 'Sánchez Torres', '44556677', '987333444', 'luis.sanchez@example.com', 'Arequipa', 'Peru');

-- ============================================================
-- 3. INSERCIÓN DE DATOS TRANSACCIONALES (Dependen de los anteriores)
-- ============================================================

-- PAQUETES (Aquí fallaba antes, ahora funcionará porque Proveedor 1 y Empleado 1 existen seguro)
INSERT INTO paquetes 
  (id, nombre, destino, duracion_dias, precio, cupos, min_cupos, tipo, descripcion, precio_grupo, max_pasajeros_recomendado, precio_adicional_persona, fecha_inicio, fecha_fin, proveedor_id, empleado_id) 
VALUES
  (1, 'Aventura en Cusco 3D/2N', 'Cusco', 3, 1200.00, 20, 1, 'REGULAR', 'Paquete clásico a Cusco', 3000.00, 10, 120.00, '2025-03-01', '2025-03-04', 1, 1),
  (2, 'Tour Montaña de 7 Colores', 'Cusco', 1, 250.00, 15, 1, 'PRIVADO', 'Excursión a Vinicunca', NULL, 8, 50.00, '2025-03-10', '2025-03-10', 2, 2),
  (3, 'City Tour Lima Premium', 'Lima', 1, 150.00, 25, 1, 'REGULAR', 'Tour por lo mejor de Lima', NULL, 15, 20.00, '2025-04-01', '2025-04-01', 1, 1);

-- RESERVAS
INSERT INTO reservas 
  (id, numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario) 
VALUES
  (1, 'RSV-1001', 1, 1, 1, 2, 2400.00, 'confirmada', 'Reserva familiar - pago inicial recibido'),
  (2, 'RSV-1002', 3, 2, 2, 1, 250.00, 'pendiente', 'Cliente solicita más info'),
  (3, 'RSV-1003', 2, 3, 1, 4, 600.00, 'confirmada', 'Grupo amigos');

-- RESERVA_PROVEEDORES
INSERT INTO reserva_proveedores (reserva_id, proveedor_id, tipo_servicio, costo, notas) VALUES
  (1, 1, 'hotel', 800.00, 'Incluye 2 noches en habitación doble'),
  (1, 2, 'transporte', 150.00, 'Traslado aeropuerto - hotel'),
  (2, 3, 'tour', 120.00, 'Guía local incluido'),
  (3, 1, 'hotel', 300.00, '1 noche para grupo');

-- PASAJEROS
INSERT INTO pasajeros (reserva_id, nombres, apellidos, tipo_documento, documento, fecha_nacimiento) VALUES
  (1, 'Juan', 'Quispe Mamani', 'DNI', '12345678', '1990-04-10'),
  (1, 'Lucía', 'Quispe Flores', 'DNI', '98765432', '1995-07-20'),
  (2, 'Luis', 'Sánchez Torres', 'DNI', '44556677', '1992-10-15'),
  (3, 'María', 'Flores Huamán', 'DNI', '87654321', '1993-02-05'),
  (3, 'Pedro', 'Romero Diaz', 'DNI', '55667788', '1989-09-09'),
  (3, 'Ana', 'Gonzales Perez', 'DNI', '66778899', '1991-12-30');

-- PAGOS
INSERT INTO pagos (reserva_id, monto, metodo_pago, referencia, estado, registrado_por, notas) VALUES
  (1, 1200.00, 'Transferencia', 'OP123456', 'completado', 1, 'Pago inicial 50%'),
  (1, 1200.00, 'Tarjeta', 'TX789012', 'completado', 1, 'Pago final'),
  (2, 50.00, 'Yape', 'YP987654', 'pendiente', 2, 'Abono parcial'),
  (3, 600.00, 'Efectivo', 'REC-300', 'completado', 2, 'Pago total por grupo');

-- HISTORIAL
INSERT INTO historial_reservas (reserva_id, estado_anterior, estado_nuevo, usuario_id, comentario) VALUES
  (1, 'pendiente', 'confirmada', 1, 'Pago recibido y reserva confirmada'),
  (2, 'pendiente', 'pendiente', 2, 'Cliente pidió tiempo adicional para pago'),
  (3, 'pendiente', 'confirmada', 2, 'Pago total recibido en efectivo');

-- ============================================================
-- 4. AJUSTAR SECUENCIAS (IMPORTANTE)
-- Como insertamos IDs manualmente (1,2,3), debemos decirle a PostgreSQL
-- que el próximo ID automático debe ser 4 (o el maximo + 1).
-- ============================================================
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));
SELECT setval('empleados_id_seq', (SELECT MAX(id) FROM empleados));
SELECT setval('proveedores_id_seq', (SELECT MAX(id) FROM proveedores));
SELECT setval('clientes_id_seq', (SELECT MAX(id) FROM clientes));