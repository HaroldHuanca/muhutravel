# ✅ CHECKLIST DE VERIFICACIÓN - Integración WhatsApp

## 📋 Pre-instalación

- [ ] Node.js v14+ instalado
- [ ] npm o yarn disponible
- [ ] PostgreSQL corriendo
- [ ] Variables de entorno configuradas (.env)
- [ ] Carpeta `backend/services/` existe

## 🔧 Verificación de Archivos

### Archivos Modificados
- [ ] `backend/app.js` - ✅ Actualizado
  - [ ] Importa `comunicacionRouter`
  - [ ] Importa `WhatsAppIntegration`
  - [ ] Middleware JSON configurado
  - [ ] `app.locals.io` disponible
  - [ ] `app.locals.whatsappIntegration` disponible
  - [ ] Ruta `/api/comunicacion` registrada

- [ ] `backend/routes/comunicacion.js` - ✅ Actualizado
  - [ ] Obtiene `whatsappIntegration` de `req.app.locals`
  - [ ] Obtiene `io` de `req.app.locals`
  - [ ] POST `/enviar` usa servicio
  - [ ] POST `/webhook` usa servicio
  - [ ] GET `/mensajes/:clienteId` usa servicio
  - [ ] POST `/webhook/test` disponible

### Archivos Nuevos
- [ ] `backend/services/whatsappIntegration.js` - ✅ Creado
  - [ ] Clase `WhatsAppIntegration` definida
  - [ ] Constructor acepta `io`
  - [ ] Todos los métodos implementados
  - [ ] Manejo de errores presente
  - [ ] Logging incluido

### Documentación
- [ ] `backend/INTEGRACION_WHATSAPP.md` - ✅ Creado
- [ ] `backend/INTEGRACION_COMPLETADA.md` - ✅ Creado
- [ ] `backend/EJEMPLOS_INTEGRACION.js` - ✅ Creado
- [ ] `backend/ARQUITECTURA_DIAGRAMA.md` - ✅ Creado

## 🧪 Pruebas Básicas

### Test 1: Inicialización
```bash
- [ ] npm start en backend/ sin errores
- [ ] Servidor escucha en puerto 5000
- [ ] Socket.IO conecta exitosamente
- [ ] Console muestra: "🚀 Inicializando WhatsApp Integration..."
```

### Test 2: Endpoints REST
```bash
- [ ] POST /api/comunicacion/enviar responde 401 sin token
- [ ] POST /api/comunicacion/enviar responde 400 sin datos requeridos
- [ ] POST /api/comunicacion/webhook/test retorna 200
- [ ] GET /api/comunicacion/mensajes/1 requiere token
```

### Test 3: Socket.IO
```bash
- [ ] Cliente Frontend conecta a Socket.IO
- [ ] Evento 'connected' se recibe en frontend
- [ ] Evento 'message_sent' se emite después de envío
- [ ] Evento 'new_message_received' se emite al recibir
```

### Test 4: Simulación
```bash
curl -X POST http://localhost:5000/api/comunicacion/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "telefono": "593999999999",
    "mensaje": "Prueba"
  }'

- [ ] Respuesta exitosa
- [ ] Mensaje guardado en BD
- [ ] Socket.IO emite evento
- [ ] Frontend recibe notificación
```

## 🔐 Verificación de Seguridad

- [ ] Tokens JWT validados en endpoints (cuando esté implementado)
- [ ] SQL Injection prevenida (usando parameterized queries)
- [ ] XSS prevenido en mensajes
- [ ] CORS configurado si necesario
- [ ] Números telefónicos normalizados antes de procesar
- [ ] Duplicados de mensajes prevenidos
- [ ] Timeouts en peticiones HTTP (15s en whapi)

## 📊 Verificación de Base de Datos

```sql
-- Verificar tabla comunicacion_mensajes existe
- [ ] SELECT * FROM comunicacion_mensajes LIMIT 1;

-- Verificar estructura
- [ ] \d comunicacion_mensajes (en psql)

-- Campos esperados:
- [ ] id (PRIMARY KEY)
- [ ] cliente_id (FOREIGN KEY)
- [ ] mensaje (TEXT)
- [ ] remitente (VARCHAR)
- [ ] tipo (VARCHAR)
- [ ] estado (VARCHAR)
- [ ] whapi_message_id (VARCHAR)
- [ ] creado_en (TIMESTAMP)

-- Insertar registro de prueba
- [ ] INSERT test message
- [ ] Verificar que se guardó
```

## 🌐 Verificación de Whapi (si está configurado)

```bash
- [ ] WHAPI_TOKEN está en .env
- [ ] WHAPI_API_URL está en .env
- [ ] Token es válido (verificar en dashboard de Whapi)
- [ ] Webhook URL está registrada en Whapi
- [ ] Webhook URL es: http://tudominio/api/comunicacion/webhook
```

## 📱 Verificación de Frontend

```javascript
// En consola del navegador:
- [ ] socket = io('http://localhost:5000')
- [ ] socket.connected === true
- [ ] socket.on('message_sent', (data) => console.log(data))
- [ ] Enviar mensaje y verificar que se recibe evento
```

## 🐛 Troubleshooting

### Si no conecta app.js
- [ ] Verificar que puerto 5000 no está en uso
- [ ] Verificar dependencias instaladas: `npm install`
- [ ] Verificar sintaxis: `node -c app.js`
- [ ] Revisar logs de error

### Si no llegan mensajes
- [ ] Verificar BD conectada
- [ ] Verificar cliente existe en tabla `clientes`
- [ ] Verificar formato de teléfono (numérico sin caracteres especiales)
- [ ] Revisar logs de `whatsappIntegration.procesarMensajeRecibido()`

### Si Socket.IO no funciona
- [ ] Verificar CORS configurado
- [ ] Verificar puerto 5000 accesible desde frontend
- [ ] Verificar socket.io cliente importado en frontend
- [ ] Revisar Network tab en DevTools

### Si Whapi falla
- [ ] Verificar token en .env
- [ ] Verificar conexión a internet
- [ ] Probar con curl: `curl -H "Authorization: Bearer TOKEN" https://api.whapi.cloud/me`
- [ ] Verificar timeout no se ejecutó

## 📝 Logs Esperados en Consola

### Al iniciar
```
🔗 Iniciando conexión con WhatsApp...
🔄 Estado de conexión: open
✅ ¡CONECTADO EXITOSAMENTE!
🤖 Bot listo para recibir y enviar mensajes
🚀 Inicializando WhatsApp Integration...
✅ Conexión con Whapi verificada
✅ WhatsApp Integration inicializado
🌐 Servidor web ejecutándose en http://localhost:5000
```

### Al enviar mensaje
```
📤 Enviando mensaje a 593999999999...
📍 URL de whapi: https://api.whapi.cloud/messages/text
🔑 Token: xxxx...
✅ Mensaje enviado por Whapi: msg_123456
💾 Mensaje guardado en BD: 1
📡 Evento emitido a través de Socket.IO
```

### Al recibir mensaje
```
📨 Webhook recibido: {...}
📨 Webhook recibido con 1 mensaje(s)
📩 Procesando mensaje: {...}
🔍 Buscando cliente con teléfono: 593999999999
✅ Cliente encontrado: 1
✅ Mensaje guardado: 123
📡 Evento emitido a través de Socket.IO
✅ Webhook procesado: 1 mensajes guardados, 0 errores
```

## 📦 Dependencias Requeridas

```json
{
  "express": "^4.17.0",
  "socket.io": "^4.0.0",
  "axios": "^1.0.0",
  "pg": "^8.0.0",
  "@whiskeysockets/baileys": "latest",
  "qrcode-terminal": "latest"
}
```

- [ ] Verificar todas están en package.json
- [ ] Ejecutar `npm install` si falta alguna
- [ ] Verificar versiones compatibles

## 🚀 Deployment

- [ ] Verificar todas las pruebas pasaron
- [ ] Variables de entorno en servidor
- [ ] BD respaldada
- [ ] Whapi webhook apunta a servidor producción
- [ ] CORS configurado para producción
- [ ] SSL/HTTPS habilitado
- [ ] Logs configurados
- [ ] Monitoreo activado

## 📋 Checklist Final

- [ ] Todos los archivos existen
- [ ] No hay errores de sintaxis
- [ ] DB conecta correctamente
- [ ] Socket.IO conecta correctamente
- [ ] Whapi conecta correctamente
- [ ] Endpoints responden correctamente
- [ ] Eventos Socket.IO funcionan
- [ ] Mensajes se guardan en BD
- [ ] Notificaciones llegan a frontend
- [ ] Documentación está completa

## 🎯 Próximos Pasos

- [ ] Implementar autenticación JWT real
- [ ] Agregar rate limiting
- [ ] Agregar validación de entrada
- [ ] Agregar tests unitarios
- [ ] Agregar tests de integración
- [ ] Documentación de API en Swagger
- [ ] Monitoreo y alertas
- [ ] Backup automático
- [ ] Migración a producción

---

**Fecha de Verificación:** _______________
**Realizado por:** _______________
**Estado Overall:** [ ] ✅ COMPLETADO [ ] ⚠️ PARCIAL [ ] ❌ PENDIENTE

