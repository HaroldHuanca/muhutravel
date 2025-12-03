# Ejemplos Prácticos de Autenticación

## Ejemplo 1: Lo que ESTABA MAL (Tu código)

```javascript
// ❌ INCORRECTO - App.js
function App() {
  const handleLogin = (token, user) => {
    sessionStorage.setItem('token', token);  // Guardas en sessionStorage
    setToken(token);
  };
}

// ❌ INCORRECTO - api.js
const getToken = () => localStorage.getItem('token');  // Buscas en localStorage (vacío!)

api.interceptors.request.use((config) => {
  const token = getToken();  // null porque no está en localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Nunca se ejecuta
  }
  return config;
});

// ❌ INCORRECTO - Comunicacion.js
const cargarClientes = async () => {
  const token = localStorage.getItem('token');  // null
  const response = await axios.get('http://localhost:5000/api/clientes', {
    headers: { Authorization: `Bearer ${token}` }  // Authorization: Bearer null
  });
};

// Resultado: Backend recibe "Token no proporcionado"
```

---

## Ejemplo 2: Lo que ESTÁ BIEN AHORA (Tu código corregido)

```javascript
// ✅ CORRECTO - App.js
function App() {
  const handleLogin = (token, user) => {
    sessionStorage.setItem('token', token);  // Guardas en sessionStorage
    setToken(token);
  };
}

// ✅ CORRECTO - api.js
const getToken = () => sessionStorage.getItem('token');  // Buscas en sessionStorage (¡encontrado!)

api.interceptors.request.use((config) => {
  const token = getToken();  // "eyJhbGc..."
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Se ejecuta correctamente
  }
  return config;
});

// ✅ CORRECTO - Comunicacion.js
const cargarClientes = async () => {
  const token = sessionStorage.getItem('token');  // "eyJhbGc..."
  const response = await axios.get('http://localhost:5000/api/clientes', {
    headers: { Authorization: `Bearer ${token}` }  // Authorization: Bearer eyJhbGc...
  });
};

// Resultado: Backend recibe el token y devuelve los datos
```

---

## Ejemplo 3: Estructura RECOMENDADA para el futuro

### Paso 1: Crear servicio centralizado de tokens

```javascript
// services/tokenService.js
export const tokenService = {
  getToken: () => sessionStorage.getItem('token'),
  setToken: (token) => sessionStorage.setItem('token', token),
  removeToken: () => sessionStorage.removeItem('token'),
  hasToken: () => !!sessionStorage.getItem('token'),
  getUser: () => JSON.parse(sessionStorage.getItem('user') || 'null'),
  setUser: (user) => sessionStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => sessionStorage.removeItem('user')
};
```

### Paso 2: Usar el servicio en api.js

```javascript
// services/api.js
import axios from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Interceptor global - se añade el token automáticamente
api.interceptors.request.use((config) => {
  const token = tokenService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Paso 3: Usar api.js en todos los servicios

```javascript
// services/clientesService.js
import api from './api';

export const clientesService = {
  getAll: (search = '') => api.get('/clientes', { params: { search } }),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`),
};

// ✅ El token se añade automáticamente por el interceptor
// No necesitas hacer nada especial
```

### Paso 4: Usar en componentes

```javascript
// pages/Clientes.js
import { clientesService } from '../services/clientesService';

function Clientes() {
  const [clientes, setClientes] = useState([]);

  const cargarClientes = async () => {
    try {
      // ✅ El token se envía automáticamente
      const response = await clientesService.getAll();
      setClientes(response.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    // JSX...
  );
}
```

---

## Ejemplo 4: Comparación de Enfoques

### ❌ INCORRECTO: Repetir código en cada archivo

```javascript
// En Comunicacion.js
const token = localStorage.getItem('token');
const response = await axios.get(url, {
  headers: { Authorization: `Bearer ${token}` }
});

// En reportes.js
const token = localStorage.getItem('token');
const response = await axios.get(url, {
  headers: { Authorization: `Bearer ${token}` }
});

// En usuarios.js
const token = localStorage.getItem('token');
const response = await axios.get(url, {
  headers: { Authorization: `Bearer ${token}` }
});

// Problemas:
// - Si cambias localStorage a sessionStorage, debes cambiar 3 archivos
// - Si cambias el formato del header, debes cambiar 3 archivos
// - Fácil olvidar cambiar uno
// - Difícil de mantener
```

### ✅ CORRECTO: Centralizar en un servicio

```javascript
// services/api.js (UNA SOLA VEZ)
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// En Comunicacion.js
const response = await api.get(url);  // Token se añade automáticamente

// En reportes.js
const response = await api.get(url);  // Token se añade automáticamente

// En usuarios.js
const response = await api.get(url);  // Token se añade automáticamente

// Ventajas:
// - Cambias UNA VEZ en api.js
// - Todos los archivos se benefician automáticamente
// - Código más limpio y mantenible
```

---

## Ejemplo 5: Debugging - Cómo saber dónde está el problema

### Paso 1: Verificar que el token se guardó

```javascript
// En la consola del navegador después de login:
sessionStorage.getItem('token')
// Debe devolver: "eyJhbGc..." (no null)

// Si devuelve null:
// → El login no guardó el token correctamente
// → Revisa App.js handleLogin()
```

### Paso 2: Verificar que se está leyendo

```javascript
// En api.js, añade console.log:
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  console.log('Token en interceptor:', token);  // ← Añade esto
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Abre DevTools → Console
// Haz una petición
// Debe mostrar: "Token en interceptor: eyJhbGc..."
// Si muestra: "Token en interceptor: null"
// → El token no se está guardando en sessionStorage
```

### Paso 3: Verificar que se está enviando

```javascript
// En DevTools → Network
// 1. Haz una petición
// 2. Click en la petición en la lista
// 3. Click en "Headers"
// 4. Busca "Authorization" en "Request Headers"
// 5. Debe mostrar: "Authorization: Bearer eyJhbGc..."

// Si no aparece o muestra "Bearer null":
// → El token no se está añadiendo al header
// → Revisa el interceptor
```

### Paso 4: Verificar que el backend lo recibe

```javascript
// En backend/middleware/auth.js, añade console.log:
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Token recibido:', token);  // ← Añade esto
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  // ...
};

// Abre la terminal del backend
// Haz una petición desde el frontend
// Debe mostrar: "Token recibido: eyJhbGc..."
// Si muestra: "Token recibido: undefined"
// → El header Authorization no se está enviando
```

---

## Resumen de Debugging

| Síntoma | Causa Probable | Solución |
|--------|---|---|
| sessionStorage.getItem('token') devuelve null | Token no se guardó en login | Revisa App.js handleLogin() |
| "Token en interceptor: null" | Se lee de localStorage en lugar de sessionStorage | Cambia a sessionStorage.getItem() |
| "Authorization: Bearer null" en Network | El interceptor no se ejecuta | Verifica que uses api.js, no axios directo |
| "Token no proporcionado" en backend | El header no se envía | Verifica que el interceptor esté configurado |

