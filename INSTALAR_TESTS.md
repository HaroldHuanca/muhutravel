# Instalación de Dependencias para Pruebas

## 📋 Requisitos Previos

- Node.js 14+ instalado
- npm 6+ instalado
- Git (opcional)

## 🚀 Instalación Rápida

### Backend

```bash
# 1. Navegar al directorio backend
cd backend

# 2. Instalar todas las dependencias (incluyendo devDependencies)
npm install

# 3. Verificar que Jest está instalado
npm list jest

# 4. Ejecutar pruebas para verificar
npm test
```

### Frontend

```bash
# 1. Navegar al directorio frontend
cd frontend

# 2. Instalar todas las dependencias
npm install

# 3. Verificar que testing libraries están instaladas
npm list @testing-library/react

# 4. Ejecutar pruebas para verificar
npm test
```

## 📦 Dependencias Instaladas

### Backend

**Dependencias de Producción:**
```json
{
  "express": "^4.18.2",
  "pg": "^8.10.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2"
}
```

**Dependencias de Desarrollo (para tests):**
```json
{
  "nodemon": "^3.0.1",
  "jest": "^29.7.0",
  "supertest": "^6.3.3"
}
```

### Frontend

**Dependencias de Producción:**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.16.0",
  "axios": "^1.5.0",
  "lucide-react": "^0.263.1"
}
```

**Dependencias de Desarrollo (para tests):**
```json
{
  "react-scripts": "5.0.1",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.4",
  "@testing-library/user-event": "^14.5.1"
}
```

## ✅ Verificación de Instalación

### Backend

```bash
cd backend

# Verificar Jest
npm list jest
# Debería mostrar: jest@29.7.0

# Verificar Supertest
npm list supertest
# Debería mostrar: supertest@6.3.3

# Ejecutar una prueba
npm test -- auth.test.js
```

### Frontend

```bash
cd frontend

# Verificar React Testing Library
npm list @testing-library/react
# Debería mostrar: @testing-library/react@14.0.0

# Verificar Jest DOM
npm list @testing-library/jest-dom
# Debería mostrar: @testing-library/jest-dom@6.1.4

# Ejecutar una prueba
npm test -- api.test.js
```

## 🔧 Solución de Problemas

### Error: "npm: command not found"

**Solución:**
```bash
# Instalar Node.js desde https://nodejs.org/
# Luego verificar:
node --version
npm --version
```

### Error: "Cannot find module 'jest'"

**Solución:**
```bash
# Backend
cd backend
npm install --save-dev jest supertest

# Frontend
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Error: "EACCES: permission denied"

**Solución (Linux/Mac):**
```bash
sudo npm install
```

**O cambiar permisos:**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Error: "node_modules not found"

**Solución:**
```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Jest timeout"

**Solución:**
Aumentar timeout en `jest.config.js`:
```javascript
testTimeout: 20000  // 20 segundos
```

## 📊 Verificar Instalación Completa

### Script de Verificación

```bash
#!/bin/bash

echo "=== Verificando Backend ==="
cd backend
npm list jest supertest
npm test -- --listTests

echo ""
echo "=== Verificando Frontend ==="
cd ../frontend
npm list @testing-library/react @testing-library/jest-dom
npm test -- --listTests

echo ""
echo "✅ Instalación verificada"
```

## 🚀 Primeras Pruebas

### Backend - Primera Prueba

```bash
cd backend
npm test -- auth.test.js --verbose
```

**Salida esperada:**
```
 PASS  tests/auth.test.js
  Auth Routes
    POST /api/auth/login
      ✓ debería retornar token cuando las credenciales son correctas
      ✓ debería retornar error 401 cuando el usuario no existe
      ✓ debería retornar error 400 cuando faltan campos
    POST /api/auth/register
      ✓ debería crear un nuevo usuario
      ✓ debería retornar error si el usuario ya existe

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

### Frontend - Primera Prueba

```bash
cd frontend
npm test -- api.test.js --verbose
```

**Salida esperada:**
```
PASS  src/tests/api.test.js
  API Services
    usuariosService
      ✓ debería obtener lista de usuarios
      ✓ debería obtener usuario por ID
      ✓ debería crear nuevo usuario
      ✓ debería actualizar usuario
      ✓ debería eliminar usuario
    clientesService
      ✓ debería obtener lista de clientes
      ✓ debería crear nuevo cliente

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

## 📝 Configuración Adicional

### Agregar Scripts Personalizados

**Backend (package.json):**
```json
"scripts": {
  "test": "jest --detectOpenHandles",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
}
```

**Frontend (package.json):**
```json
"scripts": {
  "test": "react-scripts test",
  "test:coverage": "react-scripts test --coverage --watchAll=false"
}
```

### Configurar IDE

**VS Code - settings.json:**
```json
{
  "jest.runMode": "on-demand",
  "jest.showCoverageOnLoad": false,
  "jest.autoRun": false
}
```

## 🔐 Variables de Entorno

### Backend (.env)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=muhutravel
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 Recursos Útiles

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Node.js](https://nodejs.org/)

## ✨ Próximos Pasos

1. ✅ Instalar dependencias
2. ✅ Ejecutar pruebas
3. ✅ Verificar cobertura
4. ✅ Escribir nuevas pruebas
5. ✅ Integrar con CI/CD

## 📞 Soporte

Si tienes problemas:

1. Verifica que Node.js está instalado: `node --version`
2. Verifica que npm está actualizado: `npm --version`
3. Limpia caché: `npm cache clean --force`
4. Reinstala dependencias: `rm -rf node_modules && npm install`
5. Consulta la documentación en TESTS.md

---

**Última actualización:** 2025
**Versión:** 1.0
**Estado:** ✅ Listo para usar
