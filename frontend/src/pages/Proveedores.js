import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { proveedoresService } from '../services/api';
// 1. IMPORTAR LO NUEVO (Iconos y librería PDF)
import { Plus, Eye, Printer, X } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

function Proveedores({ user, onLogout }) {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. ESTADO PARA MOSTRAR/OCULTAR PDF
  const [mostrarPDF, setMostrarPDF] = useState(false);

  useEffect(() => {
    fetchProveedores();
  }, [search]);

  const fetchProveedores = async () => {
    setLoading(true);
    try {
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

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'email', label: 'Email' },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'pais', label: 'País' },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <h1>Proveedores</h1>
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
        </div>
      </div>

      {/* 4. LÓGICA DE VISUALIZACIÓN */}
      {mostrarPDF ? (
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title="Reporte de Proveedores"
              columns={columns}
              data={proveedores}
            />
          </PDFViewer>
        </div>
      ) : (
        <>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre, tipo o ciudad..."
          />

          <Table
            columns={columns}
            data={proveedores}
            onEdit={(id) => navigate(`/proveedores/edit/${id}`)}
            onDelete={handleDelete}
            loading={loading}
          />
        </>
      )}

    </div>
  );
}

export default Proveedores;