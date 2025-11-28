import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { empleadosService } from '../services/api';
// 1. IMPORTAR ICONOS Y LIBRERÍAS DE PDF
import { Plus, Eye, Printer, X } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import ReporteGenericoPDF from '../components/ReporteGenericoPDF';
import './ListPage.css';

function Empleados({ user, onLogout }) {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. ESTADO PARA CONTROLAR LA VISUALIZACIÓN
  const [mostrarPDF, setMostrarPDF] = useState(false);

  useEffect(() => {
    fetchEmpleados();
  }, [search]);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
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

  const columns = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'puesto', label: 'Puesto' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <h1>Empleados</h1>
        <div style={{ display: 'flex', gap: '10px' }}>

          {/* 3. BOTÓN PARA IMPRIMIR (Mismo estilo que en Clientes) */}
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
            onClick={() => navigate('/inactivos/empleados')}
            title="Ver empleados inactivos"
          >
            <Eye size={20} />
            Ver Inactivos
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate('/empleados/new')}
          >
            <Plus size={20} />
            Nuevo Empleado
          </button>
        </div>
      </div>

      {/* 4. LÓGICA DE VISUALIZACIÓN (PDF o TABLA) */}
      {mostrarPDF ? (
        <div style={{ height: '70vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%">
            <ReporteGenericoPDF
              title="Reporte de Empleados"
              columns={columns}
              data={empleados}
            />
          </PDFViewer>
        </div>
      ) : (
        <>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre, puesto o email..."
          />

          <Table
            columns={columns}
            data={empleados}
            onEdit={(id) => navigate(`/empleados/edit/${id}`)}
            onDelete={handleDelete}
            loading={loading}
          />
        </>
      )}

    </div>
  );
}

export default Empleados;