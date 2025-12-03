import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reportes';

const getAuthHeader = () => {
    const token = sessionStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getVentasReport = async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/ventas?${params}`, getAuthHeader());
    return response.data;
};

export const getPaquetesPopularesReport = async () => {
    const response = await axios.get(`${API_URL}/paquetes-populares`, getAuthHeader());
    return response.data;
};

export const getClientesReport = async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/clientes?${params}`, getAuthHeader());
    return response.data;
};

export const getPendientesReport = async () => {
    const response = await axios.get(`${API_URL}/reservas-pendientes`, getAuthHeader());
    return response.data;
};
