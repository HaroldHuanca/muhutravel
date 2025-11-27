import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import api from '../services/api';
import './ListPage.css';

function Inactivos({ user, onLogout }) {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const [inactivos, setInactivos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tiposConfig = {
    usuarios: {
      titulo: 'Usuarios Inactivos',
      endpoint: '/usuarios/inactivos/lista',
      columns: [
        { key: 'username', label: 'Usuario' },
        { key: 'rol', label: 'Rol' },
        { key: 'creado_en', label: 'Creado' }
      ]
    },
    clientes: {
      titulo: 'Clientes Inactivos',
      endpoint: '/clientes/inactivos/lista',
      columns: [
        { key: 'nombres', label: 'Nombres' },
        { key: 'apellidos', label: 'Apellidos' },
        { key: 'documento', label: 'Documento' },
        { key: 'email', label: 'Email' }
      ]
    },
    empleados: {
      titulo: 'Empleados Inactivos',
      endpoint: '/empleados/inactivos/lista',
      columns: [
        { key: 'nombres', label: 'Nombres' },
        { key: 'apellidos', label: 'Apellidos' },
        { key: 'puesto', label: 'Puesto' },
        { key: 'email', label: 'Email' }
      ]
    },
    proveedores: {
      titulo: 'Proveedores Inactivos',
      endpoint: '/proveedores/inactivos/lista',
      columns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'email', label: 'Email' },
        { key: 'ciudad', label: 'Ciudad' }
      ]
    },
    paquetes: {
      titulo: 'Paquetes Inactivos',
      endpoint: '/paquetes/inactivos/lista',
      columns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'destino', label: 'Destino' },
        { key: 'duracion_dias', label: 'Duración' },
        { key: 'precio', label: 'Precio', render: (val) => `S/. ${val}` }
      ]
    }
  };

  const config = tiposConfig[tipo];

  useEffect(() => {
    cargarInactivos();
  }, [tipo]);

  useEffect(() => {
    filtrarInactivos();
  }, [search, inactivos]);

  const cargarInactivos = async () => {
    try {
      setLoading(true);
      const response = await api.get(config.endpoint, { params: { search } });
      setInactivos(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar inactivos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtrarInactivos = () => {
    if (!search) {
      setFiltrados(inactivos);
      return;
    }
    const filtered = inactivos.filter(item =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
    setFiltrados(filtered);
  };

  const handleReactivar = async (id) => {
    if (window.confirm('¿Deseas reactivar este registro?')) {
      try {
        await api.patch(`/${tipo}/${id}/reactivar`);
        setInactivos(inactivos.filter(item => item.id !== id));
        alert('Registro reactivado exitosamente');
      } catch (err) {
        alert('Error al reactivar registro');
        console.error(err);
      }
    }
  };

  if (!config) {
    return (
      <div>
        <Header user={user} onLogout={onLogout} />
        <div className="list-container">
          <h1>Tipo de inactivos no válido</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      <div className="list-container">
        <div className="list-header">
          <h1>{config.titulo}</h1>
          <button 
            className="btn-volver"
            onClick={() => navigate(`/${tipo}`)}
          >
            ← Volver a {tipo}
          </button>
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder={`Buscar en ${config.titulo}...`} />

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : filtrados.length === 0 ? (
          <p>No hay registros inactivos</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  {config.columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((row, idx) => (
                  <tr key={row.id || idx}>
                    {config.columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    <td className="table-actions">
                      <button
                        className="action-btn"
                        style={{ backgroundColor: '#48bb78', color: 'white' }}
                        onClick={() => handleReactivar(row.id)}
                        title="Reactivar"
                      >
                        <RotateCcw size={18} />
                        Reactivar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Inactivos;
