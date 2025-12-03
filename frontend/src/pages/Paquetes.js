import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { paquetesService } from '../services/api';
import { Plus, Eye, Printer, X, Users, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

function Paquetes({ user, onLogout }) {
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [paquetes, setPaquetes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('REGULAR'); // REGULAR | PRIVADO
  const [mostrarPDF, setMostrarPDF] = useState(false);

  // --- NUEVOS FILTROS SELECT ---
  const [filtroDestino, setFiltroDestino] = useState('');
  const [filtroProveedor, setFiltroProveedor] = useState('');

  // --- EFECTOS ---
  useEffect(() => {
    fetchPaquetes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchPaquetes = async () => {
    setLoading(true);
    try {
      const response = await paquetesService.getAll(search);
      setPaquetes(response.data);
    } catch (err) {
      console.error('Error al obtener paquetes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este paquete?')) {
      try {
        await paquetesService.delete(id);
        fetchPaquetes();
      } catch (err) {
        alert('Error al eliminar paquete');
      }
    }
  };

  // --- LÓGICA DE FILTRADO (COMBINADA) ---
  
  // 1. Generar listas únicas para los Selects basándose en la data cargada
  const listaDestinos = [...new Set(paquetes.map(p => p.destino).filter(Boolean))];
  const listaProveedores = [...new Set(paquetes.map(p => p.proveedor_nombre).filter(Boolean))];

  // 2. Filtrar Data: Tipo (Tab) + Destino (Select) + Proveedor (Select)
  const filteredPaquetes = paquetes.filter(p => {
    // Primero respetamos el TAB seleccionado (Regular o Privado)
    const matchTipo = p.tipo === viewType;
    
    // Luego los selects
    const matchDestino = filtroDestino ? p.destino === filtroDestino : true;
    const matchProveedor = filtroProveedor ? p.proveedor_nombre === filtroProveedor : true;

    return matchTipo && matchDestino && matchProveedor;
  });

  // Configuración de Columnas
  const getColumns = () => {
    const commonColumns = [
      { key: 'nombre', label: 'Nombre' },
      { key: 'destino', label: 'Destino' },
      { key: 'duracion_dias', label: 'Duración (días)' },
      { key: 'proveedor_nombre', label: 'Proveedor' },
      {
        key: 'activo',
        label: 'Estado',
        render: (val) => val ? <span className="badge badge-success">Activo</span> : <span className="badge badge-danger">Inactivo</span>
      }
    ];

    if (viewType === 'REGULAR') {
      return [
        ...commonColumns,
        { key: 'precio', label: 'Precio (Persona)', render: (val) => `S/. ${val}` },
        { key: 'min_cupos', label: 'Min. Salida' },
        {
          key: 'cupos',
          label: 'Cupos',
          render: (_, row) => {
            const current = parseInt(row.reservas_actuales || 0);
            const min = row.min_cupos || 1;
            const max = row.cupos;
            const isMet = current >= min;

            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: isMet ? 'green' : 'red', fontWeight: 'bold' }}>
                {isMet ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{current} / {max}</span>
              </div>
            );
          }
        }
      ];
    } else {
      return [
        ...commonColumns,
        { key: 'precio_grupo', label: 'Precio (Grupo)', render: (val) => `S/. ${val}` },
        { key: 'max_pasajeros_recomendado', label: 'Max Pax Rec.' },
        { key: 'precio_adicional_persona', label: 'Precio Extra', render: (val) => val ? `S/. ${val}` : '-' }
      ];
    }
  };

  // Estilos (Consistentes con las otras páginas)
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
        <h1>Paquetes Turísticos</h1>
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

          {user.rol !== 'agente' && (
            <>
              <button
                className="btn-primary"
                onClick={() => navigate('/inactivos/paquetes')}
                title="Ver paquetes inactivos"
              >
                <Eye size={20} />
                Ver Inactivos
              </button>

              <button
                className="btn-primary"
                onClick={() => navigate('/paquetes/new')}
              >
                <Plus size={20} />
                Nuevo Paquete
              </button>
            </>
          )}
        </div>
      </div>

      {/* TABS DE TIPO DE TOUR */}
      <div className="tabs-container" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          className={`tab-button ${viewType === 'REGULAR' ? 'active' : ''}`}
          onClick={() => setViewType('REGULAR')}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: viewType === 'REGULAR' ? '#007bff' : '#e9ecef',
            color: viewType === 'REGULAR' ? 'white' : '#495057',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Users size={18} /> Tours Regulares
        </button>
        <button
          className={`tab-button ${viewType === 'PRIVADO' ? 'active' : ''}`}
          onClick={() => setViewType('PRIVADO')}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: viewType === 'PRIVADO' ? '#007bff' : '#e9ecef',
            color: viewType === 'PRIVADO' ? 'white' : '#495057',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Package size={18} /> Tours Privados
        </button>
      </div>

      {mostrarPDF ? (
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title={`Reporte de Paquetes Turísticos (${viewType})`}
              columns={getColumns().filter(c => c.key !== 'activo')}
              data={filteredPaquetes}
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
            <div style={{ flex: 2, minWidth: '250px' }}>
              <label style={labelStyle}>Búsqueda General</label>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar por nombre o destino..."
              />
            </div>

            {/* 2. Filtro Destino */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>Filtrar por Destino</label>
               <select 
                  style={selectStyle}
                  value={filtroDestino}
                  onChange={(e) => setFiltroDestino(e.target.value)}
               >
                 <option value="">Todos los Destinos</option>
                 {listaDestinos.map((destino, index) => (
                   <option key={index} value={destino}>{destino}</option>
                 ))}
               </select>
            </div>

            {/* 3. Filtro Proveedor */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>Filtrar por Proveedor</label>
               <select 
                  style={selectStyle}
                  value={filtroProveedor}
                  onChange={(e) => setFiltroProveedor(e.target.value)}
               >
                 <option value="">Todos los Proveedores</option>
                 {listaProveedores.map((prov, index) => (
                   <option key={index} value={prov}>{prov}</option>
                 ))}
               </select>
            </div>

            {/* Botón Limpiar */}
            {(filtroDestino || filtroProveedor) && (
              <div style={{ paddingBottom: '2px' }}>
                <button 
                  onClick={() => { setFiltroDestino(''); setFiltroProveedor(''); }}
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

          <Table
            columns={getColumns()}
            data={filteredPaquetes} // Usamos la lista filtrada
            onEdit={user.rol !== 'agente' ? (id) => navigate(`/paquetes/edit/${id}`) : null}
            onDelete={user.rol !== 'agente' ? handleDelete : null}
            loading={loading}
          />
        </>
      )}

    </div>
  );
}

export default Paquetes;