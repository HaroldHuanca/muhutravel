# Backend MuhuTravel

Backend en Node.js + Express para el sistema de gestión de turismo MuhuTravel.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Configurar las variables de entorno en `.env` con tus credenciales de PostgreSQL.

4. Crear la base de datos y ejecutar el esquema SQL:
```bash
psql -U postgres -d muhutravel -f ../squema.sql
psql -U postgres -d muhutravel -f ../datos_prueba.sql
```

## Ejecución

Desarrollo (con nodemon):
```bash
npm run dev
```

Producción:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:5000`

## Endpoints API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Usuarios (solo admin)
- `GET /api/usuarios` - Obtener usuarios activos
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Desactivar usuario

### Clientes
- `GET /api/clientes` - Obtener clientes activos
- `GET /api/clientes/:id` - Obtener cliente por ID
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Desactivar cliente

### Empleados
- `GET /api/empleados` - Obtener empleados activos
- `GET /api/empleados/:id` - Obtener empleado por ID
- `POST /api/empleados` - Crear empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Desactivar empleado

### Proveedores
- `GET /api/proveedores` - Obtener proveedores activos
- `GET /api/proveedores/:id` - Obtener proveedor por ID
- `POST /api/proveedores` - Crear proveedor
- `PUT /api/proveedores/:id` - Actualizar proveedor
- `DELETE /api/proveedores/:id` - Desactivar proveedor

### Paquetes
- `GET /api/paquetes` - Obtener paquetes activos
- `GET /api/paquetes/:id` - Obtener paquete por ID
- `POST /api/paquetes` - Crear paquete
- `PUT /api/paquetes/:id` - Actualizar paquete
- `DELETE /api/paquetes/:id` - Desactivar paquete

### Reservas
- `GET /api/reservas` - Obtener reservas
- `GET /api/reservas/:id` - Obtener reserva por ID
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/:id` - Actualizar reserva
- `DELETE /api/reservas/:id` - Eliminar reserva

## Autenticación

Todos los endpoints requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

El token se obtiene al hacer login en `/api/auth/login`.
