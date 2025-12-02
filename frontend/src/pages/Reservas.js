import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { reservasService } from '../services/api';
// 1. IMPORTAR LO NUEVO (Printer, X y las librerías de PDF)
import { Plus, Link2, Printer, X } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

function Reservas({ user, onLogout }) {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. ESTADO PARA MOSTRAR/OCULTAR PDF
  const [mostrarPDF, setMostrarPDF] = useState(false);

  useEffect(() => {
    fetchReservas();
  }, [search]);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const response = await reservasService.getAll(search);
      // Logs opcionales para depuración
      // console.log('Reservas obtenidas:', response.data);
      setReservas(response.data);
    } catch (err) {
      console.error('Error al obtener reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta reserva?')) {
      try {
        await reservasService.delete(id);
        fetchReservas();
      } catch (err) {
        alert('Error al eliminar reserva');
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada': return '#48bb78';
      case 'pendiente': return '#f6ad55';
      case 'cancelada': return '#f56565';
      default: return '#999';
    }
  };

  const columns = [
    { key: 'numero_reserva', label: 'Número' },
    { key: 'cliente_nombres', label: 'Cliente' },
    { key: 'paquete_nombre', label: 'Paquete' },
    { key: 'cantidad_personas', label: 'Personas' },
    { key: 'precio_total', label: 'Precio Total', render: (val) => `S/. ${val}` },
    { key: 'total_pagado', label: 'Monto Cancelado', render: (val) => `S/. ${parseFloat(val || 0).toFixed(2)}` },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => (
        <span style={{ color: getEstadoColor(val), fontWeight: 'bold' }}>
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <h1>Reservas</h1>
        <div style={{ display: 'flex', gap: '10px' }}>

          {/* 3. BOTÓN DE IMPRIMIR */}
          <button
            className="btn-primary"
            onClick={() => setMostrarPDF(!mostrarPDF)}
            style={{ backgroundColor: '#6c757d', minWidth: '140px' }}
            title={mostrarPDF ? "Volver a la tabla" : "Generar reporte PDF"}
          >
            {mostrarPDF ? <X size={20} /> : <Printer size={20} />}
            {mostrarPDF ? ' Cerrar PDF' : ' Imprimir'}
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate('/reservas/new')}
          >
            <Plus size={20} />
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* 4. LÓGICA DE VISUALIZACIÓN */}
      {mostrarPDF ? (
        // A) VISTA PDF
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title="Reporte de Reservas"
              columns={columns}
              data={reservas}
            />
          </PDFViewer>
        </div>
      ) : (
        // B) VISTA NORMAL (Buscador y Tabla Manual)
        <>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por número de reserva, cliente o paquete..."
          />

          {loading ? (
            <div className="table-loading">Cargando datos...</div>
          ) : reservas.length === 0 ? (
            <div className="table-empty">No hay reservas disponibles</div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((row, idx) => (
                    <tr key={row.id || idx}>
                      {columns.map((col) => (
                        <td key={col.key}>
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                      <td className="table-actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => navigate(`/reservas/edit/${row.id}`)}
                          title="Editar"
                        >
                          Editar
                        </button>
                        <button
                          className="action-btn"
                          style={{ backgroundColor: '#48bb78', color: 'white' }}
                          onClick={() => navigate(`/reservas/${row.id}/proveedores`)}
                          title="Asignar proveedores"
                        >
                          <Link2 size={18} />
                          Proveedores
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(row.id)}
                          title="Eliminar"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default Reservas;