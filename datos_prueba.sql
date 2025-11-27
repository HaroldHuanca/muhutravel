INSERT INTO usuarios (username, password_hash, rol)
VALUES
('admin', 'hash123', 'admin'),
('agente1', 'hash123', 'agente'),
('agente2', 'hash123', 'agente'),
('manager', 'hash123', 'manager');

INSERT INTO clientes (nombres, apellidos, documento, telefono, email, ciudad, pais)
VALUES
('Juan', 'Quispe Mamani', 'DNI40506070', '987654321', 'juan.quispe@gmail.com', 'Cusco', 'Peru'),
('Maria', 'Flores Huaman', 'DNI41516171', '987654322', 'maria.flores@gmail.com', 'Cusco', 'Peru'),
('Carlos', 'Sanchez Vega', 'DNI42526272', '987654323', 'carlos.sanchez@gmail.com', 'Lima', 'Peru'),
('Ana', 'Torres Lopez', 'DNI43536373', '987654324', 'ana.torres@gmail.com', 'Arequipa', 'Peru'),
('Luis', 'Gomez Diaz', 'DNI44546474', '987654325', 'luis.gomez@gmail.com', 'Lima', 'Peru'),
('Elena', 'Rojas Cruz', 'DNI45556575', '987654326', 'elena.rojas@gmail.com', 'Cusco', 'Peru'),
('Pedro', 'Castillo Ruiz', 'DNI46566676', '987654327', 'pedro.castillo@gmail.com', 'Puno', 'Peru'),
('Sofia', 'Mendoza Aliaga', 'DNI47576777', '987654328', 'sofia.mendoza@gmail.com', 'Tacna', 'Peru'),
('Jorge', 'Salazar Pinto', 'DNI48586878', '987654329', 'jorge.salazar@gmail.com', 'Cusco', 'Peru'),
('Lucia', 'Vargas Soto', 'DNI49596979', '987654330', 'lucia.vargas@gmail.com', 'Lima', 'Peru'),
('John', 'Smith', 'PAS100001', '123456789', 'john.smith@email.com', 'New York', 'USA'),
('Emily', 'Johnson', 'PAS100002', '123456790', 'emily.johnson@email.com', 'Los Angeles', 'USA'),
('Michael', 'Brown', 'PAS100003', '123456791', 'michael.brown@email.com', 'Chicago', 'USA'),
('Sarah', 'Davis', 'PAS100004', '123456792', 'sarah.davis@email.com', 'Houston', 'USA'),
('David', 'Wilson', 'PAS100005', '123456793', 'david.wilson@email.com', 'Phoenix', 'USA'),
('Emma', 'Taylor', 'PAS100006', '123456794', 'emma.taylor@email.com', 'London', 'UK'),
('James', 'Anderson', 'PAS100007', '123456795', 'james.anderson@email.com', 'Manchester', 'UK'),
('Olivia', 'Thomas', 'PAS100008', '123456796', 'olivia.thomas@email.com', 'Liverpool', 'UK'),
('Robert', 'Martinez', 'PAS100009', '123456797', 'robert.martinez@email.com', 'Madrid', 'Spain'),
('Isabella', 'Hernandez', 'PAS100010', '123456798', 'isabella.hernandez@email.com', 'Barcelona', 'Spain'),
('William', 'Lopez', 'PAS100011', '123456799', 'william.lopez@email.com', 'Valencia', 'Spain'),
('Sophia', 'Gonzalez', 'PAS100012', '123456800', 'sophia.gonzalez@email.com', 'Seville', 'Spain'),
('Liam', 'Perez', 'PAS100013', '123456801', 'liam.perez@email.com', 'Paris', 'France'),
('Ava', 'Wilson', 'PAS100014', '123456802', 'ava.wilson@email.com', 'Lyon', 'France'),
('Noah', 'Anderson', 'PAS100015', '123456803', 'noah.anderson@email.com', 'Marseille', 'France'),
('Mia', 'Thomas', 'PAS100016', '123456804', 'mia.thomas@email.com', 'Berlin', 'Germany'),
('Ethan', 'Martinez', 'PAS100017', '123456805', 'ethan.martinez@email.com', 'Munich', 'Germany'),
('Charlotte', 'Hernandez', 'PAS100018', '123456806', 'charlotte.hernandez@email.com', 'Hamburg', 'Germany'),
('Alexander', 'Lopez', 'PAS100019', '123456807', 'alexander.lopez@email.com', 'Rome', 'Italy'),
('Amelia', 'Gonzalez', 'PAS100020', '123456808', 'amelia.gonzalez@email.com', 'Milan', 'Italy'),
('Benjamin', 'Perez', 'PAS100021', '123456809', 'benjamin.perez@email.com', 'Naples', 'Italy'),
('Harper', 'Wilson', 'PAS100022', '123456810', 'harper.wilson@email.com', 'Tokyo', 'Japan'),
('Lucas', 'Anderson', 'PAS100023', '123456811', 'lucas.anderson@email.com', 'Osaka', 'Japan'),
('Evelyn', 'Thomas', 'PAS100024', '123456812', 'evelyn.thomas@email.com', 'Kyoto', 'Japan'),
('Mason', 'Martinez', 'PAS100025', '123456813', 'mason.martinez@email.com', 'Sydney', 'Australia'),
('Abigail', 'Hernandez', 'PAS100026', '123456814', 'abigail.hernandez@email.com', 'Melbourne', 'Australia'),
('Logan', 'Lopez', 'PAS100027', '123456815', 'logan.lopez@email.com', 'Brisbane', 'Australia'),
('Ella', 'Gonzalez', 'PAS100028', '123456816', 'ella.gonzalez@email.com', 'Toronto', 'Canada'),
('Jackson', 'Perez', 'PAS100029', '123456817', 'jackson.perez@email.com', 'Vancouver', 'Canada'),
('Avery', 'Wilson', 'PAS100030', '123456818', 'avery.wilson@email.com', 'Montreal', 'Canada');

INSERT INTO empleados (nombres, apellidos, puesto, telefono, email)
VALUES
('Rosa', 'Huayta Caceres', 'Asesor de Viajes', '980111222', 'rosa.huayta@muhutravel.com'),
('Miguel', 'Angel Condori', 'Guía Turístico', '980111223', 'miguel.condori@muhutravel.com'),
('Carmen', 'Salinas Vega', 'Coordinador de Operaciones', '980111224', 'carmen.salinas@muhutravel.com'),
('Jose', 'Luis Mamani', 'Conductor', '980111225', 'jose.mamani@muhutravel.com'),
('Ana', 'Maria Quispe', 'Asesor de Ventas', '980111226', 'ana.quispe@muhutravel.com'),
('Carlos', 'Alberto Rojas', 'Guía de Montaña', '980111227', 'carlos.rojas@muhutravel.com'),
('Lucia', 'Fernandez Soto', 'Recepcionista', '980111228', 'lucia.fernandez@muhutravel.com'),
('Pedro', 'Pablo Castillo', 'Logística', '980111229', 'pedro.castillo@muhutravel.com'),
('Sofia', 'Elena Mendoza', 'Marketing', '980111230', 'sofia.mendoza@muhutravel.com'),
('Jorge', 'Luis Salazar', 'Gerente General', '980111231', 'jorge.salazar@muhutravel.com');

INSERT INTO proveedores (nombre, tipo, telefono, email, pais, ciudad)
VALUES
('Hotel Monasterio', 'Hotel', '084222333', 'reservas@monasterio.com', 'Peru', 'Cusco'),
('PeruRail', 'Transporte', '084222334', 'ventas@perurail.com', 'Peru', 'Cusco'),
('Inca Rail', 'Transporte', '084222335', 'reservas@incarail.com', 'Peru', 'Cusco'),
('Restaurante Chicha', 'Restaurante', '084222336', 'reservas@chicha.com', 'Peru', 'Cusco'),
('Boleto Turistico Cusco', 'Entradas', '084222337', 'info@cosituc.gob.pe', 'Peru', 'Cusco'),
('Consettur', 'Transporte', '084222338', 'ventas@consettur.com', 'Peru', 'Aguas Calientes'),
('Hotel Casa Andina', 'Hotel', '084222339', 'reservas@casa-andina.com', 'Peru', 'Cusco'),
('Restaurante Tunupa', 'Restaurante', '084222340', 'reservas@tunupa.com', 'Peru', 'Urubamba'),
('Ministerio de Cultura', 'Entradas', '084222341', 'info@culturacusco.gob.pe', 'Peru', 'Cusco'),
('Hotel Aranwa', 'Hotel', '084222342', 'reservas@aranwa.com', 'Peru', 'Urubamba');

INSERT INTO paquetes (nombre, destino, duracion_dias, precio, cupos, fecha_inicio, fecha_fin, proveedor_id, empleado_id)
VALUES
('Machu Picchu Full Day', 'Machu Picchu', 1, 350.00, 20, '2025-05-01', '2025-05-01', 2, 1),
('Valle Sagrado VIP', 'Valle Sagrado', 1, 120.00, 15, '2025-05-02', '2025-05-02', 8, 2),
('Montaña de 7 Colores', 'Vinicunca', 1, 100.00, 25, '2025-05-03', '2025-05-03', 4, 3),
('Laguna Humantay', 'Soraypampa', 1, 110.00, 20, '2025-05-04', '2025-05-04', 4, 4),
('City Tour Cusco', 'Cusco', 1, 60.00, 30, '2025-05-05', '2025-05-05', 5, 5),
('Camino Inca 4D/3N', 'Machu Picchu', 4, 650.00, 10, '2025-06-01', '2025-06-04', 9, 6),
('Salkantay Trek 5D/4N', 'Machu Picchu', 5, 550.00, 12, '2025-06-05', '2025-06-09', 9, 2),
('Choquequirao Trek 4D/3N', 'Choquequirao', 4, 450.00, 8, '2025-06-10', '2025-06-13', 4, 6),
('Tour Maras Moray', 'Maras', 1, 80.00, 20, '2025-05-06', '2025-05-06', 4, 1),
('Valle Sur Tipon', 'Tipon', 1, 70.00, 20, '2025-05-07', '2025-05-07', 4, 3),
('Cusco Magico 3D/2N', 'Cusco', 3, 400.00, 15, '2025-07-01', '2025-07-03', 1, 5),
('Aventura en los Andes 5D/4N', 'Cusco', 5, 700.00, 10, '2025-07-05', '2025-07-09', 7, 2),
('Ruta del Sol', 'Puno', 1, 60.00, 30, '2025-05-08', '2025-05-08', 4, 4),
('Palcoyo Montaña Alternativa', 'Palcoyo', 1, 90.00, 15, '2025-05-09', '2025-05-09', 4, 6),
('Waqrapukara Trek', 'Acomayo', 1, 100.00, 15, '2025-05-10', '2025-05-10', 4, 2);

INSERT INTO reservas (numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario)
VALUES
('RES-001', 1, 1, 1, 2, 700.00, 'confirmada', 'Pago adelantado 50%'),
('RES-002', 2, 2, 2, 1, 120.00, 'pendiente', 'Confirmar hotel'),
('RES-003', 3, 3, 3, 3, 300.00, 'confirmada', 'Vegetarianos'),
('RES-004', 4, 4, 4, 2, 220.00, 'cancelada', 'Problemas de salud'),
('RES-005', 5, 5, 5, 4, 240.00, 'confirmada', 'Recojo del aeropuerto'),
('RES-006', 6, 6, 6, 1, 650.00, 'pendiente', 'Verificar disponibilidad Camino Inca'),
('RES-007', 7, 7, 2, 2, 1100.00, 'confirmada', 'Luna de miel'),
('RES-008', 8, 8, 6, 1, 450.00, 'confirmada', 'Mochilero'),
('RES-009', 9, 9, 1, 2, 160.00, 'pendiente', 'Pago pendiente'),
('RES-010', 10, 10, 3, 3, 210.00, 'confirmada', 'Familia con niños'),
('RES-011', 11, 11, 5, 2, 800.00, 'confirmada', 'Hotel 5 estrellas'),
('RES-012', 12, 12, 2, 1, 700.00, 'pendiente', 'Consulta por equipo de camping'),
('RES-013', 13, 13, 4, 2, 120.00, 'confirmada', 'Asientos ventana'),
('RES-014', 14, 14, 6, 1, 90.00, 'cancelada', 'Vuelo cancelado'),
('RES-015', 15, 15, 2, 2, 200.00, 'confirmada', 'Amigos'),
('RES-016', 16, 1, 1, 1, 350.00, 'pendiente', 'Solo tour'),
('RES-017', 17, 2, 2, 2, 240.00, 'confirmada', 'Aniversario'),
('RES-018', 18, 3, 3, 1, 100.00, 'confirmada', 'Fotografo'),
('RES-019', 19, 4, 4, 2, 220.00, 'pendiente', 'Duda sobre altura'),
('RES-020', 20, 5, 5, 3, 180.00, 'confirmada', 'Grupo de estudiantes');

INSERT INTO reserva_proveedores (reserva_id, proveedor_id, tipo_servicio, costo, notas)
VALUES
(1, 2, 'Transporte', 200.00, 'Tren Vistadome'),
(1, 6, 'Transporte', 50.00, 'Bus Consettur'),
(2, 8, 'Alimentacion', 40.00, 'Almuerzo Buffet'),
(3, 4, 'Transporte', 60.00, 'Transporte Privado'),
(5, 5, 'Entradas', 140.00, 'Boleto Turistico General'),
(6, 9, 'Entradas', 200.00, 'Permiso Camino Inca'),
(7, 10, 'Hotel', 500.00, 'Hotel Aranwa 2 noches'),
(7, 2, 'Transporte', 300.00, 'Tren Hiram Bingham'),
(8, 4, 'Alimentacion', 30.00, 'Box Lunch'),
(10, 4, 'Transporte', 80.00, 'Van H1'),
(11, 1, 'Hotel', 600.00, 'Hotel Monasterio 2 noches'),
(11, 3, 'Transporte', 150.00, 'Inca Rail 360'),
(12, 4, 'Equipo', 100.00, 'Alquiler Carpa y Bolsa'),
(13, 4, 'Transporte', 50.00, 'Bus Turistico'),
(15, 4, 'Guia', 80.00, 'Guia Privado'),
(16, 6, 'Transporte', 24.00, 'Bus Subida'),
(17, 7, 'Hotel', 180.00, 'Casa Andina Standard'),
(18, 4, 'Transporte', 40.00, 'Transporte Compartido'),
(20, 5, 'Entradas', 70.00, 'Boleto Turistico Parcial'),
(20, 4, 'Guia', 60.00, 'Guia Español');
