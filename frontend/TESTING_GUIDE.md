# Guía Completa de Pruebas - MuhuTravel Frontend

## 📋 Contenido

Este proyecto incluye dos tipos de pruebas automatizadas:

1. **Selenium IDE** - Pruebas exportables para navegador
2. **Serenity/JS** - Pruebas de aceptación con Cucumber

---

## 🌐 Selenium IDE Tests

### ¿Qué es Selenium IDE?

Selenium IDE es una extensión de navegador que permite grabar y ejecutar pruebas sin código. Los archivos `.side` son proyectos exportables que pueden ejecutarse en cualquier navegador.

### Ubicación de los archivos

```
frontend/selenium-tests/
├── login.side              # Pruebas de autenticación
├── dashboard.side          # Pruebas del dashboard
├── clientes.side           # Pruebas de gestión de clientes
├── paquetes.side           # Pruebas de gestión de paquetes
├── reservas.side           # Pruebas de gestión de reservas
├── reportes.side           # Pruebas de reportes
├── empleados.side          # Pruebas de gestión de empleados
├── proveedores.side        # Pruebas de gestión de proveedores
└── usuarios.side           # Pruebas de gestión de usuarios
```

### Instalación de Selenium IDE

1. **Chrome**: Descarga desde [Chrome Web Store](https://chromewebstore.google.com/detail/selenium-ide/mooikfkahbdckldjjfddbngbmjfldaie)
2. **Firefox**: Descarga desde [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/selenium-ide/)

### Ejecutar pruebas Selenium IDE

1. Abre Selenium IDE en tu navegador
2. Selecciona "Open an existing project"
3. Navega a `frontend/selenium-tests/` y selecciona un archivo `.side`
4. Haz clic en el botón "Run" (▶️) para ejecutar todas las pruebas
5. Visualiza los resultados en el panel de ejecución

### Pruebas disponibles

#### Login Tests (login.side)
- ✅ Login exitoso con credenciales válidas
- ✅ Login fallido con credenciales inválidas
- ✅ Validación de campos vacíos
- ✅ Login con credenciales de agente

#### Dashboard Tests (dashboard.side)
- ✅ Carga del dashboard
- ✅ Visualización de tarjetas KPI
- ✅ Botón de actualización
- ✅ Renderizado de gráficos

#### Clientes Tests (clientes.side)
- ✅ Carga de lista de clientes
- ✅ Búsqueda de clientes
- ✅ Agregar nuevo cliente
- ✅ Editar cliente existente
- ✅ Imprimir reporte

#### Paquetes Tests (paquetes.side)
- ✅ Carga de lista de paquetes
- ✅ Búsqueda de paquetes
- ✅ Agregar nuevo paquete
- ✅ Editar paquete existente
- ✅ Ver paquetes inactivos

#### Reservas Tests (reservas.side)
- ✅ Carga de lista de reservas
- ✅ Búsqueda de reservas
- ✅ Agregar nueva reserva
- ✅ Ver detalles de reserva
- ✅ Filtrar por estado

#### Reportes Tests (reportes.side)
- ✅ Carga de página de reportes
- ✅ Pestaña de ventas
- ✅ Pestaña de pendientes
- ✅ Pestaña de clientes
- ✅ Filtrar por rango de fechas

#### Empleados Tests (empleados.side)
- ✅ Carga de lista de empleados
- ✅ Búsqueda de empleados
- ✅ Agregar nuevo empleado
- ✅ Editar empleado existente

#### Proveedores Tests (proveedores.side)
- ✅ Carga de lista de proveedores
- ✅ Búsqueda de proveedores
- ✅ Agregar nuevo proveedor
- ✅ Editar proveedor existente

#### Usuarios Tests (usuarios.side)
- ✅ Carga de lista de usuarios
- ✅ Búsqueda de usuarios
- ✅ Agregar nuevo usuario
- ✅ Editar usuario existente

---

## 🎭 Serenity/JS Tests

### ¿Qué es Serenity/JS?

Serenity/JS es un framework de pruebas de aceptación que combina Cucumber (BDD) con WebdriverIO para pruebas automatizadas profesionales.

### Instalación

1. **Actualiza package.json**:
   ```bash
   # Copia el contenido de SERENITY_PACKAGE_JSON.json a package.json
   cp SERENITY_PACKAGE_JSON.json package.json
   ```

2. **Instala dependencias**:
   ```bash
   npm install
   ```

3. **Verifica la instalación**:
   ```bash
   npm run serenity:test -- --version
   ```

### Estructura de Serenity

```
frontend/
├── serenity/
│   ├── features/              # Archivos .feature (Gherkin)
│   │   ├── login.feature
│   │   ├── dashboard.feature
│   │   ├── clientes.feature
│   │   ├── paquetes.feature
│   │   ├── reservas.feature
│   │   ├── reportes.feature
│   │   ├── empleados.feature
│   │   ├── proveedores.feature
│   │   └── usuarios.feature
│   └── step-definitions/      # Implementación de pasos
│       ├── login.steps.ts
│       ├── dashboard.steps.ts
│       └── ... (otros pasos)
├── serenity.config.ts         # Configuración de WebdriverIO
└── package.json               # Dependencias (actualizado)
```

### Ejecutar pruebas Serenity

```bash
# Ejecutar todas las pruebas
npm run serenity:test

# Ejecutar pruebas específicas
npm run serenity:test -- --spec serenity/features/login.feature

# Ejecutar en modo debug
npm run serenity:test:debug

# Ejecutar en Chrome
npm run serenity:test:chrome

# Ejecutar en Firefox
npm run serenity:test:firefox
```

### Archivos Feature (Gherkin)

Los archivos `.feature` describen el comportamiento esperado en lenguaje natural:

```gherkin
Feature: Login Functionality
  As a user
  I want to be able to login
  So that I can access the dashboard

  Scenario: Successful login
    Given the user is on the login page
    When the user enters username "admin"
    And the user enters password "hash123"
    And the user clicks the login button
    Then the user should be redirected to the dashboard
```

### Step Definitions

Los archivos `.steps.ts` implementan los pasos definidos en Gherkin:

```typescript
Given('the user is on the login page', async () => {
  await browser.url('http://localhost:3000/login');
});

When('the user enters username {string}', async (username: string) => {
  const input = await $('#username');
  await input.setValue(username);
});
```

---

## 🔐 Credenciales de Prueba

```
Admin:
  Usuario: admin
  Contraseña: hash123

Agente:
  Usuario: agente1
  Contraseña: hash123
```

---

## 📊 Reportes

### Serenity/JS

Los reportes se generan automáticamente en:
- `target/` - Reportes HTML
- `allure-report/` - Reportes Allure (si está configurado)

### Selenium IDE

Los resultados se muestran en tiempo real en la interfaz de Selenium IDE.

---

## ⚙️ Configuración

### Serenity Config (serenity.config.ts)

```typescript
{
  baseUrl: 'http://localhost:3000',
  waitforTimeout: 10000,
  framework: 'cucumber',
  specs: ['./serenity/features/**/*.feature'],
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    }
  }]
}
```

---

## 🚀 Flujo de Trabajo Recomendado

### 1. Desarrollo Local
```bash
# Terminal 1: Inicia el backend
cd backend && npm start

# Terminal 2: Inicia el frontend
cd frontend && npm start

# Terminal 3: Ejecuta pruebas Serenity
npm run serenity:test
```

### 2. Pruebas en CI/CD
```bash
# En tu pipeline CI/CD
npm install
npm run serenity:test
npm run cypress:run
```

### 3. Pruebas Manuales con Selenium IDE
1. Abre Selenium IDE
2. Carga un archivo `.side`
3. Ejecuta las pruebas
4. Revisa los resultados

---

## 🐛 Troubleshooting

### Las pruebas no encuentran elementos

**Problema**: Los selectores CSS no funcionan

**Solución**:
1. Abre DevTools (F12)
2. Inspecciona el elemento
3. Copia el selector CSS
4. Actualiza el step definition

### Timeout en las pruebas

**Problema**: Las pruebas se cuelgan

**Solución**:
1. Aumenta `waitforTimeout` en `serenity.config.ts`
2. Verifica que el servidor esté corriendo
3. Revisa la consola del navegador

### Errores de autenticación

**Problema**: Las pruebas fallan en login

**Solución**:
1. Verifica las credenciales en los step definitions
2. Asegúrate de que el backend esté corriendo
3. Limpia `sessionStorage` antes de las pruebas

---

## 📚 Recursos Adicionales

- [Selenium IDE Docs](https://www.selenium.dev/selenium-ide/)
- [Serenity/JS Docs](https://serenity-js.org/)
- [Cucumber Docs](https://cucumber.io/docs/cucumber/)
- [WebdriverIO Docs](https://webdriver.io/docs/gettingstarted/)

---

## 📝 Notas Importantes

- ✅ Asegúrate de que el frontend esté corriendo en `http://localhost:3000`
- ✅ Las pruebas de Serenity requieren Node.js 14+
- ✅ Selenium IDE funciona en Chrome y Firefox
- ✅ Los archivos `.side` son independientes y no requieren instalación
- ✅ Las pruebas están diseñadas para ser independientes del estado anterior

---

## 🎯 Próximos Pasos

1. ✅ Instala Selenium IDE en tu navegador
2. ✅ Abre un archivo `.side` y ejecuta las pruebas
3. ✅ Actualiza `package.json` con las dependencias de Serenity
4. ✅ Ejecuta `npm run serenity:test`
5. ✅ Revisa los reportes generados

¡Listo para probar! 🚀
