# ⚡ Quick Start - Pruebas Automatizadas

## 🎯 Opción 1: Selenium IDE (2 minutos)

### Paso 1: Instalar extensión
- **Chrome**: [Descargar aquí](https://chromewebstore.google.com/detail/selenium-ide/mooikfkahbdckldjjfddbngbmjfldaie)
- **Firefox**: [Descargar aquí](https://addons.mozilla.org/en-US/firefox/addon/selenium-ide/)

### Paso 2: Abrir proyecto
1. Abre Selenium IDE
2. Haz clic en "Open an existing project"
3. Navega a: `frontend/selenium-tests/`
4. Selecciona cualquier archivo `.side` (ej: `login.side`)

### Paso 3: Ejecutar pruebas
1. Haz clic en el botón "Run" (▶️)
2. Observa los resultados en tiempo real
3. ¡Listo! ✅

---

## 🎭 Opción 2: Serenity/JS (5 minutos)

### Paso 1: Instalar
```bash
cd frontend
bash INSTALL_SERENITY.sh
```

### Paso 2: Ejecutar pruebas
```bash
npm run serenity:test
```

### Paso 3: Ver reportes
```bash
# Los reportes se generarán en:
# target/
```

---

## 📁 Archivos Disponibles

### Selenium IDE (.side)
```
frontend/selenium-tests/
├── login.side          ← Pruebas de autenticación
├── dashboard.side      ← Dashboard
├── clientes.side       ← Gestión de clientes
├── paquetes.side       ← Gestión de paquetes
├── reservas.side       ← Gestión de reservas
├── reportes.side       ← Reportes
├── empleados.side      ← Gestión de empleados
├── proveedores.side    ← Gestión de proveedores
└── usuarios.side       ← Gestión de usuarios
```

### Serenity/JS (Features)
```
frontend/serenity/features/
├── login.feature
├── dashboard.feature
├── clientes.feature
├── paquetes.feature
├── reservas.feature
├── reportes.feature
├── empleados.feature
├── proveedores.feature
└── usuarios.feature
```

---

## 🔐 Credenciales

```
Usuario: admin
Contraseña: hash123

O

Usuario: agente1
Contraseña: hash123
```

---

## 💡 Recomendaciones

| Caso | Solución |
|------|----------|
| Quiero probar rápido | Selenium IDE |
| Quiero reportes detallados | Serenity/JS |
| Quiero integrar en CI/CD | Serenity/JS |
| No quiero instalar nada | Selenium IDE |
| Quiero lenguaje natural (BDD) | Serenity/JS |

---

## 🆘 Problemas Comunes

### Selenium IDE no encuentra elementos
→ Abre DevTools (F12) e inspecciona el elemento

### Las pruebas de Serenity se cuelgan
→ Aumenta `waitforTimeout` en `serenity.config.ts`

### Error de autenticación
→ Verifica que el backend esté corriendo en `http://localhost:3000`

---

## 📚 Documentación Completa

Para más detalles, lee:
- `TESTING_GUIDE.md` - Guía completa
- `SERENITY_SETUP.md` - Instalación detallada
- `RESUMEN_PRUEBAS_AUTOMATIZADAS.md` - Resumen ejecutivo

---

## ✨ ¡Listo!

Elige tu opción y comienza a probar. 🚀
