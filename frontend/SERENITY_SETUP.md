# Serenity/JS Setup Guide

## Instalación de Serenity/JS

Para instalar Serenity/JS y sus dependencias, ejecuta los siguientes comandos:

```bash
cd frontend

# Instalar Serenity/JS con WebdriverIO
npm install --save-dev @serenity-js/core @serenity-js/webdriverio @serenity-js/cucumber @serenity-js/assertions

# Instalar WebdriverIO y sus dependencias
npm install --save-dev webdriverio @wdio/cli @wdio/local-runner @wdio/spec-reporter

# Instalar Cucumber
npm install --save-dev @cucumber/cucumber

# Instalar TypeScript y tipos
npm install --save-dev typescript @types/node ts-node

# Instalar Chromedriver para pruebas
npm install --save-dev chromedriver
```

## Estructura de Archivos

```
frontend/
├── serenity/
│   ├── features/
│   │   ├── login.feature
│   │   ├── dashboard.feature
│   │   ├── clientes.feature
│   │   ├── paquetes.feature
│   │   ├── reservas.feature
│   │   ├── reportes.feature
│   │   ├── empleados.feature
│   │   ├── proveedores.feature
│   │   └── usuarios.feature
│   └── step-definitions/
│       ├── login.steps.ts
│       ├── dashboard.steps.ts
│       └── ... (otros step definitions)
├── serenity.config.ts
└── package.json
```

## Ejecutar Pruebas de Aceptación

### Ejecutar todas las pruebas
```bash
npm run serenity:test
```

### Ejecutar pruebas específicas
```bash
npm run serenity:test -- --spec serenity/features/login.feature
```

### Ejecutar con reporte HTML
```bash
npm run serenity:test -- --reporter html
```

## Archivos Selenium IDE

Los archivos Selenium IDE (.side) están disponibles en:
```
frontend/selenium-tests/
├── login.side
├── dashboard.side
├── clientes.side
├── paquetes.side
├── reservas.side
├── reportes.side
├── empleados.side
├── proveedores.side
└── usuarios.side
```

### Usar Selenium IDE

1. Instala la extensión Selenium IDE en Chrome o Firefox
2. Abre Selenium IDE
3. Selecciona "Open an existing project"
4. Navega a `frontend/selenium-tests/` y selecciona un archivo `.side`
5. Haz clic en "Run" para ejecutar las pruebas

## Configuración de WebdriverIO

El archivo `serenity.config.ts` contiene la configuración para:
- Navegador: Chrome
- Base URL: http://localhost:3000
- Timeout: 10 segundos
- Framework: Cucumber
- Reporters: Spec y Serenity/JS

## Notas Importantes

- Asegúrate de que el frontend esté corriendo en `http://localhost:3000`
- Las pruebas usan credenciales de prueba: `admin/hash123` y `agente1/hash123`
- Los archivos `.side` pueden ejecutarse directamente en Selenium IDE sin instalación adicional
- Las pruebas de Serenity requieren Node.js y npm instalados

## Próximos Pasos

1. Instala las dependencias: `npm install`
2. Actualiza el `package.json` con los scripts de Serenity
3. Ejecuta las pruebas: `npm run serenity:test`
4. Revisa los reportes en `target/` o `allure-report/`
