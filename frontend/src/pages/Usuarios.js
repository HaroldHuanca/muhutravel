import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import { usuariosService } from '../services/api';
import { Plus, Eye } from 'lucide-react';
import './ListPage.css';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

function Usuarios({ user, onLogout }) {
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // --- NUEVO FILTRO ---
  const [filtroRol, setFiltroRol] = useState('');

  // --- EFECTOS ---
  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      // La búsqueda de texto va al backend
      const response = await usuariosService.getAll(search);
      setUsuarios(response.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. FUNCIÓN HANDLE DELETE CON SWEETALERT
  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "El usuario será desactivado y perderá acceso al sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Azul
      cancelButtonColor: '#d33',     // Rojo
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await usuariosService.delete(id);
          
          // Alerta de éxito
          Swal.fire(
            '¡Desactivado!',
            'El usuario ha sido desactivado correctamente.',
            'success'
          );
          
          fetchUsuarios();
        } catch (err) {
          console.error(err);
          // Alerta de error
          Swal.fire(
            'Error',
            'No se pudo desactivar el usuario.',
            'error'
          );
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // --- LÓGICA DE FILTRADO (FRONTEND) ---

  // 1. Obtener lista única de Roles
  const listaRoles = [...new Set(usuarios.map(u => u.rol).filter(Boolean))];

  // 2. Filtrar data
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideRol = filtroRol ? usuario.rol === filtroRol : true;
    return coincideRol;
  });

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

  // Estilos
  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    minWidth: '160px',
    outline: 'none',
    cursor: 'pointer',
    height: '42px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#495057'
  };

  return (
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

      {/* --- BARRA DE FILTROS INTEGRADA --- */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        alignItems: 'flex-end', 
        marginBottom: '20px', 
        flexWrap: 'wrap',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        
        {/* 1. Buscador Texto */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <label style={labelStyle}>Búsqueda General</label>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por usuario..."
          />
        </div>

        {/* 2. Filtro Rol */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Filtrar por Rol</label>
            <select 
              style={selectStyle}
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option value="">Todos los Roles</option>
              {listaRoles.map((rol, index) => (
                <option key={index} value={rol}>{rol}</option>
              ))}
            </select>
        </div>

        {/* Botón Limpiar */}
        {filtroRol && (
          <div style={{ paddingBottom: '2px' }}>
            <button 
              onClick={() => setFiltroRol('')}
              style={{
                background: 'transparent',
                border: '1px solid #dc3545',
                color: '#dc3545',
                padding: '8px 15px',
                height: '42px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* Tabla usa la data filtrada */}
      <Table
        columns={columns}
        data={usuariosFiltrados}
        onEdit={(id) => navigate(`/usuarios/edit/${id}`)}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}

export default Usuarios;