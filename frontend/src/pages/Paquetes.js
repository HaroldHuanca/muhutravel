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
  const [paquetes, setPaquetes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('REGULAR'); // REGULAR | PRIVADO
  const [mostrarPDF, setMostrarPDF] = useState(false);

  useEffect(() => {
    fetchPaquetes();
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

  const filteredPaquetes = paquetes.filter(p => p.tipo === viewType);

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

      {/* TABS */}
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
              columns={getColumns().filter(c => c.key !== 'activo')} // Excluir columna estado si se desea o mantener
              data={filteredPaquetes}
            />
          </PDFViewer>
        </div>
      ) : (
        <>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre o destino..."
          />

          <Table
            columns={getColumns()}
            data={filteredPaquetes}
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