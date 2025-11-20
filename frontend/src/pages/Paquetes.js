import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { paquetesService } from '../services/api';
import { Plus, Eye } from 'lucide-react';
import './ListPage.css';

function Paquetes({ user, onLogout }) {
  const navigate = useNavigate();
  const [paquetes, setPaquetes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />
      <div className="page-content">
        <div className="container">
          <div className="page-header">
            <h1>Paquetes Turísticos</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Paquetes;
