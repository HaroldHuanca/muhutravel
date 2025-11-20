import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { proveedoresService } from '../services/api';
import { Plus, Eye } from 'lucide-react';
import './ListPage.css';

function Proveedores({ user, onLogout }) {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />
      <div className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>Proveedores</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
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
        </div>
      </div>
    </div>
  );
}

export default Proveedores;
