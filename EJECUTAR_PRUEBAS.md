# 🚀 Guía para Ejecutar Pruebas de Sistema

## 📋 Resumen Rápido

```bash
# Pruebas Backend
cd backend && npm test

# Pruebas Frontend
cd frontend && npm test

# Pruebas E2E
cd frontend && npm run cypress:run

# Todo junto
npm run test:all  # Si está configurado
```

---

## 🧪 Pruebas Unitarias (Backend)

### Ejecutar todas las pruebas unitarias

```bash
cd backend
npm test
```

### Ejecutar pruebas específicas

**Pruebas de Comunicación:**
```bash
npm test -- tests/comunicacion.test.js
```

**Pruebas de Autenticación:**
```bash
npm test -- tests/auth.test.js
```

**Pruebas de Usuarios:**
```bash
npm test -- tests/usuarios.test.js
```

**Pruebas de Clientes:**
```bash
npm test -- tests/clientes.test.js
```

**Pruebas de Middleware:**
```bash
npm test -- tests/middleware.test.js
```

### Modo Watch (Ejecutar automáticamente al cambiar archivos)

```bash
npm test -- --watch
```

### Con Cobertura

```bash
npm test -- --coverage
```

---

## 🔗 Pruebas de Integración (Backend)

### Ejecutar todas las pruebas de integración

```bash
cd backend
npm test -- integracion/
```

### Ejecutar prueba específica

**Integración de Comunicación:**
```bash
npm test -- integracion/comunicacion.integration.test.js
```

**Integración de CRUD:**
```bash
npm test -- integracion/crud.integration.test.js
```

**Integración de Autenticación:**
```bash
npm test -- integracion/auth.integration.test.js
```

---

## ⚡ Pruebas de Performance

### Ejecutar pruebas de performance

```bash
cd backend
npm test -- tests/performance.test.js
```

### Con reporte detallado

```bash
npm test -- tests/performance.test.js --verbose
```

---

## 🎯 Pruebas E2E (Frontend)

### Modo Interactivo (Recomendado para desarrollo)

```bash
cd frontend
npm run cypress:open
```

Luego selecciona:
- `comunicacion-completo.cy.js` - Pruebas del Centro de Comunicación
- `login.cy.js` - Pruebas de Login
- `dashboard.cy.js` - Pruebas del Dashboard
- `crud.cy.js` - Pruebas CRUD

### Modo Headless (Para CI/CD)

```bash
cd frontend
npm run cypress:run
```

### Ejecutar prueba específica

```bash
npm run cypress:run -- --spec "cypress/e2e/comunicacion-completo.cy.js"
```

### Con reporte de video

```bash
npm run cypress:run -- --record
```

---

## 🧪 Pruebas Frontend (Jest)

### Ejecutar todas las pruebas

```bash
cd frontend
npm test
```

### Ejecutar pruebas específicas

**Pruebas de Componentes:**
```bash
npm test -- src/tests/components.test.js
```

**Pruebas de Páginas:**
```bash
npm test -- src/tests/pages.test.js
```

**Pruebas de API:**
```bash
npm test -- src/tests/api.test.js
```

**Pruebas de Inactivos:**
```bash
npm test -- src/tests/inactivos.test.js
```

### Modo Watch

```bash
npm test -- --watch
```

### Con Cobertura

```bash
npm test -- --coverage
```

---

## 📊 Ejecutar Todas las Pruebas

### Opción 1: Secuencial

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
npm run cypress:run
```

### Opción 2: Paralelo (si está configurado)

```bash
npm run test:all
```

---

## 📈 Generar Reportes

### Reporte de Cobertura (Backend)

```bash
cd backend
npm test -- --coverage
# Abre: coverage/lcov-report/index.html
```

### Reporte de Cobertura (Frontend)

```bash
cd frontend
npm test -- --coverage
# Abre: coverage/lcov-report/index.html
```

### Reporte de Cypress

```bash
cd frontend
npm run cypress:run -- --reporter html
# Abre: cypress/reports/index.html
```

---

## 🔍 Debugging

### Ejecutar prueba con debugging

```bash
cd backend
node --inspect-brk ./node_modules/.bin/jest tests/comunicacion.test.js
```

Luego abre: `chrome://inspect`

### Ejecutar Cypress con debugging

```bash
cd frontend
npm run cypress:open
# Abre la consola del navegador (F12)
```

---

## ✅ Checklist de Pruebas

### Antes de Hacer Commit

```bash
# 1. Ejecutar pruebas unitarias
cd backend && npm test

# 2. Ejecutar pruebas de integración
npm test -- integracion/

# 3. Ejecutar pruebas frontend
cd ../frontend && npm test

# 4. Ejecutar pruebas E2E (opcional)
npm run cypress:run
```

### Antes de Hacer Deploy

```bash
# 1. Todas las pruebas deben pasar
cd backend && npm test
cd ../frontend && npm test

# 2. Cobertura debe ser > 80%
npm test -- --coverage

# 3. Pruebas E2E deben pasar
npm run cypress:run

# 4. No debe haber warnings
npm run lint
```

---

## 🐛 Solución de Problemas

### Las pruebas no encuentran módulos

```bash
# Reinstalar dependencias
cd backend
npm install

cd ../frontend
npm install
```

### Error: "Cannot find module 'jest'"

```bash
npm install --save-dev jest
```

### Error: "Cannot find module 'supertest'"

```bash
npm install --save-dev supertest
```

### Cypress no abre

```bash
# Limpiar caché
rm -rf ~/.cache/Cypress

# Reinstalar
npm install --save-dev cypress
npm run cypress:open
```

### Pruebas lentas

```bash
# Ejecutar solo pruebas rápidas
npm test -- --testPathPattern="tests/"

# Excluir pruebas de integración
npm test -- --testPathIgnorePatterns="integracion/"
```

---

## 📊 Métricas Esperadas

### Cobertura

```
Backend:
  Statements: > 80%
  Branches: > 75%
  Functions: > 80%
  Lines: > 80%

Frontend:
  Statements: > 70%
  Branches: > 65%
  Functions: > 70%
  Lines: > 70%
```

### Tiempo de Ejecución

```
Unitarias: < 5 segundos
Integración: < 15 segundos
Performance: < 10 segundos
E2E: < 2 minutos
Total: < 3 minutos
```

### Tasa de Éxito

```
Todas las pruebas: 100%
```

---

## 🔄 Integración Continua (CI/CD)

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Backend Tests
        run: |
          cd backend
          npm install
          npm test
      
      - name: Frontend Tests
        run: |
          cd frontend
          npm install
          npm test
      
      - name: E2E Tests
        run: |
          cd frontend
          npm run cypress:run
```

---

## 📚 Documentación Adicional

- `PRUEBAS_SISTEMA_COMPLETAS.md` - Descripción detallada de todas las pruebas
- `backend/tests/` - Pruebas unitarias
- `backend/integracion/` - Pruebas de integración
- `frontend/cypress/e2e/` - Pruebas E2E

---

## ✨ Comandos Útiles

```bash
# Ejecutar pruebas y generar reporte
npm test -- --coverage --reporters=default --reporters=jest-junit

# Ejecutar pruebas en paralelo
npm test -- --maxWorkers=4

# Ejecutar solo pruebas que fallaron
npm test -- --onlyChanged

# Ejecutar pruebas con patrón específico
npm test -- --testNamePattern="debe"

# Limpiar caché de Jest
npm test -- --clearCache
```

---

**Última actualización:** 20 de Noviembre de 2025  
**Estado:** ✅ LISTO PARA USAR
