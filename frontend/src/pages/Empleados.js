import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { empleadosService } from '../services/api'; // Asegúrate de tener este servicio
// Iconos
import { Plus, Eye, Printer, X } from 'lucide-react';
// PDF
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

function Empleados({ user, onLogout }) {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarPDF, setMostrarPDF] = useState(false);

  // --- NUEVO FILTRO ---
  const [filtroPuesto, setFiltroPuesto] = useState('');

  // --- EFECTOS ---
  useEffect(() => {
    fetchEmpleados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      // La búsqueda de texto va al backend
      const response = await empleadosService.getAll(search);
      setEmpleados(response.data);
    } catch (err) {
      console.error('Error al obtener empleados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
      try {
        await empleadosService.delete(id);
        fetchEmpleados();
      } catch (err) {
        alert('Error al eliminar empleado');
      }
    }
  };

  // --- LÓGICA DE FILTRADO (FRONTEND) ---
  
  // 1. Obtener lista única de Puestos automáticamente
  const listaPuestos = [...new Set(empleados.map(e => e.puesto).filter(Boolean))];

  // 2. Filtrar la data
  const empleadosFiltrados = empleados.filter((emp) => {
    // Si hay filtro seleccionado, debe coincidir. Si no, pasa todo.
    return filtroPuesto ? emp.puesto === filtroPuesto : true;
  });

  // Definición de columnas
  const columns = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'puesto', label: 'Puesto' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' }, // Asumiendo que esta columna existe en tu DB
  ];

  // Estilos
  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    minWidth: '200px',
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
        <h1>Empleados</h1>
        <div style={{ display: 'flex', gap: '10px' }}>

          <button
            className="btn-primary"
            onClick={() => setMostrarPDF(!mostrarPDF)}
            style={{ backgroundColor: '#6c757d', minWidth: '140px' }}
          >
            {mostrarPDF ? <X size={20} /> : <Printer size={20} />}
            {mostrarPDF ? ' Cerrar PDF' : ' Imprimir'}
          </button>

          {user.rol !== 'agente' && (
            <button
              className="btn-primary"
              onClick={() => navigate('/inactivos/empleados')}
            >
              <Eye size={20} />
              Ver Inactivos
            </button>
          )}

          <button
            className="btn-primary"
            onClick={() => navigate('/empleados/new')}
          >
            <Plus size={20} />
            Nuevo Empleado
          </button>
        </div>
      </div>

      {mostrarPDF ? (
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title="Reporte de Empleados"
              columns={columns}
              data={empleadosFiltrados}
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
            
            {/* 1. Buscador */}
            <div style={{ flex: 2, minWidth: '300px' }}>
              <label style={labelStyle}>Búsqueda General</label>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar por nombre, puesto o email..."
              />
            </div>

            {/* 2. Filtro Puesto */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <label style={labelStyle}>Filtrar por Puesto</label>
               <select 
                  style={selectStyle}
                  value={filtroPuesto}
                  onChange={(e) => setFiltroPuesto(e.target.value)}
               >
                 <option value="">Todos los Puestos</option>
                 {listaPuestos.map((puesto, index) => (
                   <option key={index} value={puesto}>{puesto}</option>
                 ))}
               </select>
            </div>

            {/* Botón Limpiar */}
            {filtroPuesto && (
              <div style={{ paddingBottom: '2px' }}>
                <button 
                  onClick={() => setFiltroPuesto('')}
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
            data={empleadosFiltrados} // Pasamos la data filtrada
            onEdit={user.rol !== 'agente' ? (id) => navigate(`/empleados/edit/${id}`) : null}
            onDelete={user.rol !== 'agente' ? handleDelete : null}
            loading={loading}
          />
        </>
      )}

    </div>
  );
}

export default Empleados;