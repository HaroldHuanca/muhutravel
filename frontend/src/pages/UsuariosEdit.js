import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usuariosService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import './EditPage.css';

function UsuariosEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    password_hash: '',
    rol: 'agente',
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchUsuario();
    }
  }, [id]);

  const fetchUsuario = async () => {
    setLoading(true);
    try {
      const response = await usuariosService.getById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Error al cargar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (id) {
        await usuariosService.update(id, formData);
      } else {
        if (!formData.password_hash) {
          setError('La contraseña es requerida para nuevos usuarios');
          setLoading(false);
          return;
        }
        await usuariosService.create(formData);
      }
      navigate('/usuarios');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate('/usuarios')}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="edit-header">
        <h1>{id ? 'Editar Usuario' : 'Nuevo Usuario'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h2>Información del Usuario</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Usuario *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Ingrese nombre de usuario"
              />
            </div>
            <div className="form-group">
              <label htmlFor="rol">Rol *</label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="agente">Agente</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password_hash">
                {id ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}
              </label>
              <input
                type="password"
                id="password_hash"
                name="password_hash"
                value={formData.password_hash}
                onChange={handleChange}
                required={!id}
                placeholder={id ? 'Dejar en blanco para no cambiar' : 'Ingrese contraseña'}
              />
            </div>
          </div>

          {id && (
            <div className="form-group checkbox">
              <label htmlFor="activo">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                />
                Activo
              </label>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/usuarios')}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UsuariosEdit;
