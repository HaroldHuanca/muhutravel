const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Reporte de Ventas
router.get('/ventas', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    let query = `
      SELECT 
        r.id, r.numero_reserva, r.fecha_reserva, r.precio_total, r.estado,
        c.nombres as cliente_nombres, c.apellidos as cliente_apellidos,
        p.nombre as paquete_nombre
      FROM reservas r
      JOIN clientes c ON r.cliente_id = c.id
      JOIN paquetes p ON r.paquete_id = p.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (startDate) {
      query += ` AND r.fecha_reserva >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND r.fecha_reserva <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    if (status) {
      query += ` AND r.estado = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY r.fecha_reserva DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reporte de ventas' });
  }
});

// Reporte de Paquetes Populares
router.get('/paquetes-populares', verifyToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        p.nombre,
        COUNT(r.id) as total_reservas,
        SUM(r.precio_total) as total_ingresos
      FROM paquetes p
      LEFT JOIN reservas r ON p.id = r.paquete_id
      GROUP BY p.id, p.nombre
      ORDER BY total_reservas DESC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener paquetes populares' });
  }
});

// Reporte de Clientes
router.get('/clientes', verifyToken, async (req, res) => {
  try {
    const { minSpent, country } = req.query;

    let query = `
      SELECT 
        c.id, c.nombres, c.apellidos, c.pais, c.email,
        COUNT(r.id) as total_reservas,
        COALESCE(SUM(r.precio_total), 0) as total_gastado
      FROM clientes c
      LEFT JOIN reservas r ON c.id = r.cliente_id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (country) {
      query += ` AND c.pais ILIKE $${paramIndex}`;
      params.push(`%${country}%`);
      paramIndex++;
    }

    query += ` GROUP BY c.id, c.nombres, c.apellidos, c.pais, c.email`;

    if (minSpent) {
      query += ` HAVING COALESCE(SUM(r.precio_total), 0) >= $${paramIndex}`;
      params.push(minSpent);
      paramIndex++;
    }

    query += ` ORDER BY total_gastado DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reporte de clientes' });
  }
});

// Reporte de Reservas Pendientes
router.get('/reservas-pendientes', verifyToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id, r.numero_reserva, r.fecha_reserva,r.estado, r.precio_total as monto_pendiente,
        c.nombres as cliente_nombres, c.apellidos as cliente_apellidos,
        p.nombre as paquete_nombre
      FROM reservas r
      JOIN clientes c ON r.cliente_id = c.id
      JOIN paquetes p ON r.paquete_id = p.id
      WHERE r.estado = 'pendiente'
      ORDER BY r.fecha_reserva ASC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reservas pendientes' });
  }
});

module.exports = router;
