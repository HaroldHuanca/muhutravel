import React, { useState } from 'react';
import VentasReport from '../components/Reportes/VentasReport';
import PaquetesReport from '../components/Reportes/PaquetesReport';
import ClientesReport from '../components/Reportes/ClientesReport';
import PendientesReport from '../components/Reportes/PendientesReport';
// Importamos iconos para darle un look más profesional a las pestañas
import { Printer, TrendingUp, Package, Users, Clock } from 'lucide-react';
import './ListPage.css'; // Usamos el CSS compartido

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

    // Estilo común para los botones de las pestañas
    const getTabStyle = (isActive) => ({
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: isActive ? '#007bff' : '#e9ecef', // Azul activo, Gris inactivo
        color: isActive ? 'white' : '#495057',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
        transition: 'all 0.2s'
    });

    return (
        <div className="container">
            {/* 1. CABECERA ESTÁNDAR (Igual a Clientes/Reservas) */}
            <div className="page-header no-print">
                <h1>Módulo de Reportes</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        className="btn-primary" 
                        onClick={() => window.print()}
                        style={{ backgroundColor: '#6c757d', minWidth: '140px' }}
                        title="Imprimir vista actual"
                    >
                        <Printer size={20} /> Imprimir Pantalla
                    </button>
                </div>
            </div>

            {/* 2. PESTAÑAS DE NAVEGACIÓN (Estilo Pills con Iconos) */}
            <div className="tabs-container no-print" style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                    style={getTabStyle(activeTab === 'ventas')}
                    onClick={() => setActiveTab('ventas')}
                >
                    <TrendingUp size={18} /> Ventas
                </button>
                
                <button
                    style={getTabStyle(activeTab === 'paquetes')}
                    onClick={() => setActiveTab('paquetes')}
                >
                    <Package size={18} /> Paquetes Populares
                </button>
                
                <button
                    style={getTabStyle(activeTab === 'clientes')}
                    onClick={() => setActiveTab('clientes')}
                >
                    <Users size={18} /> Clientes
                </button>
                
                <button
                    style={getTabStyle(activeTab === 'pendientes')}
                    onClick={() => setActiveTab('pendientes')}
                >
                    <Clock size={18} /> Reservas Pendientes
                </button>
            </div>

            {/* 3. CONTENIDO DEL REPORTE */}
            <div className="reportes-content" style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {renderReport()}
            </div>
        </div>
    );
};

export default Reportes;