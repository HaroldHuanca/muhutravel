import React, { useState, useEffect } from 'react';
import { getPendientesReport } from '../../services/reportes';

const PendientesReport = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const data = await getPendientesReport();
                setReservas(data);
            } catch (error) {
                console.error('Error fetching pendientes report:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    return (
        <div className="report-container">
            <h2>Reservas Pendientes de Pago/Confirmación</h2>

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
                            <th>Monto Pendiente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map((reserva) => (
                            <tr key={reserva.id}>
                                <td>{new Date(reserva.fecha_reserva).toLocaleDateString()}</td>
                                <td>{reserva.numero_reserva}</td>
                                <td>{reserva.cliente_nombres} {reserva.cliente_apellidos}</td>
                                <td>{reserva.paquete_nombre}</td>
                                <td>S/ {parseFloat(reserva.monto_pendiente).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr className="total-row">
                            <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Pendiente:</strong></td>
                            <td><strong>S/ {reservas.reduce((sum, r) => sum + parseFloat(r.monto_pendiente), 0).toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PendientesReport;
