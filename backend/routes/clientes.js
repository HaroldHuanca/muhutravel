const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los clientes activos
router.get('/', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT id, nombres, apellidos, documento, telefono, email, ciudad, pais, activo, creado_en
      FROM clientes
      WHERE activo = true AND (nombres ILIKE $1 OR apellidos ILIKE $1 OR documento ILIKE $1 OR email ILIKE $1)
      ORDER BY creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// Obtener todos los clientes inactivos
router.get('/inactivos/lista', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT id, nombres, apellidos, documento, telefono, email, ciudad, pais, activo, creado_en
      FROM clientes
      WHERE activo = false AND (nombres ILIKE $1 OR apellidos ILIKE $1 OR documento ILIKE $1 OR email ILIKE $1)
      ORDER BY creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener clientes inactivos' });
  }
});

// Obtener cliente por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombres, apellidos, documento, telefono, email, ciudad, pais, activo, creado_en FROM clientes WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// Crear cliente
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nombres, apellidos, documento, telefono, email, ciudad, pais } = req.body;

    if (!nombres || !apellidos || !documento) {
      return res.status(400).json({ error: 'Campos requeridos: nombres, apellidos, documento' });
    }

    const result = await pool.query(
      'INSERT INTO clientes (nombres, apellidos, documento, telefono, email, ciudad, pais) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nombres, apellidos, documento, telefono, email, ciudad, pais || 'Peru']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// Actualizar cliente
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { nombres, apellidos, documento, telefono, email, ciudad, pais, activo } = req.body;
    const result = await pool.query(
      'UPDATE clientes SET nombres = $1, apellidos = $2, documento = $3, telefono = $4, email = $5, ciudad = $6, pais = $7, activo = $8 WHERE id = $9 RETURNING *',
      [nombres, apellidos, documento, telefono, email, ciudad, pais, activo, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// Eliminar cliente (desactivar)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE clientes SET activo = false WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente desactivado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

// Reactivar cliente
router.patch('/:id/reactivar', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE clientes SET activo = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al reactivar cliente' });
  }
});

module.exports = router;
