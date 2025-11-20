import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { empleadosService } from '../services/api';
import { Plus, Eye } from 'lucide-react';
import './ListPage.css';

function Empleados({ user, onLogout }) {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />
      <div className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>Empleados</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
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
        </div>
      </div>
    </div>
  );
}

export default Empleados;
