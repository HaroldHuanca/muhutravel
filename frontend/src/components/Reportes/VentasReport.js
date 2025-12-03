import React, { useState, useEffect } from 'react';
import { getVentasReport } from '../../services/reportes';
// Solo necesitamos Trash2 para limpiar, ya no el Search porque es automático
import { Trash2 } from 'lucide-react';

const VentasReport = () => {
    const [ventas, setVentas] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: ''
    });
    const [loading, setLoading] = useState(false);

    // --- LÓGICA DE CARGA ---
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

    // --- FILTRADO AUTOMÁTICO ---
    // El array [filters] hace que se ejecute cada vez que cambias una fecha o estado
    useEffect(() => {
        fetchReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleClearFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            status: ''
        });
        // Al resetear el estado, el useEffect se disparará solo y recargará todo
    };

    // --- ESTILOS (Idénticos a Clientes/Reservas) ---
    const filterContainerStyle = {
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-end', // Alinea inputs y botón al fondo
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
        minWidth: '160px',
        width: '100%',
        outline: 'none',
        height: '42px', // Altura fija estándar
        cursor: 'pointer',
        color: '#495057'
    };

    return (
        <div className="report-container">
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Reporte de Ventas</h2>

            {/* --- BARRA DE FILTROS AUTOMÁTICA --- */}
            <div style={filterContainerStyle}>
                
                {/* 1. Fecha Inicio */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={labelStyle}>Fecha Inicio</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        style={inputStyle}
                        placeholder="dd/mm/aaaa"
                    />
                </div>

                {/* 2. Fecha Fin */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={labelStyle}>Fecha Fin</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        style={inputStyle}
                    />
                </div>

                {/* 3. Estado */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={labelStyle}>Estado</label>
                    <select 
                        name="status" 
                        value={filters.status} 
                        onChange={handleFilterChange}
                        style={inputStyle}
                    >
                        <option value="">Todos los Estados</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>

                {/* 4. Botón Limpiar (Solo aparece si hay filtros) */}
                {(filters.startDate || filters.endDate || filters.status) && (
                    <div style={{ paddingBottom: '2px' }}> {/* Ajuste fino de alineación */}
                        <button 
                            type="button" 
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
                    <div className="table-loading">Cargando datos...</div>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f1f3f5', borderBottom: '2px solid #dee2e6' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Reserva</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Paquete</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                        No se encontraron ventas en este rango.
                                    </td>
                                </tr>
                            ) : (
                                ventas.map((venta) => (
                                    <tr key={venta.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{new Date(venta.fecha_reserva).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{venta.numero_reserva}</td>
                                        <td style={{ padding: '12px' }}>{venta.cliente_nombres} {venta.cliente_apellidos}</td>
                                        <td style={{ padding: '12px' }}>{venta.paquete_nombre}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <span style={{ 
                                                padding: '4px 10px', 
                                                borderRadius: '12px', 
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                backgroundColor: venta.estado === 'confirmada' ? '#d1e7dd' : (venta.estado === 'pendiente' ? '#fff3cd' : '#f8d7da'),
                                                color: venta.estado === 'confirmada' ? '#0f5132' : (venta.estado === 'pendiente' ? '#664d03' : '#842029')
                                            }}>
                                                {venta.estado}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>S/ {parseFloat(venta.precio_total).toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                            
                            {/* Totales */}
                            {ventas.length > 0 && (
                                <tr style={{ backgroundColor: '#f8f9fa', borderTop: '2px solid #dee2e6' }}>
                                    <td colSpan="5" style={{ textAlign: 'right', padding: '15px', fontSize: '16px' }}><strong>Total Ventas:</strong></td>
                                    <td style={{ textAlign: 'right', padding: '15px', fontSize: '16px', color: '#28a745' }}>
                                        <strong>S/ {ventas.reduce((sum, v) => sum + parseFloat(v.precio_total), 0).toFixed(2)}</strong>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VentasReport;