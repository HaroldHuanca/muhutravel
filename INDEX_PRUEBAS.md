# 📑 Índice de Pruebas Automatizadas - MuhuTravel

## 🚀 Comienza Aquí

1. **Lectura rápida (2 min)**: [`QUICK_START.md`](./QUICK_START.md)
2. **Resumen ejecutivo (5 min)**: [`RESUMEN_PRUEBAS_AUTOMATIZADAS.md`](./RESUMEN_PRUEBAS_AUTOMATIZADAS.md)
3. **Guía completa (20 min)**: [`frontend/TESTING_GUIDE.md`](./frontend/TESTING_GUIDE.md)

---

## 📂 Estructura de Archivos

### 📍 Raíz del Proyecto
```
muhutravel/
├── QUICK_START.md                          ← Inicio rápido
├── RESUMEN_PRUEBAS_AUTOMATIZADAS.md        ← Resumen ejecutivo
├── INDEX_PRUEBAS.md                        ← Este archivo
└── frontend/
    ├── TESTING_GUIDE.md                    ← Guía completa
    ├── SERENITY_SETUP.md                   ← Instalación Serenity
    ├── ARCHIVOS_CREADOS.md                 ← Inventario
    ├── INSTALL_SERENITY.sh                 ← Script instalación
    ├── SERENITY_PACKAGE_JSON.json           ← Dependencias
    ├── serenity.config.ts                  ← Config WebdriverIO
    ├── selenium-tests/                     ← Archivos .side
    └── serenity/                           ← Features y steps
```

---

## 🌐 Selenium IDE Tests

### 📍 Ubicación
`frontend/selenium-tests/`

### 📋 Archivos Disponibles

#### 1. Login Tests
- **Archivo**: `login.side`
- **Pruebas**: 3
- **Cubre**: Autenticación, validación, credenciales
- **Tiempo**: ~30 segundos

#### 2. Dashboard Tests
- **Archivo**: `dashboard.side`
- **Pruebas**: 4
- **Cubre**: Carga, KPI cards, gráficos, actualización
- **Tiempo**: ~45 segundos

#### 3. Clientes Tests
- **Archivo**: `clientes.side`
- **Pruebas**: 5
- **Cubre**: Listar, buscar, agregar, editar, imprimir
- **Tiempo**: ~1 minuto

#### 4. Paquetes Tests
- **Archivo**: `paquetes.side`
- **Pruebas**: 5
- **Cubre**: Listar, buscar, agregar, editar, inactivos
- **Tiempo**: ~1 minuto

#### 5. Reservas Tests
- **Archivo**: `reservas.side`
- **Pruebas**: 5
- **Cubre**: Listar, buscar, agregar, editar, filtrar
- **Tiempo**: ~1 minuto

#### 6. Reportes Tests
- **Archivo**: `reportes.side`
- **Pruebas**: 5
- **Cubre**: Cargar, ventas, pendientes, clientes, filtrar
- **Tiempo**: ~1 minuto

#### 7. Empleados Tests
- **Archivo**: `empleados.side`
- **Pruebas**: 4
- **Cubre**: Listar, buscar, agregar, editar
- **Tiempo**: ~45 segundos

#### 8. Proveedores Tests
- **Archivo**: `proveedores.side`
- **Pruebas**: 4
- **Cubre**: Listar, buscar, agregar, editar
- **Tiempo**: ~45 segundos

#### 9. Usuarios Tests
- **Archivo**: `usuarios.side`
- **Pruebas**: 4
- **Cubre**: Listar, buscar, agregar, editar
- **Tiempo**: ~45 segundos

### 🎯 Cómo Usar Selenium IDE

```bash
# 1. Instalar extensión (Chrome o Firefox)
# 2. Abrir Selenium IDE
# 3. Seleccionar "Open an existing project"
# 4. Navegar a: frontend/selenium-tests/
# 5. Seleccionar archivo .side
# 6. Hacer clic en "Run" (▶️)
```

---

## 🎭 Serenity/JS Tests

### 📍 Ubicación
`frontend/serenity/`

### 📋 Features (Gherkin)

#### 1. Login Feature
- **Archivo**: `features/login.feature`
- **Escenarios**: 4
- **Cubre**: Login exitoso, fallido, validación, agente
- **Pasos**: 11 (en `login.steps.ts`)

#### 2. Dashboard Feature
- **Archivo**: `features/dashboard.feature`
- **Escenarios**: 4
- **Cubre**: Carga, KPI cards, gráficos, actualización
- **Pasos**: 17 (en `dashboard.steps.ts`)

#### 3. Clientes Feature
- **Archivo**: `features/clientes.feature`
- **Escenarios**: 6
- **Cubre**: Listar, buscar, agregar, editar, eliminar, imprimir

#### 4. Paquetes Feature
- **Archivo**: `features/paquetes.feature`
- **Escenarios**: 6
- **Cubre**: Listar, buscar, agregar, editar, inactivos, activar

#### 5. Reservas Feature
- **Archivo**: `features/reservas.feature`
- **Escenarios**: 6
- **Cubre**: Listar, buscar, agregar, editar, filtrar, detalles

#### 6. Reportes Feature
- **Archivo**: `features/reportes.feature`
- **Escenarios**: 6
- **Cubre**: Cargar, ventas, pendientes, clientes, filtrar, exportar

#### 7. Empleados Feature
- **Archivo**: `features/empleados.feature`
- **Escenarios**: 5
- **Cubre**: Listar, buscar, agregar, editar, eliminar

#### 8. Proveedores Feature
- **Archivo**: `features/proveedores.feature`
- **Escenarios**: 6
- **Cubre**: Listar, buscar, agregar, editar, eliminar, detalles

#### 9. Usuarios Feature
- **Archivo**: `features/usuarios.feature`
- **Escenarios**: 6
- **Cubre**: Listar, buscar, agregar, editar, eliminar, cambiar rol

### 🎯 Cómo Usar Serenity/JS

```bash
# 1. Instalar
cd frontend
bash INSTALL_SERENITY.sh

# 2. Ejecutar todas las pruebas
npm run serenity:test

# 3. Ejecutar pruebas específicas
npm run serenity:test -- --spec serenity/features/login.feature

# 4. Ver reportes
# Los reportes se generarán en: target/
```

---

## 📊 Estadísticas

### Cobertura
- **Vistas cubiertas**: 9 de 10 (sin Comunicación)
- **Pruebas Selenium IDE**: 39
- **Escenarios Serenity**: 49
- **Total**: 88 pruebas automatizadas

### Tiempo de Ejecución
- **Selenium IDE**: ~7-8 minutos (todas)
- **Serenity/JS**: ~10-12 minutos (todas)
- **Total**: ~15-20 minutos (ambas)

### Archivos Creados
- Archivos `.side`: 9
- Archivos `.feature`: 9
- Archivos `.steps.ts`: 2 (base)
- Configuraciones: 2
- Documentación: 5
- Scripts: 1
- **Total**: 28 archivos

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

## 📚 Documentación Detallada

### Para Selenium IDE
- [`frontend/TESTING_GUIDE.md`](./frontend/TESTING_GUIDE.md) - Sección "Selenium IDE Tests"
- [`frontend/SERENITY_SETUP.md`](./frontend/SERENITY_SETUP.md) - Sección "Archivos Selenium IDE"

### Para Serenity/JS
- [`frontend/TESTING_GUIDE.md`](./frontend/TESTING_GUIDE.md) - Sección "Serenity/JS Tests"
- [`frontend/SERENITY_SETUP.md`](./frontend/SERENITY_SETUP.md) - Sección "Instalación de Serenity/JS"
- [`RESUMEN_PRUEBAS_AUTOMATIZADAS.md`](./RESUMEN_PRUEBAS_AUTOMATIZADAS.md) - Sección "Serenity/JS Framework"

### General
- [`QUICK_START.md`](./QUICK_START.md) - Inicio rápido
- [`frontend/ARCHIVOS_CREADOS.md`](./frontend/ARCHIVOS_CREADOS.md) - Inventario completo

---

## 🔄 Flujo de Trabajo Recomendado

### Día 1: Exploración
1. Lee [`QUICK_START.md`](./QUICK_START.md) (2 min)
2. Instala Selenium IDE (2 min)
3. Abre `frontend/selenium-tests/login.side` (1 min)
4. Ejecuta las pruebas (1 min)
5. ¡Listo! (6 minutos totales)

### Día 2: Serenity
1. Lee [`SERENITY_SETUP.md`](./frontend/SERENITY_SETUP.md) (5 min)
2. Ejecuta `bash INSTALL_SERENITY.sh` (5 min)
3. Ejecuta `npm run serenity:test` (10 min)
4. Revisa los reportes (5 min)
5. ¡Listo! (25 minutos totales)

### Día 3+: Mantenimiento
1. Ejecuta pruebas regularmente
2. Agrega nuevos step definitions según necesites
3. Integra en tu pipeline CI/CD
4. Mantén la documentación actualizada

---

## 🆘 Troubleshooting

### Selenium IDE
- **Problema**: No encuentra elementos
  - **Solución**: Abre DevTools (F12) e inspecciona el elemento
  
- **Problema**: Las pruebas se cuelgan
  - **Solución**: Aumenta el timeout en la configuración

### Serenity/JS
- **Problema**: Error de instalación
  - **Solución**: Ejecuta `npm install --legacy-peer-deps`
  
- **Problema**: Las pruebas fallan en login
  - **Solución**: Verifica que el backend esté corriendo

### General
- **Problema**: "Port already in use"
  - **Solución**: Cambia el puerto en la configuración

---

## 📞 Recursos Externos

- [Selenium IDE Docs](https://www.selenium.dev/selenium-ide/)
- [Serenity/JS Docs](https://serenity-js.org/)
- [Cucumber Docs](https://cucumber.io/)
- [WebdriverIO Docs](https://webdriver.io/)

---

## ✅ Checklist de Verificación

- [ ] He leído [`QUICK_START.md`](./QUICK_START.md)
- [ ] He instalado Selenium IDE
- [ ] He ejecutado un archivo `.side`
- [ ] He leído [`SERENITY_SETUP.md`](./frontend/SERENITY_SETUP.md)
- [ ] He ejecutado `bash INSTALL_SERENITY.sh`
- [ ] He ejecutado `npm run serenity:test`
- [ ] He revisado los reportes
- [ ] He leído [`TESTING_GUIDE.md`](./frontend/TESTING_GUIDE.md) completo

---

## 🎉 ¡Listo!

Tienes todo lo que necesitas para automatizar pruebas en MuhuTravel.

**Próximo paso**: Abre [`QUICK_START.md`](./QUICK_START.md) y comienza. 🚀
