# 🚀 Inicio Rápido - MuhuTravel

## En 5 Minutos

### Paso 1: Base de Datos (2 minutos)

```bash
# Crear base de datos
createdb muhutravel

# Cargar esquema y datos
psql -U postgres -d muhutravel -f squema.sql
psql -U postgres -d muhutravel -f datos_prueba.sql
```

### Paso 2: Backend (1.5 minutos)

```bash
cd backend
npm install
cp .env.example .env
# Editar .env si es necesario (cambiar contraseña de PostgreSQL)
npm run dev
```

Deberías ver: `Servidor ejecutándose en puerto 5000`

### Paso 3: Frontend (1.5 minutos)

En otra terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

La app se abrirá en `http://localhost:3000`

### Paso 4: Login

- **Usuario**: `admin`
- **Contraseña**: `hash123`

¡Listo! 🎉

---

## 📋 Requisitos

- Node.js 14+
- PostgreSQL 12+
- npm

## 🎯 Lo Que Obtuviste

✅ Backend completo con 7 módulos
✅ Frontend moderno y responsivo
✅ 48 clientes de prueba
✅ 10 empleados
✅ 10 proveedores
✅ 15 paquetes turísticos
✅ 20 reservas
✅ Autenticación con JWT
✅ Control de acceso por rol
✅ Búsqueda en tiempo real
✅ Edición e inserción en páginas separadas

## 🔗 Enlaces Útiles

- Dashboard: `http://localhost:3000`
- API: `http://localhost:5000/api`
- Documentación: Ver `README.md`
- Instalación Detallada: Ver `INSTALACION.md`
- Configuración: Ver `CONFIGURACION.md`
- Checklist: Ver `CHECKLIST.md`

## 🆘 Problemas Comunes

### "Cannot find module"
```bash
npm install
```

### "Connection refused"
Inicia PostgreSQL

### "password authentication failed"
Verifica la contraseña en `.env`

Ver `INSTALACION.md` para más soluciones.

## 📚 Documentación Completa

- `README.md` - Descripción general
- `INSTALACION.md` - Instalación paso a paso
- `CONFIGURACION.md` - Configuración detallada
- `RESUMEN.md` - Resumen del proyecto
- `CHECKLIST.md` - Verificación de funcionalidades
- `backend/README.md` - Documentación del backend
- `frontend/README.md` - Documentación del frontend

## 🎨 Características Principales

### Dashboard
- Acceso rápido a todos los módulos
- Información del usuario
- Interfaz intuitiva

### Módulos
- **Clientes**: Gestión de clientes
- **Empleados**: Gestión de personal
- **Proveedores**: Gestión de proveedores
- **Paquetes**: Gestión de paquetes turísticos
- **Reservas**: Gestión de reservas
- **Usuarios**: Gestión de usuarios (admin)

### Funcionalidades
- Crear, editar, eliminar registros
- Búsqueda en tiempo real
- Edición e inserción en páginas separadas
- Interfaz responsiva
- Todos los botones con texto
- Confirmación antes de eliminar

## 🔐 Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | hash123 | Admin |
| agente1 | hash123 | Agente |
| agente2 | hash123 | Agente |
| manager | hash123 | Manager |

## 💡 Próximos Pasos

1. Explorar el dashboard
2. Crear nuevos registros
3. Probar la búsqueda
4. Editar registros existentes
5. Revisar la documentación para configuración avanzada

## 📞 Soporte

Si tienes problemas:

1. Revisa `INSTALACION.md`
2. Revisa `CONFIGURACION.md`
3. Revisa `CHECKLIST.md`
4. Revisa los logs de error

---

**¡Disfruta usando MuhuTravel!** 🌍✈️
