# 📑 Índice de Archivos - MuhuTravel

## 📌 Archivos Principales del Proyecto

### 📄 Documentación General

| Archivo | Descripción |
|---------|------------|
| `README.md` | Descripción general del proyecto, características y tecnologías |
| `INSTALACION.md` | Guía paso a paso para instalar y configurar MuhuTravel |
| `CONFIGURACION.md` | Configuración detallada, seguridad y despliegue |
| `RESUMEN.md` | Resumen completo del proyecto con estadísticas |
| `CHECKLIST.md` | Checklist de verificación de funcionalidades |
| `INICIO_RAPIDO.md` | Inicio rápido en 5 minutos |
| `ESTRUCTURA.md` | Estructura del proyecto y relaciones entre componentes |
| `INDICE.md` | Este archivo - índice de todos los archivos |
| `PROYECTO_COMPLETADO.txt` | Resumen visual del proyecto completado |

### 🗄️ Archivos de Base de Datos

| Archivo | Descripción |
|---------|------------|
| `squema.sql` | Esquema de base de datos PostgreSQL |
| `datos_prueba.sql` | Datos de prueba (100+ registros) |

---

## 🔙 Backend - Node.js + Express

### 📁 Estructura Backend

```
backend/
├── routes/                  # Rutas de la API
├── middleware/              # Middleware personalizado
├── db.js                    # Conexión a PostgreSQL
├── server.js                # Servidor principal
├── package.json             # Dependencias
├── .env.example             # Ejemplo de variables
├── .gitignore               # Archivos a ignorar
└── README.md                # Documentación
```

### 📄 Archivos de Rutas

| Archivo | Descripción | Endpoints |
|---------|------------|-----------|
| `routes/auth.js` | Autenticación | POST /login |
| `routes/usuarios.js` | Gestión de usuarios | GET, POST, PUT, DELETE /usuarios |
| `routes/clientes.js` | Gestión de clientes | GET, POST, PUT, DELETE /clientes |
| `routes/empleados.js` | Gestión de empleados | GET, POST, PUT, DELETE /empleados |
| `routes/proveedores.js` | Gestión de proveedores | GET, POST, PUT, DELETE /proveedores |
| `routes/paquetes.js` | Gestión de paquetes | GET, POST, PUT, DELETE /paquetes |
| `routes/reservas.js` | Gestión de reservas | GET, POST, PUT, DELETE /reservas |

### 📄 Archivos de Configuración Backend

| Archivo | Descripción |
|---------|------------|
| `db.js` | Configuración de conexión a PostgreSQL |
| `server.js` | Servidor Express principal |
| `middleware/auth.js` | Middleware de autenticación JWT |
| `package.json` | Dependencias del backend |
| `.env.example` | Ejemplo de variables de entorno |
| `.gitignore` | Archivos a ignorar en Git |
| `README.md` | Documentación del backend |

---

## ⚛️ Frontend - React

### 📁 Estructura Frontend

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── pages/               # Páginas de la aplicación
│   ├── services/            # Servicios de API
│   ├── App.js               # Componente principal
│   ├── App.css              # Estilos globales
│   └── index.js             # Punto de entrada
├── public/
│   └── index.html           # HTML principal
├── package.json             # Dependencias
├── .env.example             # Ejemplo de variables
├── .gitignore               # Archivos a ignorar
└── README.md                # Documentación
```

### 📄 Componentes Reutilizables

| Archivo | Descripción |
|---------|------------|
| `components/Header.js` | Encabezado con navegación |
| `components/Header.css` | Estilos del header |
| `components/SearchBar.js` | Barra de búsqueda |
| `components/SearchBar.css` | Estilos de búsqueda |
| `components/Table.js` | Tabla reutilizable |
| `components/Table.css` | Estilos de tabla |

### 📄 Páginas - Login y Dashboard

| Archivo | Descripción |
|---------|------------|
| `pages/Login.js` | Página de login |
| `pages/Login.css` | Estilos de login |
| `pages/Dashboard.js` | Dashboard principal |
| `pages/Dashboard.css` | Estilos del dashboard |

### 📄 Páginas - Clientes

| Archivo | Descripción |
|---------|------------|
| `pages/Clientes.js` | Listado de clientes |
| `pages/ClientesEdit.js` | Crear/editar cliente |

### 📄 Páginas - Empleados

| Archivo | Descripción |
|---------|------------|
| `pages/Empleados.js` | Listado de empleados |
| `pages/EmpleadosEdit.js` | Crear/editar empleado |

### 📄 Páginas - Proveedores

| Archivo | Descripción |
|---------|------------|
| `pages/Proveedores.js` | Listado de proveedores |
| `pages/ProveedoresEdit.js` | Crear/editar proveedor |

### 📄 Páginas - Paquetes

| Archivo | Descripción |
|---------|------------|
| `pages/Paquetes.js` | Listado de paquetes |
| `pages/PaquetesEdit.js` | Crear/editar paquete |

### 📄 Páginas - Reservas

| Archivo | Descripción |
|---------|------------|
| `pages/Reservas.js` | Listado de reservas |
| `pages/ReservasEdit.js` | Crear/editar reserva |

### 📄 Páginas - Usuarios (Admin)

| Archivo | Descripción |
|---------|------------|
| `pages/Usuarios.js` | Listado de usuarios |
| `pages/UsuariosEdit.js` | Crear/editar usuario |

### 📄 Estilos Comunes

| Archivo | Descripción |
|---------|------------|
| `pages/ListPage.css` | Estilos comunes para páginas de listado |
| `pages/EditPage.css` | Estilos comunes para páginas de edición |

### 📄 Servicios

| Archivo | Descripción |
|---------|------------|
| `services/api.js` | Configuración de Axios y servicios de API |

### 📄 Configuración Frontend

| Archivo | Descripción |
|---------|------------|
| `App.js` | Componente principal y rutas |
| `App.css` | Estilos globales |
| `index.js` | Punto de entrada |
| `public/index.html` | HTML principal |
| `package.json` | Dependencias del frontend |
| `.env.example` | Ejemplo de variables de entorno |
| `.gitignore` | Archivos a ignorar en Git |
| `README.md` | Documentación del frontend |

---

## 📊 Resumen de Archivos

### Por Tipo

| Tipo | Cantidad |
|------|----------|
| Archivos JavaScript | 30+ |
| Archivos CSS | 10+ |
| Archivos de Configuración | 8 |
| Archivos de Documentación | 9 |
| Archivos SQL | 2 |
| **Total** | **60+** |

### Por Carpeta

| Carpeta | Archivos |
|---------|----------|
| backend/routes/ | 7 |
| backend/middleware/ | 1 |
| backend/ | 4 |
| frontend/src/components/ | 6 |
| frontend/src/pages/ | 20+ |
| frontend/src/services/ | 1 |
| frontend/src/ | 3 |
| frontend/public/ | 1 |
| frontend/ | 4 |
| Raíz | 11 |

---

## 🔍 Cómo Usar Este Índice

### Para Encontrar Documentación
1. Comienza con `README.md` para una visión general
2. Lee `INSTALACION.md` para instalar
3. Lee `CONFIGURACION.md` para configurar
4. Consulta `CHECKLIST.md` para verificar

### Para Entender la Estructura
1. Lee `ESTRUCTURA.md` para ver la organización
2. Consulta este `INDICE.md` para encontrar archivos específicos
3. Revisa `RESUMEN.md` para estadísticas

### Para Desarrollar
1. Revisa `backend/README.md` para el backend
2. Revisa `frontend/README.md` para el frontend
3. Consulta `ESTRUCTURA.md` para relaciones entre componentes

### Para Desplegar
1. Lee `CONFIGURACION.md` para configuración de producción
2. Revisa `INSTALACION.md` para requisitos

---

## 📚 Orden Recomendado de Lectura

1. **Primero**: `INICIO_RAPIDO.md` (5 minutos)
2. **Segundo**: `README.md` (visión general)
3. **Tercero**: `INSTALACION.md` (instalación)
4. **Cuarto**: `PROYECTO_COMPLETADO.txt` (resumen visual)
5. **Quinto**: `ESTRUCTURA.md` (estructura técnica)
6. **Sexto**: `RESUMEN.md` (detalles completos)
7. **Séptimo**: `CONFIGURACION.md` (configuración avanzada)
8. **Octavo**: `CHECKLIST.md` (verificación)

---

## 🔗 Enlaces Rápidos

### Documentación
- [README.md](README.md) - Descripción general
- [INSTALACION.md](INSTALACION.md) - Instalación
- [CONFIGURACION.md](CONFIGURACION.md) - Configuración
- [RESUMEN.md](RESUMEN.md) - Resumen
- [CHECKLIST.md](CHECKLIST.md) - Verificación
- [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Inicio rápido
- [ESTRUCTURA.md](ESTRUCTURA.md) - Estructura
- [PROYECTO_COMPLETADO.txt](PROYECTO_COMPLETADO.txt) - Resumen visual

### Backend
- [backend/README.md](backend/README.md) - Documentación del backend
- [backend/package.json](backend/package.json) - Dependencias

### Frontend
- [frontend/README.md](frontend/README.md) - Documentación del frontend
- [frontend/package.json](frontend/package.json) - Dependencias

### Base de Datos
- [squema.sql](squema.sql) - Esquema
- [datos_prueba.sql](datos_prueba.sql) - Datos de prueba

---

## ✨ Características por Archivo

### Backend

**Autenticación** (`routes/auth.js`)
- Login con JWT
- Generación de tokens
- Validación de credenciales

**Usuarios** (`routes/usuarios.js`)
- CRUD de usuarios
- Búsqueda
- Control de acceso (admin)

**Clientes** (`routes/clientes.js`)
- CRUD de clientes
- Búsqueda por múltiples campos
- Desactivación de registros

**Empleados** (`routes/empleados.js`)
- CRUD de empleados
- Búsqueda
- Gestión de puestos

**Proveedores** (`routes/proveedores.js`)
- CRUD de proveedores
- Búsqueda
- Clasificación por tipo

**Paquetes** (`routes/paquetes.js`)
- CRUD de paquetes
- Búsqueda
- Relaciones con proveedores y empleados

**Reservas** (`routes/reservas.js`)
- CRUD de reservas
- Búsqueda
- Gestión de estados

### Frontend

**Autenticación** (`pages/Login.js`)
- Formulario de login
- Validación
- Almacenamiento de token

**Dashboard** (`pages/Dashboard.js`)
- Acceso rápido a módulos
- Información del usuario
- Interfaz intuitiva

**Listados** (`pages/[Entidad].js`)
- Tabla de registros
- Búsqueda en tiempo real
- Botones de acción

**Edición** (`pages/[Entidad]Edit.js`)
- Formularios validados
- Crear/editar registros
- Confirmación de acciones

---

## 🎯 Próximos Pasos

1. Lee `INICIO_RAPIDO.md` para empezar
2. Instala según `INSTALACION.md`
3. Verifica con `CHECKLIST.md`
4. Consulta `CONFIGURACION.md` para ajustes avanzados

---

**Última actualización**: 2025
**Versión**: 1.0
**Estado**: Completado ✅
