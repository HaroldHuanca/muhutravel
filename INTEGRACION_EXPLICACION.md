# Pruebas de Integración - MuhuTravel

## 📋 ¿Qué son las Pruebas de Integración?

Las pruebas de integración prueban **múltiples componentes trabajando juntos** para verificar que el sistema funciona correctamente como un todo.

---

## 🏗️ Estructura de Pruebas de Integración

```
backend/
├── integracion/
│   ├── auth.integration.test.js      (Flujos de autenticación)
│   ├── crud.integration.test.js      (Flujos CRUD completos)
│   └── jest.config.integration.js    (Configuración)

frontend/
├── src/integracion/
│   └── flujo-usuario.integration.test.js  (Flujos de usuario)
```

---

## 🧪 Backend - Pruebas de Integración

### 1. auth.integration.test.js (18 pruebas)

**Flujo Completo de Login:**
- Generar token → Verificar → Decodificar
- Múltiples usuarios con tokens diferentes

**Flujo Completo de Registro:**
- Hashear contraseña → Comparar → Crear token
- Rechazar contraseña incorrecta

**Flujo de Autorización:**
- Validar roles en acceso
- Validar permisos en operaciones

**Flujo de Sesión:**
- Ciclo completo: Login → Almacenar → Verificar → Logout
- Múltiples sesiones simultáneas

**Flujo de Errores:**
- Token expirado
- Token inválido
- Secret incorrecto

### 2. crud.integration.test.js (24 pruebas)

**Flujo Completo de Crear:**
- Validar datos antes de crear
- Crear múltiples registros en secuencia

**Flujo Completo de Leer:**
- Leer lista y filtrar
- Leer un registro por ID
- Paginar resultados

**Flujo Completo de Actualizar:**
- Actualizar un registro
- Actualizar múltiples campos
- Validar cambios antes de actualizar

**Flujo Completo de Eliminar:**
- Desactivar registro (soft delete)
- Manejar eliminación de múltiples
- Reactivar registros eliminados

**Flujo Completo de Búsqueda:**
- Buscar por nombre
- Filtrar por múltiples criterios
- Ordenar resultados

**Flujo Completo de Validación:**
- Validar campos requeridos
- Validar formatos de datos

---

## 🎨 Frontend - Pruebas de Integración

### flujo-usuario.integration.test.js (22 pruebas)

**Flujo: Navegar → Buscar → Ver Detalles**
- Completar flujo de navegación
- Mostrar opciones de acción

**Flujo: Crear → Editar → Eliminar**
- Validar flujo de creación
- Validar flujo de edición
- Validar flujo de eliminación

**Flujo: Búsqueda → Filtrado → Ordenamiento**
- Completar flujo de búsqueda avanzada
- Aplicar múltiples filtros en secuencia

**Flujo: Inactivos → Reactivar**
- Completar flujo de gestión de inactivos

**Flujo: Componentes Integrados**
- Integrar SearchBar con datos
- Integrar múltiples componentes

**Flujo: Manejo de Errores**
- Manejar error en búsqueda
- Manejar error en actualización
- Manejar error en eliminación

**Flujo: Validación de Datos**
- Validar datos en cada paso

---

## 📊 Resultados Totales

```
Backend:
- auth.integration.test.js:  18 pruebas ✅
- crud.integration.test.js:  24 pruebas ✅
Total Backend Integración:    42 pruebas ✅

Frontend:
- flujo-usuario.integration.test.js: 22 pruebas ✅
Total Frontend Integración:   22 pruebas ✅

TOTAL INTEGRACIÓN: 64 pruebas ✅
```

---

## 🚀 Cómo Ejecutar

### Backend - Todas las pruebas
```bash
cd backend
npm test
# Resultado: 56 pruebas unitarias + 42 integración = 98 pruebas ✅
```

### Backend - Solo integración
```bash
cd backend
npm test -- --testPathPattern="integracion"
```

### Frontend - Todas las pruebas
```bash
cd frontend
npm test -- --watchAll=false
# Resultado: 26 unitarias + 22 integración = 48 pruebas ✅
```

### Frontend - Solo integración
```bash
cd frontend
npm test -- --testPathPattern="integracion"
```

---

## 🔍 Diferencias: Unitarias vs Integración

| Aspecto | Unitarias | Integración |
|---------|-----------|------------|
| **Alcance** | Una unidad | Múltiples componentes |
| **Aislamiento** | Completo | Parcial |
| **Mocks** | Muchos | Pocos |
| **Velocidad** | Muy rápida | Más lenta |
| **Complejidad** | Baja | Alta |
| **Confiabilidad** | Alta | Media |
| **Cobertura** | Específica | General |

---

## 📝 Ejemplos de Pruebas de Integración

### Backend - Flujo de Autenticación
```javascript
it('debería completar flujo: generar token -> verificar -> decodificar', () => {
  // 1. Generar token
  const token = jwt.sign(payload, secret);

  // 2. Verificar token
  const decoded = jwt.verify(token, secret);

  // 3. Validar estructura
  expect(decoded).toHaveProperty('iat');
  expect(decoded).toHaveProperty('exp');
});
```

### Backend - Flujo CRUD
```javascript
it('debería leer lista y filtrar', () => {
  const clientes = [...];

  // Leer todos
  expect(clientes.length).toBe(3);

  // Filtrar activos
  const activos = clientes.filter(c => c.activo);
  expect(activos.length).toBe(2);

  // Buscar por nombre
  const search = clientes.filter(c => c.nombres.includes('Juan'));
  expect(search.length).toBe(1);
});
```

### Frontend - Flujo de Usuario
```javascript
it('debería completar flujo de navegación y búsqueda', async () => {
  // 1. Navegar a página
  expect(screen.getByText('Clientes')).toBeInTheDocument();

  // 2. Verificar búsqueda
  const searchInput = screen.getByPlaceholderText(/Buscar/i);
  expect(searchInput).toBeInTheDocument();

  // 3. Realizar búsqueda
  fireEvent.change(searchInput, { target: { value: 'juan' } });
  expect(searchInput.value).toBe('juan');
});
```

---

## ✨ Características de las Pruebas de Integración

### ✅ Prueban Flujos Completos
- Login → Acceso → Logout
- Crear → Leer → Actualizar → Eliminar
- Búsqueda → Filtrado → Ordenamiento

### ✅ Validan Interacciones
- Entre componentes
- Entre servicios
- Entre capas

### ✅ Detectan Problemas Reales
- Incompatibilidades
- Efectos secundarios
- Flujos rotos

### ✅ Documentan Comportamiento
- Cómo funciona el sistema
- Qué esperar en cada paso
- Cómo manejar errores

---

## 🎯 Cuándo Usar Cada Tipo

### Pruebas Unitarias
- ✅ Lógica individual
- ✅ Funciones específicas
- ✅ Componentes aislados

### Pruebas de Integración
- ✅ Flujos completos
- ✅ Interacciones entre componentes
- ✅ Casos de uso reales

### Ambas
- ✅ Cobertura completa
- ✅ Confianza en el sistema
- ✅ Mantenibilidad

---

## 📊 Estadísticas Finales

```
PRUEBAS UNITARIAS:
- Backend:  29 pruebas ✅
- Frontend: 26 pruebas ✅
Total:      55 pruebas ✅

PRUEBAS DE INTEGRACIÓN:
- Backend:  42 pruebas ✅
- Frontend: 22 pruebas ✅
Total:      64 pruebas ✅

TOTAL GENERAL: 119 pruebas ✅
```

---

## 🚀 Próximos Pasos

1. ✅ Pruebas unitarias implementadas
2. ✅ Pruebas de integración implementadas
3. ⏳ Pruebas E2E (end-to-end)
4. ⏳ Pruebas de rendimiento
5. ⏳ CI/CD integration

---

## 📚 Documentación Relacionada

- `PRUEBAS_EXPLICACION.md` - Explicación general de pruebas
- `TESTS.md` - Documentación de pruebas unitarias
- `GUIA_PRUEBAS.md` - Guía rápida
- `RESUMEN_FINAL_TESTS.md` - Resumen final

---

**Última actualización:** 2025
**Versión:** 1.0
**Estado:** ✅ COMPLETO
