TRUNCATE TABLE usuarios, clientes, empleados, proveedores, paquetes, reservas, reserva_proveedores, pasajeros, pagos, historial_reservas RESTART IDENTITY CASCADE;

INSERT INTO usuarios (username, password_hash, rol, activo, creado_en)
VALUES
('admin', 'hash123', 'admin', TRUE, NOW()),
('agente1', 'hash123', 'agente', TRUE, NOW()),
('agente2', 'hash123', 'agente', TRUE, NOW()),
('manager', 'hash123', 'manager', TRUE, NOW());

INSERT INTO clientes (nombres, apellidos, documento, telefono, email, ciudad, pais, activo, creado_en)
VALUES
('Juan', 'Quispe Mamani', 'DNI40506070', '987654321', 'juan.quispe@gmail.com', 'Cusco', 'Peru', TRUE, NOW()),
('Maria', 'Flores Huaman', 'DNI41516171', '987654322', 'maria.flores@gmail.com', 'Cusco', 'Peru', TRUE, NOW()),
('Carlos', 'Sanchez Vega', 'DNI42526272', '987654323', 'carlos.sanchez@gmail.com', 'Lima', 'Peru', TRUE, NOW()),
('Ana', 'Torres Lopez', 'DNI43536373', '987654324', 'ana.torres@gmail.com', 'Arequipa', 'Peru', TRUE, NOW()),
('Luis', 'Gomez Diaz', 'DNI44546474', '987654325', 'luis.gomez@gmail.com', 'Lima', 'Peru', TRUE, NOW()),
('Elena', 'Rojas Cruz', 'DNI45556575', '987654326', 'elena.rojas@gmail.com', 'Cusco', 'Peru', TRUE, NOW()),
('Pedro', 'Castillo Ruiz', 'DNI46566676', '987654327', 'pedro.castillo@gmail.com', 'Puno', 'Peru', TRUE, NOW()),
('Sofia', 'Mendoza Aliaga', 'DNI47576777', '987654328', 'sofia.mendoza@gmail.com', 'Tacna', 'Peru', TRUE, NOW()),
('Jorge', 'Salazar Pinto', 'DNI48586878', '987654329', 'jorge.salazar@gmail.com', 'Cusco', 'Peru', TRUE, NOW()),
('Lucia', 'Vargas Soto', 'DNI49596979', '987654330', 'lucia.vargas@gmail.com', 'Lima', 'Peru', TRUE, NOW()),
('John', 'Smith', 'PAS100001', '123456789', 'john.smith@email.com', 'New York', 'USA', TRUE, NOW()),
('Emily', 'Johnson', 'PAS100002', '123456790', 'emily.johnson@email.com', 'Los Angeles', 'USA', TRUE, NOW()),
('Michael', 'Brown', 'PAS100003', '123456791', 'michael.brown@email.com', 'Chicago', 'USA', TRUE, NOW()),
('Sarah', 'Davis', 'PAS100004', '123456792', 'sarah.davis@email.com', 'Houston', 'USA', TRUE, NOW()),
('David', 'Wilson', 'PAS100005', '123456793', 'david.wilson@email.com', 'Phoenix', 'USA', TRUE, NOW()),
('Emma', 'Taylor', 'PAS100006', '123456794', 'emma.taylor@email.com', 'London', 'UK', TRUE, NOW()),
('James', 'Anderson', 'PAS100007', '123456795', 'james.anderson@email.com', 'Manchester', 'UK', TRUE, NOW()),
('Olivia', 'Thomas', 'PAS100008', '123456796', 'olivia.thomas@email.com', 'Liverpool', 'UK', TRUE, NOW()),
('Robert', 'Martinez', 'PAS100009', '123456797', 'robert.martinez@email.com', 'Madrid', 'Spain', TRUE, NOW()),
('Isabella', 'Hernandez', 'PAS100010', '123456798', 'isabella.hernandez@email.com', 'Barcelona', 'Spain', TRUE, NOW()),
('William', 'Lopez', 'PAS100011', '123456799', 'william.lopez@email.com', 'Valencia', 'Spain', TRUE, NOW()),
('Sophia', 'Gonzalez', 'PAS100012', '123456800', 'sophia.gonzalez@email.com', 'Seville', 'Spain', TRUE, NOW()),
('Liam', 'Perez', 'PAS100013', '123456801', 'liam.perez@email.com', 'Paris', 'France', TRUE, NOW()),
('Ava', 'Wilson', 'PAS100014', '123456802', 'ava.wilson@email.com', 'Lyon', 'France', TRUE, NOW()),
('Noah', 'Anderson', 'PAS100015', '123456803', 'noah.anderson@email.com', 'Marseille', 'France', TRUE, NOW()),
('Mia', 'Thomas', 'PAS100016', '123456804', 'mia.thomas@email.com', 'Berlin', 'Germany', TRUE, NOW()),
('Ethan', 'Martinez', 'PAS100017', '123456805', 'ethan.martinez@email.com', 'Munich', 'Germany', TRUE, NOW()),
('Charlotte', 'Hernandez', 'PAS100018', '123456806', 'charlotte.hernandez@email.com', 'Hamburg', 'Germany', TRUE, NOW()),
('Alexander', 'Lopez', 'PAS100019', '123456807', 'alexander.lopez@email.com', 'Rome', 'Italy', TRUE, NOW()),
('Amelia', 'Gonzalez', 'PAS100020', '123456808', 'amelia.gonzalez@email.com', 'Milan', 'Italy', TRUE, NOW()),
('Benjamin', 'Perez', 'PAS100021', '123456809', 'benjamin.perez@email.com', 'Naples', 'Italy', TRUE, NOW()),
('Harper', 'Wilson', 'PAS100022', '123456810', 'harper.wilson@email.com', 'Tokyo', 'Japan', TRUE, NOW()),
('Lucas', 'Anderson', 'PAS100023', '123456811', 'lucas.anderson@email.com', 'Osaka', 'Japan', TRUE, NOW()),
('Evelyn', 'Thomas', 'PAS100024', '123456812', 'evelyn.thomas@email.com', 'Kyoto', 'Japan', TRUE, NOW()),
('Mason', 'Martinez', 'PAS100025', '123456813', 'mason.martinez@email.com', 'Sydney', 'Australia', TRUE, NOW()),
('Abigail', 'Hernandez', 'PAS100026', '123456814', 'abigail.hernandez@email.com', 'Melbourne', 'Australia', TRUE, NOW()),
('Logan', 'Lopez', 'PAS100027', '123456815', 'logan.lopez@email.com', 'Brisbane', 'Australia', TRUE, NOW()),
('Ella', 'Gonzalez', 'PAS100028', '123456816', 'ella.gonzalez@email.com', 'Toronto', 'Canada', TRUE, NOW()),
('Jackson', 'Perez', 'PAS100029', '123456817', 'jackson.perez@email.com', 'Vancouver', 'Canada', TRUE, NOW()),
('Avery', 'Wilson', 'PAS100030', '123456818', 'avery.wilson@email.com', 'Montreal', 'Canada', TRUE, NOW());

INSERT INTO empleados (nombres, apellidos, puesto, telefono, email, activo, creado_en)
VALUES
('Rosa', 'Huayta Caceres', 'Asesor de Viajes', '980111222', 'rosa.huayta@muhutravel.com', TRUE, NOW()),
('Miguel', 'Angel Condori', 'Guía Turístico', '980111223', 'miguel.condori@muhutravel.com', TRUE, NOW()),
('Carmen', 'Salinas Vega', 'Coordinador de Operaciones', '980111224', 'carmen.salinas@muhutravel.com', TRUE, NOW()),
('Jose', 'Luis Mamani', 'Conductor', '980111225', 'jose.mamani@muhutravel.com', TRUE, NOW()),
('Ana', 'Maria Quispe', 'Asesor de Ventas', '980111226', 'ana.quispe@muhutravel.com', TRUE, NOW()),
('Carlos', 'Alberto Rojas', 'Guía de Montaña', '980111227', 'carlos.rojas@muhutravel.com', TRUE, NOW()),
('Lucia', 'Fernandez Soto', 'Recepcionista', '980111228', 'lucia.fernandez@muhutravel.com', TRUE, NOW()),
('Pedro', 'Pablo Castillo', 'Logística', '980111229', 'pedro.castillo@muhutravel.com', TRUE, NOW()),
('Sofia', 'Elena Mendoza', 'Marketing', '980111230', 'sofia.mendoza@muhutravel.com', TRUE, NOW()),
('Jorge', 'Luis Salazar', 'Gerente General', '980111231', 'jorge.salazar@muhutravel.com', TRUE, NOW());

INSERT INTO proveedores (nombre, tipo, telefono, email, pais, ciudad, activo, creado_en)
VALUES
('Hotel Monasterio', 'Hotel', '084222333', 'reservas@monasterio.com', 'Peru', 'Cusco', TRUE, NOW()),
('PeruRail', 'Transporte', '084222334', 'ventas@perurail.com', 'Peru', 'Cusco', TRUE, NOW()),
('Inca Rail', 'Transporte', '084222335', 'reservas@incarail.com', 'Peru', 'Cusco', TRUE, NOW()),
('Restaurante Chicha', 'Restaurante', '084222336', 'reservas@chicha.com', 'Peru', 'Cusco', TRUE, NOW()),
('Boleto Turistico Cusco', 'Entradas', '084222337', 'info@cosituc.gob.pe', 'Peru', 'Cusco', TRUE, NOW()),
('Consettur', 'Transporte', '084222338', 'ventas@consettur.com', 'Peru', 'Aguas Calientes', TRUE, NOW()),
('Hotel Casa Andina', 'Hotel', '084222339', 'reservas@casa-andina.com', 'Peru', 'Cusco', TRUE, NOW()),
('Restaurante Tunupa', 'Restaurante', '084222340', 'reservas@tunupa.com', 'Peru', 'Urubamba', TRUE, NOW()),
('Ministerio de Cultura', 'Entradas', '084222341', 'info@culturacusco.gob.pe', 'Peru', 'Cusco', TRUE, NOW()),
('Hotel Aranwa', 'Hotel', '084222342', 'reservas@aranwa.com', 'Peru', 'Urubamba', TRUE, NOW());

INSERT INTO paquetes (nombre, destino, duracion_dias, precio, cupos, fecha_inicio, fecha_fin, proveedor_id, empleado_id, tipo, descripcion, precio_grupo, max_pasajeros_recomendado, precio_adicional_persona, min_cupos, activo, creado_en)
VALUES
('Machu Picchu Full Day', 'Machu Picchu', 1, 350.00, 20, '2025-05-01', '2025-05-01', 2, 1, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Valle Sagrado VIP', 'Valle Sagrado', 1, 120.00, 15, '2025-05-02', '2025-05-02', 8, 2, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Montaña de 7 Colores', 'Vinicunca', 1, 100.00, 25, '2025-05-03', '2025-05-03', 4, 3, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Laguna Humantay', 'Soraypampa', 1, 110.00, 20, '2025-05-04', '2025-05-04', 4, 4, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('City Tour Cusco', 'Cusco', 1, 60.00, 30, '2025-05-05', '2025-05-05', 5, 5, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Camino Inca 4D/3N', 'Machu Picchu', 4, 650.00, 10, '2025-06-01', '2025-06-04', 9, 6, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Salkantay Trek 5D/4N', 'Machu Picchu', 5, 550.00, 12, '2025-06-05', '2025-06-09', 9, 2, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Choquequirao Trek 4D/3N', 'Choquequirao', 4, 450.00, 8, '2025-06-10', '2025-06-13', 4, 6, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Tour Maras Moray', 'Maras', 1, 80.00, 20, '2025-05-06', '2025-05-06', 4, 1, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Valle Sur Tipon', 'Tipon', 1, 70.00, 20, '2025-05-07', '2025-05-07', 4, 3, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Cusco Magico 3D/2N', 'Cusco', 3, 400.00, 15, '2025-07-01', '2025-07-03', 1, 5, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Aventura en los Andes 5D/4N', 'Cusco', 5, 700.00, 10, '2025-07-05', '2025-07-09', 7, 2, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Ruta del Sol', 'Puno', 1, 60.00, 30, '2025-05-08', '2025-05-08', 4, 4, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Palcoyo Montaña Alternativa', 'Palcoyo', 1, 90.00, 15, '2025-05-09', '2025-05-09', 4, 6, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Waqrapukara Trek', 'Acomayo', 1, 100.00, 15, '2025-05-10', '2025-05-10', 4, 2, 'REGULAR', NULL, NULL, NULL, NULL, 1, TRUE, NOW()),
('Cusco Privado VIP', 'Cusco', 3, 0.00, 0, '2025-08-01', '2025-08-03', 1, 5, 'PRIVADO', 'Tour privado de lujo', 1500.00, 4, 200.00, 1, TRUE, NOW()),
('Valle Sagrado Exclusivo', 'Valle Sagrado', 1, 0.00, 0, '2025-08-05', '2025-08-05', 8, 2, 'PRIVADO', 'Experiencia exclusiva en el Valle', 1200.00, 3, 150.00, 1, TRUE, NOW()),
('Machu Picchu Lujo', 'Machu Picchu', 2, 0.00, 0, '2025-08-10', '2025-08-11', 2, 1, 'PRIVADO', 'Visita de lujo a la ciudadela', 2500.00, 2, 300.00, 1, TRUE, NOW()),
('Montaña 7 Colores Privado', 'Vinicunca', 1, 0.00, 0, '2025-08-15', '2025-08-15', 4, 3, 'PRIVADO', 'Caminata privada sin aglomeraciones', 800.00, 4, 100.00, 1, TRUE, NOW()),
('Laguna Humantay VIP', 'Soraypampa', 1, 0.00, 0, '2025-08-20', '2025-08-20', 4, 4, 'PRIVADO', 'Tour privado con almuerzo gourmet', 900.00, 4, 120.00, 1, TRUE, NOW()),
('Ruta Barroco Andino', 'Cusco', 1, 0.00, 0, '2025-08-25', '2025-08-25', 5, 5, 'PRIVADO', 'Recorrido cultural privado', 600.00, 5, 80.00, 1, TRUE, NOW());

INSERT INTO reservas (numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario, fecha_reserva)
VALUES
('RES-001', 1, 1, 1, 2, 700.00, 'confirmada', 'Pago adelantado 50%', NOW()),
('RES-002', 2, 2, 2, 1, 120.00, 'pendiente_pago', 'Confirmar hotel', NOW()),
('RES-003', 3, 3, 3, 3, 300.00, 'en_servicio', 'Vegetarianos', NOW()),
('RES-004', 4, 4, 4, 2, 220.00, 'cancelada', 'Problemas de salud', NOW()),
('RES-005', 5, 5, 5, 4, 240.00, 'completada', 'Recojo del aeropuerto', NOW()),
('RES-006', 6, 6, 6, 1, 650.00, 'pendiente_pago', 'Verificar disponibilidad Camino Inca', NOW()),
('RES-007', 7, 7, 2, 2, 1100.00, 'confirmada', 'Luna de miel', NOW()),
('RES-008', 8, 8, 6, 1, 450.00, 'en_servicio', 'Mochilero', NOW()),
('RES-009', 9, 9, 1, 2, 160.00, 'pendiente_pago', 'Pago pendiente', NOW()),
('RES-010', 10, 10, 3, 3, 210.00, 'completada', 'Familia con niños', NOW()),
('RES-011', 11, 11, 5, 2, 800.00, 'confirmada', 'Hotel 5 estrellas', NOW()),
('RES-012', 12, 12, 2, 1, 700.00, 'pendiente_pago', 'Consulta por equipo de camping', NOW()),
('RES-013', 13, 13, 4, 2, 120.00, 'confirmada', 'Asientos ventana', NOW()),
('RES-014', 14, 14, 6, 1, 90.00, 'cancelada', 'Vuelo cancelado', NOW()),
('RES-015', 15, 15, 2, 2, 200.00, 'en_servicio', 'Amigos', NOW()),
('RES-016', 16, 1, 1, 1, 350.00, 'pendiente_pago', 'Solo tour', NOW()),
('RES-017', 17, 2, 2, 2, 240.00, 'confirmada', 'Aniversario', NOW()),
('RES-018', 18, 3, 3, 1, 100.00, 'completada', 'Fotografo', NOW()),
('RES-019', 19, 4, 4, 2, 220.00, 'pendiente_pago', 'Duda sobre altura', NOW()),
('RES-020', 20, 5, 5, 3, 180.00, 'confirmada', 'Grupo de estudiantes', NOW());

INSERT INTO reserva_proveedores (reserva_id, proveedor_id, tipo_servicio, costo, notas, creado_en)
VALUES
(1, 2, 'Transporte', 200.00, 'Tren Vistadome', NOW()),
(1, 6, 'Transporte', 50.00, 'Bus Consettur', NOW()),
(2, 8, 'Alimentacion', 40.00, 'Almuerzo Buffet', NOW()),
(3, 4, 'Transporte', 60.00, 'Transporte Privado', NOW()),
(5, 5, 'Entradas', 140.00, 'Boleto Turistico General', NOW()),
(6, 9, 'Entradas', 200.00, 'Permiso Camino Inca', NOW()),
(7, 10, 'Hotel', 500.00, 'Hotel Aranwa 2 noches', NOW()),
(7, 2, 'Transporte', 300.00, 'Tren Hiram Bingham', NOW()),
(8, 4, 'Alimentacion', 30.00, 'Box Lunch', NOW()),
(10, 4, 'Transporte', 80.00, 'Van H1', NOW()),
(11, 1, 'Hotel', 600.00, 'Hotel Monasterio 2 noches', NOW()),
(11, 3, 'Transporte', 150.00, 'Inca Rail 360', NOW()),
(12, 4, 'Equipo', 100.00, 'Alquiler Carpa y Bolsa', NOW()),
(13, 4, 'Transporte', 50.00, 'Bus Turistico', NOW()),
(15, 4, 'Guia', 80.00, 'Guia Privado', NOW()),
(16, 6, 'Transporte', 24.00, 'Bus Subida', NOW()),
(17, 7, 'Hotel', 180.00, 'Casa Andina Standard', NOW()),
(18, 4, 'Transporte', 40.00, 'Transporte Compartido', NOW()),
(20, 5, 'Entradas', 70.00, 'Boleto Turistico Parcial', NOW()),
(20, 4, 'Guia', 60.00, 'Guia Español', NOW());

INSERT INTO pasajeros (reserva_id, nombres, apellidos, tipo_documento, documento, fecha_nacimiento, creado_en)
VALUES
(1, 'Juan', 'Quispe Mamani', 'DNI', '40506070', '1980-01-01', NOW()),
(1, 'Maria', 'Quispe', 'DNI', '40506071', '1982-02-02', NOW()),
(2, 'Maria', 'Flores Huaman', 'DNI', '41516171', '1985-03-03', NOW()),
(3, 'Carlos', 'Sanchez Vega', 'DNI', '42526272', '1990-04-04', NOW()),
(3, 'Ana', 'Sanchez', 'DNI', '42526273', '1992-05-05', NOW()),
(3, 'Luis', 'Sanchez', 'DNI', '42526274', '2010-06-06', NOW()),
(5, 'Luis', 'Gomez Diaz', 'DNI', '44546474', '1988-07-07', NOW()),
(5, 'Elena', 'Gomez', 'DNI', '44546475', '1990-08-08', NOW()),
(5, 'Pedro', 'Gomez', 'DNI', '44546476', '2015-09-09', NOW()),
(5, 'Sofia', 'Gomez', 'DNI', '44546477', '2018-10-10', NOW());

INSERT INTO pagos (reserva_id, monto, fecha_pago, metodo_pago, referencia, estado, registrado_por, notas)
VALUES
(1, 350.00, NOW(), 'Transferencia', 'OP-12345', 'completado', 1, 'Adelanto 50%'),
(3, 300.00, NOW(), 'Tarjeta', 'TX-98765', 'completado', 2, 'Pago total'),
(5, 240.00, NOW(), 'Efectivo', NULL, 'completado', 3, 'Pago en oficina'),
(7, 500.00, NOW(), 'Yape', 'YP-112233', 'completado', 1, 'Adelanto'),
(7, 600.00, NOW(), 'Plin', 'PL-445566', 'completado', 1, 'Saldo');

INSERT INTO historial_reservas (reserva_id, estado_anterior, estado_nuevo, fecha_cambio, usuario_id, comentario)
VALUES
(1, 'pendiente_pago', 'confirmada', NOW(), 1, 'Confirmado tras pago'),
(4, 'pendiente_pago', 'cancelada', NOW(), 2, 'Cancelado por cliente'),
(14, 'pendiente_pago', 'cancelada', NOW(), 3, 'Vuelo cancelado');
