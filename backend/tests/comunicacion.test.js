/**
 * Pruebas unitarias para el módulo de comunicación
 * Pruebas de endpoints de WhatsApp
 */

const request = require('supertest');
const express = require('express');
const comunicacionRouter = require('../routes/comunicacion');

// Mock de la base de datos
jest.mock('../db', () => ({
  query: jest.fn()
}));

const db = require('../db');

describe('Módulo de Comunicación - Pruebas de API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Middleware de autenticación mock
    app.use((req, res, next) => {
      req.headers.authorization = 'Bearer test-token';
      next();
    });
    
    app.use('/api/comunicacion', comunicacionRouter);
    
    jest.clearAllMocks();
  });

  describe('POST /api/comunicacion/conectar', () => {
    test('Debe conectar exitosamente con un cliente', async () => {
      const response = await request(app)
        .post('/api/comunicacion/conectar')
        .send({
          clienteId: 1,
          telefono: '51984438516',
          nombre: 'Harold Huanca'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.clienteId).toBe(1);
    });

    test('Debe retornar error si faltan datos', async () => {
      const response = await request(app)
        .post('/api/comunicacion/conectar')
        .send({
          clienteId: 1
          // Falta telefono
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('Debe retornar error sin token de autenticación', async () => {
      const appSinAuth = express();
      appSinAuth.use(express.json());
      appSinAuth.use('/api/comunicacion', comunicacionRouter);

      const response = await request(appSinAuth)
        .post('/api/comunicacion/conectar')
        .send({
          clienteId: 1,
          telefono: '51984438516',
          nombre: 'Harold Huanca'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/comunicacion/mensajes/:clienteId', () => {
    test('Debe obtener mensajes de un cliente', async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            mensaje: 'Hola',
            remitente: 'usuario',
            tipo: 'enviado',
            estado: 'sent',
            creado_en: new Date()
          }
        ]
      });

      const response = await request(app)
        .get('/api/comunicacion/mensajes/1');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].texto).toBe('Hola');
    });

    test('Debe retornar array vacío si no hay mensajes', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/comunicacion/mensajes/1');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('Debe retornar error en caso de fallo de BD', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .get('/api/comunicacion/mensajes/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/comunicacion/webhook', () => {
    test('Debe procesar webhook con mensajes', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Buscar cliente
        .mockResolvedValueOnce({ rows: [] }); // Guardar mensaje

      const response = await request(app)
        .post('/api/comunicacion/webhook')
        .send({
          messages: [
            {
              id: 'msg123',
              from: '51984438516@s.whatsapp.net',
              body: 'Hola desde WhatsApp',
              timestamp: Math.floor(Date.now() / 1000)
            }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Debe ignorar webhook sin mensajes', async () => {
      const response = await request(app)
        .post('/api/comunicacion/webhook')
        .send({ messages: [] });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Debe continuar si cliente no existe', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // Cliente no encontrado

      const response = await request(app)
        .post('/api/comunicacion/webhook')
        .send({
          messages: [
            {
              id: 'msg123',
              from: '51999999999@s.whatsapp.net',
              body: 'Mensaje de cliente desconocido',
              timestamp: Math.floor(Date.now() / 1000)
            }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Validación de Datos', () => {
    test('Debe validar formato de número de teléfono', async () => {
      const response = await request(app)
        .post('/api/comunicacion/conectar')
        .send({
          clienteId: 1,
          telefono: '', // Teléfono vacío
          nombre: 'Test'
        });

      expect(response.status).toBe(400);
    });

    test('Debe normalizar números de teléfono', async () => {
      const response = await request(app)
        .post('/api/comunicacion/conectar')
        .send({
          clienteId: 1,
          telefono: '+51-984-438-516', // Con caracteres especiales
          nombre: 'Test'
        });

      expect(response.status).toBe(200);
    });
  });

  describe('Manejo de Errores', () => {
    test('Debe retornar error 500 en caso de excepción', async () => {
      db.query.mockRejectedValueOnce(new Error('Unexpected error'));

      const response = await request(app)
        .get('/api/comunicacion/mensajes/1');

      expect(response.status).toBe(500);
    });

    test('Debe loguear errores', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      db.query.mockRejectedValueOnce(new Error('Test error'));

      await request(app)
        .get('/api/comunicacion/mensajes/1');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
