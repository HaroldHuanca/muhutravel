-- TABLA: Plantillas de Mensajes
CREATE TABLE IF NOT EXISTS comunicacion_plantillas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    creado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- Insertar algunas plantillas por defecto
INSERT INTO comunicacion_plantillas (nombre, contenido) VALUES 
('Bienvenida', 'Hola {{nombre}}, bienvenido a MuhuTravel. Estamos emocionados de ayudarte a planificar tu viaje.'),
('Confirmación de Reserva', 'Hola {{nombre}}, tu reserva ha sido confirmada exitosamente. Te enviamos los detalles a tu correo.'),
('Recordatorio de Pago', 'Hola {{nombre}}, te recordamos que tienes un pago pendiente para tu reserva. Por favor contáctanos para regularizarlo.');
