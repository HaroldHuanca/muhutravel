const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los paquetes activos
router.get('/', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT 
        p.id, p.nombre, p.destino, p.duracion_dias, p.precio, p.cupos, 
        p.fecha_inicio, p.fecha_fin, p.proveedor_id, p.empleado_id, 
        p.activo, p.creado_en,
        pr.nombre as proveedor_nombre,
        e.nombres as empleado_nombres, e.apellidos as empleado_apellidos
      FROM paquetes p
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
      LEFT JOIN empleados e ON p.empleado_id = e.id
      WHERE p.activo = true AND (p.nombre ILIKE $1 OR p.destino ILIKE $1)
      ORDER BY p.creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener paquetes' });
  }
});

// Obtener todos los paquetes inactivos
router.get('/inactivos/lista', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT 
        p.id, p.nombre, p.destino, p.duracion_dias, p.precio, p.cupos, 
        p.fecha_inicio, p.fecha_fin, p.proveedor_id, p.empleado_id, 
        p.activo, p.creado_en,
        pr.nombre as proveedor_nombre,
        e.nombres as empleado_nombres, e.apellidos as empleado_apellidos
      FROM paquetes p
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
      LEFT JOIN empleados e ON p.empleado_id = e.id
      WHERE p.activo = false AND (p.nombre ILIKE $1 OR p.destino ILIKE $1)
      ORDER BY p.creado_en DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener paquetes inactivos' });
  }
});

// Obtener paquete por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.id, p.nombre, p.destino, p.duracion_dias, p.precio, p.cupos, 
        p.fecha_inicio, p.fecha_fin, p.proveedor_id, p.empleado_id, 
        p.activo, p.creado_en,
        pr.nombre as proveedor_nombre,
        e.nombres as empleado_nombres, e.apellidos as empleado_apellidos
      FROM paquetes p
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
      LEFT JOIN empleados e ON p.empleado_id = e.id
      WHERE p.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener paquete' });
  }
});

// Crear paquete
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nombre, destino, duracion_dias, precio, cupos, fecha_inicio, fecha_fin, proveedor_id, empleado_id } = req.body;

    if (!nombre || !destino || !duracion_dias || !precio || !cupos || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Campos requeridos: nombre, destino, duracion_dias, precio, cupos, fecha_inicio, fecha_fin' });
    }

    const result = await pool.query(
      'INSERT INTO paquetes (nombre, destino, duracion_dias, precio, cupos, fecha_inicio, fecha_fin, proveedor_id, empleado_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [nombre, destino, duracion_dias, precio, cupos, fecha_inicio, fecha_fin, proveedor_id, empleado_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear paquete' });
  }
});

// Actualizar paquete
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { nombre, destino, duracion_dias, precio, cupos, fecha_inicio, fecha_fin, proveedor_id, empleado_id, activo } = req.body;
    const result = await pool.query(
      'UPDATE paquetes SET nombre = $1, destino = $2, duracion_dias = $3, precio = $4, cupos = $5, fecha_inicio = $6, fecha_fin = $7, proveedor_id = $8, empleado_id = $9, activo = $10 WHERE id = $11 RETURNING *',
      [nombre, destino, duracion_dias, precio, cupos, fecha_inicio, fecha_fin, proveedor_id, empleado_id, activo, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar paquete' });
  }
});

// Eliminar paquete (desactivar)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE paquetes SET activo = false WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    res.json({ message: 'Paquete desactivado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar paquete' });
  }
});

// Reactivar paquete
router.patch('/:id/reactivar', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE paquetes SET activo = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al reactivar paquete' });
  }
});

module.exports = router;
