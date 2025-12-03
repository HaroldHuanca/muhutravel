import api from './api';

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
