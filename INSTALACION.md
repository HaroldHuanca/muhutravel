# Guía de Instalación - MuhuTravel

Sigue estos pasos para instalar y ejecutar MuhuTravel en tu máquina local.

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** (v14 o superior): https://nodejs.org/
- **PostgreSQL** (v12 o superior): https://www.postgresql.org/
- **npm** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## 🗄️ Paso 1: Configurar la Base de Datos

### En Windows (Command Prompt o PowerShell):

```bash
# Crear la base de datos
createdb -U postgres muhutravel

# Ejecutar el esquema
psql -U postgres -d muhutravel -f squema.sql

# Cargar datos de prueba
psql -U postgres -d muhutravel -f datos_prueba.sql
```

### En macOS/Linux:

```bash
# Crear la base de datos
createdb muhutravel

# Ejecutar el esquema
psql -d muhutravel -f squema.sql

# Cargar datos de prueba
psql -d muhutravel -f datos_prueba.sql
```

**Nota**: Si PostgreSQL requiere contraseña, usa `-U postgres` y se te pedirá la contraseña.

## 🔧 Paso 2: Configurar el Backend

### 2.1 Navegar a la carpeta del backend

```bash
cd backend
```

### 2.2 Instalar dependencias

```bash
npm install
```

### 2.3 Crear archivo de configuración

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

### 2.4 Editar el archivo `.env`

Abre el archivo `backend/.env` y configura según tu instalación de PostgreSQL:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=muhutravel
DB_USER=postgres
DB_PASSWORD=tu_contraseña_de_postgres
PORT=5000
JWT_SECRET=tu_secreto_jwt_seguro_aqui
NODE_ENV=development
```

**Importante**: 
- `DB_PASSWORD` debe ser la contraseña que configuraste en PostgreSQL
- `JWT_SECRET` puede ser cualquier cadena aleatoria (ej: `abc123xyz789`)

### 2.5 Iniciar el servidor backend

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

Deberías ver un mensaje como:
```
Servidor ejecutándose en puerto 5000
```

**Deja este terminal abierto y abierto en otra terminal continúa con el frontend.**

## 🎨 Paso 3: Configurar el Frontend

### 3.1 Abrir una nueva terminal y navegar a la carpeta del frontend

```bash
cd frontend
```

### 3.2 Instalar dependencias

```bash
npm install
```

### 3.3 Crear archivo de configuración

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

### 3.4 Editar el archivo `.env` (opcional)

El archivo `.env.example` ya tiene la configuración correcta:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Si tu backend está en otra URL, actualiza este valor.

### 3.5 Iniciar el frontend

```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

Si no se abre automáticamente, abre tu navegador y ve a `http://localhost:3000`

## 🔐 Paso 4: Iniciar Sesión

Usa cualquiera de estas credenciales de prueba:

### Admin (acceso completo)
- **Usuario**: `admin`
- **Contraseña**: `hash123`

### Agente (acceso limitado)
- **Usuario**: `agente1`
- **Contraseña**: `hash123`

## ✅ Verificación

Si todo está configurado correctamente:

1. ✅ Backend ejecutándose en `http://localhost:5000`
2. ✅ Frontend ejecutándose en `http://localhost:3000`
3. ✅ Puedes iniciar sesión con las credenciales de prueba
4. ✅ Puedes ver el dashboard y navegar entre módulos
5. ✅ Puedes crear, editar y eliminar registros

## 🐛 Solución de Problemas

### Error: "Cannot find module 'express'"

**Solución**: Asegúrate de haber ejecutado `npm install` en la carpeta del backend.

```bash
cd backend
npm install
```

### Error: "ECONNREFUSED" o "Connection refused"

**Solución**: PostgreSQL no está ejecutándose. Inicia PostgreSQL:

- **Windows**: Abre Services y busca PostgreSQL
- **macOS**: `brew services start postgresql`
- **Linux**: `sudo service postgresql start`

### Error: "password authentication failed"

**Solución**: La contraseña en `.env` no coincide con la de PostgreSQL. Verifica:

```bash
# Conecta a PostgreSQL para verificar
psql -U postgres
```

Si no puedes conectar, resetea la contraseña de PostgreSQL.

### Error: "database does not exist"

**Solución**: La base de datos no fue creada. Ejecuta:

```bash
createdb -U postgres muhutravel
psql -U postgres -d muhutravel -f squema.sql
psql -U postgres -d muhutravel -f datos_prueba.sql
```

### Frontend no se conecta al backend

**Solución**: Verifica que:

1. El backend está ejecutándose en `http://localhost:5000`
2. La variable `REACT_APP_API_URL` en `frontend/.env` es correcta
3. CORS está habilitado en el backend (ya lo está por defecto)

### Puerto 3000 o 5000 ya está en uso

**Solución**: Cambia el puerto:

**Para el backend**: Edita `backend/.env` y cambia `PORT=5001`

**Para el frontend**: Ejecuta:
```bash
PORT=3001 npm start
```

## 📚 Documentación Adicional

- Backend: Ver `backend/README.md`
- Frontend: Ver `frontend/README.md`
- General: Ver `README.md`

## 🎉 ¡Listo!

Ya tienes MuhuTravel ejecutándose. Ahora puedes:

1. Explorar el dashboard
2. Crear nuevos clientes, empleados, proveedores, etc.
3. Crear reservas y paquetes turísticos
4. Gestionar usuarios (si eres admin)

## 💡 Próximos Pasos

- Personaliza los datos según tus necesidades
- Configura CORS para producción
- Implementa autenticación más segura (bcrypt para contraseñas)
- Agrega más validaciones en el backend
- Implementa paginación en las tablas
- Agrega más reportes y estadísticas

¡Disfruta usando MuhuTravel! 🌍✈️
