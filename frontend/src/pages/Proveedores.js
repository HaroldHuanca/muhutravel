import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { proveedoresService } from '../services/api';
// Importamos iconos y PDF
import { Plus, Eye, Printer, X } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

function Proveedores({ user, onLogout }) {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarPDF, setMostrarPDF] = useState(false);

  // --- NUEVOS FILTROS ---
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroPais, setFiltroPais] = useState('');
  const [filtroCiudad, setFiltroCiudad] = useState('');

  // --- EFECTOS ---
  useEffect(() => {
    fetchProveedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      // La búsqueda por texto va al backend
      const response = await proveedoresService.getAll(search);
      setProveedores(response.data);
    } catch (err) {
      console.error('Error al obtener proveedores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este proveedor?')) {
      try {
        await proveedoresService.delete(id);
        fetchProveedores();
      } catch (err) {
        alert('Error al eliminar proveedor');
      }
    }
  };

  // --- LÓGICA DE FILTRADO (FRONTEND) ---

  // 1. Obtener listas únicas para los Selects
  const listaTipos = [...new Set(proveedores.map(p => p.tipo).filter(Boolean))];
  const listaPaises = [...new Set(proveedores.map(p => p.pais).filter(Boolean))];

  // La lista de ciudades depende del país seleccionado
  const listaCiudades = [...new Set(proveedores
    .filter(p => !filtroPais || p.pais === filtroPais)
    .map(p => p.ciudad)
    .filter(Boolean)
  )];

  // 2. Aplicar Filtros
  const proveedoresFiltrados = proveedores.filter((prov) => {
    const coincideTipo = filtroTipo ? prov.tipo === filtroTipo : true;
    const coincidePais = filtroPais ? prov.pais === filtroPais : true;
    const coincideCiudad = filtroCiudad ? prov.ciudad === filtroCiudad : true;
    
    return coincideTipo && coincidePais && coincideCiudad;
  });

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'email', label: 'Email' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'pais', label: 'País' },
  ];

  // Estilos (Mismos que en Clientes/Empleados para consistencia)
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
        <h1>Proveedores</h1>
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
                onClick={() => navigate('/inactivos/proveedores')}
                title="Ver proveedores inactivos"
              >
                <Eye size={20} />
                Ver Inactivos
              </button>

              <button
                className="btn-primary"
                onClick={() => navigate('/proveedores/new')}
              >
                <Plus size={20} />
                Nuevo Proveedor
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- VISTA PRINCIPAL --- */}
      {mostrarPDF ? (
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title="Reporte de Proveedores"
              columns={columns}
              data={proveedoresFiltrados} // Pasamos la data filtrada
            />
          </PDFViewer>
        </div>
      ) : (
        <>
          {/* --- BARRA DE FILTROS --- */}
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
                placeholder="Buscar por nombre, tipo o ciudad..."
              />
            </div>

            {/* 2. Filtro Tipo (Hotel, Transporte, etc.) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>Tipo de Servicio</label>
               <select 
                  style={selectStyle}
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
               >
                 <option value="">Todos los Tipos</option>
                 {listaTipos.map((tipo, index) => (
                   <option key={index} value={tipo}>{tipo}</option>
                 ))}
               </select>
            </div>

            {/* 3. Filtro País */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>País</label>
               <select 
                  style={selectStyle}
                  value={filtroPais}
                  onChange={(e) => {
                    setFiltroPais(e.target.value);
                    setFiltroCiudad('');
                  }}
               >
                 <option value="">Todos los Países</option>
                 {listaPaises.map((pais, index) => (
                   <option key={index} value={pais}>{pais}</option>
                 ))}
               </select>
            </div>

            {/* 4. Filtro Ciudad */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>Ciudad</label>
               <select 
                  style={selectStyle}
                  value={filtroCiudad}
                  onChange={(e) => setFiltroCiudad(e.target.value)}
                  disabled={!filtroPais && listaCiudades.length > 20}
               >
                 <option value="">Todas las Ciudades</option>
                 {listaCiudades.map((ciudad, index) => (
                   <option key={index} value={ciudad}>{ciudad}</option>
                 ))}
               </select>
            </div>

            {/* Botón Limpiar */}
            {(filtroTipo || filtroPais || filtroCiudad) && (
              <div style={{ paddingBottom: '2px' }}>
                <button 
                  onClick={() => { setFiltroTipo(''); setFiltroPais(''); setFiltroCiudad(''); }}
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
            columns={columns}
            data={proveedoresFiltrados} // Renderizamos los filtrados
            onEdit={user.rol !== 'agente' ? (id) => navigate(`/proveedores/edit/${id}`) : null}
            onDelete={user.rol !== 'agente' ? handleDelete : null}
            loading={loading}
          />
        </>
      )}

    </div>
  );
}

export default Proveedores;