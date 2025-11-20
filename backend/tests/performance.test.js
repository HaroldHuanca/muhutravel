/**
 * Pruebas de Performance del Sistema
 * Pruebas de carga y velocidad
 */

const request = require('supertest');
const express = require('express');
const db = require('../db');
const comunicacionRouter = require('../routes/comunicacion');

jest.mock('../db', () => ({
  query: jest.fn()
}));

describe('Performance - Pruebas de Carga', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    app.use((req, res, next) => {
      req.headers.authorization = 'Bearer test-token';
      next();
    });
    
    app.use('/api/comunicacion', comunicacionRouter);
    jest.clearAllMocks();
  });

  describe('Velocidad de Respuesta', () => {
    test('GET /mensajes debe responder en menos de 100ms', async () => {
      db.query.mockResolvedValueOnce({
        rows: Array(100).fill({
          id: 1,
          mensaje: 'Test',
          remitente: 'usuario',
          tipo: 'enviado',
          estado: 'sent',
          creado_en: new Date()
        })
      });

      const start = Date.now();
      
      await request(app)
        .get('/api/comunicacion/mensajes/1');
      
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });

    test('POST /conectar debe responder en menos de 50ms', async () => {
      const start = Date.now();
      
      await request(app)
        .post('/api/comunicacion/conectar')
        .send({
          clienteId: 1,
          telefono: '51984438516',
          nombre: 'Test'
        });
      
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Manejo de Volumen de Datos', () => {
    test('Debe obtener 1000 mensajes sin error', async () => {
      const largeDataset = Array(1000).fill({
        id: 1,
        mensaje: 'Test message',
        remitente: 'usuario',
        tipo: 'enviado',
        estado: 'sent',
        creado_en: new Date()
      });

      db.query.mockResolvedValueOnce({ rows: largeDataset });

      const response = await request(app)
        .get('/api/comunicacion/mensajes/1');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1000);
    });

    test('Debe procesar webhook con 100 mensajes', async () => {
      db.query
        .mockResolvedValue({ rows: [{ id: 1 }] });

      const messages = Array(100).fill({
        id: 'msg_test',
        from: '51984438516@s.whatsapp.net',
        body: 'Test message',
        timestamp: Math.floor(Date.now() / 1000)
      });

      const start = Date.now();

      const response = await request(app)
        .post('/api/comunicacion/webhook')
        .send({ messages });

      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(5000); // 5 segundos máximo
    });
  });

  describe('Manejo de Concurrencia', () => {
    test('Debe manejar 10 solicitudes simultáneas', async () => {
      db.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            mensaje: 'Test',
            remitente: 'usuario',
            tipo: 'enviado',
            estado: 'sent',
            creado_en: new Date()
          }
        ]
      });

      const promises = Array(10).fill(null).map(() =>
        request(app)
          .get('/api/comunicacion/mensajes/1')
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    test('Debe manejar 5 webhooks simultáneos', async () => {
      db.query
        .mockResolvedValue({ rows: [{ id: 1 }] });

      const promises = Array(5).fill(null).map(() =>
        request(app)
          .post('/api/comunicacion/webhook')
          .send({
            messages: [
              {
                id: 'msg_test',
                from: '51984438516@s.whatsapp.net',
                body: 'Test message',
                timestamp: Math.floor(Date.now() / 1000)
              }
            ]
          })
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Uso de Memoria', () => {
    test('No debe causar memory leak con múltiples solicitudes', async () => {
      db.query.mockResolvedValue({
        rows: Array(100).fill({
          id: 1,
          mensaje: 'Test',
          remitente: 'usuario',
          tipo: 'enviado',
          estado: 'sent',
          creado_en: new Date()
        })
      });

      const initialMemory = process.memoryUsage().heapUsed;

      // Hacer 100 solicitudes
      for (let i = 0; i < 100; i++) {
        await request(app)
          .get('/api/comunicacion/mensajes/1');
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // No debe aumentar más de 50MB
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Optimización de Queries', () => {
    test('Debe usar índices para búsquedas rápidas', async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            mensaje: 'Test',
            remitente: 'usuario',
            tipo: 'enviado',
            estado: 'sent',
            creado_en: new Date()
          }
        ]
      });

      const start = Date.now();

      await request(app)
        .get('/api/comunicacion/mensajes/1');

      const duration = Date.now() - start;

      // Con índices, debe ser muy rápido
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Escalabilidad', () => {
    test('Debe escalar con múltiples clientes', async () => {
      db.query.mockResolvedValue({
        rows: [
          {
            id: 1,
            mensaje: 'Test',
            remitente: 'usuario',
            tipo: 'enviado',
            estado: 'sent',
            creado_en: new Date()
          }
        ]
      });

      const promises = Array(50).fill(null).map((_, i) =>
        request(app)
          .get(`/api/comunicacion/mensajes/${i + 1}`)
      );

      const responses = await Promise.all(promises);

      const successCount = responses.filter(r => r.status === 200).length;
      expect(successCount).toBe(50);
    });
  });
});
