import React, { useState, useEffect } from 'react';
import { getPaquetesPopularesReport } from '../../services/reportes';

const PaquetesReport = () => {
    const [paquetes, setPaquetes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const data = await getPaquetesPopularesReport();
                setPaquetes(data);
            } catch (error) {
                console.error('Error fetching paquetes report:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    return (
        <div className="report-container">
            <h2>Paquetes Populares</h2>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Paquete</th>
                            <th>Total Reservas</th>
                            <th>Ingresos Generados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paquetes.map((pkg, index) => (
                            <tr key={index}>
                                <td>{pkg.nombre}</td>
                                <td>{pkg.total_reservas}</td>
                                <td>S/ {pkg.total_ingresos ? parseFloat(pkg.total_ingresos).toFixed(2) : '0.00'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PaquetesReport;
