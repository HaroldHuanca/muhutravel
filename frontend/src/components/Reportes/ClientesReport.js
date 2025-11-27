import React, { useState, useEffect } from 'react';
import { getClientesReport } from '../../services/reportes';

const ClientesReport = () => {
    const [clientes, setClientes] = useState([]);
    const [filters, setFilters] = useState({
        country: '',
        minSpent: ''
    });
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const data = await getClientesReport(filters);
            setClientes(data);
        } catch (error) {
            console.error('Error fetching clientes report:', error);
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
            <h2>Reporte de Clientes</h2>

            <form onSubmit={handleSubmit} className="report-filters">
                <div className="filter-group">
                    <label>País:</label>
                    <input
                        type="text"
                        name="country"
                        value={filters.country}
                        onChange={handleFilterChange}
                        placeholder="Ej: Peru"
                    />
                </div>
                <div className="filter-group">
                    <label>Gasto Mínimo:</label>
                    <input
                        type="number"
                        name="minSpent"
                        value={filters.minSpent}
                        onChange={handleFilterChange}
                        placeholder="0.00"
                    />
                </div>
                <button type="submit" className="btn-filter">Filtrar</button>
            </form>

            <div className="print-filters-info">
                <p><strong>Filtros aplicados:</strong></p>
                <p>País: {filters.country || 'Todos'}</p>
                <p>Gasto Mínimo: {filters.minSpent || '0'}</p>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Email</th>
                            <th>País</th>
                            <th>Total Reservas</th>
                            <th>Total Gastado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>{cliente.nombres} {cliente.apellidos}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.pais}</td>
                                <td>{cliente.total_reservas}</td>
                                <td>S/ {parseFloat(cliente.total_gastado).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ClientesReport;
