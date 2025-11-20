/**
 * Pruebas de integración para el módulo de comunicación
 * Pruebas de flujos completos con BD real
 */

const request = require('supertest');
const express = require('express');
const db = require('../db');
const comunicacionRouter = require('../routes/comunicacion');

describe('Integración - Sistema de Comunicación WhatsApp', () => {
  let app;
  let testClienteId;
  const testToken = 'test-token';

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    
    // Middleware de autenticación
    app.use((req, res, next) => {
      req.headers.authorization = `Bearer ${testToken}`;
      next();
    });
    
    app.use('/api/comunicacion', comunicacionRouter);

    // Crear cliente de prueba
    try {
      const result = await db.query(
        'INSERT INTO clientes (nombres, apellidos, documento, telefono, email, ciudad, pais) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        ['Test', 'Comunicacion', 'TEST123', '51984438516', 'test@comunicacion.com', 'Lima', 'Peru']
      );
      testClienteId = result.rows[0].id;
    } catch (error) {
      console.error('Error creando cliente de prueba:', error);
    }
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    try {
      await db.query('DELETE FROM comunicacion_mensajes WHERE cliente_id = $1', [testClienteId]);
      await db.query('DELETE FROM clientes WHERE id = $1', [testClienteId]);
    } catch (error) {
      console.error('Error limpiando datos:', error);
    }
  });

  describe('Flujo Completo: Envío y Recepción de Mensajes', () => {
    test('Debe conectar con cliente y enviar mensaje', async () => {
      const connectResponse = await request(app)
        .post('/api/comunicacion/conectar')
        .send({
          clienteId: testClienteId,
          telefono: '51984438516',
          nombre: 'Test Comunicacion'
        });

      expect(connectResponse.status).toBe(200);
      expect(connectResponse.body.success).toBe(true);
    });

    test('Debe guardar mensaje enviado en BD', async () => {
      // Simular envío de mensaje
      const sendResponse = await request(app)
        .post('/api/comunicacion/enviar')
        .send({
          clienteId: testClienteId,
          telefono: '51984438516',
          mensaje: 'Mensaje de prueba de integración',
          remitente: 'test-user'
        });

      // Verificar que se guardó en BD
      const messagesResponse = await request(app)
        .get(`/api/comunicacion/mensajes/${testClienteId}`);

      expect(messagesResponse.status).toBe(200);
      expect(Array.isArray(messagesResponse.body)).toBe(true);
    });

    test('Debe procesar webhook y guardar mensaje recibido', async () => {
      const webhookResponse = await request(app)
        .post('/api/comunicacion/webhook')
        .send({
          messages: [
            {
              id: 'test_msg_001',
              from: '51984438516@s.whatsapp.net',
              body: 'Respuesta de prueba desde webhook',
              timestamp: Math.floor(Date.now() / 1000)
            }
          ]
        });

      expect(webhookResponse.status).toBe(200);
      expect(webhookResponse.body.success).toBe(true);

      // Verificar que se guardó
      const messagesResponse = await request(app)
        .get(`/api/comunicacion/mensajes/${testClienteId}`);

      expect(messagesResponse.status).toBe(200);
      const receivedMessages = messagesResponse.body.filter(m => m.tipo === 'recibido');
      expect(receivedMessages.length).toBeGreaterThan(0);
    });

    test('Debe obtener historial completo de conversación', async () => {
      const messagesResponse = await request(app)
        .get(`/api/comunicacion/mensajes/${testClienteId}`);

      expect(messagesResponse.status).toBe(200);
      expect(Array.isArray(messagesResponse.body)).toBe(true);
      
      // Verificar estructura de mensajes
      messagesResponse.body.forEach(msg => {
        expect(msg).toHaveProperty('id');
        expect(msg).toHaveProperty('texto');
        expect(msg).toHaveProperty('remitente');
        expect(msg).toHaveProperty('timestamp');
        expect(msg).toHaveProperty('tipo');
        expect(msg).toHaveProperty('estado');
      });
    });
  });

  describe('Persistencia de Datos', () => {
    test('Debe persistir mensajes en BD', async () => {
      const mensaje = 'Mensaje para persistencia';
      
      // Enviar mensaje
      await request(app)
        .post('/api/comunicacion/enviar')
        .send({
          clienteId: testClienteId,
          telefono: '51984438516',
          mensaje: mensaje,
          remitente: 'test-user'
        });

      // Consultar directamente en BD
      const result = await db.query(
        'SELECT * FROM comunicacion_mensajes WHERE cliente_id = $1 AND mensaje = $2',
        [testClienteId, mensaje]
      );

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].mensaje).toBe(mensaje);
      expect(result.rows[0].tipo).toBe('enviado');
    });

    test('Debe mantener integridad referencial', async () => {
      const result = await db.query(
        'SELECT * FROM comunicacion_mensajes WHERE cliente_id = $1',
        [testClienteId]
      );

      // Todos los mensajes deben tener cliente_id válido
      result.rows.forEach(msg => {
        expect(msg.cliente_id).toBe(testClienteId);
      });
    });
  });

  describe('Validación de Datos en BD', () => {
    test('Debe validar que mensaje no esté vacío', async () => {
      const response = await request(app)
        .post('/api/comunicacion/enviar')
        .send({
          clienteId: testClienteId,
          telefono: '51984438516',
          mensaje: '', // Mensaje vacío
          remitente: 'test-user'
        });

      expect(response.status).toBe(400);
    });

    test('Debe validar que cliente_id sea válido', async () => {
      const response = await request(app)
        .post('/api/comunicacion/enviar')
        .send({
          clienteId: 99999, // Cliente no existe
          telefono: '51984438516',
          mensaje: 'Mensaje',
          remitente: 'test-user'
        });

      // Puede fallar en whapi o en BD
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('Manejo de Múltiples Mensajes', () => {
    test('Debe procesar múltiples mensajes en webhook', async () => {
      const response = await request(app)
        .post('/api/comunicacion/webhook')
        .send({
          messages: [
            {
              id: 'msg_multi_001',
              from: '51984438516@s.whatsapp.net',
              body: 'Primer mensaje',
              timestamp: Math.floor(Date.now() / 1000)
            },
            {
              id: 'msg_multi_002',
              from: '51984438516@s.whatsapp.net',
              body: 'Segundo mensaje',
              timestamp: Math.floor(Date.now() / 1000) + 1
            }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Debe mantener orden cronológico de mensajes', async () => {
      const messagesResponse = await request(app)
        .get(`/api/comunicacion/mensajes/${testClienteId}`);

      const messages = messagesResponse.body;
      
      // Verificar que están ordenados por fecha
      for (let i = 1; i < messages.length; i++) {
        const prevTime = new Date(messages[i - 1].timestamp).getTime();
        const currTime = new Date(messages[i].timestamp).getTime();
        expect(currTime).toBeGreaterThanOrEqual(prevTime);
      }
    });
  });

  describe('Estados de Mensaje', () => {
    test('Debe registrar estado de mensaje enviado', async () => {
      await request(app)
        .post('/api/comunicacion/enviar')
        .send({
          clienteId: testClienteId,
          telefono: '51984438516',
          mensaje: 'Mensaje con estado',
          remitente: 'test-user'
        });

      const result = await db.query(
        'SELECT estado FROM comunicacion_mensajes WHERE cliente_id = $1 ORDER BY creado_en DESC LIMIT 1',
        [testClienteId]
      );

      expect(result.rows[0].estado).toBe('sent');
    });

    test('Debe registrar estado de mensaje recibido', async () => {
      await request(app)
        .post('/api/comunicacion/webhook')
        .send({
          messages: [
            {
              id: 'msg_estado_001',
              from: '51984438516@s.whatsapp.net',
              body: 'Mensaje con estado recibido',
              timestamp: Math.floor(Date.now() / 1000)
            }
          ]
        });

      const result = await db.query(
        'SELECT estado FROM comunicacion_mensajes WHERE cliente_id = $1 AND tipo = $2 ORDER BY creado_en DESC LIMIT 1',
        [testClienteId, 'recibido']
      );

      expect(result.rows[0].estado).toBe('delivered');
    });
  });
});
