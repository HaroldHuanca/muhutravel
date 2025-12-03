import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
// No usamos el componente Table genérico aquí porque tu tabla tiene botones personalizados (Proveedores)
import { reservasService } from '../services/api';
import { Plus, Link2, Printer, X } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

function Reservas({ user, onLogout }) {
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [reservas, setReservas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarPDF, setMostrarPDF] = useState(false);

  // --- NUEVOS FILTROS ---
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPaquete, setFiltroPaquete] = useState('');

  useEffect(() => {
    fetchReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      // La búsqueda de texto sigue yendo al backend
      const response = await reservasService.getAll(search);
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

  // --- LÓGICA DE FILTRADO (FRONTEND) ---

  // 1. Obtener listas únicas para los Selects
  const listaEstados = [...new Set(reservas.map(r => r.estado).filter(Boolean))];
  const listaPaquetes = [...new Set(reservas.map(r => r.paquete_nombre).filter(Boolean))];

  // 2. Filtrar la data en memoria
  const reservasFiltradas = reservas.filter((item) => {
    const matchEstado = filtroEstado ? item.estado === filtroEstado : true;
    const matchPaquete = filtroPaquete ? item.paquete_nombre === filtroPaquete : true;
    return matchEstado && matchPaquete;
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada': return '#48bb78'; // Verde
      case 'pendiente': return '#f6ad55';  // Naranja
      case 'cancelada': return '#f56565';  // Rojo
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
        <span style={{ color: getEstadoColor(val), fontWeight: 'bold', textTransform: 'capitalize' }}>
          {val}
        </span>
      ),
    },
  ];

  // Estilos
  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    minWidth: '160px',
    outline: 'none',
    cursor: 'pointer',
    height: '42px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#495057'
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Reservas</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          
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

      {mostrarPDF ? (
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title="Reporte de Reservas"
              columns={columns}
              data={reservasFiltradas} // Usamos la data filtrada
            />
          </PDFViewer>
        </div>
      ) : (
        <>
          {/* --- BARRA DE FILTROS INTEGRADA --- */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            alignItems: 'flex-end', 
            marginBottom: '20px', 
            flexWrap: 'wrap',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            
            {/* 1. Buscador Texto */}
            <div style={{ flex: 2, minWidth: '300px' }}>
              <label style={labelStyle}>Búsqueda General</label>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar por número, cliente o paquete..."
              />
            </div>

            {/* 2. Filtro Estado */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>Filtrar por Estado</label>
               <select 
                  style={selectStyle}
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
               >
                 <option value="">Todos los Estados</option>
                 {listaEstados.map((est, index) => (
                   <option key={index} value={est}>{est}</option>
                 ))}
               </select>
            </div>

            {/* 3. Filtro Paquete */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>Filtrar por Paquete</label>
               <select 
                  style={selectStyle}
                  value={filtroPaquete}
                  onChange={(e) => setFiltroPaquete(e.target.value)}
               >
                 <option value="">Todos los Paquetes</option>
                 {listaPaquetes.map((paq, index) => (
                   <option key={index} value={paq}>{paq}</option>
                 ))}
               </select>
            </div>

            {/* Botón Limpiar */}
            {(filtroEstado || filtroPaquete) && (
              <div style={{ paddingBottom: '2px' }}>
                <button 
                  onClick={() => { setFiltroEstado(''); setFiltroPaquete(''); }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #dc3545',
                    color: '#dc3545',
                    padding: '8px 15px',
                    height: '42px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Limpiar
                </button>
              </div>
            )}
          </div>

          {/* --- TABLA MANUAL (Para mantener tus botones personalizados) --- */}
          {loading ? (
            <div className="table-loading">Cargando datos...</div>
          ) : reservasFiltradas.length === 0 ? (
            <div className="table-empty">No hay reservas disponibles con estos filtros</div>
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
                  {/* IMPORTANTE: Mapeamos reservasFiltradas, no reservas */}
                  {reservasFiltradas.map((row, idx) => (
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