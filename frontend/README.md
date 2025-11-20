# Frontend MuhuTravel

Frontend en React para el sistema de gestión de turismo MuhuTravel.

## Características

- ✅ Autenticación con JWT
- ✅ Dashboard intuitivo
- ✅ Gestión de Clientes
- ✅ Gestión de Empleados
- ✅ Gestión de Proveedores
- ✅ Gestión de Paquetes Turísticos
- ✅ Gestión de Reservas
- ✅ Gestión de Usuarios (solo admin)
- ✅ Búsqueda y filtrado en todas las páginas
- ✅ Edición e inserción en páginas separadas
- ✅ Interfaz responsiva y moderna
- ✅ Todos los botones con texto descriptivo

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Configurar la URL del API en `.env` si es necesario.

## Ejecución

Desarrollo:
```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── components/
│   ├── Header.js          # Encabezado con navegación
│   ├── SearchBar.js       # Barra de búsqueda
│   └── Table.js           # Tabla reutilizable
├── pages/
│   ├── Login.js           # Página de login
│   ├── Dashboard.js       # Dashboard principal
│   ├── Clientes.js        # Listado de clientes
│   ├── ClientesEdit.js    # Edición de clientes
│   ├── Empleados.js       # Listado de empleados
│   ├── EmpleadosEdit.js   # Edición de empleados
│   ├── Proveedores.js     # Listado de proveedores
│   ├── ProveedoresEdit.js # Edición de proveedores
│   ├── Paquetes.js        # Listado de paquetes
│   ├── PaquetesEdit.js    # Edición de paquetes
│   ├── Reservas.js        # Listado de reservas
│   ├── ReservasEdit.js    # Edición de reservas
│   ├── Usuarios.js        # Listado de usuarios (admin)
│   └── UsuariosEdit.js    # Edición de usuarios (admin)
├── services/
│   └── api.js             # Configuración de axios y servicios
├── App.js                 # Componente principal
└── index.js               # Punto de entrada

```

## Rutas de la Aplicación

### Públicas
- `/login` - Página de login

### Autenticadas
- `/` - Dashboard
- `/clientes` - Listado de clientes
- `/clientes/new` - Crear nuevo cliente
- `/clientes/edit/:id` - Editar cliente
- `/empleados` - Listado de empleados
- `/empleados/new` - Crear nuevo empleado
- `/empleados/edit/:id` - Editar empleado
- `/proveedores` - Listado de proveedores
- `/proveedores/new` - Crear nuevo proveedor
- `/proveedores/edit/:id` - Editar proveedor
- `/paquetes` - Listado de paquetes
- `/paquetes/new` - Crear nuevo paquete
- `/paquetes/edit/:id` - Editar paquete
- `/reservas` - Listado de reservas
- `/reservas/new` - Crear nueva reserva
- `/reservas/edit/:id` - Editar reserva
- `/usuarios` - Listado de usuarios (solo admin)
- `/usuarios/new` - Crear nuevo usuario (solo admin)
- `/usuarios/edit/:id` - Editar usuario (solo admin)

## Credenciales de Prueba

- **Admin**: usuario: `admin` | contraseña: `hash123`
- **Agente**: usuario: `agente1` | contraseña: `hash123`

## Características de la Interfaz

### Header
- Logo y navegación principal
- Información del usuario actual
- Botón de cierre de sesión
- Menú responsivo para dispositivos móviles

### Búsqueda
- Barra de búsqueda en cada página de listado
- Filtrado en tiempo real
- Búsqueda por múltiples campos

### Tablas
- Listado de registros con información relevante
- Botones de edición y eliminación en cada fila
- Indicadores visuales (colores, estados)

### Formularios
- Campos validados
- Mensajes de error claros
- Botones con texto descriptivo
- Confirmación antes de eliminar

## Tecnologías Utilizadas

- React 18
- React Router v6
- Axios
- Lucide React (iconos)
- CSS3 (estilos personalizados)
