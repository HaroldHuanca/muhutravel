/**
 * EJEMPLOS DE USO - Integración WhatsApp
 * 
 * Este archivo contiene ejemplos prácticos de cómo usar la integración
 * entre app.js, comunicacion.js y WhatsAppService.js
 */

// ============================================================================
// 1. USAR EL SERVICIO DESDE CUALQUIER RUTA
// ============================================================================

// En cualquier archivo de rutas (ej: routes/reservas.js):
const express = require('express');
const router = express.Router();

// Obtener la instancia del servicio desde app.locals
router.post('/confirmar-reserva', async (req, res) => {
  try {
    const { clienteId, telefono, detallesReserva } = req.body;
    
    // Acceder al servicio de integración
    const whatsappIntegration = req.app.locals.whatsappIntegration;
    
    // Crear mensaje personalizado
    const mensaje = `
Hola! Tu reserva ha sido confirmada.
Detalles: ${detallesReserva}
Gracias por tu confianza.
    `.trim();
    
    // Enviar mensaje
    const result = await whatsappIntegration.enviarMensaje(
      telefono,
      mensaje,
      clienteId,
      'sistema-reservas'
    );
    
    res.json({
      success: true,
      reservaConfirmada: true,
      mensajeEnviado: result.success,
      messageId: result.messageId
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// ============================================================================
// 2. ESCUCHAR EVENTOS EN TIEMPO REAL DESDE EL CLIENTE
// ============================================================================

// En Frontend (React Component):
import { useEffect } from 'react';
import io from 'socket.io-client';

function ComponenteMensajes() {
  const [mensajes, setMensajes] = useState([]);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    // Escuchar mensajes enviados exitosamente
    socket.on('message_sent', (data) => {
      console.log('✅ Mensaje enviado:', data);
      setMensajes(prev => [...prev, {
        tipo: 'enviado',
        texto: data.mensaje,
        timestamp: data.timestamp
      }]);
    });

    // Escuchar nuevos mensajes recibidos
    socket.on('new_message_received', (data) => {
      console.log('📥 Nuevo mensaje recibido:', data);
      setMensajes(prev => [...prev, {
        tipo: 'recibido',
        texto: data.mensaje,
        de: data.clienteNombre,
        timestamp: data.timestamp
      }]);
      
      // Mostrar notificación
      alert(`Nuevo mensaje de ${data.clienteNombre}: ${data.mensaje}`);
    });

    return () => socket.off('message_sent');
  }, []);

  return (
    <div>
      {mensajes.map((msg, idx) => (
        <div key={idx} className={`mensaje ${msg.tipo}`}>
          <p>{msg.texto}</p>
          <small>{msg.timestamp}</small>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 3. ENVÍO MASIVO DE MENSAJES
// ============================================================================

// En cualquier ruta o servicio:
async function enviarPromocionesMasivas() {
  try {
    // Obtener clientes activos
    const clientes = await db.query(
      'SELECT id, nombre, telefono FROM clientes WHERE estado = $1',
      ['activo']
    );

    const whatsappIntegration = req.app.locals.whatsappIntegration;

    // Enviar mensaje masivo
    const resultado = await whatsappIntegration.enviarMensajeMasivo(
      clientes.rows,
      '¡Descuento especial! 50% en tours. ¡Aplica hoy!',
      'marketing'
    );

    console.log(`Enviados: ${resultado.exitosos}, Errores: ${resultado.errores}`);
    return resultado;
    
  } catch (error) {
    console.error('Error en envío masivo:', error);
  }
}

// ============================================================================
// 4. PROCESAR WEBHOOK PERSONALIZADO
// ============================================================================

// Si necesitas procesar mensajes en otro lugar:
async function procesarMensajePersonalizado(messageData) {
  const whatsappIntegration = req.app.locals.whatsappIntegration;
  
  // Procesar el mensaje
  const result = await whatsappIntegration.procesarMensajeRecibido(messageData);
  
  // Hacer algo adicional con el resultado
  if (result) {
    // Notificar a específico usuario
    const io = req.app.locals.io;
    io.emit('mensaje-importante', {
      clienteId: result.clienteId,
      clienteNombre: result.clienteNombre
    });
  }
}

// ============================================================================
// 5. OBTENER HISTORIAL Y MOSTRAR EN DASHBOARD
// ============================================================================

// En ruta de reportes:
router.get('/comunicacion/historial/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;
    const whatsappIntegration = req.app.locals.whatsappIntegration;

    // Obtener últimos 100 mensajes
    const mensajes = await whatsappIntegration.obtenerHistorial(clienteId, 100);

    // Organizar por tipo
    const conversacion = {
      enviados: mensajes.filter(m => m.remitente === 'usuario'),
      recibidos: mensajes.filter(m => m.remitente !== 'usuario'),
      total: mensajes.length
    };

    res.json(conversacion);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// 6. INTEGRACIÓN CON ALERTAS
// ============================================================================

// Enviar alerta si hay cliente importante escribiendo:
const io = req.app.locals.io;
io.on('connection', (socket) => {
  socket.on('new_message_received', (data) => {
    // Si es cliente VIP, notificar a admin
    if (data.clienteId === VIP_CLIENT_ID) {
      io.emit('vip_client_message', {
        clienteNombre: data.clienteNombre,
        mensaje: data.mensaje,
        timestamp: data.timestamp
      });
    }
  });
});

// ============================================================================
// 7. MANEJO DE ERRORES CENTRALIZADO
// ============================================================================

try {
  const result = await whatsappIntegration.enviarMensaje(
    telefono,
    mensaje,
    clienteId
  );
} catch (error) {
  // El servicio ya maneja errores internamente
  if (error.message.includes('Whapi')) {
    // Error de API
    console.error('❌ Error con Whapi:', error.message);
  } else if (error.message.includes('BD')) {
    // Error de BD
    console.error('❌ Error de base de datos:', error.message);
  } else {
    // Error desconocido
    console.error('❌ Error desconocido:', error.message);
  }
}

// ============================================================================
// 8. VERIFICAR ESTADO DE CONEXIÓN
// ============================================================================

// En cualquier momento:
async function verificarEstado() {
  const whatsappIntegration = req.app.locals.whatsappIntegration;
  
  // Verificar conexión con Whapi
  const estaConectado = await whatsappIntegration.verifyWhapiConnection();
  
  console.log('¿Conectado a Whapi?', estaConectado);
  
  return {
    whapi_conectado: estaConectado,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// 9. USAR CON BASE DE DATOS
// ============================================================================

// Cuando se guarda un cliente, también se puede enviar mensaje de bienvenida:
router.post('/clientes', async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    
    // Guardar cliente
    const result = await db.query(
      'INSERT INTO clientes (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING id',
      [nombre, email, telefono]
    );
    
    const clienteId = result.rows[0].id;
    const whatsappIntegration = req.app.locals.whatsappIntegration;
    
    // Enviar mensaje de bienvenida
    await whatsappIntegration.enviarMensaje(
      telefono,
      `¡Bienvenido ${nombre}! Gracias por registrarte en MuhuTravel.`,
      clienteId,
      'sistema'
    );
    
    res.json({ success: true, clienteId });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// 10. EVENTOS PERSONALIZADOS CON SOCKET.IO
// ============================================================================

// Emitir evento personalizado cuando se envía un mensaje
const io = req.app.locals.io;

io.emit('client_message_activity', {
  clienteId,
  actionType: 'envio_masivo',
  quantityEnviados: 50,
  timestamp: new Date().toISOString()
});

// En Frontend, escuchar:
socket.on('client_message_activity', (data) => {
  console.log(`Se enviaron ${data.quantityEnviados} mensajes`);
  updateDashboard(data);
});

// ============================================================================
// NOTAS IMPORTANTES
// ============================================================================

/*
✅ SIEMPRE disponible en: req.app.locals.whatsappIntegration
✅ Socket.IO disponible en: req.app.locals.io

❌ NO hacer esto:
  - No importes directamente sin pasar por app.locals
  - No crees múltiples instancias del servicio
  - No ignores los eventos de Socket.IO

✨ MEJORES PRÁCTICAS:
  - Usa try/catch alrededor de enviarMensaje()
  - Normaliza teléfonos antes de enviar
  - Verifica que clienteId existe en BD
  - Usa emit() para notificaciones en tiempo real
  - Loguea siempre el resultado de operaciones
*/

// ============================================================================
// VARIABLES DE ENTORNO NECESARIAS
// ============================================================================

/*
WHAPI_TOKEN=tu_token_aqui
WHAPI_API_URL=https://api.whapi.cloud
DB_HOST=localhost
DB_PORT=5432
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=crm_whatsapp
PORT=5000
NODE_ENV=development
*/
