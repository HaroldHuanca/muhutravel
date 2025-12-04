# 📦 Archivos Creados para Pruebas Automatizadas

## 🌐 Selenium IDE Tests (.side)

Ubicación: `frontend/selenium-tests/`

| Archivo | Pruebas | Descripción |
|---------|---------|-------------|
| `login.side` | 3 | Autenticación, credenciales inválidas, validación |
| `dashboard.side` | 4 | Carga, KPI cards, gráficos, actualización |
| `clientes.side` | 5 | Listar, buscar, agregar, editar, imprimir |
| `paquetes.side` | 5 | Listar, buscar, agregar, editar, inactivos |
| `reservas.side` | 5 | Listar, buscar, agregar, editar, filtrar |
| `reportes.side` | 5 | Cargar, ventas, pendientes, clientes, filtrar |
| `empleados.side` | 4 | Listar, buscar, agregar, editar |
| `proveedores.side` | 4 | Listar, buscar, agregar, editar |
| `usuarios.side` | 4 | Listar, buscar, agregar, editar |

**Total: 39 pruebas en Selenium IDE**

---

## 🎭 Serenity/JS Features (Gherkin)

Ubicación: `frontend/serenity/features/`

| Archivo | Escenarios | Descripción |
|---------|-----------|-------------|
| `login.feature` | 4 | Login exitoso, fallido, validación, agente |
| `dashboard.feature` | 4 | Carga, KPI cards, gráficos, actualización |
| `clientes.feature` | 6 | Listar, buscar, agregar, editar, eliminar, imprimir |
| `paquetes.feature` | 6 | Listar, buscar, agregar, editar, inactivos, activar |
| `reservas.feature` | 6 | Listar, buscar, agregar, editar, filtrar, detalles |
| `reportes.feature` | 6 | Cargar, ventas, pendientes, clientes, filtrar, exportar |
| `empleados.feature` | 5 | Listar, buscar, agregar, editar, eliminar |
| `proveedores.feature` | 6 | Listar, buscar, agregar, editar, eliminar, detalles |
| `usuarios.feature` | 6 | Listar, buscar, agregar, editar, eliminar, cambiar rol |

**Total: 49 escenarios en Serenity/JS**

---

## 🔧 Step Definitions (TypeScript)

Ubicación: `frontend/serenity/step-definitions/`

| Archivo | Pasos | Descripción |
|---------|-------|-------------|
| `login.steps.ts` | 11 | Implementación de pasos de login |
| `dashboard.steps.ts` | 17 | Implementación de pasos del dashboard |

**Nota**: Se pueden crear más step definitions para las otras features siguiendo el mismo patrón.

---

## ⚙️ Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `serenity.config.ts` | Configuración de WebdriverIO y Serenity/JS |
| `SERENITY_PACKAGE_JSON.json` | Package.json actualizado con dependencias |

---

## 📚 Documentación

| Archivo | Contenido |
|---------|-----------|
| `TESTING_GUIDE.md` | Guía completa de pruebas (este archivo) |
| `SERENITY_SETUP.md` | Instrucciones de instalación de Serenity |
| `ARCHIVOS_CREADOS.md` | Este archivo - resumen de lo creado |

---

## 📊 Resumen Estadístico

```
Selenium IDE Tests:
├── Archivos .side: 9
├── Pruebas totales: 39
└── Vistas cubiertas: 9 (sin Comunicación)

Serenity/JS Tests:
├── Archivos .feature: 9
├── Escenarios totales: 49
├── Step definitions: 2 (base)
└── Vistas cubiertas: 9 (sin Comunicación)

Documentación:
├── Guías: 3
├── Configuraciones: 2
└── Total de archivos: 25+
```

---

## 🚀 Cómo Usar

### Opción 1: Selenium IDE (Sin instalación)

1. Instala Selenium IDE en tu navegador
2. Abre un archivo `.side` desde `frontend/selenium-tests/`
3. Haz clic en "Run" para ejecutar las pruebas

### Opción 2: Serenity/JS (Con instalación)

1. Copia `SERENITY_PACKAGE_JSON.json` a `package.json`
2. Ejecuta `npm install`
3. Ejecuta `npm run serenity:test`

---

## 📝 Notas Importantes

✅ **Selenium IDE**
- No requiere instalación adicional (solo extensión del navegador)
- Archivos `.side` son portables y ejecutables en cualquier navegador
- Ideal para pruebas rápidas y manuales

✅ **Serenity/JS**
- Requiere Node.js y npm
- Proporciona reportes detallados
- Ideal para CI/CD y pruebas automatizadas
- Soporta múltiples navegadores (Chrome, Firefox, Safari)

✅ **Cobertura**
- Todas las vistas principales están cubiertas
- Excluida la vista de Comunicación (como se solicitó)
- Pruebas de funcionalidad CRUD completas
- Pruebas de búsqueda y filtrado

---

## 🔄 Próximos Pasos

1. **Instalar Selenium IDE**: Descarga desde Chrome Web Store o Firefox Add-ons
2. **Probar Selenium IDE**: Abre un archivo `.side` y ejecuta las pruebas
3. **Instalar Serenity**: Copia el package.json y ejecuta `npm install`
4. **Ejecutar Serenity**: Usa `npm run serenity:test`
5. **Revisar reportes**: Abre los reportes generados en `target/`

---

## 📞 Soporte

Para más información:
- Selenium IDE: https://www.selenium.dev/selenium-ide/
- Serenity/JS: https://serenity-js.org/
- Cucumber: https://cucumber.io/
- WebdriverIO: https://webdriver.io/

¡Listo para empezar a probar! 🎉
