import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 
import SearchBar from '../components/SearchBar';
import Table from '../components/Table'; 
import api from '../services/api';
import './ListPage.css';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

function Inactivos({ user, onLogout }) {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const [inactivos, setInactivos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Configuración de columnas
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
    if (user?.rol === 'agente' && ['clientes', 'proveedores', 'paquetes'].includes(tipo)) {
      navigate('/');
      return;
    }
    cargarInactivos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, user]);

  useEffect(() => {
    filtrarInactivos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 2. FUNCIÓN DE REACTIVAR MEJORADA CON SWEETALERT
  const handleReactivar = (id) => {
    Swal.fire({
      title: '¿Deseas reactivar este registro?',
      text: "El registro volverá a estar disponible en la lista principal.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Azul
      cancelButtonColor: '#d33',     // Rojo
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/${tipo}/${id}/reactivar`);
          
          // Actualizamos el estado visualmente (quitamos la fila)
          setInactivos(inactivos.filter(item => item.id !== id));
          
          // Mensaje de éxito
          Swal.fire(
            '¡Reactivado!',
            'El registro ha sido reactivado exitosamente.',
            'success'
          );
        } catch (err) {
          console.error(err);
          // Mensaje de error
          Swal.fire(
            'Error',
            'No se pudo reactivar el registro.',
            'error'
          );
        }
      }
    });
  };

  if (!config) {
    return (
      <div className="container">
        <div className="page-header">
          <h1>Tipo no válido</h1>
          <button className="btn-primary" onClick={() => navigate('/')}>Ir al Inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <h1>{config.titulo}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={() => navigate(`/${tipo}`)}
            style={{ backgroundColor: '#6c757d', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <ArrowLeft size={18} />
            Volver a {tipo}
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px', 
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ flex: 1 }}>
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder={`Buscar en ${config.titulo}...`} 
          />
        </div>
      </div>

      {/* Tabla */}
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
      
      <Table 
        columns={config.columns} 
        data={filtrados} 
        loading={loading}
        onRestore={handleReactivar} 
      />

    </div>
  );
}

export default Inactivos;