import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { reservasService } from '../services/api';
import { Plus } from 'lucide-react';
import './ListPage.css';

function Reservas({ user, onLogout }) {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReservas();
  }, [search]);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const response = await reservasService.getAll(search);
      setReservas(response.data);
    } catch (err) {
      console.error('Error al obtener reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta reserva?')) {
      try {
        await reservasService.delete(id);
        fetchReservas();
      } catch (err) {
        alert('Error al eliminar reserva');
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada':
        return '#48bb78';
      case 'pendiente':
        return '#f6ad55';
      case 'cancelada':
        return '#f56565';
      default:
        return '#999';
    }
  };

  const columns = [
    { key: 'numero_reserva', label: 'Número' },
    { key: 'cliente_nombres', label: 'Cliente' },
    { key: 'paquete_nombre', label: 'Paquete' },
    { key: 'cantidad_personas', label: 'Personas' },
    { key: 'precio_total', label: 'Precio Total', render: (val) => `S/. ${val}` },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => (
        <span style={{ color: getEstadoColor(val), fontWeight: 'bold' }}>
          {val}
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
            <h1>Reservas</h1>
            <button
              className="btn-primary"
              onClick={() => navigate('/reservas/new')}
            >
              <Plus size={20} />
              Nueva Reserva
            </button>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por número de reserva, cliente o paquete..."
          />

          <Table
            columns={columns}
            data={reservas}
            onEdit={(id) => navigate(`/reservas/edit/${id}`)}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Reservas;
