# Gestión de Registros Inactivos - MuhuTravel

## 📋 Descripción

Se ha implementado una funcionalidad completa para gestionar registros inactivos en todas las tablas que tienen la columna `activo`. Ahora puedes:

1. **Ver registros inactivos** - Acceder a una lista de todos los registros desactivados
2. **Reactivar registros** - Volver a activar registros que fueron desactivados
3. **Buscar en inactivos** - Filtrar registros inactivos por criterios de búsqueda

## 🎯 Tablas Afectadas

Las siguientes tablas tienen la funcionalidad de inactivos:

- ✅ **Usuarios** - Gestión de usuarios del sistema
- ✅ **Clientes** - Gestión de clientes
- ✅ **Empleados** - Gestión de empleados
- ✅ **Proveedores** - Gestión de proveedores
- ✅ **Paquetes** - Gestión de paquetes turísticos

**Nota:** La tabla `reservas` no tiene columna `activo`, por lo que no tiene esta funcionalidad.

## 🔧 Cambios en el Backend

### Nuevos Endpoints

Para cada entidad se agregaron dos nuevos endpoints:

#### 1. Obtener Inactivos
```
GET /api/{entidad}/inactivos/lista?search={criterio}
```

**Ejemplo:**
```bash
GET /api/clientes/inactivos/lista?search=juan
```

**Respuesta:**
```json
[
  {
    "id": 5,
    "nombres": "Juan",
    "apellidos": "Pérez",
    "documento": "12345678",
    "email": "juan@example.com",
    "ciudad": "Lima",
    "pais": "Peru",
    "activo": false,
    "creado_en": "2025-01-15T10:30:00Z"
  }
]
```

#### 2. Reactivar Registro
```
PATCH /api/{entidad}/{id}/reactivar
```

**Ejemplo:**
```bash
PATCH /api/clientes/5/reactivar
```

**Respuesta:**
```json
{
  "id": 5,
  "nombres": "Juan",
  "apellidos": "Pérez",
  "documento": "12345678",
  "email": "juan@example.com",
  "ciudad": "Lima",
  "pais": "Peru",
  "activo": true,
  "creado_en": "2025-01-15T10:30:00Z"
}
```

### Rutas Modificadas

Se modificaron las siguientes rutas:

- `backend/routes/usuarios.js`
- `backend/routes/clientes.js`
- `backend/routes/empleados.js`
- `backend/routes/proveedores.js`
- `backend/routes/paquetes.js`

## 🎨 Cambios en el Frontend

### Nuevas Páginas

#### Página de Inactivos (`frontend/src/pages/Inactivos.js`)

Página genérica que muestra registros inactivos de cualquier entidad. Características:

- Búsqueda en tiempo real
- Tabla con columnas relevantes
- Botón de reactivación
- Confirmación antes de reactivar
- Botón de volver a la lista activa

### Páginas Modificadas

Se agregó un botón "Ver Inactivos" en las siguientes páginas:

- `frontend/src/pages/Usuarios.js`
- `frontend/src/pages/Clientes.js`
- `frontend/src/pages/Empleados.js`
- `frontend/src/pages/Proveedores.js`
- `frontend/src/pages/Paquetes.js`

### Rutas Agregadas

Se agregó una nueva ruta en `App.js`:

```javascript
<Route path="/inactivos/:tipo" element={<Inactivos user={user} onLogout={handleLogout} />} />
```

## 📱 Flujo de Uso

### Para Ver Inactivos

1. Accede a cualquier página de listado (Clientes, Empleados, etc.)
2. Haz clic en el botón **"Ver Inactivos"** (con icono de ojo)
3. Se abrirá la página de inactivos correspondiente
4. Puedes buscar usando la barra de búsqueda
5. Verás una tabla con todos los registros inactivos

### Para Reactivar un Registro

1. En la página de inactivos, busca el registro que deseas reactivar
2. Haz clic en el botón **"Reactivar"** (color verde)
3. Se pedirá confirmación
4. Una vez confirmado, el registro se reactivará
5. Se eliminará de la lista de inactivos
6. Aparecerá nuevamente en la lista de activos

## 🔍 Búsqueda en Inactivos

La búsqueda funciona igual que en las listas activas:

- **Usuarios:** Busca por usuario, rol
- **Clientes:** Busca por nombre, apellido, documento, email
- **Empleados:** Busca por nombre, apellido, puesto, email
- **Proveedores:** Busca por nombre, tipo, email, ciudad
- **Paquetes:** Busca por nombre, destino

## 🔐 Permisos

- **Usuarios Inactivos:** Solo admin
- **Otros Inactivos:** Cualquier usuario autenticado

## 💾 Base de Datos

No se realizaron cambios en la estructura de la base de datos. Se utilizó la columna `activo` existente en las tablas.

## 🧪 Pruebas

### Prueba 1: Ver Inactivos de Clientes

1. Ve a la página de Clientes
2. Haz clic en "Ver Inactivos"
3. Deberías ver una lista vacía (si no hay clientes inactivos)

### Prueba 2: Desactivar y Reactivar

1. Ve a la página de Clientes
2. Selecciona un cliente y haz clic en "Eliminar"
3. Confirma la eliminación
4. Haz clic en "Ver Inactivos"
5. Deberías ver el cliente que acabas de eliminar
6. Haz clic en "Reactivar"
7. Confirma la reactivación
8. El cliente debería desaparecer de la lista de inactivos
9. Ve a la lista de Clientes activos
10. El cliente debería estar nuevamente en la lista

### Prueba 3: Búsqueda en Inactivos

1. Ve a la página de Inactivos de cualquier entidad
2. Escribe en la barra de búsqueda
3. La lista debería filtrarse en tiempo real

## 📊 Estadísticas

- **Nuevos Endpoints:** 10 (2 por entidad × 5 entidades)
- **Nuevas Páginas:** 1 (Inactivos.js)
- **Páginas Modificadas:** 5
- **Archivos Modificados:** 11

## 🚀 Próximas Mejoras

Posibles mejoras futuras:

1. **Eliminación permanente** - Agregar opción de eliminar definitivamente
2. **Historial** - Ver cuándo se desactivó un registro
3. **Reactivación masiva** - Reactivar múltiples registros a la vez
4. **Filtros avanzados** - Filtrar por fecha de desactivación
5. **Exportar inactivos** - Descargar lista de inactivos en PDF/Excel

## 📝 Notas Importantes

- Los registros desactivados se guardan en la base de datos (no se eliminan)
- La búsqueda en inactivos es en tiempo real
- Se pide confirmación antes de reactivar
- Los permisos se respetan (solo admin puede ver usuarios inactivos)
- La funcionalidad es consistente en todas las entidades

## 🔗 Archivos Relacionados

- `backend/routes/usuarios.js`
- `backend/routes/clientes.js`
- `backend/routes/empleados.js`
- `backend/routes/proveedores.js`
- `backend/routes/paquetes.js`
- `frontend/src/pages/Inactivos.js`
- `frontend/src/App.js`
- `frontend/src/pages/Usuarios.js`
- `frontend/src/pages/Clientes.js`
- `frontend/src/pages/Empleados.js`
- `frontend/src/pages/Proveedores.js`
- `frontend/src/pages/Paquetes.js`

---

**Última actualización:** 2025
**Versión:** 1.1 (Con funcionalidad de inactivos)
