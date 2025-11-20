# Configuración Detallada - MuhuTravel

## 🗄️ Configuración de PostgreSQL

### Instalación en Windows

1. Descargar PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Ejecutar el instalador
3. Durante la instalación:
   - Establecer contraseña para el usuario `postgres`
   - Dejar puerto por defecto: `5432`
   - Seleccionar componentes: PostgreSQL Server, pgAdmin 4, Command Line Tools

### Instalación en macOS

```bash
# Usando Homebrew
brew install postgresql

# Iniciar PostgreSQL
brew services start postgresql

# Verificar instalación
psql --version
```

### Instalación en Linux (Ubuntu/Debian)

```bash
# Actualizar repositorios
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Iniciar servicio
sudo service postgresql start

# Verificar estado
sudo service postgresql status
```

## 🔑 Configuración de Credenciales PostgreSQL

### Cambiar contraseña de postgres (si es necesario)

```bash
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql, ejecutar:
ALTER USER postgres WITH PASSWORD 'nueva_contraseña';

# Salir
\q
```

### Crear usuario específico para la aplicación (opcional)

```bash
# Conectar como postgres
psql -U postgres

# Crear usuario
CREATE USER muhutravel WITH PASSWORD 'contraseña_segura';

# Dar permisos
ALTER USER muhutravel CREATEDB;

# Salir
\q
```

## 🔐 Configuración de Variables de Entorno

### Backend (.env)

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=muhutravel
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres

# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui_cambiar_en_produccion

# CORS (opcional)
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
# API
REACT_APP_API_URL=http://localhost:5000/api

# Modo desarrollo
REACT_APP_ENV=development
```

## 🚀 Configuración de Puertos

### Puertos por Defecto

- **Backend**: `5000`
- **Frontend**: `3000`
- **PostgreSQL**: `5432`

### Cambiar Puertos

**Backend**: Editar `backend/.env`
```env
PORT=5001
```

**Frontend**: Ejecutar con variable de entorno
```bash
PORT=3001 npm start
```

**PostgreSQL**: Editar `postgresql.conf` (ubicación varía según SO)

## 🔗 Configuración de CORS

### Desarrollo (ya configurado)

El backend permite solicitudes desde `http://localhost:3000`

### Producción

Editar `backend/server.js`:

```javascript
app.use(cors({
  origin: 'https://tu-dominio.com',
  credentials: true
}));
```

## 🔐 Seguridad en Producción

### 1. Variables de Entorno Seguras

```env
# Cambiar todos estos valores
DB_PASSWORD=contraseña_muy_segura_aleatoria
JWT_SECRET=secreto_jwt_aleatorio_muy_largo_y_seguro
```

### 2. Contraseñas de Usuarios

Actualmente las contraseñas se almacenan en texto plano. En producción:

```javascript
// Usar bcryptjs en backend/routes/auth.js
const bcrypt = require('bcryptjs');

// Al crear usuario
const hashedPassword = await bcrypt.hash(password, 10);

// Al verificar
const isValid = await bcrypt.compare(password, user.password_hash);
```

### 3. HTTPS

- Usar certificados SSL/TLS
- Redirigir HTTP a HTTPS

### 4. Rate Limiting

```javascript
// Instalar: npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 solicitudes por ventana
});

app.use('/api/', limiter);
```

### 5. Validación de Entrada

- Validar todos los inputs
- Usar librerías como `joi` o `express-validator`

## 📊 Configuración de Base de Datos

### Backup

```bash
# Crear backup
pg_dump -U postgres muhutravel > backup.sql

# Restaurar backup
psql -U postgres muhutravel < backup.sql
```

### Índices (ya incluidos en squema.sql)

```sql
CREATE INDEX idx_reservas_cliente ON reservas(cliente_id);
CREATE INDEX idx_reservas_paquete ON reservas(paquete_id);
CREATE INDEX idx_paquetes_destino ON paquetes(destino);
```

## 🌐 Despliegue en Producción

### Opción 1: Heroku

```bash
# Instalar Heroku CLI
# Crear app
heroku create tu-app-name

# Agregar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Configurar variables
heroku config:set JWT_SECRET=tu_secreto

# Desplegar
git push heroku main
```

### Opción 2: DigitalOcean / AWS / Azure

1. Crear servidor
2. Instalar Node.js y PostgreSQL
3. Clonar repositorio
4. Instalar dependencias
5. Configurar variables de entorno
6. Usar PM2 para mantener el proceso activo

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start backend/server.js --name "muhutravel-api"

# Guardar configuración
pm2 save
```

### Opción 3: Docker

Crear `Dockerfile` para backend:

```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Crear `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: muhutravel
      POSTGRES_PASSWORD: contraseña
    ports:
      - "5432:5432"
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      DB_HOST: postgres
      DB_USER: postgres
      DB_PASSWORD: contraseña
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

## 🧪 Testing

### Backend

```bash
cd backend

# Instalar testing framework
npm install --save-dev jest

# Crear archivo de test
# tests/api.test.js

# Ejecutar tests
npm test
```

### Frontend

```bash
cd frontend

# Tests ya configurados con react-scripts
npm test
```

## 📈 Monitoreo

### Logs del Backend

```bash
# Ver logs en tiempo real
pm2 logs muhutravel-api

# Guardar logs
pm2 logs muhutravel-api > logs.txt
```

### Monitoreo de Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres -d muhutravel

# Ver conexiones activas
SELECT * FROM pg_stat_activity;

# Ver tamaño de tablas
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
```

## 🔄 Actualización de Dependencias

```bash
# Backend
cd backend
npm outdated  # Ver qué está desactualizado
npm update    # Actualizar

# Frontend
cd frontend
npm outdated
npm update
```

## 📝 Notas Importantes

1. **Nunca** commitear archivos `.env` a Git
2. Usar `.gitignore` para excluir archivos sensibles
3. Cambiar `JWT_SECRET` en producción
4. Usar contraseñas fuertes para PostgreSQL
5. Hacer backups regulares de la base de datos
6. Monitorear logs regularmente
7. Mantener dependencias actualizadas
8. Implementar autenticación más segura (2FA, OAuth)

## 🆘 Contacto y Soporte

Para problemas específicos de configuración, consultar:

- Documentación de PostgreSQL: https://www.postgresql.org/docs/
- Documentación de Node.js: https://nodejs.org/docs/
- Documentación de React: https://react.dev/
