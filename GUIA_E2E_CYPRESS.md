# Guía Completa - Pruebas E2E con Cypress

## ⚠️ Requisitos Importantes

**Las pruebas E2E con Cypress NECESITAN que el frontend esté corriendo.**

Esto es diferente a las pruebas unitarias e integración que NO necesitan servidor.

---

## 🚀 Cómo Ejecutar Pruebas E2E

### Opción 1: Ejecución Manual (Recomendado para desarrollo)

#### Paso 1: Iniciar Backend
```bash
cd backend
npm run dev
# Esperar hasta ver: "Servidor ejecutándose en puerto 5000"
```

#### Paso 2: En otra terminal, iniciar Frontend
```bash
cd frontend
npm start
# Esperar hasta ver: "Compiled successfully!"
# Y que esté disponible en http://localhost:3000
```

#### Paso 3: En otra terminal, abrir Cypress
```bash
cd frontend
npm run cypress:open
```

**Resultado:** Se abrirá la interfaz de Cypress donde puedes:
- Ver todos los tests
- Ejecutarlos uno por uno
- Hacer debugging interactivo
- Ver screenshots

---

### Opción 2: Ejecución Headless (Para CI/CD)

#### Paso 1: Iniciar Backend
```bash
cd backend
npm run dev &
```

#### Paso 2: Iniciar Frontend
```bash
cd frontend
npm start &
```

#### Paso 3: Esperar a que estén listos (5-10 segundos)

#### Paso 4: Ejecutar Cypress en headless
```bash
cd frontend
npm run cypress:run
# o
npm run e2e
```

**Resultado:** Los tests se ejecutarán automáticamente sin interfaz gráfica

---

## 🔍 Solución de Problemas

### Problema 1: "Cannot read properties of undefined"
**Causa:** El frontend no está corriendo
**Solución:** Asegúrate de que `npm start` esté ejecutándose en el frontend

### Problema 2: "Connection refused"
**Causa:** El backend no está corriendo
**Solución:** Asegúrate de que `npm run dev` esté ejecutándose en el backend

### Problema 3: "Port 3000 already in use"
**Causa:** Ya hay algo corriendo en puerto 3000
**Solución:** 
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O cambiar puerto en frontend
PORT=3001 npm start
```

### Problema 4: "Port 5000 already in use"
**Causa:** Ya hay algo corriendo en puerto 5000
**Solución:**
```bash
# Matar proceso en puerto 5000
lsof -ti:5000 | xargs kill -9

# O cambiar puerto en backend .env
PORT=5001
```

---

## 📊 Diferencia: Pruebas Unitarias vs E2E

| Aspecto | Unitarias | E2E |
|---------|-----------|-----|
| **Necesita servidor** | NO | SÍ |
| **Necesita frontend** | NO | SÍ |
| **Necesita backend** | NO | SÍ |
| **Velocidad** | < 2 segundos | ~30 segundos |
| **Ejecución** | `npm test` | `npm run cypress:run` |

---

## ✅ Checklist antes de ejecutar E2E

- [ ] Backend corriendo en `http://localhost:5000`
- [ ] Frontend corriendo en `http://localhost:3000`
- [ ] Cypress instalado (`npm install cypress`)
- [ ] Archivos de prueba en `cypress/e2e/`
- [ ] Configuración en `cypress.config.js`

---

## 🎯 Comandos Disponibles

```bash
# Abrir Cypress (interfaz gráfica)
npm run cypress:open

# Ejecutar pruebas (headless)
npm run cypress:run

# Alias para cypress:run
npm run e2e

# Ejecutar prueba específica
npx cypress run --spec "cypress/e2e/login.cy.js"

# Ejecutar con navegador específico
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

---

## 📝 Estructura de Pruebas E2E

```
cypress/
├── e2e/
│   ├── login.cy.js           (6 pruebas)
│   ├── crud.cy.js            (14 pruebas)
│   ├── navegacion.cy.js      (11 pruebas)
│   └── inactivos.cy.js       (12 pruebas)
├── support/
│   └── e2e.js                (Comandos personalizados)
└── fixtures/                 (Datos de prueba)
```

---

## 🔧 Comandos Personalizados

En `cypress/support/e2e.js` hay comandos personalizados:

```javascript
// Login
cy.login('admin', 'hash123');

// Logout
cy.logout();

// Navegar
cy.navigateTo('Clientes');

// Buscar
cy.searchFor('Juan');

// Limpiar búsqueda
cy.clearSearch();
```

---

## 📊 Pruebas Disponibles

### login.cy.js (6 pruebas)
- Mostrar página de login
- Error con credenciales vacías
- Error con credenciales incorrectas
- Login exitoso
- Token en localStorage
- Nombre de usuario en header

### crud.cy.js (14 pruebas)
- Lectura: Navegar, listar, buscar
- Creación: Formulario, validación
- Actualización: Editar datos
- Eliminación: Confirmar, cancelar
- Búsqueda: Filtrar, limpiar

### navegacion.cy.js (11 pruebas)
- Navegar a todas las páginas
- Header en todas las páginas
- Logout
- Protección de rutas

### inactivos.cy.js (12 pruebas)
- Ver inactivos
- Reactivar registros
- Búsqueda en inactivos
- Ciclo completo

---

## 🚀 Flujo Completo Recomendado

### Para Desarrollo
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start

# Terminal 3: Cypress (cuando esté listo)
cd frontend && npm run cypress:open
```

### Para CI/CD
```bash
# Iniciar servicios
npm run dev &
npm start &

# Esperar 10 segundos
sleep 10

# Ejecutar pruebas
npm run cypress:run
```

---

## 💡 Tips

1. **Usa `npm run cypress:open` para desarrollo** - Puedes ver los tests en tiempo real
2. **Usa `npm run cypress:run` para CI/CD** - Más rápido y automatizado
3. **Verifica que los puertos sean correctos** - 3000 para frontend, 5000 para backend
4. **Limpia localStorage entre tests** - Ya está configurado en `e2e.js`
5. **Usa comandos personalizados** - Hacen los tests más legibles

---

## ❌ Errores Comunes

### Error: "Cannot find module 'cypress'"
```bash
npm install cypress --save-dev
```

### Error: "Port 3000 already in use"
```bash
# Matar proceso
lsof -ti:3000 | xargs kill -9
```

### Error: "Connection refused"
Asegúrate de que:
- Backend está corriendo en puerto 5000
- Frontend está corriendo en puerto 3000

### Error: "Timeout"
Aumenta el timeout en `cypress.config.js`:
```javascript
defaultCommandTimeout: 15000  // 15 segundos
```

---

## 📚 Documentación Relacionada

- `E2E_EXPLICACION.md` - Explicación técnica de E2E
- `RESUMEN_COMPLETO_TESTS.md` - Resumen de todas las pruebas
- `cypress.config.js` - Configuración de Cypress

---

## ✅ Verificación

Para verificar que todo funciona:

```bash
# 1. Verificar que Cypress está instalado
npm list cypress

# 2. Verificar que los archivos existen
ls cypress/e2e/
ls cypress/support/

# 3. Verificar configuración
cat cypress.config.js
```

---

## 🎯 Resumen

**Pruebas E2E SÍ necesitan:**
- ✅ Frontend corriendo en `http://localhost:3000`
- ✅ Backend corriendo en `http://localhost:5000`
- ✅ Cypress instalado

**Pruebas Unitarias NO necesitan:**
- ❌ Frontend corriendo
- ❌ Backend corriendo
- ✅ Solo `npm test`

---

**Última actualización:** 2025
**Versión:** 1.0
**Estado:** ✅ COMPLETO
