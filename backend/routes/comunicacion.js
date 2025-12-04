const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// Función auxiliar para obtener token (DB o ENV)
const obtenerWhapiToken = async () => {
  try {
    // 1. Buscar en DB
    const result = await db.query('SELECT valor FROM configuracion WHERE clave = $1', ['WHAPI_TOKEN']);
    if (result.rows.length > 0 && result.rows[0].valor) {
      return result.rows[0].valor;
    }
    // 2. Fallback a ENV
    return process.env.WHAPI_TOKEN || null;
  } catch (err) {
    console.error('Error al obtener token:', err);
    return process.env.WHAPI_TOKEN || null;
  }
};

// Verificar configuración de whapi
const verificarWhapiConfig = async () => {
  const token = await obtenerWhapiToken();
  if (!token) {
    console.warn('⚠️ WHAPI_TOKEN no configurado en DB ni .env');
    return false;
  }
  return true;
};

// Obtener estado del servicio
router.get('/status', verifyToken, async (req, res) => {
  const token = await obtenerWhapiToken();
  res.json({
    whapiConfigured: !!token,
    mode: token ? 'production' : 'simulation'
  });
});

// Guardar configuración (Solo Admin)
router.post('/config', verifyToken, async (req, res) => {
  try {
    const { token } = req.body;

    // Verificar permisos (simple check, idealmente middleware)
    // Asumimos que el frontend controla acceso, pero validamos aquí también si es crítico
    // En este caso, confiamos en que solo admin ve la opción, pero podríamos validar req.user.rol

    await db.query(
      'INSERT INTO configuracion (clave, valor, descripcion) VALUES ($1, $2, $3) ON CONFLICT (clave) DO UPDATE SET valor = $2, actualizado_en = NOW()',
      ['WHAPI_TOKEN', token, 'Token de autenticación para Whapi.cloud']
    );

    res.json({ success: true, message: 'Configuración guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
});

// Conectar con cliente (simular conexión WhatsApp)
router.post('/conectar', verifyToken, async (req, res) => {
  try {
    const { clienteId, telefono, nombre } = req.body;

    if (!clienteId || !telefono) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Aquí se integraría con la API de whapi
    // Por ahora, simular la conexión
    console.log(`Conectando con cliente: ${nombre} (${telefono})`);

    // Guardar la conexión en la base de datos
    await db.query(
      'INSERT INTO comunicacion_conexiones (cliente_id, telefono, conectado_en) VALUES ($1, $2, NOW())',
      [clienteId, telefono]
    );

    res.json({
      success: true,
      message: 'Conexión establecida correctamente',
      clienteId,
      telefono
    });
  } catch (error) {
    console.error('Error al conectar:', error);
    res.status(500).json({ error: 'Error al establecer conexión' });
  }
});

// Enviar mensaje
router.post('/enviar', verifyToken, async (req, res) => {
  try {
    const { clienteId, telefono, mensaje, remitente } = req.body;

    if (!clienteId || !telefono || !mensaje) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Normalizar número de teléfono (remover caracteres especiales)
    let numeroLimpio = telefono.replace(/\D/g, '');

    // Si tiene 9 dígitos (formato Perú sin código), agregar 51
    if (numeroLimpio.length === 9) {
      numeroLimpio = '51' + numeroLimpio;
    }

    console.log(`📤 Intentando enviar mensaje a ${numeroLimpio}: ${mensaje}`);

    // Intentar enviar con whapi si está configurado
    if (await verificarWhapiConfig()) {
      try {
        const token = await obtenerWhapiToken();
        let whapiUrl = process.env.WHAPI_API_URL || 'https://gate.whapi.cloud';
        // Remover barra diagonal final si existe
        whapiUrl = whapiUrl.replace(/\/$/, '');
        const fullUrl = `${whapiUrl}/messages/text`;

        console.log(`📍 URL de whapi: ${fullUrl}`);
        console.log(`🔑 Token: ${token.substring(0, 10)}...`);

        const response = await axios.post(
          fullUrl,
          {
            to: numeroLimpio,
            body: mensaje
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        console.log('✅ Mensaje enviado exitosamente a través de whapi:', response.data);

        // Guardar mensaje en la base de datos
        const messageId = response.data.message?.id || response.data.result?.id || `msg_${Date.now()}`;
        try {
          await db.query(
            'INSERT INTO comunicacion_mensajes (cliente_id, mensaje, remitente, tipo, estado, whapi_message_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [clienteId, mensaje, 'usuario', 'enviado', 'sent', messageId]
          );
          console.log('💾 Mensaje guardado en BD');
        } catch (dbError) {
          console.error('⚠️ Error al guardar mensaje en BD:', dbError.message);
          // No fallar la respuesta si falla la BD
        }

        res.json({
          success: true,
          message: 'Mensaje enviado correctamente',
          messageId: messageId,
          clienteId,
          timestamp: new Date().toISOString(),
          whapi: true
        });
      } catch (whapiError) {
        console.error('❌ Error de whapi:');
        console.error('Status:', whapiError.response?.status);
        console.error('Data:', whapiError.response?.data);
        console.error('Message:', whapiError.message);

        // Si falla whapi, retornar error
        return res.status(500).json({
          error: 'Error al enviar mensaje a través de WhatsApp',
          details: whapiError.response?.data?.error || whapiError.message,
          status: whapiError.response?.status
        });
      }
    } else {
      // Sin whapi configurado, simular
      console.log(`⚠️ Simulando envío a ${numeroLimpio}: ${mensaje}`);

      res.json({
        success: true,
        message: 'Mensaje simulado (whapi no configurado)',
        messageId: `msg_${Date.now()}`,
        clienteId,
        timestamp: new Date().toISOString(),
        simulated: true
      });
    }
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// Obtener mensajes de un cliente
router.get('/mensajes/:clienteId', verifyToken, async (req, res) => {
  try {
    const { clienteId } = req.params;

    // Obtener mensajes de la base de datos
    const result = await db.query(
      'SELECT id, mensaje, remitente, tipo, estado, creado_en FROM comunicacion_mensajes WHERE cliente_id = $1 ORDER BY creado_en ASC',
      [clienteId]
    );

    // Formatear mensajes para el frontend
    const mensajes = result.rows.map(msg => ({
      id: msg.id,
      texto: msg.mensaje,
      remitente: msg.remitente === 'usuario' ? 'Yo' : msg.remitente,
      timestamp: new Date(msg.creado_en).toLocaleTimeString('es-PE'),
      tipo: msg.tipo,
      estado: msg.estado
    }));

    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

// Webhook para recibir mensajes de WhatsApp
router.post('/webhook', async (req, res) => {
  try {
    const { messages } = req.body;

    console.log('📨 Webhook recibido:', JSON.stringify(req.body, null, 2));

    if (!messages || messages.length === 0) {
      console.log('⚠️ Webhook recibido sin mensajes');
      return res.json({ success: true, message: 'Sin mensajes' });
    }

    console.log(`📨 Webhook recibido con ${messages.length} mensaje(s)`);

    const procesados = [];
    const errores = [];

    // Procesar cada mensaje recibido
    for (const message of messages) {
      try {
        console.log('📩 Procesando mensaje:', {
          id: message.id,
          from: message.from,
          body: message.body,
          timestamp: message.timestamp
        });

        // Validar que el mensaje tenga contenido
        if (!message.body || !message.from) {
          console.warn('⚠️ Mensaje incompleto, saltando');
          continue;
        }

        // Extraer número de teléfono (remover @s.whatsapp.net si existe)
        let telefono = message.from?.replace('@s.whatsapp.net', '') || message.from;

        // Normalizar número de teléfono
        telefono = telefono.replace(/\D/g, '');

        console.log(`🔍 Buscando cliente con teléfono: ${telefono}`);

        // Buscar el cliente por teléfono
        // Buscar el cliente por teléfono (intentar con y sin código de país 51)
        let telefonoSinCodigo = telefono;
        if (telefono.startsWith('51') && telefono.length === 11) {
          telefonoSinCodigo = telefono.substring(2);
        }

        const clienteResult = await db.query(
          'SELECT id FROM clientes WHERE telefono = $1 OR telefono = $2 LIMIT 1',
          [telefono, telefonoSinCodigo]
        );

        if (clienteResult.rows.length === 0) {
          console.warn(`⚠️ Cliente no encontrado para teléfono: ${telefono}`);
          errores.push({ telefono, razon: 'Cliente no encontrado' });
          continue;
        }

        const clienteId = clienteResult.rows[0].id;
        console.log(`✅ Cliente encontrado: ${clienteId}`);

        // Verificar si el mensaje ya existe
        const existeResult = await db.query(
          'SELECT id FROM comunicacion_mensajes WHERE whapi_message_id = $1',
          [message.id]
        );

        if (existeResult.rows.length > 0) {
          console.log(`⚠️ Mensaje duplicado, saltando: ${message.id}`);
          continue;
        }

        // Guardar el mensaje en la base de datos
        const insertResult = await db.query(
          'INSERT INTO comunicacion_mensajes (cliente_id, mensaje, remitente, tipo, estado, whapi_message_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          [clienteId, message.body, telefono, 'recibido', 'delivered', message.id]
        );

        console.log(`✅ Mensaje guardado en BD: ${insertResult.rows[0].id}`);
        procesados.push({
          clienteId,
          messageId: message.id,
          dbId: insertResult.rows[0].id
        });
      } catch (msgError) {
        console.error('❌ Error procesando mensaje individual:', msgError);
        errores.push({ error: msgError.message });
      }
    }

    console.log(`✅ Webhook procesado: ${procesados.length} mensajes guardados, ${errores.length} errores`);

    res.json({
      success: true,
      message: 'Mensajes procesados correctamente',
      procesados: procesados.length,
      errores: errores.length,
      detalles: { procesados, errores }
    });
  } catch (error) {
    console.error('❌ Error al procesar webhook:', error);
    res.status(500).json({ error: 'Error al procesar webhook', detalles: error.message });
  }
});

// Endpoint de prueba para simular webhook
router.post('/webhook/test', async (req, res) => {
  try {
    const { clienteId, telefono, mensaje } = req.body;

    if (!clienteId || !telefono || !mensaje) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    console.log(`🧪 Simulando webhook de prueba para cliente ${clienteId}`);

    // Simular webhook
    const testMessage = {
      id: `test_${Date.now()}`,
      from: `${telefono}@s.whatsapp.net`,
      body: mensaje,
      timestamp: Math.floor(Date.now() / 1000)
    };

    // Procesar como webhook normal
    const clienteResult = await db.query(
      'SELECT id FROM clientes WHERE id = $1',
      [clienteId]
    );

    if (clienteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Guardar el mensaje
    const insertResult = await db.query(
      'INSERT INTO comunicacion_mensajes (cliente_id, mensaje, remitente, tipo, estado, whapi_message_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [clienteId, mensaje, telefono, 'recibido', 'delivered', testMessage.id]
    );

    console.log(`✅ Mensaje de prueba guardado: ${insertResult.rows[0].id}`);

    res.json({
      success: true,
      message: 'Mensaje de prueba guardado',
      messageId: insertResult.rows[0].id
    });
  } catch (error) {
    console.error('❌ Error en webhook de prueba:', error);
    res.status(500).json({ error: 'Error al procesar webhook de prueba', detalles: error.message });
  }
});

// ==========================================
// GESTIÓN DE PLANTILLAS
// ==========================================

// Obtener todas las plantillas
router.get('/plantillas', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM comunicacion_plantillas ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    res.status(500).json({ error: 'Error al obtener plantillas' });
  }
});

// Crear nueva plantilla
router.post('/plantillas', verifyToken, async (req, res) => {
  try {
    const { nombre, contenido } = req.body;
    if (!nombre || !contenido) {
      return res.status(400).json({ error: 'Nombre y contenido son requeridos' });
    }

    const result = await db.query(
      'INSERT INTO comunicacion_plantillas (nombre, contenido, creado_por) VALUES ($1, $2, $3) RETURNING *',
      [nombre, contenido, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear plantilla:', error);
    res.status(500).json({ error: 'Error al crear plantilla' });
  }
});

// Eliminar plantilla
router.delete('/plantillas/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM comunicacion_plantillas WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Plantilla eliminada' });
  } catch (error) {
    console.error('Error al eliminar plantilla:', error);
    res.status(500).json({ error: 'Error al eliminar plantilla' });
  }
});

module.exports = router;
