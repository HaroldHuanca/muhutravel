const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los proveedores activos
router.get('/', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT id, nombre, tipo, telefono, email, pais, ciudad, activo, creado_en
      FROM proveedores
      WHERE activo = true AND (nombre ILIKE $1 OR tipo ILIKE $1 OR email ILIKE $1 OR ciudad ILIKE $1)
      ORDER BY creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// Obtener todos los proveedores inactivos
router.get('/inactivos/lista', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT id, nombre, tipo, telefono, email, pais, ciudad, activo, creado_en
      FROM proveedores
      WHERE activo = false AND (nombre ILIKE $1 OR tipo ILIKE $1 OR email ILIKE $1 OR ciudad ILIKE $1)
      ORDER BY creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener proveedores inactivos' });
  }
});

// Obtener proveedor por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, tipo, telefono, email, pais, ciudad, activo, creado_en FROM proveedores WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener proveedor' });
  }
});

// Crear proveedor
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nombre, tipo, telefono, email, pais, ciudad } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Campo requerido: nombre' });
    }

    const result = await pool.query(
      'INSERT INTO proveedores (nombre, tipo, telefono, email, pais, ciudad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, tipo, telefono, email, pais, ciudad]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

// Actualizar proveedor
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { nombre, tipo, telefono, email, pais, ciudad, activo } = req.body;
    const result = await pool.query(
      'UPDATE proveedores SET nombre = $1, tipo = $2, telefono = $3, email = $4, pais = $5, ciudad = $6, activo = $7 WHERE id = $8 RETURNING *',
      [nombre, tipo, telefono, email, pais, ciudad, activo, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

// Eliminar proveedor (desactivar)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE proveedores SET activo = false WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor desactivado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});

// Reactivar proveedor
router.patch('/:id/reactivar', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE proveedores SET activo = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al reactivar proveedor' });
  }
});

module.exports = router;
