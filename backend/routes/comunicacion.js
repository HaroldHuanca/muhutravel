const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

// Obtener io desde app.locals cuando se usa el router
const getIo = (req) => {
  return req.app.locals.io;
};

// Middleware para verificar autenticación
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  // En producción, verificar el token JWT aquí
  next();
};

// Verificar configuración de whapi
const verificarWhapiConfig = () => {
  if (!process.env.WHAPI_TOKEN) {
    console.warn('⚠️ WHAPI_TOKEN no configurado en .env');
    return false;
  }
  return true;
};

// Conectar con cliente (simular conexión WhatsApp)
router.post('/conectar', verificarToken, async (req, res) => {
  try {
    const { clienteId, telefono, nombre } = req.body;

    if (!clienteId || !telefono) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Aquí se integraría con la API de whapi
    // Por ahora, simular la conexión
    console.log(`Conectando con cliente: ${nombre} (${telefono})`);

    // Guardar la conexión en la base de datos (opcional)
    // await db.query(
    //   'INSERT INTO comunicacion_conexiones (cliente_id, telefono, conectado_en) VALUES ($1, $2, NOW())',
    //   [clienteId, telefono]
    // );

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
router.post('/enviar', verificarToken, async (req, res) => {
  try {
    const { clienteId, telefono, mensaje, remitente } = req.body;

    if (!clienteId || !telefono || !mensaje) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const whatsappIntegration = req.app.locals.whatsappIntegration;
    const io = getIo(req);

    // Usar servicio de integración para enviar mensaje
    const result = await whatsappIntegration.enviarMensaje(
      telefono,
      mensaje,
      clienteId,
      remitente || 'usuario'
    );

    console.log('✅ Mensaje enviado correctamente:', result);

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      messageId: result.messageId,
      clienteId,
      timestamp: new Date().toISOString(),
      provider: result.provider
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ 
      error: 'Error al enviar mensaje',
      detalles: error.message
    });
  }
});

// Obtener mensajes de un cliente
router.get('/mensajes/:clienteId', verificarToken, async (req, res) => {
  try {
    const { clienteId } = req.params;
    const whatsappIntegration = req.app.locals.whatsappIntegration;

    // Usar servicio de integración para obtener historial
    const mensajes = await whatsappIntegration.obtenerHistorial(clienteId);

    // Formatear mensajes para el frontend
    const mensajesFormateados = mensajes.map(msg => ({
      id: msg.id,
      texto: msg.texto,
      remitente: msg.remitente === 'usuario' ? 'Yo' : msg.remitente,
      timestamp: new Date(msg.timestamp).toLocaleTimeString('es-PE'),
      tipo: msg.tipo,
      estado: msg.estado
    }));

    res.json(mensajesFormateados);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

// Webhook para recibir mensajes de WhatsApp
router.post('/webhook', async (req, res) => {
  try {
    const { messages } = req.body;
    const whatsappIntegration = req.app.locals.whatsappIntegration;

    console.log('📨 Webhook recibido:', JSON.stringify(req.body, null, 2));

    if (!messages || messages.length === 0) {
      console.log('⚠️ Webhook recibido sin mensajes');
      return res.json({ success: true, message: 'Sin mensajes' });
    }

    console.log(`📨 Webhook recibido con ${messages.length} mensaje(s)`);

    const procesados = [];
    const errores = [];

    // Procesar cada mensaje recibido usando el servicio de integración
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

        // Usar servicio de integración para procesar el mensaje
        const result = await whatsappIntegration.procesarMensajeRecibido(message);

        if (result) {
          procesados.push(result);
        }
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

module.exports = router;
