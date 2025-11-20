# 🚀 Guía Rápida - Centro de Comunicación

## Instalación Rápida

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Iniciar la aplicación
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### 3. Acceder a la aplicación
- URL: `http://localhost:3000`
- Login con tus credenciales

---

## Cómo Usar el Centro de Comunicación

### Paso 1: Acceder
1. Haz clic en **"Comunicación"** en el menú de navegación
2. O haz clic en **"Centro de Comunicación"** en el Footer

### Paso 2: Seleccionar Cliente
1. En el panel izquierdo, verás la lista de clientes
2. Usa la barra de búsqueda para filtrar por nombre o teléfono
3. Haz clic en el cliente deseado

### Paso 3: Conectar con WhatsApp
Tienes 2 opciones:

#### Opción A: Generar QR
1. Haz clic en **"Generar QR"**
2. Abre WhatsApp en tu teléfono
3. Ve a Escanear código QR
4. Escanea el código mostrado

#### Opción B: Conectar Directamente
1. Haz clic en **"Conectar Directamente"**
2. Se establecerá la conexión automáticamente

### Paso 4: Enviar Mensajes
1. Una vez conectado, verás el área de chat
2. Escribe tu mensaje en el campo de entrada
3. Presiona **Enter** o haz clic en el botón de envío
4. El mensaje aparecerá en el chat

---

## Características del Centro

### Panel de Clientes
```
┌─────────────────────┐
│   Clientes          │
├─────────────────────┤
│ 🔍 Buscar...        │
├─────────────────────┤
│ 👤 Juan Pérez       │
│    +1234567890      │
│                     │
│ 👤 María García     │
│    +0987654321      │
│                     │
│ 👤 Carlos López     │
│    +5555555555      │
└─────────────────────┘
```

### Panel de Chat
```
┌─────────────────────────────────┐
│ Juan Pérez | +1234567890    [X] │
├─────────────────────────────────┤
│                                 │
│  Conectar con WhatsApp          │
│  [Generar QR] [Conectar]        │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Escanea este código QR  │    │
│  │        [QR CODE]        │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│ Escribe tu mensaje...  [Enviar] │
└─────────────────────────────────┘
```

---

## Códigos de Estado

### Conexión
- 🟢 **Conectado** - Puedes enviar mensajes
- 🔴 **Desconectado** - Necesitas conectar primero
- ⏳ **Conectando** - Espera a que termine

### Mensajes
- 📤 **Enviado** - Mensaje en azul a la derecha
- 📥 **Recibido** - Mensaje en blanco a la izquierda
- ⏰ **Hora** - Se muestra debajo de cada mensaje

---

## Solución de Problemas

### "No se puede conectar"
- ✅ Verifica que el cliente tenga teléfono registrado
- ✅ Comprueba que el número esté en formato correcto
- ✅ Asegúrate de tener internet

### "El QR no funciona"
- ✅ Abre WhatsApp en tu teléfono
- ✅ Ve a Configuración > Escanear código QR
- ✅ Apunta la cámara al código

### "No veo los mensajes"
- ✅ Asegúrate de estar conectado
- ✅ Recarga la página (F5)
- ✅ Verifica la conexión a internet

---

## Atajos de Teclado

| Tecla | Acción |
|-------|--------|
| `Enter` | Enviar mensaje |
| `Esc` | Cerrar cliente |
| `Ctrl+F` | Buscar cliente |

---

## Información de Contacto

### En el Footer
- 📞 Teléfono: +1 (555) 123-4567
- 📧 Email: info@muhutravel.com
- 📍 Ubicación: Calle Principal 123, Ciudad

### Redes Sociales
- 👍 Facebook
- 🐦 Twitter
- 📷 Instagram

---

## Configuración Avanzada

### Cambiar Información de Contacto
Edita `Footer.js` líneas 55-62:
```javascript
<Phone size={18} />
<span>+1 (555) 123-4567</span>  // Cambiar aquí

<Mail size={18} />
<span>info@muhutravel.com</span>  // Cambiar aquí

<MapPin size={18} />
<span>Calle Principal 123, Ciudad</span>  // Cambiar aquí
```

### Integrar WhatsApp API
1. Registrarse en whapi.cloud
2. Obtener API token
3. Crear `.env` en backend
4. Agregar: `WHAPI_TOKEN=tu_token`
5. Descomentar código en `comunicacion.js`

---

## Tips y Trucos

💡 **Búsqueda rápida:** Escribe el nombre o teléfono del cliente  
💡 **Múltiples clientes:** Puedes cambiar de cliente sin perder el chat  
💡 **Historial:** Los mensajes se guardan en la sesión  
💡 **Responsive:** Funciona perfectamente en móviles  
💡 **Seguro:** Requiere autenticación para acceder  

---

## Preguntas Frecuentes

**¿Puedo enviar imágenes?**
- Actualmente solo texto. Próximamente se agregará soporte para multimedia.

**¿Se guardan los mensajes?**
- En desarrollo se guardan en la sesión. En producción se guardarán en BD.

**¿Puedo comunicarme con múltiples clientes?**
- Sí, puedes cambiar entre clientes en el panel izquierdo.

**¿Es seguro?**
- Sí, requiere autenticación y usa HTTPS en producción.

**¿Funciona en móvil?**
- Sí, la interfaz es completamente responsive.

---

## Próximas Características

🔄 Sincronización en tiempo real  
📎 Soporte para archivos adjuntos  
🔔 Notificaciones push  
📊 Estadísticas de mensajes  
🤖 Respuestas automáticas  
🌙 Modo oscuro  

---

**¿Necesitas ayuda?** Consulta `IMPLEMENTACION_FOOTER_COMUNICACION.md` para documentación completa.
