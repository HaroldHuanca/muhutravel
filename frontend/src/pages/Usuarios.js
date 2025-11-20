import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { usuariosService } from '../services/api';
import { Plus, Eye } from 'lucide-react';
import './ListPage.css';

function Usuarios({ user, onLogout }) {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, [search]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await usuariosService.getAll(search);
      setUsuarios(response.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea desactivar este usuario?')) {
      try {
        await usuariosService.delete(id);
        fetchUsuarios();
      } catch (err) {
        alert('Error al desactivar usuario');
      }
    }
  };

  const columns = [
    { key: 'username', label: 'Usuario' },
    { key: 'rol', label: 'Rol' },
    {
      key: 'activo',
      label: 'Estado',
      render: (val) => (
        <span style={{ color: val ? '#48bb78' : '#f56565', fontWeight: 'bold' }}>
          {val ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />
      <div className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>Usuarios del Sistema</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-primary"
                onClick={() => navigate('/inactivos/usuarios')}
                title="Ver usuarios inactivos"
              >
                <Eye size={20} />
                Ver Inactivos
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate('/usuarios/new')}
              >
                <Plus size={20} />
                Nuevo Usuario
              </button>
            </div>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por usuario..."
          />

          <Table
            columns={columns}
            data={usuarios}
            onEdit={(id) => navigate(`/usuarios/edit/${id}`)}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Usuarios;
