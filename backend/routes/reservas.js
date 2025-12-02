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
        e.nombres as empleado_nombres, e.apellidos as empleado_apellidos,
        COALESCE((SELECT SUM(monto) FROM pagos WHERE reserva_id = r.id), 0) as total_pagado
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

// ============ RUTAS CON /proveedores (MÁS ESPECÍFICAS) ============

// Obtener proveedores de una reserva
router.get('/:id/proveedores', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('Obteniendo proveedores para reserva ID:', id);

    const result = await pool.query(
      `SELECT rp.id, rp.reserva_id, rp.proveedor_id, rp.tipo_servicio, rp.costo, rp.notas, rp.creado_en,
              pr.nombre as proveedor_nombre, pr.tipo as proveedor_tipo, pr.email, pr.telefono
       FROM reserva_proveedores rp
       LEFT JOIN proveedores pr ON rp.proveedor_id = pr.id
       WHERE rp.reserva_id = $1
       ORDER BY rp.creado_en DESC`,
      [id]
    );
    console.log('Proveedores encontrados:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener proveedores:', err);
    res.status(500).json({ error: 'Error al obtener proveedores de la reserva', details: err.message });
  }
});

// Agregar proveedor a reserva
router.post('/:id/proveedores', verifyToken, async (req, res) => {
  try {
    const { proveedor_id, tipo_servicio, costo, notas } = req.body;
    const reserva_id = parseInt(req.params.id);

    if (!proveedor_id) {
      return res.status(400).json({ error: 'proveedor_id es requerido' });
    }

    const result = await pool.query(
      `INSERT INTO reserva_proveedores (reserva_id, proveedor_id, tipo_servicio, costo, notas)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [reserva_id, proveedor_id, tipo_servicio, costo, notas]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Este proveedor ya está asignado a esta reserva' });
    }
    res.status(500).json({ error: 'Error al agregar proveedor a la reserva' });
  }
});

// Actualizar proveedor en reserva
router.put('/:id/proveedores/:rp_id', verifyToken, async (req, res) => {
  try {
    const { tipo_servicio, costo, notas } = req.body;
    const result = await pool.query(
      `UPDATE reserva_proveedores 
       SET tipo_servicio = $1, costo = $2, notas = $3
       WHERE id = $4 AND reserva_id = $5
       RETURNING *`,
      [tipo_servicio, costo, notas, req.params.rp_id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Relación reserva-proveedor no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar proveedor de la reserva' });
  }
});

// Eliminar proveedor de reserva
router.delete('/:id/proveedores/:rp_id', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM reserva_proveedores 
       WHERE id = $1 AND reserva_id = $2
       RETURNING id`,
      [req.params.rp_id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Relación reserva-proveedor no encontrada' });
    }

    res.json({ message: 'Proveedor removido de la reserva' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar proveedor de la reserva' });
  }
});

// ============ RUTAS SIN /proveedores (MENOS ESPECÍFICAS) ============

// Obtener reserva por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('Buscando reserva con ID:', id);

    const result = await pool.query(
      `SELECT 
        r.id, r.numero_reserva, r.cliente_id, r.paquete_id, r.empleado_id,
        r.fecha_reserva, r.cantidad_personas, r.precio_total, r.estado, r.comentario,
        c.nombres as cliente_nombres, c.apellidos as cliente_apellidos,
        p.nombre as paquete_nombre,
        e.nombres as empleado_nombres, e.apellidos as empleado_apellidos,
        COALESCE((SELECT SUM(monto) FROM pagos WHERE reserva_id = r.id AND estado = 'completado'), 0) as total_pagado
      FROM reservas r
      LEFT JOIN clientes c ON r.cliente_id = c.id
      LEFT JOIN paquetes p ON r.paquete_id = p.id
      LEFT JOIN empleados e ON r.empleado_id = e.id
      WHERE r.id = $1`,
      [id]
    );

    console.log('Resultado de la consulta:', result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada', id: id });
    }

    const reserva = result.rows[0];

    // Obtener pasajeros
    const pasajeros = await pool.query('SELECT * FROM pasajeros WHERE reserva_id = $1', [id]);
    reserva.pasajeros = pasajeros.rows;

    // Obtener pagos
    const pagos = await pool.query('SELECT * FROM pagos WHERE reserva_id = $1 ORDER BY fecha_pago DESC', [id]);
    reserva.pagos = pagos.rows;

    // Obtener historial
    const historial = await pool.query(`
      SELECT h.*, u.username as usuario_nombre 
      FROM historial_reservas h
      LEFT JOIN usuarios u ON h.usuario_id = u.id
      WHERE h.reserva_id = $1 
      ORDER BY h.fecha_cambio DESC`,
      [id]
    );
    reserva.historial = historial.rows;

    res.json(reserva);
  } catch (err) {
    console.error('Error al obtener reserva:', err);
    res.status(500).json({ error: 'Error al obtener reserva', details: err.message });
  }
});

// Crear reserva
router.post('/', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario } = req.body;

    if (!numero_reserva || !cliente_id || !paquete_id || !cantidad_personas || precio_total === undefined) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Campos requeridos: numero_reserva, cliente_id, paquete_id, cantidad_personas, precio_total' });
    }

    // 1. Validar Deuda del Cliente
    const deudaQuery = `
      SELECT r.id, r.precio_total, 
             COALESCE((SELECT SUM(monto) FROM pagos WHERE reserva_id = r.id AND estado = 'completado'), 0) as pagado
      FROM reservas r
      WHERE r.cliente_id = $1 AND r.estado NOT IN ('cancelada', 'completada')
    `;
    const deudaResult = await client.query(deudaQuery, [cliente_id]);

    let tieneDeuda = false;
    let tienePendientePago = false;

    for (const res of deudaResult.rows) {
      if (parseFloat(res.pagado) < parseFloat(res.precio_total)) {
        tieneDeuda = true;
      }
      // Verificar si hay alguna reserva explícitamente en "pendiente_pago" (aunque la lógica de arriba ya cubre deuda financiera)
      // La regla dice: "Si el cliente tiene pagos pendientes...". Interpretamos como saldo pendiente.
    }

    // Verificar estado "pendiente_pago" especifico si se requiere estricto
    const pendientes = await client.query("SELECT id FROM reservas WHERE cliente_id = $1 AND estado = 'pendiente_pago'", [cliente_id]);
    if (pendientes.rows.length > 0) tienePendientePago = true;

    if (tieneDeuda || tienePendientePago) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El cliente tiene pagos pendientes o deudas. No se puede generar nueva reserva.' });
    }

    // 2. Validar Paquete
    const paqueteRes = await client.query(`
      SELECT p.*, pr.activo as proveedor_activo 
      FROM paquetes p
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
      WHERE p.id = $1
    `, [paquete_id]);

    if (paqueteRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    const paquete = paqueteRes.rows[0];

    if (!paquete.activo) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El paquete turístico no está activo' });
    }

    if (paquete.proveedor_id && !paquete.proveedor_activo) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El proveedor asignado al paquete no está activo' });
    }

    const fechaInicio = new Date(paquete.fecha_inicio);
    const hoy = new Date();
    if (fechaInicio < hoy) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No se pueden crear reservas para fechas pasadas' });
    }

    // 3. Validar Disponibilidad y Tipo de Tour
    if (paquete.tipo === 'REGULAR') {
      // Verificar cupos
      const ocupacionRes = await client.query(`
        SELECT COALESCE(SUM(cantidad_personas), 0) as total_ocupado
        FROM reservas
        WHERE paquete_id = $1 AND estado NOT IN ('cancelada', 'borrador')
      `, [paquete_id]);

      const totalOcupado = parseInt(ocupacionRes.rows[0].total_ocupado);

      if (totalOcupado + parseInt(cantidad_personas) > paquete.cupos) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `No hay disponibilidad suficiente. Cupos restantes: ${paquete.cupos - totalOcupado}` });
      }

      // Nota: El cupo mínimo se valida al confirmar el tour, no al reservar.
    } else if (paquete.tipo === 'PRIVADO') {
      // Validar disponibilidad del empleado (si está asignado)
      if (paquete.empleado_id) {
        const empleadoOcupado = await client.query(`
          SELECT r.id FROM reservas r
          JOIN paquetes p ON r.paquete_id = p.id
          WHERE p.empleado_id = $1 
          AND p.fecha_inicio = $2
          AND r.estado NOT IN ('cancelada')
        `, [paquete.empleado_id, paquete.fecha_inicio]);

        if (empleadoOcupado.rows.length > 0) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'El servicio (empleado) no está disponible para esta fecha.' });
        }
      }
      // Tour privado no resta cupo global del paquete (si fuera un paquete genérico), 
      // pero aquí el paquete tiene fecha fija. Asumimos que si es privado, se bloquea para el cliente.
    }

    // 4. Crear Reserva
    const estadoInicial = estado || 'borrador'; // Por defecto borrador

    const result = await client.query(
      'INSERT INTO reservas (numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estadoInicial, comentario]
    );

    // Registrar historial inicial
    await client.query(
      'INSERT INTO historial_reservas (reserva_id, estado_nuevo, usuario_id, comentario) VALUES ($1, $2, $3, $4)',
      [result.rows[0].id, estadoInicial, req.user?.id, 'Creación de reserva']
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al crear reserva' });
  } finally {
    client.release();
  }
});

// Actualizar reserva (con historial)
router.put('/:id', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario, usuario_id } = req.body;
    const reserva_id = req.params.id;

    // Obtener estado anterior y datos actuales
    const oldReservaRes = await client.query('SELECT estado, precio_total FROM reservas WHERE id = $1', [reserva_id]);
    if (oldReservaRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    const oldReserva = oldReservaRes.rows[0];
    const estadoAnterior = oldReserva.estado;

    // Regla: Una reserva completada o cancelada no puede editarse.
    if (estadoAnterior === 'completada' || estadoAnterior === 'cancelada') {
      // Permitir solo si se está reactivando o cancelando? La regla dice "no puede editarse".
      // Asumiremos estricto por ahora, salvo que sea un admin (no implementado check de rol aquí aun).
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `No se puede editar una reserva en estado '${estadoAnterior}'` });
    }

    // Regla: Para mover a "En Servicio", deben verificarse todos los pagos.
    if (estado === 'en_servicio' && estadoAnterior !== 'en_servicio') {
      const pagosRes = await client.query(`
        SELECT COALESCE(SUM(monto), 0) as total_pagado 
        FROM pagos 
        WHERE reserva_id = $1 AND estado = 'completado'
      `, [reserva_id]);
      const totalPagado = parseFloat(pagosRes.rows[0].total_pagado);

      // Usar el precio nuevo si se está actualizando, sino el viejo
      const precioFinal = precio_total !== undefined ? parseFloat(precio_total) : parseFloat(oldReserva.precio_total);

      if (totalPagado < precioFinal) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'No se puede pasar a "En Servicio" sin completar el pago total.' });
      }
    }

    const result = await client.query(
      `UPDATE reservas SET 
        numero_reserva = COALESCE($1, numero_reserva), 
        cliente_id = COALESCE($2, cliente_id), 
        paquete_id = COALESCE($3, paquete_id), 
        empleado_id = COALESCE($4, empleado_id), 
        cantidad_personas = COALESCE($5, cantidad_personas), 
        precio_total = COALESCE($6, precio_total), 
        estado = COALESCE($7, estado), 
        comentario = COALESCE($8, comentario) 
       WHERE id = $9 RETURNING *`,
      [numero_reserva, cliente_id, paquete_id, empleado_id, cantidad_personas, precio_total, estado, comentario, reserva_id]
    );

    // Registrar en historial si hubo cambio de estado
    if (estado && estado !== estadoAnterior) {
      await client.query(
        'INSERT INTO historial_reservas (reserva_id, estado_anterior, estado_nuevo, usuario_id, comentario) VALUES ($1, $2, $3, $4, $5)',
        [reserva_id, estadoAnterior, estado, usuario_id || req.user?.id, comentario]
      );
    } else {
      // Registrar modificación de datos aunque no cambie estado
      await client.query(
        'INSERT INTO historial_reservas (reserva_id, estado_anterior, estado_nuevo, usuario_id, comentario) VALUES ($1, $2, $3, $4, $5)',
        [reserva_id, estadoAnterior, estadoAnterior, usuario_id || req.user?.id, 'Modificación de datos']
      );
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar reserva' });
  } finally {
    client.release();
  }
});

// ============ RUTAS PARA PASAJEROS ============

// Agregar pasajero
router.post('/:id/pasajeros', verifyToken, async (req, res) => {
  try {
    const { nombres, apellidos, tipo_documento, documento, fecha_nacimiento } = req.body;
    const reserva_id = req.params.id;

    const result = await pool.query(
      'INSERT INTO pasajeros (reserva_id, nombres, apellidos, tipo_documento, documento, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [reserva_id, nombres, apellidos, tipo_documento, documento, fecha_nacimiento]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar pasajero' });
  }
});

// Eliminar pasajero
router.delete('/:id/pasajeros/:pid', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM pasajeros WHERE id = $1 AND reserva_id = $2', [req.params.pid, req.params.id]);
    res.json({ message: 'Pasajero eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar pasajero' });
  }
});

// ============ RUTAS PARA PAGOS ============

// Registrar pago
router.post('/:id/pagos', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { monto, metodo_pago, referencia, notas, usuario_id } = req.body;
    const reserva_id = req.params.id;

    const result = await client.query(
      'INSERT INTO pagos (reserva_id, monto, metodo_pago, referencia, notas, registrado_por) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [reserva_id, monto, metodo_pago, referencia, notas, usuario_id || req.user?.id]
    );

    // Verificar si se debe actualizar el estado de la reserva
    const reservaRes = await client.query('SELECT precio_total, estado FROM reservas WHERE id = $1', [reserva_id]);
    const reserva = reservaRes.rows[0];

    if (reserva.estado === 'pendiente_pago') {
      const pagosRes = await client.query(`
        SELECT COALESCE(SUM(monto), 0) as total_pagado 
        FROM pagos 
        WHERE reserva_id = $1 AND estado = 'completado'
      `, [reserva_id]);

      const totalPagado = parseFloat(pagosRes.rows[0].total_pagado);
      const precioTotal = parseFloat(reserva.precio_total);

      // Regla: Para generar un reserva el pago minimo debe ser del 30% para quedar en estado de confirmado.
      if (totalPagado >= (precioTotal * 0.30)) {
        await client.query(
          "UPDATE reservas SET estado = 'confirmada' WHERE id = $1",
          [reserva_id]
        );

        // Registrar cambio en historial
        await client.query(
          'INSERT INTO historial_reservas (reserva_id, estado_anterior, estado_nuevo, usuario_id, comentario) VALUES ($1, $2, $3, $4, $5)',
          [reserva_id, 'pendiente_pago', 'confirmada', usuario_id || req.user?.id, 'Confirmación automática por pago mínimo (30%)']
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al registrar pago' });
  } finally {
    client.release();
  }
});

// Actualizar estado de pago (ej. anular)
router.put('/:id/pagos/:pid', verifyToken, async (req, res) => {
  try {
    const { estado } = req.body;
    const result = await pool.query(
      'UPDATE pagos SET estado = $1 WHERE id = $2 AND reserva_id = $3 RETURNING *',
      [estado, req.params.pid, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar pago' });
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
