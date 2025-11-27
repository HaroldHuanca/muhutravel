import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { reservasService } from '../services/api';
import { Plus, Link2 } from 'lucide-react';
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
      console.log('Reservas obtenidas:', response.data);
      console.log('Primeras 3 reservas con IDs:', response.data.slice(0, 3).map(r => ({ id: r.id, numero_reserva: r.numero_reserva })));
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

          {loading ? (
            <div className="table-loading">Cargando datos...</div>
          ) : reservas.length === 0 ? (
            <div className="table-empty">No hay reservas disponibles</div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((row, idx) => (
                    <tr key={row.id || idx}>
                      {columns.map((col) => (
                        <td key={col.key}>
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                      <td className="table-actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => navigate(`/reservas/edit/${row.id}`)}
                          title="Editar"
                        >
                          Editar
                        </button>
                        <button
                          className="action-btn"
                          style={{ backgroundColor: '#48bb78', color: 'white' }}
                          onClick={() => navigate(`/reservas/${row.id}/proveedores`)}
                          title="Asignar proveedores"
                        >
                          <Link2 size={18} />
                          Proveedores
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(row.id)}
                          title="Eliminar"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Reservas;
