const express = require('express');
const pool = require('../db');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los usuarios activos
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT id, username, rol, activo, creado_en
      FROM usuarios
      WHERE activo = true AND (username ILIKE $1)
      ORDER BY creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener todos los usuarios inactivos
router.get('/inactivos/lista', verifyAdmin, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT id, username, rol, activo, creado_en
      FROM usuarios
      WHERE activo = false AND (username ILIKE $1)
      ORDER BY creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios inactivos' });
  }
});

// Obtener usuario por ID
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, rol, activo, creado_en FROM usuarios WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Crear usuario
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { username, password_hash, rol } = req.body;

    if (!username || !password_hash || !rol) {
      return res.status(400).json({ error: 'Campos requeridos: username, password_hash, rol' });
    }

    const result = await pool.query(
      'INSERT INTO usuarios (username, password_hash, rol) VALUES ($1, $2, $3) RETURNING id, username, rol, activo, creado_en',
      [username, password_hash, rol]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Actualizar usuario
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { username, rol, activo } = req.body;
    const result = await pool.query(
      'UPDATE usuarios SET username = $1, rol = $2, activo = $3 WHERE id = $4 RETURNING id, username, rol, activo, creado_en',
      [username, rol, activo, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (desactivar)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE usuarios SET activo = false WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario desactivado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Reactivar usuario
router.patch('/:id/reactivar', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE usuarios SET activo = true WHERE id = $1 RETURNING id, username, rol, activo, creado_en',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al reactivar usuario' });
  }
});

module.exports = router;
