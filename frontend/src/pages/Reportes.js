import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VentasReport from '../components/Reportes/VentasReport';
import PaquetesReport from '../components/Reportes/PaquetesReport';
import ClientesReport from '../components/Reportes/ClientesReport';
import PendientesReport from '../components/Reportes/PendientesReport';
import '../App.css'; // Ensure styles are loaded

const Reportes = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('ventas');

    const renderReport = () => {
        switch (activeTab) {
            case 'ventas':
                return <VentasReport />;
            case 'paquetes':
                return <PaquetesReport />;
            case 'clientes':
                return <ClientesReport />;
            case 'pendientes':
                return <PendientesReport />;
            default:
                return <VentasReport />;
        }
    };

    return (
        <div className="page-wrapper">
            <Header user={user} onLogout={onLogout} />
            <div className="page-content">
                <div className="container">
                    <div className="reportes-page">
                        <div className="reportes-header no-print">
                            <h1>Módulo de Reportes</h1>
                            <button onClick={() => window.print()} className="btn-print">
                                Imprimir Reporte
                            </button>
                        </div>

                        <div className="reportes-tabs no-print">
                            <button
                                className={activeTab === 'ventas' ? 'active' : ''}
                                onClick={() => setActiveTab('ventas')}
                            >
                                Ventas
                            </button>
                            <button
                                className={activeTab === 'paquetes' ? 'active' : ''}
                                onClick={() => setActiveTab('paquetes')}
                            >
                                Paquetes Populares
                            </button>
                            <button
                                className={activeTab === 'clientes' ? 'active' : ''}
                                onClick={() => setActiveTab('clientes')}
                            >
                                Clientes
                            </button>
                            <button
                                className={activeTab === 'pendientes' ? 'active' : ''}
                                onClick={() => setActiveTab('pendientes')}
                            >
                                Reservas Pendientes
                            </button>
                        </div>

                        <div className="reportes-content">
                            {renderReport()}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Reportes;
