# Pruebas Unitarias - MuhuTravel

## 📋 Descripción General

Se han implementado pruebas unitarias completas para el backend y frontend del sistema MuhuTravel. Las pruebas verifican que todas las unidades funcionales del sistema estén operando correctamente.

## 🏗️ Estructura de Pruebas

```
backend/
├── tests/
│   ├── auth.test.js          # Pruebas de autenticación
│   ├── usuarios.test.js      # Pruebas de usuarios
│   ├── clientes.test.js      # Pruebas de clientes
│   └── middleware.test.js    # Pruebas de middleware
├── jest.config.js            # Configuración de Jest
└── package.json              # Scripts de test

frontend/
├── src/tests/
│   ├── api.test.js           # Pruebas de servicios API
│   ├── components.test.js    # Pruebas de componentes
│   ├── pages.test.js         # Pruebas de páginas
│   ├── inactivos.test.js     # Pruebas de funcionalidad inactivos
│   └── setupTests.js         # Configuración de tests
└── package.json              # Scripts de test
```

## 🧪 Pruebas del Backend

### 1. Autenticación (`auth.test.js`)

**Pruebas incluidas:**
- ✅ Login con credenciales correctas
- ✅ Login con usuario inexistente
- ✅ Login sin campos requeridos
- ✅ Registro de nuevo usuario
- ✅ Registro con usuario duplicado

**Endpoints probados:**
- `POST /api/auth/login`
- `POST /api/auth/register`

### 2. Usuarios (`usuarios.test.js`)

**Pruebas incluidas:**
- ✅ Obtener lista de usuarios activos
- ✅ Filtrar usuarios por búsqueda
- ✅ Obtener lista de usuarios inactivos
- ✅ Obtener usuario por ID
- ✅ Actualizar usuario
- ✅ Desactivar usuario
- ✅ Reactivar usuario inactivo

**Endpoints probados:**
- `GET /api/usuarios`
- `GET /api/usuarios/inactivos/lista`
- `GET /api/usuarios/:id`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`
- `PATCH /api/usuarios/:id/reactivar`

### 3. Clientes (`clientes.test.js`)

**Pruebas incluidas:**
- ✅ Obtener lista de clientes activos
- ✅ Obtener lista de clientes inactivos
- ✅ Crear nuevo cliente
- ✅ Validar campos requeridos
- ✅ Actualizar cliente
- ✅ Desactivar cliente
- ✅ Reactivar cliente inactivo

**Endpoints probados:**
- `GET /api/clientes`
- `GET /api/clientes/inactivos/lista`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`
- `PATCH /api/clientes/:id/reactivar`

### 4. Middleware (`middleware.test.js`)

**Pruebas incluidas:**
- ✅ Verificar token válido
- ✅ Rechazar sin token
- ✅ Rechazar token inválido
- ✅ Rechazar sin prefijo Bearer
- ✅ Permitir acceso a admin
- ✅ Rechazar acceso a no-admin

**Funciones probadas:**
- `verifyToken()`
- `verifyAdmin()`

## 🎨 Pruebas del Frontend

### 1. Servicios API (`api.test.js`)

**Servicios probados:**
- ✅ `usuariosService` - CRUD de usuarios
- ✅ `clientesService` - CRUD de clientes
- ✅ `empleadosService` - CRUD de empleados
- ✅ `proveedoresService` - CRUD de proveedores
- ✅ `paquetesService` - CRUD de paquetes

**Operaciones probadas:**
- ✅ Obtener lista
- ✅ Obtener por ID
- ✅ Crear
- ✅ Actualizar
- ✅ Eliminar

### 2. Componentes (`components.test.js`)

**Componentes probados:**
- ✅ `SearchBar` - Barra de búsqueda

**Funcionalidades probadas:**
- ✅ Renderizado del componente
- ✅ Cambio de valor
- ✅ Valor inicial
- ✅ Limpieza de búsqueda

### 3. Páginas (`pages.test.js`)

**Páginas probadas:**
- ✅ `Clientes` - Página de clientes
- ✅ `Empleados` - Página de empleados
- ✅ `Proveedores` - Página de proveedores
- ✅ `Paquetes` - Página de paquetes

**Funcionalidades probadas:**
- ✅ Renderizado de página
- ✅ Botón "Ver Inactivos"
- ✅ Botón "Nuevo [Entidad]"
- ✅ Carga de datos

### 4. Funcionalidad de Inactivos (`inactivos.test.js`)

**Funcionalidades probadas:**
- ✅ Renderizado de página de inactivos
- ✅ Botón "Volver"
- ✅ Barra de búsqueda
- ✅ Botón "Reactivar"
- ✅ Búsqueda en inactivos

## 🚀 Cómo Ejecutar las Pruebas

### Backend

```bash
# Instalar dependencias
cd backend
npm install

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm test -- --coverage
```

### Frontend

```bash
# Instalar dependencias
cd frontend
npm install

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm test -- --watch

# Ejecutar pruebas con cobertura
npm test -- --coverage
```

## 📊 Cobertura de Pruebas

### Backend

**Objetivos de cobertura:**
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

**Archivos cubiertos:**
- `routes/**/*.js` - Todas las rutas
- `middleware/**/*.js` - Todos los middlewares

### Frontend

**Archivos cubiertos:**
- `services/api.js` - Servicios de API
- `components/**/*.js` - Componentes
- `pages/**/*.js` - Páginas

## 🔧 Configuración

### Backend (jest.config.js)

```javascript
{
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 10000,
  forceExit: true,
  clearMocks: true
}
```

### Frontend (setupTests.js)

- Mock de `localStorage`
- Mock de `window.alert`
- Mock de `window.confirm`
- Supresión de warnings innecesarios

## 📝 Ejemplos de Pruebas

### Backend - Prueba de Autenticación

```javascript
it('debería retornar token cuando las credenciales son correctas', async () => {
  const mockUser = {
    id: 1,
    username: 'admin',
    password: '$2a$10$YourHashedPassword',
    rol: 'admin'
  };

  pool.query.mockResolvedValueOnce({ rows: [mockUser] });

  const response = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'admin',
      password: 'hash123'
    });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('token');
});
```

### Frontend - Prueba de Componente

```javascript
it('debería llamar onChange cuando se escribe', () => {
  const mockOnChange = jest.fn();
  
  render(
    <SearchBar 
      value="" 
      onChange={mockOnChange} 
      placeholder="Buscar..." 
    />
  );

  const input = screen.getByPlaceholderText('Buscar...');
  fireEvent.change(input, { target: { value: 'test' } });

  expect(mockOnChange).toHaveBeenCalledWith('test');
});
```

## 🎯 Casos de Prueba Principales

### Autenticación
- ✅ Login exitoso
- ✅ Login fallido
- ✅ Registro de usuario
- ✅ Validación de tokens

### CRUD Operations
- ✅ Crear registros
- ✅ Leer registros
- ✅ Actualizar registros
- ✅ Eliminar (desactivar) registros

### Funcionalidad de Inactivos
- ✅ Listar inactivos
- ✅ Reactivar registros
- ✅ Búsqueda en inactivos

### Autorización
- ✅ Acceso admin
- ✅ Acceso agente
- ✅ Rechazo de acceso no autorizado

## 🔍 Mocks Utilizados

### Backend
- `jest.mock('../db')` - Mock de base de datos
- `jest.mock('../middleware/auth')` - Mock de autenticación

### Frontend
- `jest.mock('axios')` - Mock de HTTP client
- `jest.mock('../services/api')` - Mock de servicios
- `jest.mock('../components/Header')` - Mock de componentes
- `jest.mock('../components/SearchBar')` - Mock de componentes

## 📈 Próximas Mejoras

1. **Aumentar cobertura** - Llegar a 80%+ de cobertura
2. **Pruebas E2E** - Agregar pruebas end-to-end con Cypress
3. **Pruebas de integración** - Pruebas con base de datos real
4. **Performance** - Pruebas de rendimiento
5. **Snapshot tests** - Pruebas de snapshots para componentes

## 🐛 Solución de Problemas

### Backend

**Error: "Cannot find module"**
```bash
npm install
```

**Error: "Jest timeout"**
- Aumentar `testTimeout` en `jest.config.js`

### Frontend

**Error: "Testing Library not found"**
```bash
npm install @testing-library/react @testing-library/jest-dom
```

**Error: "localStorage is not defined"**
- Verificar que `setupTests.js` está configurado correctamente

## 📚 Recursos Útiles

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)

## ✅ Checklist de Pruebas

- [x] Pruebas de autenticación
- [x] Pruebas de usuarios
- [x] Pruebas de clientes
- [x] Pruebas de middleware
- [x] Pruebas de servicios API
- [x] Pruebas de componentes
- [x] Pruebas de páginas
- [x] Pruebas de inactivos
- [ ] Pruebas E2E
- [ ] Pruebas de integración

---

**Última actualización:** 2025
**Versión:** 1.0
**Estado:** ✅ Completo
