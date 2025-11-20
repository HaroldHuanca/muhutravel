# Checklist de Verificación - MuhuTravel

Use este checklist para verificar que todo está funcionando correctamente.

## ✅ Instalación

- [ ] PostgreSQL instalado y ejecutándose
- [ ] Base de datos `muhutravel` creada
- [ ] Esquema SQL ejecutado
- [ ] Datos de prueba cargados
- [ ] Node.js v14+ instalado
- [ ] npm instalado

## ✅ Backend

- [ ] Carpeta `backend` creada
- [ ] `npm install` ejecutado en backend
- [ ] Archivo `.env` creado con credenciales correctas
- [ ] Backend ejecutándose en `http://localhost:5000`
- [ ] Mensaje "Servidor ejecutándose en puerto 5000" visible

### Rutas API Funcionales

- [ ] `POST /api/auth/login` - Login funciona
- [ ] `GET /api/usuarios` - Obtener usuarios
- [ ] `GET /api/clientes` - Obtener clientes
- [ ] `GET /api/empleados` - Obtener empleados
- [ ] `GET /api/proveedores` - Obtener proveedores
- [ ] `GET /api/paquetes` - Obtener paquetes
- [ ] `GET /api/reservas` - Obtener reservas

## ✅ Frontend

- [ ] Carpeta `frontend` creada
- [ ] `npm install` ejecutado en frontend
- [ ] Archivo `.env` creado
- [ ] Frontend ejecutándose en `http://localhost:3000`
- [ ] Aplicación se abre automáticamente

## ✅ Autenticación

- [ ] Página de login visible
- [ ] Login con `admin` / `hash123` funciona
- [ ] Token JWT se guarda en localStorage
- [ ] Redirección al dashboard después de login
- [ ] Botón de logout funciona
- [ ] Sesión se cierra correctamente

## ✅ Dashboard

- [ ] Dashboard visible después de login
- [ ] Mensaje de bienvenida muestra usuario correcto
- [ ] 6 módulos visibles (Clientes, Empleados, Proveedores, Paquetes, Reservas, Usuarios)
- [ ] Todos los módulos son clickeables
- [ ] Header con navegación visible
- [ ] Información del usuario en header correcta

## ✅ Módulo Clientes

- [ ] Página de listado de clientes carga
- [ ] Barra de búsqueda funciona
- [ ] Botón "Nuevo Cliente" visible
- [ ] Tabla muestra clientes
- [ ] Botones "Editar" y "Eliminar" visibles
- [ ] Crear nuevo cliente funciona
- [ ] Editar cliente funciona
- [ ] Eliminar cliente funciona (con confirmación)
- [ ] Búsqueda filtra resultados

## ✅ Módulo Empleados

- [ ] Página de listado de empleados carga
- [ ] Barra de búsqueda funciona
- [ ] Botón "Nuevo Empleado" visible
- [ ] Tabla muestra empleados
- [ ] Crear nuevo empleado funciona
- [ ] Editar empleado funciona
- [ ] Eliminar empleado funciona
- [ ] Búsqueda filtra resultados

## ✅ Módulo Proveedores

- [ ] Página de listado de proveedores carga
- [ ] Barra de búsqueda funciona
- [ ] Botón "Nuevo Proveedor" visible
- [ ] Tabla muestra proveedores
- [ ] Crear nuevo proveedor funciona
- [ ] Editar proveedor funciona
- [ ] Eliminar proveedor funciona
- [ ] Búsqueda filtra resultados

## ✅ Módulo Paquetes

- [ ] Página de listado de paquetes carga
- [ ] Barra de búsqueda funciona
- [ ] Botón "Nuevo Paquete" visible
- [ ] Tabla muestra paquetes
- [ ] Crear nuevo paquete funciona
- [ ] Editar paquete funciona
- [ ] Eliminar paquete funciona
- [ ] Búsqueda filtra resultados
- [ ] Selects de proveedor y empleado funcionan

## ✅ Módulo Reservas

- [ ] Página de listado de reservas carga
- [ ] Barra de búsqueda funciona
- [ ] Botón "Nueva Reserva" visible
- [ ] Tabla muestra reservas
- [ ] Estados mostrados con colores (pendiente, confirmada, cancelada)
- [ ] Crear nueva reserva funciona
- [ ] Editar reserva funciona
- [ ] Eliminar reserva funciona
- [ ] Búsqueda filtra resultados
- [ ] Selects de cliente, paquete y empleado funcionan

## ✅ Módulo Usuarios (Admin)

- [ ] Módulo solo visible para admin
- [ ] Página de listado de usuarios carga
- [ ] Barra de búsqueda funciona
- [ ] Botón "Nuevo Usuario" visible
- [ ] Tabla muestra usuarios
- [ ] Crear nuevo usuario funciona
- [ ] Editar usuario funciona
- [ ] Desactivar usuario funciona
- [ ] Búsqueda filtra resultados

## ✅ Interfaz de Usuario

- [ ] Header visible en todas las páginas
- [ ] Navegación funciona correctamente
- [ ] Logo clickeable lleva al dashboard
- [ ] Información del usuario en header correcta
- [ ] Botón de logout funciona
- [ ] Menú responsivo en móvil
- [ ] Todos los botones tienen texto descriptivo
- [ ] Colores consistentes en toda la app
- [ ] Iconos visibles y claros

## ✅ Formularios

- [ ] Campos requeridos validados
- [ ] Mensajes de error claros
- [ ] Botón "Cancelar" lleva de vuelta
- [ ] Botón "Guardar" guarda datos
- [ ] Confirmación antes de eliminar
- [ ] Formularios responsivos en móvil

## ✅ Búsqueda y Filtrado

- [ ] Búsqueda en tiempo real funciona
- [ ] Búsqueda filtra por múltiples campos
- [ ] Búsqueda no sensible a mayúsculas
- [ ] Búsqueda vacía muestra todos los registros

## ✅ Edición e Inserción

- [ ] Edición en página separada (ej: `/clientes/edit/1`)
- [ ] Inserción en página separada (ej: `/clientes/new`)
- [ ] Botón "Volver" funciona
- [ ] Datos se cargan correctamente en edición
- [ ] Cambios se guardan correctamente
- [ ] Redirección al listado después de guardar

## ✅ Responsividad

- [ ] Aplicación funciona en desktop
- [ ] Aplicación funciona en tablet
- [ ] Aplicación funciona en móvil
- [ ] Menú se adapta en móvil
- [ ] Tablas se adaptan en móvil
- [ ] Formularios se adaptan en móvil

## ✅ Datos de Prueba

- [ ] 48 clientes cargados
- [ ] 10 empleados cargados
- [ ] 10 proveedores cargados
- [ ] 15 paquetes cargados
- [ ] 20 reservas cargadas
- [ ] Datos visibles en listados

## ✅ Seguridad

- [ ] Token JWT se guarda en localStorage
- [ ] Token se envía en headers de solicitudes
- [ ] Logout elimina token
- [ ] Páginas protegidas requieren autenticación
- [ ] Usuarios no admin no pueden acceder a `/usuarios`

## ✅ Documentación

- [ ] README.md existe y es completo
- [ ] INSTALACION.md existe y es claro
- [ ] CONFIGURACION.md existe y es detallado
- [ ] backend/README.md existe
- [ ] frontend/README.md existe
- [ ] RESUMEN.md existe

## ✅ Archivos de Configuración

- [ ] backend/.env.example existe
- [ ] frontend/.env.example existe
- [ ] backend/.gitignore existe
- [ ] frontend/.gitignore existe
- [ ] backend/package.json tiene todas las dependencias
- [ ] frontend/package.json tiene todas las dependencias

## ✅ Errores y Excepciones

- [ ] Errores de conexión manejados
- [ ] Errores de validación mostrados
- [ ] Errores de servidor manejados
- [ ] Mensajes de error claros
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en consola del servidor

## 🎯 Funcionalidades Especiales

- [ ] Todos los botones tienen texto (no solo iconos)
- [ ] Edición e inserción en páginas diferentes
- [ ] Búsqueda en todas las páginas de listado
- [ ] Header con datos del usuario
- [ ] Dashboard genérico
- [ ] Usuarios solo activos para admin
- [ ] Confirmación antes de eliminar
- [ ] Indicadores visuales de estado

## 📊 Pruebas Funcionales

### Crear Registros
- [ ] Crear cliente
- [ ] Crear empleado
- [ ] Crear proveedor
- [ ] Crear paquete
- [ ] Crear reserva
- [ ] Crear usuario (admin)

### Editar Registros
- [ ] Editar cliente
- [ ] Editar empleado
- [ ] Editar proveedor
- [ ] Editar paquete
- [ ] Editar reserva
- [ ] Editar usuario (admin)

### Eliminar Registros
- [ ] Eliminar cliente
- [ ] Eliminar empleado
- [ ] Eliminar proveedor
- [ ] Eliminar paquete
- [ ] Eliminar reserva
- [ ] Desactivar usuario (admin)

### Búsqueda
- [ ] Buscar cliente
- [ ] Buscar empleado
- [ ] Buscar proveedor
- [ ] Buscar paquete
- [ ] Buscar reserva
- [ ] Buscar usuario (admin)

## 🔧 Solución de Problemas

Si algo no funciona:

1. [ ] Verificar que PostgreSQL está ejecutándose
2. [ ] Verificar que el backend está ejecutándose en puerto 5000
3. [ ] Verificar que el frontend está ejecutándose en puerto 3000
4. [ ] Verificar credenciales en `.env`
5. [ ] Revisar logs de error en consola
6. [ ] Revisar INSTALACION.md para soluciones comunes
7. [ ] Revisar CONFIGURACION.md para problemas de configuración

## ✨ Resultado Final

Si todos los checkboxes están marcados, ¡MuhuTravel está funcionando correctamente! 🎉

---

**Fecha de Verificación**: _______________

**Verificado por**: _______________

**Notas**: 
