const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

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

    // Normalizar número de teléfono (remover caracteres especiales)
    const numeroLimpio = telefono.replace(/\D/g, '');
    
    console.log(`📤 Intentando enviar mensaje a ${numeroLimpio}: ${mensaje}`);

    // Intentar enviar con whapi si está configurado
    if (verificarWhapiConfig()) {
      try {
        let whapiUrl = process.env.WHAPI_API_URL || 'https://api.whapi.cloud';
        // Remover barra diagonal final si existe
        whapiUrl = whapiUrl.replace(/\/$/, '');
        const fullUrl = `${whapiUrl}/messages/text`;
        
        console.log(`📍 URL de whapi: ${fullUrl}`);
        console.log(`🔑 Token: ${process.env.WHAPI_TOKEN?.substring(0, 10)}...`);
        
        const response = await axios.post(
          fullUrl,
          {
            to: numeroLimpio,
            body: mensaje
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.WHAPI_TOKEN}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        console.log('✅ Mensaje enviado exitosamente a través de whapi:', response.data);

        res.json({
          success: true,
          message: 'Mensaje enviado correctamente',
          messageId: response.data.message?.id || response.data.result?.id || `msg_${Date.now()}`,
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
router.get('/mensajes/:clienteId', verificarToken, async (req, res) => {
  try {
    const { clienteId } = req.params;

    // Aquí se obtendría los mensajes de la base de datos
    // const result = await db.query(
    //   'SELECT * FROM comunicacion_mensajes WHERE cliente_id = $1 ORDER BY enviado_en ASC',
    //   [clienteId]
    // );

    // Por ahora, retornar un array vacío
    const mensajes = [];

    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

// Webhook para recibir mensajes de WhatsApp (opcional)
router.post('/webhook', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'No hay mensajes' });
    }

    // Procesar cada mensaje recibido
    for (const message of messages) {
      console.log('Mensaje recibido:', message);
      
      // Guardar el mensaje en la base de datos
      // await db.query(
      //   'INSERT INTO comunicacion_mensajes (cliente_id, mensaje, remitente, tipo, recibido_en) VALUES ($1, $2, $3, $4, NOW())',
      //   [message.from, message.body, 'cliente', 'recibido']
      // );
    }

    res.json({ success: true, message: 'Mensajes procesados' });
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    res.status(500).json({ error: 'Error al procesar webhook' });
  }
});

module.exports = router;
