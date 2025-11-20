const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las reservas
router.get('/', verifyToken, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = `
      SELECT 
        r.id, r.numero_reserva, r.cliente_id, r.paquete_id, r.empleado_id,
        r.fecha_reserva, r.cantidad_personas, r.precio_total, r.estado, r.comentario,
        c.nombres as cliente_nombres, c.apellidos as cliente_apellidos,
        p.nombre as paquete_nombre,
        e.nombres as empleado_nombres, e.apellidos as empleado_apellidos
      FROM reservas r
      LEFT JOIN clientes c ON r.cliente_id = c.id
      LEFT JOIN paquetes p ON r.paquete_id = p.id
      LEFT JOIN empleados e ON r.empleado_id = e.id
      WHERE r.numero_reserva ILIKE $1 OR c.nombres ILIKE $1 OR p.nombre ILIKE $1
      ORDER BY r.fecha_reserva DESC
    `;
    const result = await pool.query(query, [`%${search}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// Obtener reserva por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        r.id, r.numero_reserva, r.cliente_id, r.paquete_id, r.empleado_id,
        r.fecha_reserva, r.cantidad_personas, r.precio_total, r.estado, r.comentario,
        c.nombres as cliente_nombres, c.apellidos as cliente_apellidos,
        p.nombre as paquete_nombre,
        e.nombres as empleado_nombres, e.apellidos as empleado_apellidos
      FROM reservas r
      LEFT JOIN clientes c ON r.cliente_id = c.id
      LEFT JOIN paquetes p ON r.paquete_id = p.id
      LEFT JOIN empleados e ON r.empleado_id = e.id
      WHERE r.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reserva' });
  }
});

// Crear reserva
router.post('/', verifyToken, async (req, res) => {
  try {
    const { numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario } = req.body;

    if (!numero_reserva || !cliente_id || !paquete_id || !cantidad_personas || !precio_total) {
      return res.status(400).json({ error: 'Campos requeridos: numero_reserva, cliente_id, paquete_id, cantidad_personas, precio_total' });
    }

    const result = await pool.query(
      'INSERT INTO reservas (numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado || 'pendiente', comentario]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// Actualizar reserva
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario } = req.body;
    const result = await pool.query(
      'UPDATE reservas SET numero_reserva = $1, cliente_id = $2, paquete_id = $3, empleado_id = $4, cantidad_personas = $5, precio_total = $6, estado = $7, comentario = $8 WHERE id = $9 RETURNING *',
      [numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar reserva' });
  }
});

// Eliminar reserva
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM reservas WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
});

module.exports = router;
