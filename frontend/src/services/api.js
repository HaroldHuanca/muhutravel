import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => sessionStorage.getItem('token');

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};

export const usuariosService = {
  getAll: (search = '') => api.get('/usuarios', { params: { search } }),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export const clientesService = {
  getAll: (search = '') => api.get('/clientes', { params: { search } }),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`),
};

export const empleadosService = {
  getAll: (search = '') => api.get('/empleados', { params: { search } }),
  getById: (id) => api.get(`/empleados/${id}`),
  create: (data) => api.post('/empleados', data),
  update: (id, data) => api.put(`/empleados/${id}`, data),
  delete: (id) => api.delete(`/empleados/${id}`),
};

export const proveedoresService = {
  getAll: (search = '') => api.get('/proveedores', { params: { search } }),
  getById: (id) => api.get(`/proveedores/${id}`),
  create: (data) => api.post('/proveedores', data),
  update: (id, data) => api.put(`/proveedores/${id}`, data),
  delete: (id) => api.delete(`/proveedores/${id}`),
};

export const paquetesService = {
  getAll: (search = '') => api.get('/paquetes', { params: { search } }),
  getById: (id) => api.get(`/paquetes/${id}`),
  create: (data) => api.post('/paquetes', data),
  update: (id, data) => api.put(`/paquetes/${id}`, data),
  delete: (id) => api.delete(`/paquetes/${id}`),
};

export const reservasService = {
  getAll: (search = '') => api.get('/reservas', { params: { search } }),
  getById: (id) => api.get(`/reservas/${id}`),
  create: (data) => api.post('/reservas', data),
  update: (id, data) => api.put(`/reservas/${id}`, data),
  delete: (id) => api.delete(`/reservas/${id}`),
  getProveedores: (id) => api.get(`/reservas/${id}/proveedores`),
  addProveedor: (id, data) => api.post(`/reservas/${id}/proveedores`, data),
  updateProveedor: (id, rpId, data) => api.put(`/reservas/${id}/proveedores/${rpId}`, data),
  deleteProveedor: (id, rpId) => api.delete(`/reservas/${id}/proveedores/${rpId}`),
};

export default api;
