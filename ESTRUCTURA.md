# 📁 Estructura del Proyecto - MuhuTravel

## Árbol de Directorios

```
muhutravel/
│
├── 📄 squema.sql                    # Esquema de base de datos PostgreSQL
├── 📄 datos_prueba.sql              # Datos de prueba
├── 📄 README.md                     # Documentación general
├── 📄 INSTALACION.md                # Guía de instalación paso a paso
├── 📄 CONFIGURACION.md              # Configuración detallada
├── 📄 RESUMEN.md                    # Resumen del proyecto
├── 📄 CHECKLIST.md                  # Checklist de verificación
├── 📄 INICIO_RAPIDO.md              # Inicio rápido en 5 minutos
├── 📄 ESTRUCTURA.md                 # Este archivo
│
├── 📁 backend/                      # API Node.js + Express
│   ├── 📁 routes/                   # Rutas de la API
│   │   ├── 📄 auth.js               # Rutas de autenticación
│   │   ├── 📄 usuarios.js           # Rutas de usuarios
│   │   ├── 📄 clientes.js           # Rutas de clientes
│   │   ├── 📄 empleados.js          # Rutas de empleados
│   │   ├── 📄 proveedores.js        # Rutas de proveedores
│   │   ├── 📄 paquetes.js           # Rutas de paquetes
│   │   └── 📄 reservas.js           # Rutas de reservas
│   │
│   ├── 📁 middleware/               # Middleware personalizado
│   │   └── 📄 auth.js               # Middleware de autenticación JWT
│   │
│   ├── 📄 db.js                     # Configuración de conexión PostgreSQL
│   ├── 📄 server.js                 # Servidor principal Express
│   ├── 📄 package.json              # Dependencias del backend
│   ├── 📄 .env.example              # Ejemplo de variables de entorno
│   ├── 📄 .gitignore                # Archivos a ignorar en Git
│   └── 📄 README.md                 # Documentación del backend
│
└── 📁 frontend/                     # Aplicación React
    ├── 📁 public/                   # Archivos estáticos
    │   └── 📄 index.html            # HTML principal
    │
    ├── 📁 src/                      # Código fuente
    │   ├── 📁 components/           # Componentes reutilizables
    │   │   ├── 📄 Header.js         # Encabezado con navegación
    │   │   ├── 📄 Header.css        # Estilos del header
    │   │   ├── 📄 SearchBar.js      # Barra de búsqueda
    │   │   ├── 📄 SearchBar.css     # Estilos de búsqueda
    │   │   ├── 📄 Table.js          # Tabla reutilizable
    │   │   └── 📄 Table.css         # Estilos de tabla
    │   │
    │   ├── 📁 pages/                # Páginas de la aplicación
    │   │   ├── 📄 Login.js          # Página de login
    │   │   ├── 📄 Login.css         # Estilos de login
    │   │   ├── 📄 Dashboard.js      # Dashboard principal
    │   │   ├── 📄 Dashboard.css     # Estilos del dashboard
    │   │   │
    │   │   ├── 📄 Clientes.js       # Listado de clientes
    │   │   ├── 📄 ClientesEdit.js   # Edición de clientes
    │   │   │
    │   │   ├── 📄 Empleados.js      # Listado de empleados
    │   │   ├── 📄 EmpleadosEdit.js  # Edición de empleados
    │   │   │
    │   │   ├── 📄 Proveedores.js    # Listado de proveedores
    │   │   ├── 📄 ProveedoresEdit.js# Edición de proveedores
    │   │   │
    │   │   ├── 📄 Paquetes.js       # Listado de paquetes
    │   │   ├── 📄 PaquetesEdit.js   # Edición de paquetes
    │   │   │
    │   │   ├── 📄 Reservas.js       # Listado de reservas
    │   │   ├── 📄 ReservasEdit.js   # Edición de reservas
    │   │   │
    │   │   ├── 📄 Usuarios.js       # Listado de usuarios (admin)
    │   │   ├── 📄 UsuariosEdit.js   # Edición de usuarios (admin)
    │   │   │
    │   │   ├── 📄 ListPage.css      # Estilos comunes de listados
    │   │   └── 📄 EditPage.css      # Estilos comunes de edición
    │   │
    │   ├── 📁 services/             # Servicios de API
    │   │   └── 📄 api.js            # Configuración de Axios y servicios
    │   │
    │   ├── 📄 App.js                # Componente principal
    │   ├── 📄 App.css               # Estilos globales
    │   └── 📄 index.js              # Punto de entrada
    │
    ├── 📄 package.json              # Dependencias del frontend
    ├── 📄 .env.example              # Ejemplo de variables de entorno
    ├── 📄 .gitignore                # Archivos a ignorar en Git
    └── 📄 README.md                 # Documentación del frontend
```

## 📊 Descripción de Archivos Principales

### Backend

#### `server.js`
- Configuración principal de Express
- Importación de rutas
- Middleware de CORS y JSON
- Manejo de errores global

#### `db.js`
- Configuración de conexión a PostgreSQL
- Pool de conexiones
- Manejo de errores de conexión

#### `middleware/auth.js`
- Verificación de JWT
- Control de acceso por rol
- Protección de rutas

#### `routes/`
- **auth.js**: Login y autenticación
- **usuarios.js**: CRUD de usuarios (admin)
- **clientes.js**: CRUD de clientes
- **empleados.js**: CRUD de empleados
- **proveedores.js**: CRUD de proveedores
- **paquetes.js**: CRUD de paquetes
- **reservas.js**: CRUD de reservas

### Frontend

#### `App.js`
- Configuración de rutas
- Gestión de autenticación
- Componente raíz

#### `services/api.js`
- Configuración de Axios
- Servicios para cada entidad
- Interceptores de autenticación

#### `components/`
- **Header.js**: Navegación principal
- **SearchBar.js**: Búsqueda en tiempo real
- **Table.js**: Tabla reutilizable

#### `pages/`
- **Login.js**: Autenticación
- **Dashboard.js**: Panel principal
- **[Entidad].js**: Listado de registros
- **[Entidad]Edit.js**: Crear/editar registros

## 🔄 Flujo de Datos

```
Usuario
  ↓
Frontend (React)
  ↓
API (Express)
  ↓
PostgreSQL
  ↓
API (Express)
  ↓
Frontend (React)
  ↓
Usuario
```

## 🔐 Flujo de Autenticación

```
1. Usuario ingresa credenciales en Login
2. Frontend envía POST a /api/auth/login
3. Backend verifica credenciales
4. Backend genera JWT
5. Frontend guarda JWT en localStorage
6. Frontend incluye JWT en headers de solicitudes
7. Backend verifica JWT en middleware
8. Acceso permitido/denegado según rol
```

## 📱 Rutas de la Aplicación

### Públicas
```
/login                          # Página de login
```

### Autenticadas
```
/                               # Dashboard
/clientes                       # Listado de clientes
/clientes/new                   # Crear cliente
/clientes/edit/:id              # Editar cliente
/empleados                      # Listado de empleados
/empleados/new                  # Crear empleado
/empleados/edit/:id             # Editar empleado
/proveedores                    # Listado de proveedores
/proveedores/new                # Crear proveedor
/proveedores/edit/:id           # Editar proveedor
/paquetes                       # Listado de paquetes
/paquetes/new                   # Crear paquete
/paquetes/edit/:id              # Editar paquete
/reservas                       # Listado de reservas
/reservas/new                   # Crear reserva
/reservas/edit/:id              # Editar reserva
/usuarios                       # Listado de usuarios (admin)
/usuarios/new                   # Crear usuario (admin)
/usuarios/edit/:id              # Editar usuario (admin)
```

## 🗄️ Estructura de Base de Datos

```
usuarios
├── id (PK)
├── username (UNIQUE)
├── password_hash
├── rol (admin, agente, manager)
├── activo
└── creado_en

clientes
├── id (PK)
├── nombres
├── apellidos
├── documento (UNIQUE)
├── telefono
├── email
├── ciudad
├── pais
├── activo
└── creado_en

empleados
├── id (PK)
├── nombres
├── apellidos
├── puesto
├── telefono
├── email
├── activo
└── creado_en

proveedores
├── id (PK)
├── nombre
├── tipo
├── telefono
├── email
├── pais
├── ciudad
├── activo
└── creado_en

paquetes
├── id (PK)
├── nombre
├── destino
├── duracion_dias
├── precio
├── cupos
├── fecha_inicio
├── fecha_fin
├── proveedor_id (FK)
├── empleado_id (FK)
├── activo
└── creado_en

reservas
├── id (PK)
├── numero_reserva (UNIQUE)
├── cliente_id (FK)
├── paquete_id (FK)
├── empleado_id (FK)
├── fecha_reserva
├── cantidad_personas
├── precio_total
├── estado
└── comentario
```

## 📦 Dependencias Principales

### Backend
```
express: Framework web
pg: Cliente PostgreSQL
cors: Middleware CORS
dotenv: Variables de entorno
jsonwebtoken: JWT
bcryptjs: Hash de contraseñas
```

### Frontend
```
react: Librería UI
react-router-dom: Enrutamiento
axios: Cliente HTTP
lucide-react: Iconos
```

## 🎨 Estructura de Estilos

```
Global (App.css)
├── Header.css
├── SearchBar.css
├── Table.css
├── Login.css
├── Dashboard.css
├── ListPage.css
└── EditPage.css
```

## 📝 Archivos de Configuración

```
.env.example        # Ejemplo de variables
.gitignore          # Archivos a ignorar
package.json        # Dependencias
```

## 📚 Archivos de Documentación

```
README.md           # General
INSTALACION.md      # Instalación
CONFIGURACION.md    # Configuración
RESUMEN.md          # Resumen
CHECKLIST.md        # Verificación
INICIO_RAPIDO.md    # Inicio rápido
ESTRUCTURA.md       # Este archivo
```

## 🔗 Relaciones entre Componentes

```
App.js
├── Login.js
├── Header.js
├── Dashboard.js
├── Clientes.js
│   ├── SearchBar.js
│   └── Table.js
├── ClientesEdit.js
├── Empleados.js
├── EmpleadosEdit.js
├── Proveedores.js
├── ProveedoresEdit.js
├── Paquetes.js
├── PaquetesEdit.js
├── Reservas.js
├── ReservasEdit.js
├── Usuarios.js
└── UsuariosEdit.js
```

## 🔄 Ciclo de Vida de una Solicitud

1. Usuario interactúa con componente
2. Componente llama a servicio de API
3. Servicio de API usa Axios
4. Axios incluye JWT en headers
5. Backend recibe solicitud
6. Middleware verifica JWT
7. Ruta procesa solicitud
8. Base de datos ejecuta query
9. Backend retorna respuesta
10. Frontend actualiza estado
11. Componente re-renderiza

## 📊 Estadísticas

- **Archivos Backend**: 8
- **Archivos Frontend**: 30+
- **Líneas de Código**: 3000+
- **Rutas API**: 35+
- **Páginas**: 13
- **Componentes**: 3
- **Tablas BD**: 6
- **Registros de Prueba**: 100+

---

Esta estructura está diseñada para ser:
- ✅ Escalable
- ✅ Mantenible
- ✅ Modular
- ✅ Fácil de entender
- ✅ Fácil de extender
