import React, { useState, useEffect } from 'react';
import { getPendientesReport } from '../../services/reportes';
import { AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';

const PendientesReport = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const data = await getPendientesReport();
                // Ya no imprimimos en consola
                setReservas(data || []);
            } catch (error) {
                // Manejo silencioso de errores o solo log crítico
                console.error('Error fetching pendientes report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    // --- PROCESAMIENTO DE DATOS ---
    // Solo formateamos los números para que se vean bien, NO filtramos filas.
    // Si el backend lo envió, es porque es pendiente.
    const reservasVisuales = reservas.map(r => {
        // Priorizamos 'monto_pendiente' si viene del SQL, sino calculamos
        let deuda = 0;
        
        if (r.monto_pendiente !== undefined && r.monto_pendiente !== null) {
            deuda = parseFloat(r.monto_pendiente);
        } else {
            // Fallback por si la propiedad se llama distinto
            const precio = parseFloat(r.precio_total || r.precio || 0);
            const pagado = parseFloat(r.total_pagado || 0);
            deuda = precio - pagado;
        }

        return {
            ...r,
            deuda_calculada: deuda
        };
    });

    const totalDeuda = reservasVisuales.reduce((sum, r) => sum + r.deuda_calculada, 0);

    return (
        <div className="report-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#333', margin: 0 }}>Reservas Pendientes de Pago</h2>
                
                <div style={{ 
                    backgroundColor: '#fff3cd', 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    border: '1px solid #ffeeba',
                    color: '#856404',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <AlertCircle size={20} />
                    <div>
                        <span style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>TOTAL POR COBRAR</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>S/ {totalDeuda.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Cargando datos...</div>
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
                                <th style={{ padding: '12px', textAlign: 'right' }}>Monto Pendiente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasVisuales.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                            <CheckCircle size={32} color="#28a745" />
                                            <span>¡Excelente! No hay reservas pendientes de atención.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reservasVisuales.map((reserva) => (
                                    <tr key={reserva.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>
                                            {reserva.fecha_reserva ? new Date(reserva.fecha_reserva).toLocaleDateString() : '-'}
                                        </td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{reserva.numero_reserva}</td>
                                        <td style={{ padding: '12px' }}>{reserva.cliente_nombres} {reserva.cliente_apellidos}</td>
                                        <td style={{ padding: '12px' }}>{reserva.paquete_nombre}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <span style={{ 
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 10px', 
                                                borderRadius: '12px', 
                                                fontSize: '11px', 
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                backgroundColor: (reserva.estado || '').toLowerCase().includes('pendiente') ? '#fff3cd' : '#d1e7dd',
                                                color: (reserva.estado || '').toLowerCase().includes('pendiente') ? '#856404' : '#0f5132'
                                            }}>
                                                {(reserva.estado || '').toLowerCase().includes('pendiente') && <Clock size={12} />}
                                                {reserva.estado}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right', color: '#dc3545', fontWeight: 'bold' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                <DollarSign size={14} />
                                                {reserva.deuda_calculada.toFixed(2)}
                                            </div>
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

export default PendientesReport;