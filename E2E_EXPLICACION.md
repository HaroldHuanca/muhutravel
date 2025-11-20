# Pruebas E2E con Cypress - MuhuTravel

## 📋 ¿Qué son las Pruebas E2E?

Las pruebas **End-to-End (E2E)** prueban la aplicación completa desde la perspectiva del usuario, simulando interacciones reales en el navegador.

---

## 🏗️ Estructura de Pruebas E2E

```
frontend/
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js           (Pruebas de login)
│   │   ├── crud.cy.js            (Pruebas CRUD)
│   │   ├── navegacion.cy.js      (Pruebas de navegación)
│   │   └── inactivos.cy.js       (Pruebas de inactivos)
│   └── support/
│       └── e2e.js                (Soporte y comandos)
├── cypress.config.js             (Configuración)
└── package.json                  (Scripts)
```

---

## 🧪 Pruebas E2E Implementadas

### 1. login.cy.js (6 pruebas)

**Flujo de Login:**
- ✅ Mostrar página de login
- ✅ Error con credenciales vacías
- ✅ Error con credenciales incorrectas
- ✅ Login exitoso
- ✅ Guardar token en localStorage
- ✅ Mostrar nombre de usuario en header

### 2. crud.cy.js (14 pruebas)

**Flujo de Lectura:**
- ✅ Navegar a página de clientes
- ✅ Mostrar lista de clientes
- ✅ Permitir buscar cliente

**Flujo de Creación:**
- ✅ Navegar a crear nuevo cliente
- ✅ Mostrar formulario de creación
- ✅ Validar campos requeridos

**Flujo de Actualización:**
- ✅ Permitir editar cliente
- ✅ Permitir actualizar datos

**Flujo de Eliminación:**
- ✅ Mostrar botón eliminar
- ✅ Confirmar antes de eliminar
- ✅ Permitir cancelar eliminación

**Flujo de Búsqueda:**
- ✅ Filtrar por búsqueda
- ✅ Limpiar búsqueda

### 3. navegacion.cy.js (11 pruebas)

**Navegación Entre Páginas:**
- ✅ Navegar a Dashboard
- ✅ Navegar a Clientes
- ✅ Navegar a Empleados
- ✅ Navegar a Proveedores
- ✅ Navegar a Paquetes
- ✅ Navegar a Reservas
- ✅ Navegar a Usuarios
- ✅ Mostrar header en todas las páginas
- ✅ Permitir logout
- ✅ Redirigir a login si no hay token

### 4. inactivos.cy.js (12 pruebas)

**Flujo de Ver Inactivos:**
- ✅ Mostrar botón Ver Inactivos en Clientes
- ✅ Navegar a página de inactivos
- ✅ Mostrar lista de inactivos
- ✅ Permitir buscar en inactivos

**Flujo de Reactivar:**
- ✅ Mostrar botón Reactivar
- ✅ Permitir reactivar cliente
- ✅ Volver a Clientes desde Inactivos

**Flujo en Otras Entidades:**
- ✅ Ver Inactivos en Empleados
- ✅ Ver Inactivos en Proveedores
- ✅ Ver Inactivos en Paquetes
- ✅ Ver Inactivos en Usuarios

**Flujo Completo:**
- ✅ Desactivar → Ver Inactivos → Reactivar

---

## 🚀 Cómo Ejecutar Pruebas E2E

### Requisitos
- Backend corriendo en `http://localhost:5000`
- Frontend corriendo en `http://localhost:3000`

### Abrir Cypress (Modo Interactivo)
```bash
cd frontend
npm run cypress:open
```

### Ejecutar Pruebas E2E (Modo Headless)
```bash
cd frontend
npm run cypress:run
# o
npm run e2e
```

### Ejecutar Pruebas Específicas
```bash
# Solo login
npx cypress run --spec "cypress/e2e/login.cy.js"

# Solo CRUD
npx cypress run --spec "cypress/e2e/crud.cy.js"

# Solo navegación
npx cypress run --spec "cypress/e2e/navegacion.cy.js"

# Solo inactivos
npx cypress run --spec "cypress/e2e/inactivos.cy.js"
```

---

## 📝 Ejemplos de Pruebas E2E

### Ejemplo 1: Login
```javascript
it('debería permitir login con credenciales correctas', () => {
  cy.get('input[type="text"]').type('admin');
  cy.get('input[type="password"]').type('hash123');
  cy.get('button').contains('Login').click();
  
  cy.url().should('include', '/dashboard');
  cy.contains('Dashboard').should('exist');
});
```

### Ejemplo 2: CRUD
```javascript
it('debería permitir editar cliente', () => {
  cy.contains('Clientes').click();
  cy.get('tbody tr').first().within(() => {
    cy.contains('Editar').click();
  });
  
  cy.url().should('include', '/clientes/');
  cy.get('input[placeholder*="Nombres"]').should('have.value');
});
```

### Ejemplo 3: Navegación
```javascript
it('debería mostrar header en todas las páginas', () => {
  const pages = ['clientes', 'empleados', 'proveedores'];
  
  pages.forEach(page => {
    cy.contains(page.charAt(0).toUpperCase() + page.slice(1)).click();
    cy.get('header').should('exist');
  });
});
```

### Ejemplo 4: Inactivos
```javascript
it('debería completar ciclo de desactivación y reactivación', () => {
  cy.contains('Clientes').click();
  cy.get('tbody tr').first().within(() => {
    cy.contains('Eliminar').click();
  });
  cy.contains('Aceptar').click();
  
  cy.contains('Ver Inactivos').click();
  cy.get('tbody tr').first().within(() => {
    cy.contains('Reactivar').click();
  });
  
  cy.contains('reactivado').should('exist');
});
```

---

## 🔧 Comandos Personalizados

Se han creado comandos personalizados en `cypress/support/e2e.js`:

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

## 📊 Resumen de Pruebas E2E

```
login.cy.js:       6 pruebas ✅
crud.cy.js:        14 pruebas ✅
navegacion.cy.js:  11 pruebas ✅
inactivos.cy.js:   12 pruebas ✅

TOTAL E2E: 43 pruebas ✅
```

---

## 🎯 Diferencias: Unitarias vs Integración vs E2E

| Aspecto | Unitarias | Integración | E2E |
|---------|-----------|------------|-----|
| **Alcance** | Una unidad | Múltiples componentes | Aplicación completa |
| **Navegador** | No | No | Sí |
| **Usuario** | No | No | Sí |
| **Velocidad** | Muy rápida | Rápida | Lenta |
| **Confiabilidad** | Alta | Media | Muy Alta |
| **Cobertura** | Específica | General | Completa |
| **Mantenimiento** | Fácil | Medio | Difícil |

---

## ✨ Características de Cypress

### ✅ Ventajas
- Ejecuta en el navegador real
- Debugging interactivo
- Screenshots automáticos
- Manejo de async/await
- Comandos personalizados
- Esperas automáticas

### ⚠️ Limitaciones
- Solo JavaScript
- Un navegador a la vez
- Requiere servidor corriendo
- Más lento que unitarias

---

## 🚀 Próximos Pasos

1. ✅ Pruebas unitarias
2. ✅ Pruebas de integración
3. ✅ Pruebas E2E
4. ⏳ CI/CD integration
5. ⏳ Pruebas de rendimiento

---

## 📚 Documentación Relacionada

- `PRUEBAS_EXPLICACION.md` - Explicación general
- `TESTS.md` - Pruebas unitarias
- `INTEGRACION_EXPLICACION.md` - Pruebas de integración
- `RESUMEN_FINAL_TESTS.md` - Resumen final

---

## 🔍 Verificación

Para verificar que todo funciona:

```bash
# 1. Iniciar backend
cd backend && npm run dev

# 2. En otra terminal, iniciar frontend
cd frontend && npm start

# 3. En otra terminal, ejecutar E2E
cd frontend && npm run cypress:run
```

---

**Última actualización:** 2025
**Versión:** 1.0
**Estado:** ✅ COMPLETO
