-- ============================================
-- Cliente de Prueba para WhatsApp Integration
-- ============================================

-- Insertar cliente de prueba con números de WhatsApp
INSERT INTO clientes (nombres, apellidos, documento, telefono, email, ciudad, pais, activo, creado_en)
VALUES 
  ('Harold', 'Huanca', 'DNI12345678', '51984438516', 'harold.huanca@test.com', 'Lima', 'Peru', TRUE, NOW()),
  ('Prueba', 'WhatsApp', 'DNI87654321', '51930466769', 'prueba.whatsapp@test.com', 'Lima', 'Peru', TRUE, NOW());

-- Verificar que los clientes fueron insertados
SELECT id, nombres, apellidos, telefono, email FROM clientes WHERE telefono IN ('51984438516', '51930466769');

-- Nota: Estos números son los que se usaron en las pruebas exitosas de whapi
-- Puedes usar estos clientes para enviar mensajes a través del Centro de Comunicación
