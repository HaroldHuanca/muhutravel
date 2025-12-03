import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reportes';

const getAuthHeader = () => {
    const token = sessionStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getVentasReport = async (filters) => {
    const response = await api.get('/reportes/ventas', { params: filters });
    return response.data;
};

export const getPaquetesPopularesReport = async () => {
    const response = await api.get('/reportes/paquetes-populares');
    return response.data;
};

export const getClientesReport = async (filters) => {
    const response = await api.get('/reportes/clientes', { params: filters });
    return response.data;
};

export const getPendientesReport = async () => {
    const response = await api.get('/reportes/reservas-pendientes');
    return response.data;
};
