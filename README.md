# MuhuTravel - Sistema de Gestión de Turismo

Sistema completo de gestión de turismo con backend en Node.js/Express y frontend en React.

## 📋 Descripción

MuhuTravel es una aplicación web para la gestión integral de operaciones turísticas, incluyendo:

- Gestión de clientes
- Gestión de empleados
- Gestión de proveedores
- Gestión de paquetes turísticos
- Gestión de reservas
- Control de usuarios y acceso

## 🏗️ Estructura del Proyecto

```
muhutravel/
├── backend/                 # API Node.js + Express
│   ├── routes/             # Rutas de la API
│   ├── middleware/         # Middleware de autenticación
│   ├── db.js              # Configuración de base de datos
│   ├── server.js          # Servidor principal
│   ├── package.json       # Dependencias del backend
│   └── README.md          # Documentación del backend
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── services/     # Servicios de API
│   │   ├── App.js        # Componente principal
│   │   └── index.js      # Punto de entrada
│   ├── public/           # Archivos estáticos
│   ├── package.json      # Dependencias del frontend
│   └── README.md         # Documentación del frontend
├── squema.sql            # Esquema de base de datos
├── datos_prueba.sql      # Datos de prueba
└── README.md             # Este archivo
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 14+
- PostgreSQL 12+
- npm o yarn

### 1. Configurar Base de Datos

```bash
# Crear base de datos
createdb muhutravel

# Ejecutar esquema
psql -U postgres -d muhutravel -f squema.sql

# Cargar datos de prueba
psql -U postgres -d muhutravel -f datos_prueba.sql
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=muhutravel
# DB_USER=postgres
# DB_PASSWORD=tu_contraseña
# PORT=5000
# JWT_SECRET=tu_secreto_jwt

# Iniciar servidor
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Iniciar aplicación
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Autenticación

### Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | hash123 | Admin |
| agente1 | hash123 | Agente |
| agente2 | hash123 | Agente |
| manager | hash123 | Manager |

## 📱 Características Principales

### Dashboard
- Acceso rápido a todos los módulos
- Información del usuario actual
- Interfaz intuitiva y moderna

### Gestión de Clientes
- Crear, editar y eliminar clientes
- Búsqueda por nombre, documento o email
- Información de contacto completa

### Gestión de Empleados
- Administración de personal
- Asignación de puestos
- Información de contacto

### Gestión de Proveedores
- Registro de proveedores de servicios
- Clasificación por tipo (hotel, transporte, etc.)
- Información de ubicación y contacto

### Gestión de Paquetes
- Creación de paquetes turísticos
- Definición de destinos y duraciones
- Asignación de proveedores y empleados
- Control de cupos y precios

### Gestión de Reservas
- Creación de reservas de clientes
- Seguimiento del estado (pendiente, confirmada, cancelada)
- Cálculo automático de precios
- Comentarios y notas

### Gestión de Usuarios (Admin)
- Creación de usuarios del sistema
- Asignación de roles
- Control de acceso

## 🎨 Interfaz de Usuario

### Componentes Principales

- **Header**: Navegación principal, información del usuario y cierre de sesión
- **SearchBar**: Búsqueda en tiempo real en todas las páginas de listado
- **Table**: Tabla reutilizable con acciones de edición y eliminación
- **Forms**: Formularios validados para crear y editar registros

### Características de UX

- ✅ Todos los botones tienen texto descriptivo
- ✅ Edición e inserción en páginas separadas
- ✅ Búsqueda y filtrado en todas las páginas
- ✅ Interfaz responsiva (mobile, tablet, desktop)
- ✅ Confirmación antes de eliminar
- ✅ Mensajes de error claros
- ✅ Indicadores visuales de estado

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Usuarios (Admin)
- `GET /api/usuarios` - Obtener usuarios
- `GET /api/usuarios/:id` - Obtener usuario
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Desactivar usuario

### Clientes
- `GET /api/clientes` - Obtener clientes
- `GET /api/clientes/:id` - Obtener cliente
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Desactivar cliente

### Empleados
- `GET /api/empleados` - Obtener empleados
- `GET /api/empleados/:id` - Obtener empleado
- `POST /api/empleados` - Crear empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Desactivar empleado

### Proveedores
- `GET /api/proveedores` - Obtener proveedores
- `GET /api/proveedores/:id` - Obtener proveedor
- `POST /api/proveedores` - Crear proveedor
- `PUT /api/proveedores/:id` - Actualizar proveedor
- `DELETE /api/proveedores/:id` - Desactivar proveedor

### Paquetes
- `GET /api/paquetes` - Obtener paquetes
- `GET /api/paquetes/:id` - Obtener paquete
- `POST /api/paquetes` - Crear paquete
- `PUT /api/paquetes/:id` - Actualizar paquete
- `DELETE /api/paquetes/:id` - Desactivar paquete

### Reservas
- `GET /api/reservas` - Obtener reservas
- `GET /api/reservas/:id` - Obtener reserva
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/:id` - Actualizar reserva
- `DELETE /api/reservas/:id` - Eliminar reserva

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- bcryptjs

### Frontend
- React 18
- React Router v6
- Axios
- Lucide React (iconos)
- CSS3

## 📝 Notas Importantes

1. **Seguridad**: En producción, cambiar todas las contraseñas y secretos
2. **Base de Datos**: Asegurar credenciales de PostgreSQL
3. **CORS**: Configurar correctamente para producción
4. **Variables de Entorno**: Nunca commitear archivos `.env`

## 🤝 Contribuciones

Para contribuir al proyecto, por favor:

1. Crear una rama para tu feature
2. Hacer commit de tus cambios
3. Push a la rama
4. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 📞 Soporte

Para soporte o preguntas, contactar al equipo de desarrollo.
