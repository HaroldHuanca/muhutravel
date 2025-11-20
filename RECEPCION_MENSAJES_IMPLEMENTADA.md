# ✅ Recepción de Mensajes - IMPLEMENTADA

## 🎉 Estado

La recepción de mensajes está **completamente implementada** en el backend.

- ✅ Tabla `comunicacion_mensajes` creada
- ✅ Tabla `comunicacion_conexiones` creada
- ✅ Endpoint `/api/comunicacion/webhook` implementado
- ✅ Guardado de mensajes en BD
- ✅ Obtención de historial de mensajes
- ✅ Script de simulación de webhook

---

## 🔄 Flujo de Recepción

```
Cliente envía mensaje en WhatsApp
    ↓
whapi.cloud recibe el mensaje
    ↓
whapi envía webhook a tu servidor
    POST /api/comunicacion/webhook
    {
      messages: [
        {
          id: "msg123",
          from: "51984438516@s.whatsapp.net",
          body: "Hola, ¿cómo estás?",
          timestamp: 1763655500
        }
      ]
    }
    ↓
Backend procesa el webhook
    ↓
Backend extrae número de teléfono
    ↓
Backend busca cliente por teléfono
    ↓
Backend guarda mensaje en BD
    ↓
Frontend obtiene mensajes con GET /api/comunicacion/mensajes/:clienteId
    ↓
Frontend muestra en chat como "Recibido"
```

---

## 📊 Cambios Realizados

### 1. Tabla de Mensajes

**Archivo:** `crear_tabla_mensajes.sql`

```sql
CREATE TABLE comunicacion_mensajes (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  mensaje TEXT NOT NULL,
  remitente VARCHAR(50) NOT NULL,
  tipo VARCHAR(20) NOT NULL,  -- 'enviado' o 'recibido'
  estado VARCHAR(20) DEFAULT 'pending',
  whapi_message_id VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

### 2. Endpoint: Obtener Mensajes

**Archivo:** `backend/routes/comunicacion.js` (líneas 138-164)

```javascript
router.get('/mensajes/:clienteId', verificarToken, async (req, res) => {
  const result = await db.query(
    'SELECT id, mensaje, remitente, tipo, estado, creado_en FROM comunicacion_mensajes WHERE cliente_id = $1 ORDER BY creado_en ASC',
    [clienteId]
  );
  
  const mensajes = result.rows.map(msg => ({
    id: msg.id,
    texto: msg.mensaje,
    remitente: msg.remitente === 'usuario' ? 'Yo' : msg.remitente,
    timestamp: new Date(msg.creado_en).toLocaleTimeString('es-PE'),
    tipo: msg.tipo,
    estado: msg.estado
  }));
  
  res.json(mensajes);
});
```

### 3. Guardar Mensajes Enviados

**Archivo:** `backend/routes/comunicacion.js` (líneas 98-109)

```javascript
// Guardar mensaje en la base de datos
const messageId = response.data.message?.id || `msg_${Date.now()}`;
await db.query(
  'INSERT INTO comunicacion_mensajes (cliente_id, mensaje, remitente, tipo, estado, whapi_message_id) VALUES ($1, $2, $3, $4, $5, $6)',
  [clienteId, mensaje, 'usuario', 'enviado', 'sent', messageId]
);
```

### 4. Webhook para Recibir Mensajes

**Archivo:** `backend/routes/comunicacion.js` (líneas 179-235)

```javascript
router.post('/webhook', async (req, res) => {
  const { messages } = req.body;
  
  for (const message of messages) {
    // Extraer número de teléfono
    const telefono = message.from?.replace('@s.whatsapp.net', '') || message.from;
    
    // Buscar cliente
    const clienteResult = await db.query(
      'SELECT id FROM clientes WHERE telefono = $1 LIMIT 1',
      [telefono]
    );
    
    if (clienteResult.rows.length === 0) continue;
    
    const clienteId = clienteResult.rows[0].id;
    
    // Guardar mensaje
    await db.query(
      'INSERT INTO comunicacion_mensajes (cliente_id, mensaje, remitente, tipo, estado, whapi_message_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [clienteId, message.body, telefono, 'recibido', 'delivered', message.id]
    );
  }
  
  res.json({ success: true, message: 'Mensajes procesados correctamente' });
});
```

### 5. Script de Simulación

**Archivo:** `backend/simular-webhook.js`

Simula la recepción de mensajes sin necesidad de configurar webhook real.

---

## 🚀 Pasos para Activar

### Paso 1: Crear Tabla en BD

```bash
psql -U tu_usuario -d muhutravel -f crear_tabla_mensajes.sql
```

### Paso 2: Reiniciar Backend

```bash
cd backend
npm start
```

### Paso 3: Probar Recepción (Opcional)

```bash
cd backend
node simular-webhook.js
```

Deberías ver:
```
🧪 SIMULADOR DE WEBHOOK DE WHAPI

[1/3] Simulando mensaje:
  ID: test_msg_001
  De: 51984438516@s.whatsapp.net
  Texto: "¡Hola! Gracias por contactarme."
  ✅ Respuesta: Mensajes procesados correctamente

[2/3] Simulando mensaje:
  ...

✅ SIMULACIÓN COMPLETADA
```

### Paso 4: Configurar Webhook en whapi.cloud

1. Abre https://whapi.cloud
2. Ve a Settings → Webhooks
3. Agrega webhook:
   - URL: `https://tudominio.com/api/comunicacion/webhook`
   - Eventos: Messages, Message Status, Message Ack
   - Método: POST

### Paso 5: Probar en la Web

1. Abre http://localhost:3000
2. Ve a Comunicación
3. Selecciona un cliente
4. Envía un mensaje desde WhatsApp
5. Deberías verlo en el chat

---

## 📱 Ejemplo de Flujo Completo

### Escenario: Conversación entre Usuario y Cliente

**Paso 1: Usuario envía mensaje**
```
Usuario escribe: "Hola, ¿cuál es tu disponibilidad?"
Frontend: POST /api/comunicacion/enviar
Backend: Envía a whapi
whapi: Envía a WhatsApp
Cliente recibe en WhatsApp
Backend: Guarda en BD (tipo: 'enviado')
```

**Paso 2: Cliente responde**
```
Cliente escribe en WhatsApp: "Estoy disponible mañana"
whapi: Recibe el mensaje
whapi: Envía webhook a tu servidor
Backend: POST /api/comunicacion/webhook
Backend: Busca cliente por teléfono
Backend: Guarda en BD (tipo: 'recibido')
```

**Paso 3: Usuario ve la respuesta**
```
Frontend: GET /api/comunicacion/mensajes/:clienteId
Backend: Retorna todos los mensajes
Frontend: Muestra en chat:
  - "Hola, ¿cuál es tu disponibilidad?" (Yo - Enviado)
  - "Estoy disponible mañana" (51984438516 - Recibido)
```

---

## 📊 Estructura de Datos

### Tabla: comunicacion_mensajes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| cliente_id | INTEGER | FK a clientes |
| mensaje | TEXT | Contenido del mensaje |
| remitente | VARCHAR(50) | 'usuario' o número de teléfono |
| tipo | VARCHAR(20) | 'enviado' o 'recibido' |
| estado | VARCHAR(20) | 'pending', 'sent', 'delivered', 'read' |
| whapi_message_id | VARCHAR(255) | ID en whapi |
| creado_en | TIMESTAMP | Fecha de creación |
| actualizado_en | TIMESTAMP | Última actualización |

### Ejemplo de Datos

```
id | cliente_id | mensaje                    | remitente      | tipo     | estado    | creado_en
---|------------|----------------------------|----------------|----------|-----------|-------------------
1  | 1          | Hola cliente               | usuario        | enviado  | sent      | 2025-11-20 11:00
2  | 1          | Hola, ¿cómo estás?         | 51984438516    | recibido | delivered | 2025-11-20 11:01
3  | 1          | Bien, gracias               | usuario        | enviado  | sent      | 2025-11-20 11:02
4  | 1          | ¿Tienes disponibilidad?    | 51984438516    | recibido | delivered | 2025-11-20 11:03
```

---

## 🧪 Pruebas

### Test 1: Simular Webhook

```bash
cd backend
node simular-webhook.js
```

Resultado esperado:
```
✅ 3 mensajes procesados
✅ Mensajes guardados en BD
```

### Test 2: Verificar en BD

```sql
SELECT * FROM comunicacion_mensajes WHERE cliente_id = 1;
```

Resultado esperado:
```
3 mensajes en la BD
```

### Test 3: Obtener Mensajes por API

```bash
curl -H "Authorization: Bearer token" \
  http://localhost:5000/api/comunicacion/mensajes/1
```

Resultado esperado:
```json
[
  {
    "id": 1,
    "texto": "Hola cliente",
    "remitente": "Yo",
    "timestamp": "11:00:00",
    "tipo": "enviado",
    "estado": "sent"
  },
  ...
]
```

---

## 📁 Archivos Creados/Modificados

### Creados
- ✅ `crear_tabla_mensajes.sql` - Script SQL
- ✅ `backend/simular-webhook.js` - Script de simulación
- ✅ `CONFIGURAR_WEBHOOK_WHAPI.md` - Guía de configuración
- ✅ `RECEPCION_MENSAJES_IMPLEMENTADA.md` - Este archivo

### Modificados
- ✅ `backend/routes/comunicacion.js` - Implementación completa

---

## 🔐 Seguridad

### Consideraciones

1. **Webhook sin autenticación (Actual)**
   - Cualquiera puede enviar mensajes al webhook
   - Para producción, agregar validación

2. **Mejoras Recomendadas**
   - Verificar firma de whapi
   - Agregar token en la URL
   - Usar HTTPS
   - Validar IP de whapi

### Implementación de Seguridad (Opcional)

```javascript
// Verificar token en webhook
router.post('/webhook', (req, res, next) => {
  const token = req.query.token;
  if (token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
});
```

---

## 🎯 Checklist de Implementación

- [x] Tabla `comunicacion_mensajes` creada
- [x] Endpoint GET `/api/comunicacion/mensajes/:clienteId` implementado
- [x] Guardado de mensajes enviados en BD
- [x] Endpoint POST `/api/comunicacion/webhook` implementado
- [x] Procesamiento de mensajes recibidos
- [x] Script de simulación creado
- [ ] Webhook configurado en whapi.cloud
- [ ] Probado envío y recepción
- [ ] Frontend actualizado (si es necesario)

---

## 🚀 Próximos Pasos

### Inmediatos
1. ✅ Crear tabla en BD
2. ✅ Reiniciar backend
3. ⏳ Configurar webhook en whapi.cloud
4. ⏳ Probar envío y recepción

### Corto Plazo
- [ ] Implementar Socket.io para tiempo real
- [ ] Agregar notificaciones
- [ ] Mejorar UI del chat

### Mediano Plazo
- [ ] Soporte para multimedia
- [ ] Estadísticas de mensajes
- [ ] Respuestas automáticas

---

## 📞 Soporte

Si tienes problemas:

1. **Verifica los logs del backend**
   ```bash
   # En la terminal del backend
   # Busca: 📨 Webhook recibido
   ```

2. **Ejecuta la simulación**
   ```bash
   node simular-webhook.js
   ```

3. **Verifica la tabla**
   ```sql
   SELECT COUNT(*) FROM comunicacion_mensajes;
   ```

4. **Revisa la configuración del webhook en whapi.cloud**
   - Settings → Webhooks → Ver logs

---

## 📚 Documentación Relacionada

- `CONFIGURAR_WEBHOOK_WHAPI.md` - Cómo configurar webhook en whapi
- `SOLUCION_ERROR_WHAPI.md` - Solución del error de envío
- `WHAPI_INTEGRACION_COMPLETA.md` - Integración completa

---

**Estado:** ✅ IMPLEMENTADO  
**Próximo:** Configurar webhook en whapi.cloud  
**Fecha:** 20 de Noviembre de 2025
