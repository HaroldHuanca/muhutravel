const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los empleados activos
router.get('/', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT id, nombres, apellidos, puesto, telefono, email, activo, creado_en
      FROM empleados
      WHERE activo = true AND (nombres ILIKE $1 OR apellidos ILIKE $1 OR puesto ILIKE $1 OR email ILIKE $1)
      ORDER BY creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

// Obtener todos los empleados inactivos
router.get('/inactivos/lista', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT id, nombres, apellidos, puesto, telefono, email, activo, creado_en
      FROM empleados
      WHERE activo = false AND (nombres ILIKE $1 OR apellidos ILIKE $1 OR puesto ILIKE $1 OR email ILIKE $1)
      ORDER BY creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener empleados inactivos' });
  }
});

// Obtener empleado por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombres, apellidos, puesto, telefono, email, activo, creado_en FROM empleados WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
});

// Crear empleado
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nombres, apellidos, puesto, telefono, email } = req.body;

    if (!nombres || !apellidos) {
      return res.status(400).json({ error: 'Campos requeridos: nombres, apellidos' });
    }

    const result = await pool.query(
      'INSERT INTO empleados (nombres, apellidos, puesto, telefono, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombres, apellidos, puesto, telefono, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear empleado' });
  }
});

// Actualizar empleado
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { nombres, apellidos, puesto, telefono, email, activo } = req.body;
    const result = await pool.query(
      'UPDATE empleados SET nombres = $1, apellidos = $2, puesto = $3, telefono = $4, email = $5, activo = $6 WHERE id = $7 RETURNING *',
      [nombres, apellidos, puesto, telefono, email, activo, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
});

// Eliminar empleado (desactivar)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE empleados SET activo = false WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json({ message: 'Empleado desactivado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
});

// Reactivar empleado
router.patch('/:id/reactivar', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE empleados SET activo = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al reactivar empleado' });
  }
});

module.exports = router;
