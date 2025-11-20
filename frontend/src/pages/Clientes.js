import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { clientesService } from '../services/api';
import { Plus, Eye } from 'lucide-react';
import './ListPage.css';

function Clientes({ user, onLogout }) {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />
      <div className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>Clientes</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Clientes;
