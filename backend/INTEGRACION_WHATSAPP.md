# 📱 Integración WhatsApp - Documentación de Comunicación

## 🎯 Descripción General

Se ha establecido una comunicación centralizada entre `app.js`, `comunicacion.js` y `WhatsAppService.js` a través de un nuevo servicio de integración llamado `whatsappIntegration.js`.

## 🏗️ Arquitectura

```
app.js (Servidor Principal)
  ├── Socket.IO (Comunicación en tiempo real)
  ├── WhatsAppIntegration (Servicio centralizado)
  └── Rutas: /api/comunicacion (comunicacion.js)
      ├── POST /enviar - Envío de mensajes
      ├── POST /webhook - Recepción de mensajes
      ├── GET /mensajes/:clienteId - Historial de mensajes
      └── POST /envio-masivo - Envío masivo

Frontend (WhatsAppService.js)
  ├── Socket.IO (Escucha eventos en tiempo real)
  ├── Emite: select_chat, send_message, send_bulk
  └── Escucha: connected, status, qr, new_message, message_sent
```

## 🔄 Flujo de Comunicación

### 1. Envío de Mensajes

```
Frontend (WhatsAppService.js)
    ↓ emit(send_message)
Socket.IO (app.js)
    ↓ 
Route Handler (comunicacion.js: POST /enviar)
    ↓
WhatsAppIntegration.enviarMensaje()
    ├── Valida datos
    ├── Envía por Whapi o simula
    ├── Guarda en BD
    └── Emite evento de éxito
    ↓
Socket.IO emit(message_sent)
    ↓
Frontend (actualiza UI)
```

### 2. Recepción de Mensajes

```
Webhook externo (Whapi)
    ↓
Route Handler (comunicacion.js: POST /webhook)
    ↓
WhatsAppIntegration.procesarMensajeRecibido()
    ├── Busca cliente por teléfono
    ├── Verifica duplicados
    ├── Guarda en BD
    └── Emite evento
    ↓
Socket.IO emit(new_message_received)
    ↓
Frontend (notificación en tiempo real)
```

## 📋 API Endpoints

### POST /api/comunicacion/enviar
**Descripción:** Enviar mensaje a un contacto

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "clienteId": 1,
  "telefono": "593999999999",
  "mensaje": "Hola, ¿cómo estás?",
  "remitente": "usuario"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente",
  "messageId": "msg_1234567890",
  "clienteId": 1,
  "timestamp": "2025-12-04T10:30:00.000Z",
  "provider": "whapi"
}
```

---

### POST /api/comunicacion/webhook
**Descripción:** Recibir mensajes desde Whapi

**Body (ejemplo):**
```json
{
  "messages": [
    {
      "id": "wamid.xxx",
      "from": "593999999999@s.whatsapp.net",
      "body": "Hola, recibí tu mensaje",
      "timestamp": 1701683400
    }
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Mensajes procesados correctamente",
  "procesados": 1,
  "errores": 0,
  "detalles": {
    "procesados": [
      {
        "id": 123,
        "clienteId": 1,
        "clienteNombre": "Juan Pérez"
      }
    ],
    "errores": []
  }
}
```

---

### GET /api/comunicacion/mensajes/:clienteId
**Descripción:** Obtener historial de mensajes de un cliente

**Headers:**
```
Authorization: Bearer {token}
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "texto": "Hola, necesito información",
    "remitente": "Yo",
    "timestamp": "10:30:45",
    "tipo": "enviado",
    "estado": "sent"
  },
  {
    "id": 2,
    "texto": "Claro, ¿en qué puedo ayudarte?",
    "remitente": "593999999999",
    "timestamp": "10:31:00",
    "tipo": "recibido",
    "estado": "delivered"
  }
]
```

---

### POST /api/comunicacion/webhook/test
**Descripción:** Simular recepción de mensaje (para testing)

**Body:**
```json
{
  "clienteId": 1,
  "telefono": "593999999999",
  "mensaje": "Mensaje de prueba"
}
```

## 🔌 Eventos Socket.IO

### Desde el Servidor

| Evento | Descripción | Payload |
|--------|-------------|---------|
| `message_sent` | Mensaje enviado exitosamente | `{ messageId, telefono, mensaje, clienteId, timestamp, provider }` |
| `new_message_received` | Nuevo mensaje recibido | `{ clienteId, clienteNombre, mensaje, telefono, messageId, timestamp }` |
| `bulk_message_start` | Inicio de envío masivo | `{ total, timestamp }` |
| `bulk_message_progress` | Progreso de envío masivo | `{ current, total, exitosos, errores, porcentaje }` |
| `bulk_message_complete` | Envío masivo completado | `{ exitosos, errores, total, timestamp }` |
| `whatsapp_status` | Estado de conexión WhatsApp | `{ connected, provider, timestamp }` |

### Hacia el Servidor

| Evento | Descripción | Payload |
|--------|-------------|---------|
| `send_message` | Enviar mensaje | `{ to, message }` |
| `send_to_active` | Enviar a chat activo | `{ message }` |
| `select_chat` | Seleccionar chat | `{ chatJid }` |

## 🚀 Uso en Frontend

```javascript
// Enviar mensaje
socket.emit('send_message', {
  to: '593999999999',
  message: 'Hola desde la app'
});

// Escuchar mensaje enviado
socket.on('message_sent', (data) => {
  console.log('Mensaje enviado:', data);
  updateUI(data);
});

// Escuchar nuevo mensaje recibido
socket.on('new_message_received', (data) => {
  console.log('Nuevo mensaje:', data);
  addMessageToChat(data);
});
```

## 🛠️ Configuración de Variables de Entorno

```bash
# Whapi Configuration
WHAPI_TOKEN=tu_token_de_whapi
WHAPI_API_URL=https://api.whapi.cloud

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=crm_whatsapp

# Servidor
PORT=5000
NODE_ENV=development
```

## 📦 Dependencias

```json
{
  "express": "^4.x",
  "socket.io": "^4.x",
  "axios": "^1.x",
  "pg": "^8.x",
  "@whiskeysockets/baileys": "latest",
  "qrcode-terminal": "latest"
}
```

## ⚙️ Servicio WhatsAppIntegration

### Métodos Principales

#### `enviarMensaje(telefono, mensaje, clienteId, remitente)`
Envía un mensaje a un contacto usando Whapi o simulación.

```javascript
const result = await whatsappIntegration.enviarMensaje(
  '593999999999',
  'Hola mundo',
  1,
  'usuario'
);
// result: { success: true, messageId, telefono, provider }
```

#### `procesarMensajeRecibido(messageData)`
Procesa un mensaje recibido del webhook.

```javascript
const result = await whatsappIntegration.procesarMensajeRecibido({
  id: 'wamid.xxx',
  from: '593999999999@s.whatsapp.net',
  body: 'Hola',
  timestamp: 1701683400
});
// result: { id, clienteId, clienteNombre }
```

#### `obtenerHistorial(clienteId, limite)`
Obtiene el historial de mensajes de un cliente.

```javascript
const mensajes = await whatsappIntegration.obtenerHistorial(1, 50);
// Array de mensajes ordenados por fecha
```

#### `enviarMensajeMasivo(clientes, mensaje, remitente)`
Envía un mensaje a múltiples clientes.

```javascript
const result = await whatsappIntegration.enviarMensajeMasivo(
  [{ id: 1, telefono: '593999999999' }, ...],
  'Mensaje para todos',
  'sistema'
);
// result: { exitosos, errores, total, resultados }
```

## 🔐 Seguridad

- ✅ Validación de tokens en endpoints
- ✅ Normalización de números telefónicos
- ✅ Prevención de duplicados en mensajes
- ✅ Manejo de errores centralizado
- ✅ Logging detallado de operaciones
- ✅ Timeout en peticiones HTTP

## 🧪 Testing

### Simular Webhook de Prueba

```bash
curl -X POST http://localhost:5000/api/comunicacion/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "telefono": "593999999999",
    "mensaje": "Mensaje de prueba"
  }'
```

### Enviar Mensaje de Prueba

```bash
curl -X POST http://localhost:5000/api/comunicacion/enviar \
  -H "Authorization: Bearer token_valido" \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "telefono": "593999999999",
    "mensaje": "¿Hola?"
  }'
```

## 📊 Logs Esperados

```
🚀 Inicializando WhatsApp Integration...
✅ WhatsApp Integration inicializado
📤 Enviando mensaje a 593999999999...
✅ Mensaje enviado por Whapi: msg_123456
💾 Mensaje guardado en BD: 1
📡 Evento emitido a través de Socket.IO
```

## 🐛 Troubleshooting

### Mensaje no se envía
- Verificar que `WHAPI_TOKEN` esté configurado
- Revisar formato del teléfono (debe ser numérico)
- Verificar conexión a base de datos

### No llega notificación en tiempo real
- Confirmar que Socket.IO está conectado
- Revisar que `io` está disponible en `app.locals`
- Verificar filtros de firewall

### Cliente no encontrado
- Verificar que el teléfono existe en BD
- Normalizar número telefónico (remover caracteres especiales)
- Revisar prefijo de país

---

**Última actualización:** 4 de diciembre de 2025
**Versión:** 1.0.0
