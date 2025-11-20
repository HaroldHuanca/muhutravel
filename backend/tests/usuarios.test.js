const request = require('supertest');
const express = require('express');
const usuariosRoutes = require('../routes/usuarios');
const { verifyAdmin } = require('../middleware/auth');

jest.mock('../db', () => ({
  query: jest.fn()
}));

jest.mock('../middleware/auth', () => ({
  verifyAdmin: (req, res, next) => {
    req.user = { id: 1, rol: 'admin' };
    next();
  },
  verifyToken: (req, res, next) => {
    req.user = { id: 1, rol: 'agente' };
    next();
  }
}));

const pool = require('../db');

describe('Usuarios Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/usuarios', usuariosRoutes);
    jest.clearAllMocks();
  });

  describe('GET /api/usuarios', () => {
    it('debería retornar lista de usuarios activos', async () => {
      const mockUsuarios = [
        { id: 1, username: 'admin', rol: 'admin', activo: true },
        { id: 2, username: 'agente1', rol: 'agente', activo: true }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockUsuarios });

      const response = await request(app)
        .get('/api/usuarios');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('debería filtrar usuarios por búsqueda', async () => {
      const mockUsuarios = [
        { id: 1, username: 'admin', rol: 'admin', activo: true }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockUsuarios });

      const response = await request(app)
        .get('/api/usuarios?search=admin');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });

  describe('GET /api/usuarios/inactivos/lista', () => {
    it('debería retornar lista de usuarios inactivos', async () => {
      const mockInactivos = [
        { id: 3, username: 'inactivo1', rol: 'agente', activo: false }
      ];

      pool.query.mockResolvedValueOnce({ rows: mockInactivos });

      const response = await request(app)
        .get('/api/usuarios/inactivos/lista');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/usuarios/:id', () => {
    it('debería retornar un usuario por ID', async () => {
      const mockUsuario = {
        id: 1,
        username: 'admin',
        rol: 'admin',
        activo: true
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUsuario] });

      const response = await request(app)
        .get('/api/usuarios/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.username).toBe('admin');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/usuarios/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    it('debería actualizar un usuario', async () => {
      const usuarioActualizado = {
        id: 1,
        username: 'admin_updated',
        rol: 'admin',
        activo: true
      };

      pool.query.mockResolvedValueOnce({ rows: [usuarioActualizado] });

      const response = await request(app)
        .put('/api/usuarios/1')
        .send({
          username: 'admin_updated',
          rol: 'admin'
        });

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('admin_updated');
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    it('debería desactivar un usuario', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const response = await request(app)
        .delete('/api/usuarios/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PATCH /api/usuarios/:id/reactivar', () => {
    it('debería reactivar un usuario inactivo', async () => {
      const usuarioReactivado = {
        id: 1,
        username: 'admin',
        rol: 'admin',
        activo: true
      };

      pool.query.mockResolvedValueOnce({ rows: [usuarioReactivado] });

      const response = await request(app)
        .patch('/api/usuarios/1/reactivar');

      expect(response.status).toBe(200);
      expect(response.body.activo).toBe(true);
    });
  });
});
