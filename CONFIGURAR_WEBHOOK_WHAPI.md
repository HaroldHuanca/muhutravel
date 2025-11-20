# 🔗 Configurar Webhook en whapi.cloud para Recibir Mensajes

## ✅ Estado Actual

La recepción de mensajes está **completamente implementada** en el backend:

- ✅ Tabla `comunicacion_mensajes` creada
- ✅ Endpoint `/api/comunicacion/webhook` implementado
- ✅ Guardado de mensajes en BD
- ✅ Obtención de historial de mensajes

**Lo único que falta:** Configurar el webhook en whapi.cloud para que envíe los mensajes a tu servidor.

---

## 📋 Pasos para Configurar el Webhook

### Paso 1: Crear la Tabla en la BD

Ejecuta el script SQL para crear las tablas necesarias:

```bash
psql -U tu_usuario -d muhutravel -f crear_tabla_mensajes.sql
```

O copia y pega en pgAdmin:

```sql
-- Ver archivo: crear_tabla_mensajes.sql
```

### Paso 2: Reiniciar Backend

```bash
cd backend
npm start
```

### Paso 3: Configurar Webhook en whapi.cloud

1. **Abre** https://whapi.cloud
2. **Login** con tu cuenta
3. **Ve a** Settings → Webhooks
4. **Haz clic** en "Add Webhook" o "Create Webhook"
5. **Configura:**

   **URL del Webhook:**
   ```
   http://localhost:5000/api/comunicacion/webhook
   ```
   
   O si tienes un dominio público:
   ```
   https://tudominio.com/api/comunicacion/webhook
   ```

   **Eventos a Recibir:**
   - ✅ Messages (Mensajes)
   - ✅ Message Status (Estado de mensajes)
   - ✅ Message Ack (Confirmación de mensajes)

   **Método:** POST

6. **Haz clic** en "Save" o "Create"

### Paso 4: Verificar Configuración

En la terminal del backend, deberías ver:

```
📨 Webhook recibido con 1 mensaje(s)
📩 Procesando mensaje: {
  id: "...",
  from: "51984438516@s.whatsapp.net",
  body: "Hola desde WhatsApp",
  timestamp: 1763655500
}
✅ Mensaje guardado para cliente 1
```

---

## 🧪 Probar la Recepción

### Opción 1: Enviar Mensaje desde WhatsApp

1. Abre WhatsApp en tu teléfono
2. Busca el chat con tu número sincronizado en whapi
3. Envía un mensaje: "Hola desde WhatsApp"
4. Verifica en el backend que se recibió

### Opción 2: Simular Webhook (Para Desarrollo)

```bash
curl -X POST http://localhost:5000/api/comunicacion/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "id": "test123",
        "from": "51984438516@s.whatsapp.net",
        "body": "Mensaje de prueba",
        "timestamp": 1763655500
      }
    ]
  }'
```

---

## 🔄 Flujo Completo de Mensajes

### Envío (Usuario → Cliente)

```
1. Usuario escribe mensaje en la web
   ↓
2. Frontend: POST /api/comunicacion/enviar
   {
     clienteId: 1,
     telefono: "51984438516",
     mensaje: "Hola cliente"
   }
   ↓
3. Backend: Envía a whapi API
   ↓
4. whapi: Envía a WhatsApp
   ↓
5. Cliente recibe en WhatsApp
   ↓
6. Backend: Guarda en BD (tipo: 'enviado')
   ↓
7. Frontend: Muestra en chat como "Enviado"
```

### Recepción (Cliente → Usuario)

```
1. Cliente responde en WhatsApp
   ↓
2. whapi: Recibe el mensaje
   ↓
3. whapi: Envía webhook a tu servidor
   POST /api/comunicacion/webhook
   ↓
4. Backend: Procesa el webhook
   ↓
5. Backend: Busca cliente por teléfono
   ↓
6. Backend: Guarda en BD (tipo: 'recibido')
   ↓
7. Frontend: Obtiene mensajes con GET /api/comunicacion/mensajes/:clienteId
   ↓
8. Frontend: Muestra en chat como "Recibido"
```

---

## 📊 Estructura de Datos

### Tabla: comunicacion_mensajes

```sql
id                  | SERIAL PRIMARY KEY
cliente_id          | INTEGER (FK clientes)
mensaje             | TEXT
remitente           | VARCHAR(50)  -- 'usuario' o número de teléfono
tipo                | VARCHAR(20)  -- 'enviado' o 'recibido'
estado              | VARCHAR(20)  -- 'pending', 'sent', 'delivered', 'read'
whapi_message_id    | VARCHAR(255) -- ID en whapi
creado_en           | TIMESTAMP
actualizado_en      | TIMESTAMP
```

### Ejemplo de Datos

```
id | cliente_id | mensaje           | remitente      | tipo     | estado    | creado_en
---|------------|-------------------|----------------|----------|-----------|-------------------
1  | 1          | Hola cliente      | usuario        | enviado  | sent      | 2025-11-20 11:00
2  | 1          | Hola, ¿cómo estás?| 51984438516    | recibido | delivered | 2025-11-20 11:01
3  | 1          | Bien, gracias      | usuario        | enviado  | sent      | 2025-11-20 11:02
```

---

## 🔐 Seguridad del Webhook

### Verificación de Origen (Recomendado)

whapi puede enviar un header de verificación. Puedes validarlo:

```javascript
// En el webhook
const signature = req.headers['x-whapi-signature'];
const token = process.env.WHAPI_TOKEN;

// Verificar que el webhook viene de whapi
if (!verificarSignatura(signature, token, req.body)) {
  return res.status(401).json({ error: 'No autorizado' });
}
```

### Sin Autenticación (Actual)

Actualmente el webhook no requiere autenticación. Para producción, considera:

1. Agregar token en la URL
2. Verificar IP de whapi
3. Usar HTTPS

---

## 🐛 Solución de Problemas

### Problema: Webhook no se recibe

**Solución 1:** Verificar que la URL es correcta
```bash
# Probar conectividad
curl http://localhost:5000/api/comunicacion/webhook
```

**Solución 2:** Verificar logs en whapi.cloud
- Ve a Settings → Webhooks → Ver logs
- Busca intentos fallidos

**Solución 3:** Usar ngrok para exponer localhost
```bash
ngrok http 5000
# Usar la URL de ngrok en whapi
```

### Problema: Mensajes no se guardan

**Verificar:**
1. Tabla `comunicacion_mensajes` existe
2. Cliente existe en BD con ese teléfono
3. Logs del backend muestran el webhook recibido

### Problema: Cliente no encontrado

**Causa:** El teléfono en whapi no coincide con el de la BD

**Solución:**
1. Verifica el formato del teléfono
2. Asegúrate que sea: 51 + número (sin +)
3. Ejemplo: 51984438516

---

## 📱 Números de Prueba

| Número | Formato | Estado |
|--------|---------|--------|
| 51984438516 | Correcto | ✅ Activo |
| +51984438516 | Con + | ❌ No funciona |
| 984438516 | Sin 51 | ❌ No funciona |

---

## 🎯 Checklist de Configuración

- [ ] Tabla `comunicacion_mensajes` creada
- [ ] Backend reiniciado
- [ ] Webhook configurado en whapi.cloud
- [ ] URL correcta en whapi
- [ ] Eventos seleccionados (Messages, Status, Ack)
- [ ] Probé enviando un mensaje desde WhatsApp
- [ ] Backend recibió el webhook
- [ ] Mensaje se guardó en BD
- [ ] Frontend muestra el mensaje

---

## 📚 Endpoints Disponibles

### Enviar Mensaje
```
POST /api/comunicacion/enviar
Body: {
  clienteId: 1,
  telefono: "51984438516",
  mensaje: "Hola",
  remitente: "usuario1"
}
Response: { success: true, messageId: "..." }
```

### Obtener Mensajes
```
GET /api/comunicacion/mensajes/:clienteId
Response: [
  {
    id: 1,
    texto: "Hola cliente",
    remitente: "Yo",
    timestamp: "11:00:00",
    tipo: "enviado",
    estado: "sent"
  },
  ...
]
```

### Webhook (Recibir Mensajes)
```
POST /api/comunicacion/webhook
Body: {
  messages: [
    {
      id: "msg123",
      from: "51984438516@s.whatsapp.net",
      body: "Hola usuario",
      timestamp: 1763655500
    }
  ]
}
Response: { success: true, message: "Mensajes procesados" }
```

---

## 🚀 Próximos Pasos

1. ✅ Crear tabla en BD
2. ✅ Reiniciar backend
3. ⏳ **Configurar webhook en whapi** (Este paso)
4. ⏳ Probar envío y recepción
5. ⏳ Implementar Socket.io para tiempo real (opcional)

---

## 📞 Soporte

Si tienes problemas:

1. Verifica los logs del backend
2. Ejecuta: `node diagnostico-whapi.js`
3. Revisa la configuración del webhook en whapi.cloud
4. Verifica que el teléfono esté sincronizado

---

**Estado:** ✅ Backend Listo  
**Próximo:** Configurar webhook en whapi.cloud  
**Fecha:** 20 de Noviembre de 2025
