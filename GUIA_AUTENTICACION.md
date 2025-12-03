# Guía de Autenticación - Errores Comunes y Soluciones

## 🔴 Error que tuviste: "Token no proporcionado"

### Causa Raíz
Mezclaste `sessionStorage` y `localStorage` en diferentes partes del código:
- App.js guardaba el token en `sessionStorage`
- api.js, Comunicacion.js, reportes.js lo buscaban en `localStorage`
- Resultado: El token nunca llegaba al backend

### Solución Aplicada
Cambiar TODOS a `sessionStorage` para mantener consistencia.

---

## ✅ Reglas de Oro para Autenticación

### Regla 1: Elige UNA forma de almacenamiento
```javascript
// ✅ CORRECTO: Usa sessionStorage para tokens (se pierden al cerrar pestaña)
sessionStorage.setItem('token', token);
const token = sessionStorage.getItem('token');

// ❌ INCORRECTO: No mezcles sessionStorage y localStorage
sessionStorage.setItem('token', token);  // Guardas aquí
const token = localStorage.getItem('token');  // Buscas aquí (vacío!)
```

### Regla 2: Centraliza la gestión de tokens
```javascript
// ✅ CORRECTO: Crea un servicio reutilizable
// services/tokenService.js
export const tokenService = {
  getToken: () => sessionStorage.getItem('token'),
  setToken: (token) => sessionStorage.setItem('token', token),
  removeToken: () => sessionStorage.removeItem('token'),
  hasToken: () => !!sessionStorage.getItem('token')
};

// Úsalo en TODOS los archivos:
import { tokenService } from './services/tokenService';
const token = tokenService.getToken();

// ❌ INCORRECTO: Repetir el código en cada archivo
// En api.js:
const token = localStorage.getItem('token');
// En Comunicacion.js:
const token = localStorage.getItem('token');
// En reportes.js:
const token = localStorage.getItem('token');
// ← Cuando cambies uno, olvidarás cambiar los otros!
```

### Regla 3: Usa interceptores de axios globalmente
```javascript
// ✅ CORRECTO: Configurar UNA SOLA VEZ en api.js
import axios from 'axios';
import { tokenService } from './tokenService';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = tokenService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Luego en otros archivos, usa el api configurado:
import api from './services/api';
const response = await api.get('/clientes');  // ← Token se añade automáticamente!

// ❌ INCORRECTO: Repetir el header en cada petición
// En Comunicacion.js:
const token = localStorage.getItem('token');
const response = await axios.get(url, {
  headers: { Authorization: `Bearer ${token}` }
});
// En reportes.js:
const token = localStorage.getItem('token');
const response = await axios.get(url, {
  headers: { Authorization: `Bearer ${token}` }
});
// ← Código repetido, difícil de mantener
```

### Regla 4: Sincroniza el estado global
```javascript
// ✅ CORRECTO: Usa Context API para estado global
// context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user') || 'null'));

  const login = (newToken, newUser) => {
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Luego en tus componentes:
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function MiComponente() {
  const { token, user } = useContext(AuthContext);
  // Aquí siempre tendrás el token actualizado
}
```

---

## 📋 Checklist para Evitar Este Error

- [ ] ¿Todos los archivos usan `sessionStorage` (o todos usan `localStorage`)?
- [ ] ¿Hay un servicio centralizado para obtener el token?
- [ ] ¿El interceptor de axios está configurado globalmente?
- [ ] ¿No repito `getItem('token')` en múltiples archivos?
- [ ] ¿El token se guarda Y se busca en el MISMO lugar?
- [ ] ¿Probé después de login que el token llegue al backend?

---

## 🧪 Cómo Verificar que Funciona

### En el navegador (DevTools):
```javascript
// Abre la consola y ejecuta:
sessionStorage.getItem('token')  // Debe devolver el token, no null

// Luego haz una petición:
fetch('http://localhost:5000/api/clientes', {
  headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
})
.then(r => r.json())
.then(console.log)  // Debe devolver los clientes, no "Token no proporcionado"
```

### En Network tab:
1. Abre DevTools → Network
2. Haz una petición POST (insertar datos)
3. Busca la petición en la lista
4. Click en ella → Headers → Request Headers
5. Verifica que exista: `Authorization: Bearer eyJhbGc...`

Si ves `Authorization: Bearer null` o no aparece el header, el token no se está enviando.

---

## 🚀 Estructura Recomendada para Futuros Proyectos

```
frontend/src/
├── services/
│   ├── api.js                 ← Axios con interceptor
│   ├── tokenService.js        ← Gestión centralizada de tokens
│   ├── authService.js         ← Login/logout
│   ├── clientesService.js     ← Usa api.js
│   └── ...
├── context/
│   └── AuthContext.js         ← Estado global
├── hooks/
│   └── useAuth.js             ← Hook para acceder a AuthContext
├── pages/
│   ├── Login.js               ← Usa AuthContext
│   ├── Clientes.js            ← Usa clientesService (que usa api.js)
│   └── ...
└── App.js                     ← Envuelve con AuthProvider
```

---

## 📌 Resumen

| Aspecto | ❌ Incorrecto | ✅ Correcto |
|--------|-------------|-----------|
| Almacenamiento | Mezclar sessionStorage y localStorage | Usar UNO consistentemente |
| Obtención de token | Repetir `getItem('token')` en cada archivo | Servicio centralizado |
| Headers de peticiones | Añadir manualmente en cada fetch | Interceptor global de axios |
| Estado de autenticación | Variables locales en cada componente | Context API global |
| Sincronización | Desincronizado entre archivos | Sincronizado automáticamente |

