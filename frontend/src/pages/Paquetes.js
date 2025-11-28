import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { paquetesService } from '../services/api';
// 1. IMPORTAR LO NUEVO (Iconos y librería PDF)
import { Plus, Eye, Printer, X } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

function Paquetes({ user, onLogout }) {
  const navigate = useNavigate();
  const [paquetes, setPaquetes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. ESTADO PARA MOSTRAR/OCULTAR PDF
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

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'destino', label: 'Destino' },
    { key: 'duracion_dias', label: 'Duración (días)' },
    { key: 'precio', label: 'Precio', render: (val) => `S/. ${val}` },
    { key: 'cupos', label: 'Cupos' },
    { key: 'proveedor_nombre', label: 'Proveedor' },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <h1>Paquetes Turísticos</h1>
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
        </div>
      </div>

      {/* 4. LÓGICA DE VISUALIZACIÓN */}
      {mostrarPDF ? (
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title="Reporte de Paquetes Turísticos"
              columns={columns}
              data={paquetes}
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
            columns={columns}
            data={paquetes}
            onEdit={(id) => navigate(`/paquetes/edit/${id}`)}
            onDelete={handleDelete}
            loading={loading}
          />
        </>
      )}

    </div>
  );
}

export default Paquetes;