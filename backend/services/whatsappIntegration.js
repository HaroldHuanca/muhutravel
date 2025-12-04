/**
 * Servicio de integración de WhatsApp
 * Conecta app.js, comunicacion.js y WhatsAppService.js
 * Proporciona métodos centralizados para enviar y recibir mensajes
 */

const axios = require('axios');
const db = require('../db');

class WhatsAppIntegration {
  constructor(io) {
    this.io = io;
    this.isConnected = false;
    this.messageQueue = [];
  }

  /**
   * Inicializar la integración
   */
  async initialize() {
    console.log('🚀 Inicializando WhatsApp Integration...');
    try {
      // Verificar conexión con whapi
      if (process.env.WHAPI_TOKEN) {
        await this.verifyWhapiConnection();
      }
      console.log('✅ WhatsApp Integration inicializado');
    } catch (error) {
      console.error('❌ Error inicializando WhatsApp Integration:', error.message);
    }
  }

  /**
   * Verificar conexión con Whapi
   */
  async verifyWhapiConnection() {
    try {
      let whapiUrl = process.env.WHAPI_API_URL || 'https://api.whapi.cloud';
      whapiUrl = whapiUrl.replace(/\/$/, '');

      const response = await axios.get(`${whapiUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${process.env.WHAPI_TOKEN}`,
        },
        timeout: 10000
      });

      console.log('✅ Conexión con Whapi verificada:', response.data);
      this.isConnected = true;
      
      if (this.io) {
        this.io.emit('whatsapp_status', {
          connected: true,
          provider: 'whapi',
          timestamp: new Date().toISOString()
        });
      }
      return true;
    } catch (error) {
      console.warn('⚠️ No se pudo verificar Whapi:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Enviar mensaje a un contacto
   * @param {string} telefono - Número de teléfono
   * @param {string} mensaje - Contenido del mensaje
   * @param {string} clienteId - ID del cliente (opcional)
   * @param {string} remitente - Identificador del remitente
   * @returns {Object} Resultado del envío
   */
  async enviarMensaje(telefono, mensaje, clienteId = null, remitente = 'sistema') {
    try {
      console.log(`📤 Enviando mensaje a ${telefono}...`);

      const numeroLimpio = telefono.replace(/\D/g, '');

      // Intentar enviar con Whapi si está configurado
      if (process.env.WHAPI_TOKEN) {
        return await this.enviarPorWhapi(numeroLimpio, mensaje, clienteId, remitente);
      } else {
        console.warn('⚠️ Whapi no configurado, simulando envío');
        return this.simularEnvio(numeroLimpio, mensaje, clienteId, remitente);
      }
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error.message);
      throw error;
    }
  }

  /**
   * Enviar mensaje a través de Whapi
   */
  async enviarPorWhapi(telefono, mensaje, clienteId, remitente) {
    try {
      let whapiUrl = process.env.WHAPI_API_URL || 'https://api.whapi.cloud';
      whapiUrl = whapiUrl.replace(/\/$/, '');

      const response = await axios.post(
        `${whapiUrl}/messages/text`,
        {
          to: telefono,
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

      const messageId = response.data.message?.id || response.data.result?.id || `msg_${Date.now()}`;

      console.log('✅ Mensaje enviado por Whapi:', messageId);

      // Guardar en BD si clienteId existe
      if (clienteId) {
        await this.guardarMensajeEnBD(clienteId, mensaje, remitente, 'enviado', 'sent', messageId);
      }

      // Emitir evento
      if (this.io) {
        this.io.emit('message_sent', {
          messageId,
          telefono,
          mensaje,
          clienteId,
          timestamp: new Date().toISOString(),
          provider: 'whapi'
        });
      }

      return {
        success: true,
        messageId,
        telefono,
        provider: 'whapi'
      };
    } catch (error) {
      console.error('❌ Error en Whapi:', error.response?.data || error.message);
      throw new Error(`Error enviando por Whapi: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Simular envío de mensaje (cuando Whapi no está configurado)
   */
  async simularEnvio(telefono, mensaje, clienteId, remitente) {
    const messageId = `msg_${Date.now()}`;

    console.log(`⚠️ Simulando envío a ${telefono}: ${mensaje}`);

    // Guardar en BD si clienteId existe
    if (clienteId) {
      await this.guardarMensajeEnBD(clienteId, mensaje, remitente, 'enviado', 'simulated', messageId);
    }

    // Emitir evento
    if (this.io) {
      this.io.emit('message_sent', {
        messageId,
        telefono,
        mensaje,
        clienteId,
        timestamp: new Date().toISOString(),
        provider: 'simulated',
        simulated: true
      });
    }

    return {
      success: true,
      messageId,
      telefono,
      provider: 'simulated',
      simulated: true
    };
  }

  /**
   * Guardar mensaje en la base de datos
   */
  async guardarMensajeEnBD(clienteId, mensaje, remitente, tipo, estado, messageId) {
    try {
      const result = await db.query(
        `INSERT INTO comunicacion_mensajes 
        (cliente_id, mensaje, remitente, tipo, estado, whapi_message_id) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id`,
        [clienteId, mensaje, remitente, tipo, estado, messageId]
      );

      console.log('💾 Mensaje guardado en BD:', result.rows[0].id);
      return result.rows[0].id;
    } catch (error) {
      console.error('⚠️ Error guardando mensaje en BD:', error.message);
      // No lanzar error para no fallar el envío si falla la BD
      return null;
    }
  }

  /**
   * Procesar mensaje recibido (desde webhook)
   */
  async procesarMensajeRecibido(messageData) {
    try {
      console.log('📥 Procesando mensaje recibido...');

      let telefono = messageData.from?.replace('@s.whatsapp.net', '') || messageData.from;
      telefono = telefono.replace(/\D/g, '');

      // Buscar cliente por teléfono
      const clienteResult = await db.query(
        'SELECT id, nombre FROM clientes WHERE telefono = $1 LIMIT 1',
        [telefono]
      );

      if (clienteResult.rows.length === 0) {
        console.warn(`⚠️ Cliente no encontrado para ${telefono}`);
        return null;
      }

      const cliente = clienteResult.rows[0];
      console.log(`✅ Cliente encontrado: ${cliente.nombre}`);

      // Verificar duplicados
      const existeResult = await db.query(
        'SELECT id FROM comunicacion_mensajes WHERE whapi_message_id = $1',
        [messageData.id]
      );

      if (existeResult.rows.length > 0) {
        console.log('⚠️ Mensaje duplicado');
        return null;
      }

      // Guardar mensaje
      const insertResult = await db.query(
        `INSERT INTO comunicacion_mensajes 
        (cliente_id, mensaje, remitente, tipo, estado, whapi_message_id) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id`,
        [cliente.id, messageData.body, telefono, 'recibido', 'delivered', messageData.id]
      );

      console.log('✅ Mensaje guardado:', insertResult.rows[0].id);

      // Emitir evento en tiempo real
      if (this.io) {
        this.io.emit('new_message_received', {
          clienteId: cliente.id,
          clienteNombre: cliente.nombre,
          mensaje: messageData.body,
          telefono,
          messageId: messageData.id,
          timestamp: new Date().toISOString()
        });
      }

      return {
        id: insertResult.rows[0].id,
        clienteId: cliente.id,
        clienteNombre: cliente.nombre
      };
    } catch (error) {
      console.error('❌ Error procesando mensaje recibido:', error.message);
      throw error;
    }
  }

  /**
   * Obtener historial de mensajes de un cliente
   */
  async obtenerHistorial(clienteId, limite = 50) {
    try {
      const result = await db.query(
        `SELECT id, mensaje, remitente, tipo, estado, creado_en 
        FROM comunicacion_mensajes 
        WHERE cliente_id = $1 
        ORDER BY creado_en DESC 
        LIMIT $2`,
        [clienteId, limite]
      );

      return result.rows.map(msg => ({
        id: msg.id,
        texto: msg.mensaje,
        remitente: msg.remitente,
        tipo: msg.tipo,
        estado: msg.estado,
        timestamp: msg.creado_en
      }));
    } catch (error) {
      console.error('❌ Error obtener historial:', error.message);
      return [];
    }
  }

  /**
   * Enviar mensaje masivo
   */
  async enviarMensajeMasivo(clientes, mensaje, remitente = 'sistema') {
    try {
      console.log(`📢 Iniciando envío masivo a ${clientes.length} clientes...`);

      if (this.io) {
        this.io.emit('bulk_message_start', {
          total: clientes.length,
          timestamp: new Date().toISOString()
        });
      }

      let exitosos = 0;
      let errores = 0;
      const resultados = [];

      for (let i = 0; i < clientes.length; i++) {
        try {
          const cliente = clientes[i];
          const result = await this.enviarMensaje(
            cliente.telefono,
            mensaje,
            cliente.id,
            remitente
          );

          exitosos++;
          resultados.push({ ...result, clienteId: cliente.id });

          if (this.io) {
            this.io.emit('bulk_message_progress', {
              current: i + 1,
              total: clientes.length,
              exitosos,
              errores,
              porcentaje: Math.round((i + 1) / clientes.length * 100)
            });
          }

          // Delay entre mensajes
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          errores++;
          console.error(`❌ Error enviando a cliente ${i + 1}:`, error.message);

          if (this.io) {
            this.io.emit('bulk_message_progress', {
              current: i + 1,
              total: clientes.length,
              exitosos,
              errores,
              porcentaje: Math.round((i + 1) / clientes.length * 100)
            });
          }
        }
      }

      console.log(`✅ Envío masivo completado: ${exitosos} exitosos, ${errores} errores`);

      if (this.io) {
        this.io.emit('bulk_message_complete', {
          exitosos,
          errores,
          total: clientes.length,
          timestamp: new Date().toISOString()
        });
      }

      return {
        exitosos,
        errores,
        total: clientes.length,
        resultados
      };
    } catch (error) {
      console.error('❌ Error en envío masivo:', error.message);
      throw error;
    }
  }
}

module.exports = WhatsAppIntegration;
