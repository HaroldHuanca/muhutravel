# Implementación de Footer y Centro de Comunicación

## Resumen de Cambios

Se han implementado dos características principales en la aplicación MuhuTravel:

### 1. **Footer Reutilizable**
- Componente `Footer.js` y `Footer.css` creados en `/frontend/src/components/`
- Se agregó a todas las páginas excepto Login
- Incluye:
  - Información de la empresa
  - Enlaces rápidos a módulos principales
  - Información de contacto
  - Enlace al Centro de Comunicación
  - Redes sociales
  - Copyright y enlaces legales

### 2. **Centro de Comunicación con WhatsApp**
- Nueva página `Comunicacion.js` y `Comunicacion.css` en `/frontend/src/pages/`
- Características:
  - Selección de cliente con búsqueda
  - Generación de código QR para conectar con WhatsApp
  - Conexión directa con WhatsApp API (whapi)
  - Chat en tiempo real (envío y recepción de mensajes)
  - Interfaz moderna y responsive
  - Indicador de conexión establecida

## Archivos Creados

### Frontend
```
frontend/src/components/
├── Footer.js          # Componente Footer
└── Footer.css         # Estilos del Footer

frontend/src/pages/
├── Comunicacion.js    # Página de Centro de Comunicación
└── Comunicacion.css   # Estilos de Comunicación
```

### Backend
```
backend/routes/
└── comunicacion.js    # Rutas para integración con WhatsApp
```

## Archivos Modificados

### Frontend
- `App.js` - Agregada ruta `/comunicacion`
- `Header.js` - Agregado enlace a Comunicación en navegación
- `package.json` - Agregada dependencia `qrcode.react`
- Todas las páginas de lista - Agregado Footer

### Backend
- `server.js` - Agregada ruta de comunicación

## Instalación de Dependencias

### Frontend
```bash
cd frontend
npm install qrcode.react
```

### Backend
No se requieren dependencias adicionales (axios ya está instalado)

## Configuración de WhatsApp API (whapi)

Para integrar completamente con WhatsApp, sigue estos pasos:

1. **Registrarse en whapi.cloud**
   - Visita https://whapi.cloud
   - Crea una cuenta
   - Obtén tu token API

2. **Configurar variables de entorno**
   - Crea un archivo `.env` en la carpeta `backend/`
   - Agrega: `WHAPI_TOKEN=tu_token_aqui`

3. **Descomentar código de integración**
   - En `backend/routes/comunicacion.js`, descomenta las secciones de integración con whapi
   - Instala axios en el backend: `npm install axios`

## Estructura de la Página de Comunicación

### Panel Izquierdo - Selección de Clientes
- Lista de todos los clientes
- Búsqueda por nombre o teléfono
- Avatar con inicial del nombre
- Indicador de conexión establecida

### Panel Derecho - Chat
- **Antes de conectar:**
  - Opción para generar código QR
  - Botón para conectar directamente
  - Muestra el código QR escaneable

- **Después de conectar:**
  - Área de mensajes con historial
  - Formulario para enviar mensajes
  - Botón de envío con icono
  - Auto-scroll al último mensaje

## Rutas API Disponibles

### POST `/api/comunicacion/conectar`
Establece conexión con un cliente
```json
{
  "clienteId": 1,
  "telefono": "+1234567890",
  "nombre": "Juan Pérez"
}
```

### POST `/api/comunicacion/enviar`
Envía un mensaje a un cliente
```json
{
  "clienteId": 1,
  "telefono": "+1234567890",
  "mensaje": "Hola, ¿cómo estás?",
  "remitente": "usuario"
}
```

### GET `/api/comunicacion/mensajes/:clienteId`
Obtiene el historial de mensajes de un cliente

### POST `/api/comunicacion/webhook`
Webhook para recibir mensajes de WhatsApp (configurar en whapi)

## Estilos y Diseño

- **Colores principales:**
  - Gradiente: #667eea a #764ba2
  - Fondo oscuro: #2c3e50 a #34495e
  - Texto: #2c3e50, #7f8c8d, #95a5a6

- **Componentes:**
  - Botones con gradiente y hover effects
  - Alertas de error y éxito
  - Animaciones suaves
  - Diseño responsive para móviles

## Uso

1. **Acceder al Centro de Comunicación**
   - Desde el Header, hacer clic en "Comunicación"
   - O desde el Footer, hacer clic en "Centro de Comunicación"

2. **Seleccionar un cliente**
   - Buscar por nombre o teléfono
   - Hacer clic en el cliente deseado

3. **Conectar con WhatsApp**
   - Opción 1: Generar QR y escanear con teléfono
   - Opción 2: Hacer clic en "Conectar Directamente"

4. **Enviar mensajes**
   - Escribir mensaje en el input
   - Presionar Enter o hacer clic en el botón de envío
   - Los mensajes aparecen en el chat

## Próximas Mejoras

- [ ] Integración completa con whapi API
- [ ] Almacenamiento de mensajes en base de datos
- [ ] Notificaciones en tiempo real
- [ ] Soporte para multimedia (imágenes, documentos)
- [ ] Historial de conversaciones
- [ ] Estadísticas de comunicación
- [ ] Automatización de respuestas

## Notas Importantes

- El componente Footer está excluido de la página de Login
- La página de Comunicación requiere autenticación
- Los mensajes se simulan en desarrollo (sin whapi)
- El código QR se genera dinámicamente basado en el número de teléfono
- La interfaz es completamente responsive

## Soporte

Para más información sobre whapi, visita: https://whapi.cloud/docs
