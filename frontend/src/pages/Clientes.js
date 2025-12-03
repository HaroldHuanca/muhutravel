import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { clientesService } from '../services/api';
// Importamos iconos
import { Plus, Eye, Printer, X } from 'lucide-react';
// Importamos la librería de PDF y el componente genérico
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

function Clientes({ user, onLogout }) {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [clientes, setClientes] = useState([]); 
  const [search, setSearch] = useState('');     
  const [loading, setLoading] = useState(false);
  const [mostrarPDF, setMostrarPDF] = useState(false);

  // Estados para los Filtros de Select
  const [filtroPais, setFiltroPais] = useState('');
  const [filtroCiudad, setFiltroCiudad] = useState('');

  // --- EFECTOS ---
  useEffect(() => {
    fetchClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await clientesService.getAll(search);
      setClientes(response.data);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. NUEVA FUNCIÓN HANDLE DELETE CON SWEETALERT2
  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción. El cliente pasará a inactivos o se eliminará.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Azul
      cancelButtonColor: '#d33',     // Rojo
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Mostramos loading mientras borra
          setLoading(true);
          await clientesService.delete(id);
          
          // Alerta de Éxito
          Swal.fire(
            '¡Eliminado!',
            'El cliente ha sido eliminado correctamente.',
            'success'
          );
          
          // Recargamos la tabla
          fetchClientes();
        } catch (err) {
          console.error(err);
          // Alerta de Error
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el cliente. Verifique que no tenga reservas activas.',
            'error'
          );
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // --- FUNCIÓN: IR A RESERVAR ---
  const handleReservar = (cliente) => {
    navigate('/reservas/new', { 
      state: { clientePreseleccionado: cliente } 
    });
  };

  // --- LÓGICA DE FILTRADO (FRONTEND) ---
  const listaPaises = [...new Set(clientes.map(c => c.pais).filter(Boolean))];

  const listaCiudades = [...new Set(clientes
    .filter(c => !filtroPais || c.pais === filtroPais)
    .map(c => c.ciudad)
    .filter(Boolean)
  )];

  const clientesFiltrados = clientes.filter((cliente) => {
    const coincidePais = filtroPais ? cliente.pais === filtroPais : true;
    const coincideCiudad = filtroCiudad ? cliente.ciudad === filtroCiudad : true;
    return coincidePais && coincideCiudad;
  });

  const columns = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'documento', label: 'Documento' },
    { key: 'email', label: 'Email' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'pais', label: 'País' },
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
        <h1>Clientes</h1>
        <div style={{ display: 'flex', gap: '10px' }}>

          {/* Botón PDF / Imprimir */}
          <button
            className="btn-primary"
            onClick={() => setMostrarPDF(!mostrarPDF)}
            style={{ backgroundColor: '#6c757d', minWidth: '140px' }}
            title={mostrarPDF ? "Volver a la tabla" : "Generar reporte PDF"}
          >
            {mostrarPDF ? <X size={20} /> : <Printer size={20} />}
            {mostrarPDF ? ' Cerrar PDF' : ' Imprimir'}
          </button>

          {/* Botón Ver Inactivos */}
          {user.rol !== 'agente' && (
            <button
              className="btn-primary"
              onClick={() => navigate('/inactivos/clientes')}
              title="Ver clientes inactivos"
            >
              <Eye size={20} />
              Ver Inactivos
            </button>
          )}

          {/* Botón Nuevo Cliente */}
          <button
            className="btn-primary"
            onClick={() => navigate('/clientes/new')}
          >
            <Plus size={20} />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}

      {mostrarPDF ? (
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title="Reporte de Clientes"
              columns={columns}
              data={clientesFiltrados}
            />
          </PDFViewer>
        </div>
      ) : (
        <>
          {/* --- BARRA DE FILTROS --- */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            alignItems: 'flex-end',
            marginBottom: '20px', 
            flexWrap: 'wrap',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            
            {/* 1. Buscador General */}
            <div style={{ flex: 2, minWidth: '300px' }}>
              <label style={labelStyle}>Búsqueda General</label>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar por nombre, documento o email..."
              />
            </div>

            {/* 2. Filtro País */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>Filtrar por País</label>
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

            {/* 3. Filtro Ciudad */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>Filtrar por Ciudad</label>
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
            {(filtroPais || filtroCiudad) && (
              <div style={{ paddingBottom: '2px' }}>
                <button 
                  onClick={() => { setFiltroPais(''); setFiltroCiudad(''); }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #dc3545',
                    color: '#dc3545',
                    padding: '8px 15px',
                    height: '42px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  title="Borrar filtros de ubicación"
                >
                  Limpiar
                </button>
              </div>
            )}
          </div>

          {/* --- TABLA --- */}
          <Table
            columns={columns}
            data={clientesFiltrados} 
            onEdit={user.rol !== 'agente' ? (id) => navigate(`/clientes/edit/${id}`) : null}
            onDelete={user.rol !== 'agente' ? handleDelete : null}
            onReservar={handleReservar} 
            loading={loading}
          />
        </>
      )}

    </div>
  );
}

export default Clientes;