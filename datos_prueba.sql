INSERT INTO usuarios (username, password_hash, rol)
VALUES
('admin', 'hash123', 'admin'),
('agente1', 'hash123', 'agente'),
('agente2', 'hash123', 'agente'),
('manager', 'hash123', 'manager');

INSERT INTO clientes (nombres, apellidos, documento, telefono, email, ciudad, pais)
VALUES
('Juan', 'Pérez Gómez', 'DNI12345678', '987654321', 'juanpg@gmail.com', 'Lima', 'Peru'),
('María', 'Lopez Sanchez', 'DNI87654321', '987111222', 'marialopez@gmail.com', 'Arequipa', 'Peru'),
('Carlos', 'Quispe Huamán', 'DNI44556677', '944222333', 'carlosqh@gmail.com', 'Cusco', 'Peru'),
('Ana', 'Ramos Torres', 'DNI99887766', '955111333', 'anaramos@gmail.com', 'Trujillo', 'Peru'),
('Jose', 'Mamani Quispe', 'DNI11223344', '922334455', 'josemamani@gmail.com', 'Puno', 'Peru'),
('Daniel', 'Smith', 'PAS12345', '555111222', 'dsmith@yahoo.com', 'New York', 'USA'),
('Laura', 'Johnson', 'PAS67890', '555333444', 'laura.j@gmail.com', 'Los Angeles', 'USA'),
('Keiko', 'Tanaka', 'PAS99887', '444555666', 'keiko.t@japan.jp', 'Tokyo', 'Japan'),
('Hans', 'Müller', 'PAS55443', '333777999', 'hans.muller@germany.de', 'Berlin', 'Germany'),
('Elena', 'Garcia Ruiz', 'CE44551231', '955674312', 'elenag@gmail.com', 'Madrid', 'Spain'),

('Miguel', 'Chavez Soto', 'DNI12233445', '923445566', 'miguelchs@gmail.com', 'Lima', 'Peru'),
('Lucía', 'Valdez Ramos', 'DNI66778899', '988776655', 'lucia.vr@gmail.com', 'Cusco', 'Peru'),
('Pedro', 'Huarca Ccoris', 'DNI99884422', '987556699', 'pedrohuarca@gmail.com', 'Cusco', 'Peru'),
('Sofía', 'Mendoza Ccori', 'DNI55443322', '921334455', 'sofimen@gmail.com', 'Arequipa', 'Peru'),
('Diego', 'Cáceres Ludeña', 'DNI11229988', '911223344', 'diegocl@gmail.com', 'Piura', 'Peru'),
('Julia', 'Renner', 'PAS777222', '444667788', 'renner.julia@gmail.com', 'Toronto', 'Canada'),
('Marco', 'Bianchi', 'PAS889977', '321444555', 'marco.bianchi@italy.it', 'Roma', 'Italy'),
('Chloe', 'Dupont', 'PAS998877', '555998877', 'chloe.dupont@france.fr', 'Paris', 'France'),
('Oliver', 'Brown', 'PAS564738', '555777888', 'obrown@gmail.com', 'London', 'UK'),
('Sven', 'Larsson', 'PAS884422', '332211445', 'sven.l@sweden.se', 'Stockholm', 'Sweden'),

('Renato', 'Cruz Palomino', 'DNI23412233', '912233445', 'renatocp@gmail.com', 'Lima', 'Peru'),
('Valeria', 'Ticona Condori', 'DNI55667788', '933445521', 'valeriaticona@gmail.com', 'Puno', 'Peru'),
('Andrea', 'Morales Diaz', 'DNI77889955', '921556788', 'andrea.md@gmail.com', 'Tacna', 'Peru'),
('Fernando', 'Huayhua Torres', 'DNI44559922', '955667788', 'fernandoht@gmail.com', 'Cusco', 'Peru'),
('Patricia', 'Cjuiro Mesa', 'DNI66773344', '911442233', 'patriciacm@gmail.com', 'Ica', 'Peru'),

('Isabella', 'Martinez', 'PAS102938', '555777221', 'isabella.m@gmail.com', 'Miami', 'USA'),
('George', 'Wilson', 'PAS112233', '555444221', 'geo.wilson@gmail.com', 'Chicago', 'USA'),
('Lukas', 'Schmidt', 'PAS223344', '333222111', 'lukas.sch@gmail.com', 'Munich', 'Germany'),
('Natalie', 'Fischer', 'PAS332211', '333888555', 'natalie.f@gmail.com', 'Vienna', 'Austria'),
('Yuki', 'Sato', 'PAS445566', '444333221', 'yuki.s@japan.jp', 'Osaka', 'Japan'),

('Thiago', 'Santos', 'PAS556677', '666777888', 'thiago.brazil@gmail.com', 'Rio de Janeiro', 'Brazil'),
('Camila', 'Gonzalez', 'PAS667788', '555666777', 'camila.ar@gmail.com', 'Buenos Aires', 'Argentina'),
('Mateo', 'Torres', 'PAS778899', '777888999', 'mateo.chile@gmail.com', 'Santiago', 'Chile'),
('Lucia', 'Fernandez', 'PAS889900', '888999000', 'lucia.col@gmail.com', 'Bogotá', 'Colombia'),
('Andrés', 'Orozco', 'PAS990011', '999000111', 'andres.ec@gmail.com', 'Quito', 'Ecuador');

INSERT INTO empleados (nombres, apellidos, puesto, telefono, email)
VALUES
('Luis', 'Salazar Pinedo', 'Asesor de Viajes', '900111222', 'luissp@empresa.com'),
('Carla', 'Vega Montes', 'Asesora de Reservas', '900333444', 'carlavm@empresa.com'),
('Ricardo', 'Quispe Ramos', 'Guía Turístico', '900555666', 'ricardoqr@empresa.com'),
('Natalia', 'Huamán Ccori', 'Guía Turística', '900777888', 'nathc@empresa.com'),
('Jorge', 'Cárdenas Díaz', 'Soporte', '900999000', 'jorgecd@empresa.com'),
('Erika', 'Paredes Lazo', 'Asesora', '977111222', 'erikapl@empresa.com'),
('Samuel', 'Mamani Flores', 'Agente Senior', '955333444', 'samuelmf@empresa.com'),
('Viviana', 'Torres Soto', 'Ventas', '988444555', 'viviants@empresa.com'),
('Rafael', 'Quiroz Ramos', 'Asesor', '977555666', 'rafaelqr@empresa.com'),
('Diana', 'Barrios Núñez', 'Asesora', '933666777', 'dianabn@empresa.com');

INSERT INTO proveedores (nombre, tipo, telefono, email, pais, ciudad)
VALUES
('Hotel Inti Raymi', 'Hotel', '984111222', 'contacto@intiraymi.pe', 'Peru', 'Cusco'),
('Hotel Qoricancha', 'Hotel', '984222333', 'info@qoricancha.pe', 'Peru', 'Cusco'),
('PeruRail', 'Transporte', '984333444', 'ventas@perurail.com', 'Peru', 'Cusco'),
('Inca Rail', 'Transporte', '984444555', 'info@incarail.com', 'Peru', 'Cusco'),
('Sacred Valley Adventures', 'Agencia Local', '984555666', 'contact@sva.pe', 'Peru', 'Urubamba'),
('Andean Paths', 'Agencia Local', '984666777', 'info@andeanpaths.pe', 'Peru', 'Ollantaytambo'),
('Mountain Explore', 'Tours', '984777888', 'mountainxp@gmail.com', 'Chile', 'Arica'),
('Travel Andes', 'Tours', '984888999', 'contact@travelandes.ec', 'Ecuador', 'Quito'),
('Global Tour', 'Tours', '333222111', 'globaltour@gmail.com', 'USA', 'Miami'),
('Hotel Sumaq', 'Hotel', '984999000', 'sumaqhotel@aguascalientes.pe', 'Peru', 'Aguas Calientes');

INSERT INTO paquetes (nombre, destino, duracion_dias, precio, cupos, fecha_inicio, fecha_fin, proveedor_id, empleado_id)
VALUES
('Machu Picchu Full Day', 'Machu Picchu', 1, 350.00, 30, '2025-01-10', '2025-01-10', 3, 1),
('Valle Sagrado + Pisaq', 'Valle Sagrado', 1, 150.00, 40, '2025-01-05', '2025-01-05', 5, 2),
('City Tour Cusco', 'Cusco', 1, 80.00, 50, '2025-01-02', '2025-01-02', 5, 3),
('Montaña de 7 Colores', 'Vinicunca', 1, 120.00, 35, '2025-01-12', '2025-01-12', 6, 4),
('Laguna Humantay', 'Soraypampa', 1, 140.00, 30, '2025-01-15', '2025-01-15', 6, 1),
('Maras y Moray', 'Maras', 1, 110.00, 45, '2025-01-08', '2025-01-08', 5, 5),
('Inca Jungle 4D/3N', 'Cusco - Santa Teresa', 4, 650.00, 20, '2025-02-01', '2025-02-04', 7, 6),
('Camino Inca 2D/1N', 'Machu Picchu', 2, 500.00, 15, '2025-02-10', '2025-02-11', 7, 6),
('Salkantay Trek 5D', 'Salkantay', 5, 900.00, 15, '2025-03-01', '2025-03-05', 7, 7),
('Valle Sur + Tipón', 'Tipón', 1, 90.00, 40, '2025-01-06', '2025-01-06', 5, 8),
('Aguas Calientes Tour', 'Aguas Calientes', 1, 180.00, 30, '2025-01-14', '2025-01-14', 10, 4),
('Qoricancha + Sacsayhuamán', 'Cusco', 1, 75.00, 40, '2025-01-03', '2025-01-03', 5, 3),
('Tour Cusco Imperial 3D/2N', 'Cusco', 3, 400.00, 25, '2025-02-05', '2025-02-07', 1, 9),
('Tour Montaña Palcoyo', 'Palcoyo', 1, 130.00, 25, '2025-01-22', '2025-01-22', 6, 2),
('Tour Valle Rojo', 'Pitumarca', 1, 140.00, 20, '2025-01-25', '2025-01-25', 6, 10);

INSERT INTO reservas (numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario)
VALUES
('RES001', 1, 1, 1, 2, 700.00, 'confirmada', 'Cliente peruano'),
('RES002', 2, 2, 2, 1, 150.00, 'pendiente', ''),
('RES003', 6, 1, 1, 1, 350.00, 'confirmada', 'Turista de USA'),
('RES004', 8, 4, 4, 3, 360.00, 'confirmada', ''),
('RES005', 10, 5, 1, 2, 280.00, 'pendiente', ''),
('RES006', 3, 3, 3, 1, 80.00, 'confirmada', ''),
('RES007', 7, 7, 6, 2, 1300.00, 'confirmada', ''),
('RES008', 12, 1, 2, 1, 350.00, 'cancelada', 'Motivos personales'),
('RES009', 15, 11, 3, 4, 720.00, 'confirmada', ''),
('RES010', 20, 8, 6, 1, 500.00, 'pendiente', ''),
('RES011', 25, 14, 8, 2, 260.00, 'confirmada', ''),
('RES012', 30, 15, 10, 1, 140.00, 'pendiente', ''),
('RES013', 28, 9, 7, 1, 900.00, 'confirmada', ''),
('RES014', 32, 6, 5, 3, 330.00, 'confirmada', ''),
('RES015', 5, 1, 1, 2, 700.00, 'confirmada', ''),
('RES016', 18, 12, 3, 1, 75.00, 'cancelada', 'Cambio de fecha'),
('RES017', 35, 3, 4, 1, 80.00, 'pendiente', ''),
('RES018', 30, 4, 4, 2, 240.00, 'confirmada', ''),
('RES019', 7, 13, 9, 2, 800.00, 'confirmada', ''),
('RES020', 22, 10, 8, 1, 90.00, 'pendiente', '');
