const request = require('supertest');
const express = require('express');
const clientesRoutes = require('../routes/clientes');

jest.mock('../db', () => ({
  query: jest.fn()
}));

jest.mock('../middleware/auth', () => ({
  verifyToken: (req, res, next) => {
    req.user = { id: 1, rol: 'agente' };
    next();
  }
}));

const pool = require('../db');

describe('Clientes Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/clientes', clientesRoutes);
    jest.clearAllMocks();
  });

  describe('GET /api/clientes', () => {
    it('debería retornar lista de clientes activos', async () => {
      const mockClientes = [
        {
          id: 1,
          nombres: 'Juan',
          apellidos: 'Pérez',
          documento: '12345678',
          email: 'juan@example.com',
          activo: true
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockClientes });

      const response = await request(app)
        .get('/api/clientes');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].nombres).toBe('Juan');
    });
  });

  describe('GET /api/clientes/inactivos/lista', () => {
    it('debería retornar lista de clientes inactivos', async () => {
      const mockInactivos = [
        {
          id: 2,
          nombres: 'Carlos',
          apellidos: 'López',
          documento: '87654321',
          email: 'carlos@example.com',
          activo: false
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockInactivos });

      const response = await request(app)
        .get('/api/clientes/inactivos/lista');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/clientes', () => {
    it('debería crear un nuevo cliente', async () => {
      const nuevoCliente = {
        id: 3,
        nombres: 'María',
        apellidos: 'García',
        documento: '11111111',
        email: 'maria@example.com',
        telefono: '987654321',
        ciudad: 'Lima',
        pais: 'Peru',
        activo: true
      };

      pool.query.mockResolvedValueOnce({ rows: [nuevoCliente] });

      const response = await request(app)
        .post('/api/clientes')
        .send({
          nombres: 'María',
          apellidos: 'García',
          documento: '11111111',
          email: 'maria@example.com',
          telefono: '987654321',
          ciudad: 'Lima',
          pais: 'Peru'
        });

      expect(response.status).toBe(201);
      expect(response.body.nombres).toBe('María');
    });

    it('debería retornar error si faltan campos requeridos', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .send({
          nombres: 'María'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/clientes/:id', () => {
    it('debería actualizar un cliente', async () => {
      const clienteActualizado = {
        id: 1,
        nombres: 'Juan Updated',
        apellidos: 'Pérez',
        documento: '12345678',
        email: 'juan.updated@example.com',
        activo: true
      };

      pool.query.mockResolvedValueOnce({ rows: [clienteActualizado] });

      const response = await request(app)
        .put('/api/clientes/1')
        .send({
          nombres: 'Juan Updated',
          apellidos: 'Pérez',
          documento: '12345678',
          email: 'juan.updated@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.nombres).toBe('Juan Updated');
    });
  });

  describe('DELETE /api/clientes/:id', () => {
    it('debería desactivar un cliente', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const response = await request(app)
        .delete('/api/clientes/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PATCH /api/clientes/:id/reactivar', () => {
    it('debería reactivar un cliente inactivo', async () => {
      const clienteReactivado = {
        id: 2,
        nombres: 'Carlos',
        apellidos: 'López',
        documento: '87654321',
        email: 'carlos@example.com',
        activo: true
      };

      pool.query.mockResolvedValueOnce({ rows: [clienteReactivado] });

      const response = await request(app)
        .patch('/api/clientes/2/reactivar');

      expect(response.status).toBe(200);
      expect(response.body.activo).toBe(true);
    });
  });
});
