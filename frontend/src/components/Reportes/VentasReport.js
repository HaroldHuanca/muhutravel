import React, { useState, useEffect } from 'react';
import { getVentasReport } from '../../services/reportes';

const VentasReport = () => {
    const [ventas, setVentas] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: ''
    });
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const data = await getVentasReport(filters);
            setVentas(data);
        } catch (error) {
            console.error('Error fetching ventas report:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchReport();
    };

    return (
        <div className="report-container">
            <h2>Reporte de Ventas</h2>

            <form onSubmit={handleSubmit} className="report-filters">
                <div className="filter-group">
                    <label>Fecha Inicio:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="filter-group">
                    <label>Fecha Fin:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="filter-group">
                    <label>Estado:</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange}>
                        <option value="">Todos</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>
                <button type="submit" className="btn-filter">Filtrar</button>
            </form>

            <div className="print-filters-info">
                <p><strong>Filtros aplicados:</strong></p>
                <p>Fecha Inicio: {filters.startDate || 'Todas'}</p>
                <p>Fecha Fin: {filters.endDate || 'Todas'}</p>
                <p>Estado: {filters.status || 'Todos'}</p>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Reserva</th>
                            <th>Cliente</th>
                            <th>Paquete</th>
                            <th>Estado</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map((venta) => (
                            <tr key={venta.id}>
                                <td>{new Date(venta.fecha_reserva).toLocaleDateString()}</td>
                                <td>{venta.numero_reserva}</td>
                                <td>{venta.cliente_nombres} {venta.cliente_apellidos}</td>
                                <td>{venta.paquete_nombre}</td>
                                <td>{venta.estado}</td>
                                <td>S/ {venta.precio_total}</td>
                            </tr>
                        ))}
                        <tr className="total-row">
                            <td colSpan="5" style={{ textAlign: 'right' }}><strong>Total:</strong></td>
                            <td><strong>S/ {ventas.reduce((sum, v) => sum + parseFloat(v.precio_total), 0).toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VentasReport;
