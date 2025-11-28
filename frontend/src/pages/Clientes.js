import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { clientesService } from '../services/api';
// Importamos iconos adicionales (Printer, X)
import { Plus, Eye, Printer, X } from 'lucide-react';
// Importamos la librería de PDF y el componente genérico
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

function Clientes({ user, onLogout }) {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado para controlar si mostramos el PDF o la Tabla normal
  const [mostrarPDF, setMostrarPDF] = useState(false);

  useEffect(() => {
    fetchClientes();
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

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      try {
        await clientesService.delete(id);
        fetchClientes();
      } catch (err) {
        alert('Error al eliminar cliente');
      }
    }
  };

  const columns = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'documento', label: 'Documento' },
    { key: 'email', label: 'Email' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'pais', label: 'País' },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <h1>Clientes</h1>
        <div style={{ display: 'flex', gap: '10px' }}>

          {/* --- BOTÓN DE IMPRIMIR / PDF --- */}
          <button
            className="btn-primary"
            onClick={() => setMostrarPDF(!mostrarPDF)}
            style={{ backgroundColor: '#6c757d', minWidth: '140px' }} // Gris para diferenciar
            title={mostrarPDF ? "Volver a la tabla" : "Generar reporte PDF"}
          >
            {mostrarPDF ? <X size={20} /> : <Printer size={20} />}
            {mostrarPDF ? ' Cerrar PDF' : ' Imprimir'}
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate('/inactivos/clientes')}
            title="Ver clientes inactivos"
          >
            <Eye size={20} />
            Ver Inactivos
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate('/clientes/new')}
          >
            <Plus size={20} />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* --- SECCIÓN LÓGICA: O VEMOS EL PDF O VEMOS LA TABLA --- */}

      {mostrarPDF ? (
        // 1. VISOR DE PDF
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title="Reporte de Clientes"
              columns={columns}
              data={clientes}
            />
          </PDFViewer>
        </div>
      ) : (
        // 2. VISTA NORMAL (BUSCADOR Y TABLA)
        <>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre, documento o email..."
          />

          <Table
            columns={columns}
            data={clientes}
            onEdit={(id) => navigate(`/clientes/edit/${id}`)}
            onDelete={handleDelete}
            loading={loading}
          />
        </>
      )}

    </div>
  );
}

export default Clientes;