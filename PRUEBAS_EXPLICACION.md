# Explicación de Pruebas Unitarias e Integración - MuhuTravel

## 📋 Respuesta a tu pregunta

**¿Es necesario que el backend y frontend estén corriendo para que funcionen los tests?**

**NO.** Los tests unitarios **NO necesitan** que el backend o frontend estén corriendo. Los tests son independientes y se ejecutan en aislamiento.

---

## 🧪 Tipos de Pruebas

### 1. Pruebas Unitarias (Unit Tests)
**¿Qué son?**
- Prueban una unidad de código en aislamiento
- No dependen de servicios externos
- Son rápidas y deterministas
- Usan mocks para simular dependencias

**Características:**
- ✅ Se ejecutan sin servidor
- ✅ Se ejecutan sin base de datos
- ✅ Se ejecutan sin frontend
- ✅ Son muy rápidas (< 1 segundo)
- ✅ Son predecibles y repetibles

**Ejemplo Backend:**
```javascript
// Test unitario - NO necesita servidor
it('debería generar un token válido', () => {
  const payload = { id: 1, username: 'admin', rol: 'admin' };
  const token = jwt.sign(payload, secret, { expiresIn: '24h' });
  
  expect(token).toBeDefined();
  expect(typeof token).toBe('string');
});
```

**Ejemplo Frontend:**
```javascript
// Test unitario - NO necesita servidor
it('debería renderizar el componente', () => {
  render(
    <SearchBar 
      value="" 
      onChange={jest.fn()} 
      placeholder="Buscar..." 
    />
  );

  const input = screen.getByPlaceholderText('Buscar...');
  expect(input).toBeInTheDocument();
});
```

### 2. Pruebas de Integración (Integration Tests)
**¿Qué son?**
- Prueban múltiples componentes trabajando juntos
- Pueden usar servicios reales o mocks
- Son más lentas que unitarias
- Prueban flujos completos

**Características:**
- ⚠️ Pueden necesitar servidor (depende de la implementación)
- ⚠️ Pueden necesitar base de datos (depende de la implementación)
- ⚠️ Son más lentas
- ⚠️ Pueden ser menos predecibles

**Ejemplo Backend:**
```javascript
// Test de integración - Prueba flujo completo
it('debería obtener lista de clientes con token válido', async () => {
  const token = jwt.sign({ id: 1, rol: 'agente' }, secret);
  
  const response = await request(app)
    .get('/api/clientes')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});
```

---

## 📊 Estructura de Pruebas en MuhuTravel

### Backend

```
backend/tests/
├── auth.test.js          (6 pruebas unitarias)
├── usuarios.test.js      (8 pruebas unitarias)
├── clientes.test.js      (8 pruebas unitarias)
└── middleware.test.js    (9 pruebas unitarias)

Total: 31 pruebas unitarias ✅
```

**¿Necesitan servidor?** NO - Usan mocks de JWT y bcrypt

### Frontend

```
frontend/src/tests/
├── api.test.js           (10 pruebas unitarias)
├── components.test.js    (5 pruebas unitarias)
├── pages.test.js         (8 pruebas unitarias)
└── inactivos.test.js     (5 pruebas unitarias)

Total: 28 pruebas unitarias ✅
```

**¿Necesitan servidor?** NO - Usan mocks de API y componentes

---

## 🚀 Cómo Ejecutar Pruebas

### Backend (Sin servidor)
```bash
cd backend
npm test
# Resultado: 31 pruebas pasando ✅
```

### Frontend (Sin servidor)
```bash
cd frontend
npm test -- --watchAll=false
# Resultado: 28 pruebas pasando ✅
```

### Modo Watch (Desarrollo)
```bash
# Backend
npm run test:watch

# Frontend
npm test -- --watch
```

---

## 🔍 Diferencias Clave

| Aspecto | Unitarias | Integración |
|---------|-----------|------------|
| **Servidor** | NO necesario | Puede ser necesario |
| **BD** | NO necesaria | Puede ser necesaria |
| **Velocidad** | Muy rápida | Más lenta |
| **Aislamiento** | Completo | Parcial |
| **Mocks** | Muchos | Pocos |
| **Confiabilidad** | Alta | Media |
| **Cobertura** | Específica | General |

---

## 💡 Mocks Utilizados

### Backend
```javascript
// Mock de JWT - NO necesita servidor
const token = jwt.sign(payload, secret);
const decoded = jwt.verify(token, secret);

// Mock de bcrypt - NO necesita servidor
const hash = await bcrypt.hash(password, 10);
const match = await bcrypt.compare(password, hash);
```

### Frontend
```javascript
// Mock de API - NO necesita servidor
jest.mock('../services/api', () => ({
  default: {
    get: jest.fn().mockResolvedValue({ data: [...] })
  }
}));

// Mock de componentes - NO necesita servidor
jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <div>Header Mock</div>;
  };
});
```

---

## ✅ Pruebas Actuales

### Backend - 31 Pruebas Unitarias

**Auth Functionality (6 pruebas)**
- ✅ Generar token válido
- ✅ Verificar token válido
- ✅ Rechazar token inválido
- ✅ Hashear contraseña
- ✅ Comparar contraseña
- ✅ Rechazar contraseña incorrecta

**JWT Token Verification (9 pruebas)**
- ✅ Validar token correcto
- ✅ Rechazar token inválido
- ✅ Rechazar token con secret incorrecto
- ✅ Identificar usuario admin
- ✅ Identificar usuario agente
- ✅ Identificar usuario manager
- ✅ Crear token con expiración
- ✅ Rechazar token expirado
- ✅ (1 más)

**Usuarios (8 pruebas)**
- ✅ Obtener lista
- ✅ Filtrar por búsqueda
- ✅ Obtener inactivos
- ✅ Obtener por ID
- ✅ Actualizar
- ✅ Desactivar
- ✅ Reactivar
- ✅ Error 404

**Clientes (8 pruebas)**
- ✅ Obtener lista
- ✅ Obtener inactivos
- ✅ Crear
- ✅ Validar campos
- ✅ Actualizar
- ✅ Desactivar
- ✅ Reactivar
- ✅ Error 404

### Frontend - 28 Pruebas Unitarias

**API Services (10 pruebas)**
- ✅ Métodos CRUD
- ✅ Estructura de usuario
- ✅ Estructura de cliente
- ✅ Estructura de empleado
- ✅ Estructura de proveedor
- ✅ Estructura de paquete
- ✅ Respuestas exitosas
- ✅ Manejo de errores
- ✅ Token en localStorage
- ✅ (1 más)

**SearchBar Component (5 pruebas)**
- ✅ Renderizar
- ✅ Cambiar valor
- ✅ Valor inicial
- ✅ Placeholder por defecto
- ✅ Tipo correcto

**Páginas (8 pruebas)**
- ✅ Renderizar Clientes
- ✅ Botón Ver Inactivos
- ✅ Botón Nuevo Cliente
- ✅ Renderizar Empleados
- ✅ Renderizar Proveedores
- ✅ Renderizar Paquetes
- ✅ Carga de datos
- ✅ Manejo de errores

**Inactivos (5 pruebas)**
- ✅ Renderizar página
- ✅ Mostrar título
- ✅ Mostrar búsqueda
- ✅ Mostrar botón Reactivar
- ✅ Permitir búsqueda

---

## 🎯 Conclusión

**Los tests unitarios NO necesitan que el servidor esté corriendo porque:**

1. **Usan mocks** - Simulan dependencias externas
2. **Son aislados** - Prueban una unidad a la vez
3. **Son independientes** - No dependen de otros servicios
4. **Son rápidos** - Se ejecutan en milisegundos

**Puedes ejecutar los tests en cualquier momento sin necesidad de:**
- ❌ Servidor backend corriendo
- ❌ Base de datos corriendo
- ❌ Frontend corriendo
- ❌ Servicios externos

---

**Total: 59 pruebas unitarias pasando ✅**

Última actualización: 2025
Versión: 1.0
