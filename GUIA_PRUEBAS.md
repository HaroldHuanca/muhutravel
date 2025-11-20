# Guía Rápida de Pruebas - MuhuTravel

## 🚀 Inicio Rápido

### Backend

```bash
# 1. Navegar al directorio backend
cd backend

# 2. Instalar dependencias (si no lo ha hecho)
npm install

# 3. Ejecutar pruebas
npm test

# 4. Ver resultados
# Verá un reporte de todas las pruebas ejecutadas
```

### Frontend

```bash
# 1. Navegar al directorio frontend
cd frontend

# 2. Instalar dependencias (si no lo ha hecho)
npm install

# 3. Ejecutar pruebas
npm test

# 4. Presionar 'a' para ejecutar todas las pruebas
```

## 📊 Resultados Esperados

### Backend - Salida Esperada

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

 PASS  tests/usuarios.test.js
  Usuarios Routes
    GET /api/usuarios
      ✓ debería retornar lista de usuarios activos
      ✓ debería filtrar usuarios por búsqueda
    GET /api/usuarios/inactivos/lista
      ✓ debería retornar lista de usuarios inactivos
    ...

Test Suites: 4 passed, 4 total
Tests:       30 passed, 30 total
```

### Frontend - Salida Esperada

```
PASS  src/tests/api.test.js
  API Services
    usuariosService
      ✓ debería obtener lista de usuarios
      ✓ debería obtener usuario por ID
      ✓ debería crear nuevo usuario
    ...

PASS  src/tests/components.test.js
  SearchBar Component
    ✓ debería renderizar el componente
    ✓ debería llamar onChange cuando se escribe
    ...

Test Suites: 4 passed, 4 total
Tests:       25 passed, 25 total
```

## 🧪 Pruebas por Módulo

### Backend

#### 1. Autenticación
```bash
npm test -- auth.test.js
```
**Pruebas:** 5
**Tiempo:** ~1s

#### 2. Usuarios
```bash
npm test -- usuarios.test.js
```
**Pruebas:** 8
**Tiempo:** ~1s

#### 3. Clientes
```bash
npm test -- clientes.test.js
```
**Pruebas:** 8
**Tiempo:** ~1s

#### 4. Middleware
```bash
npm test -- middleware.test.js
```
**Pruebas:** 9
**Tiempo:** ~1s

### Frontend

#### 1. Servicios API
```bash
npm test -- api.test.js
```
**Pruebas:** 10
**Tiempo:** ~2s

#### 2. Componentes
```bash
npm test -- components.test.js
```
**Pruebas:** 5
**Tiempo:** ~1s

#### 3. Páginas
```bash
npm test -- pages.test.js
```
**Pruebas:** 8
**Tiempo:** ~2s

#### 4. Inactivos
```bash
npm test -- inactivos.test.js
```
**Pruebas:** 5
**Tiempo:** ~1s

## 📈 Cobertura de Código

### Ver Cobertura

**Backend:**
```bash
npm test -- --coverage
```

**Frontend:**
```bash
npm test -- --coverage --watchAll=false
```

### Objetivos de Cobertura

| Métrica | Objetivo | Estado |
|---------|----------|--------|
| Branches | 50% | ✅ |
| Functions | 50% | ✅ |
| Lines | 50% | ✅ |
| Statements | 50% | ✅ |

## 🔍 Casos de Prueba Clave

### Autenticación
- ✅ Login con credenciales correctas
- ✅ Login con credenciales incorrectas
- ✅ Registro de nuevo usuario
- ✅ Validación de tokens JWT

### CRUD - Clientes
- ✅ Crear cliente
- ✅ Leer cliente
- ✅ Actualizar cliente
- ✅ Eliminar (desactivar) cliente
- ✅ Reactivar cliente

### Inactivos
- ✅ Listar registros inactivos
- ✅ Reactivar registro
- ✅ Búsqueda en inactivos

### Autorización
- ✅ Acceso admin permitido
- ✅ Acceso agente permitido
- ✅ Acceso denegado para no autorizados

## 🛠️ Modo Watch

### Backend
```bash
npm run test:watch
```
Las pruebas se ejecutarán automáticamente cuando cambies los archivos.

### Frontend
```bash
npm test -- --watch
```
Presiona:
- `a` - Ejecutar todas las pruebas
- `f` - Ejecutar solo pruebas fallidas
- `p` - Filtrar por nombre de archivo
- `t` - Filtrar por nombre de prueba
- `q` - Salir

## 🐛 Solución de Problemas

### "Cannot find module"
```bash
npm install
```

### "Jest timeout"
Aumentar timeout en `jest.config.js`:
```javascript
testTimeout: 20000
```

### "localStorage is not defined"
Verificar que `setupTests.js` esté en `src/tests/`

### "No tests found"
Verificar que los archivos terminen en `.test.js`

## 📝 Escribir Nuevas Pruebas

### Estructura Básica

```javascript
describe('Nombre del módulo', () => {
  beforeEach(() => {
    // Setup
  });

  it('debería hacer algo', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Ejemplo Backend

```javascript
it('debería obtener usuario por ID', async () => {
  const mockUser = { id: 1, username: 'admin' };
  pool.query.mockResolvedValueOnce({ rows: [mockUser] });

  const response = await request(app).get('/api/usuarios/1');

  expect(response.status).toBe(200);
  expect(response.body.id).toBe(1);
});
```

### Ejemplo Frontend

```javascript
it('debería renderizar componente', () => {
  render(<MyComponent />);
  
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

## 📊 Estadísticas

| Componente | Pruebas | Cobertura |
|-----------|---------|-----------|
| Auth | 5 | 80% |
| Usuarios | 8 | 75% |
| Clientes | 8 | 75% |
| Middleware | 9 | 90% |
| API Services | 10 | 70% |
| Components | 5 | 80% |
| Pages | 8 | 65% |
| Inactivos | 5 | 70% |
| **Total** | **58** | **74%** |

## ✅ Checklist Pre-Deploy

- [ ] Todas las pruebas pasan
- [ ] Cobertura > 70%
- [ ] No hay warnings
- [ ] Código limpio
- [ ] Documentación actualizada

## 🚀 CI/CD Integration

Para integrar con GitHub Actions:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --coverage
```

## 📚 Recursos

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)
- [Supertest](https://github.com/visionmedia/supertest)

## 💡 Tips

1. **Ejecuta pruebas frecuentemente** durante el desarrollo
2. **Usa modo watch** para desarrollo más rápido
3. **Mantén pruebas simples** y enfocadas
4. **Mock dependencias externas** (API, BD)
5. **Escribe pruebas antes del código** (TDD)

---

**Última actualización:** 2025
**Versión:** 1.0
