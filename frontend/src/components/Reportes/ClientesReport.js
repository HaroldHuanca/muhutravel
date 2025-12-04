import React, { useState, useEffect } from 'react';
import { getClientesReport } from '../../services/reportes';
// Importamos el icono de limpiar
import { Trash2 } from 'lucide-react';

const ClientesReport = () => {
    const [clientes, setClientes] = useState([]);
    const [filters, setFilters] = useState({
        country: '',
        minSpent: ''
    });
    const [loading, setLoading] = useState(false);

    // Estado para llenar el Select de países dinámicamente
    const [availableCountries, setAvailableCountries] = useState([]);

    // --- CARGA DE DATOS ---
    const fetchReport = async () => {
        setLoading(true);
        try {
            const data = await getClientesReport(filters);
            setClientes(data);

            // Si no hay filtro de país activo, actualizamos la lista de países disponibles
            // para el Select (basado en los datos recibidos)
            if (!filters.country) {
                const uniqueCountries = [...new Set(data.map(c => c.pais).filter(Boolean))];
                setAvailableCountries(uniqueCountries);
            }
        } catch (error) {
            console.error('Error fetching clientes report:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- FILTRADO AUTOMÁTICO ---
    useEffect(() => {
        fetchReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]); // Se ejecuta cada vez que cambia un filtro

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleClearFilters = () => {
        setFilters({
            country: '',
            minSpent: ''
        });
    };

    // --- ESTILOS (Consistentes con VentasReport y Maestros) ---
    const filterContainerStyle = {
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginBottom: '20px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '600',
        fontSize: '14px',
        color: '#495057'
    };

    const inputStyle = {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        minWidth: '180px',
        width: '100%',
        outline: 'none',
        height: '42px',
        cursor: 'pointer',
        color: '#495057'
    };

    return (
        <div className="report-container">
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Reporte de Clientes</h2>

            {/* --- BARRA DE FILTROS --- */}
            <div style={filterContainerStyle}>
                
                {/* 1. Filtro País (Select Dinámico) */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={labelStyle}>País</label>
                    <select
                        name="country"
                        value={filters.country}
                        onChange={handleFilterChange}
                        style={inputStyle}
                    >
                        <option value="">Todos los Países</option>
                        {availableCountries.map((pais, index) => (
                            <option key={index} value={pais}>{pais}</option>
                        ))}
                    </select>
                </div>

                {/* 2. Filtro Gasto Mínimo */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={labelStyle}>Gasto Mínimo (S/.)</label>
                    <input
                        type="number"
                        name="minSpent"
                        value={filters.minSpent}
                        onChange={handleFilterChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        style={inputStyle}
                    />
                </div>

                {/* 3. Botón Limpiar */}
                {(filters.country || filters.minSpent) && (
                    <div style={{ paddingBottom: '2px' }}>
                        <button 
                            onClick={handleClearFilters}
                            style={{
                                height: '42px',
                                background: 'transparent',
                                border: '1px solid #dc3545',
                                color: '#dc3545',
                                borderRadius: '4px',
                                padding: '0 15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            title="Borrar filtros"
                        >
                            <Trash2 size={18} /> Limpiar
                        </button>
                    </div>
                )}
            </div>

            {/* --- TABLA DE RESULTADOS --- */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    Cargando datos...
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f1f3f5', borderBottom: '2px solid #dee2e6' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>País</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Total Reservas</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Total Gastado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                        No se encontraron clientes con estos criterios.
                                    </td>
                                </tr>
                            ) : (
                                clientes.map((cliente) => (
                                    <tr key={cliente.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px', fontWeight: '500' }}>
                                            {cliente.nombres} {cliente.apellidos}
                                        </td>
                                        <td style={{ padding: '12px', color: '#666' }}>{cliente.email}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <span style={{ backgroundColor: '#e9ecef', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                                {cliente.pais}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            {cliente.total_reservas}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                                            S/ {parseFloat(cliente.total_gastado).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ClientesReport;