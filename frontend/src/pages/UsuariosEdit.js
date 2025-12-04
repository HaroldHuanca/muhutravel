import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usuariosService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import './EditPage.css';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

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

  // 2. ESTADO PARA DETECTAR CAMBIOS SIN GUARDAR
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUsuario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUsuario = async () => {
    setLoading(true);
    try {
      const response = await usuariosService.getById(id);
      // Al cargar, limpiamos el campo password para que no viaje el hash
      setFormData({ ...response.data, password_hash: '' });
      setHasUnsavedChanges(false);
    } catch (err) {
      setError('Error al cargar usuario');
      Swal.fire('Error', 'No se pudieron cargar los datos del usuario', 'error');
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
    setHasUnsavedChanges(true);
  };

  // 3. PROTECCIÓN AL SALIR
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Swal.fire({
        title: '¿Salir sin guardar?',
        text: "Tienes cambios pendientes que se perderán.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Continuar editando'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/usuarios');
        }
      });
    } else {
      navigate('/usuarios');
    }
  };

  // 4. SUBMIT CON VALIDACIÓN Y ALERTAS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación Manual
    if (!formData.username) {
      Swal.fire({
        title: 'Faltan datos',
        text: 'El campo Usuario es obligatorio.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Validación específica: Contraseña obligatoria solo si es NUEVO
    if (!id && !formData.password_hash) {
      Swal.fire({
        title: 'Faltan datos',
        text: 'La contraseña es obligatoria para nuevos usuarios.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    setLoading(true);

    try {
      if (id) {
        await usuariosService.update(id, formData);
      } else {
        await usuariosService.create(formData);
      }

      setHasUnsavedChanges(false);

      // Alerta de Éxito
      await Swal.fire({
        title: '¡Operación Exitosa!',
        text: id ? 'El usuario ha sido actualizado correctamente.' : 'El nuevo usuario ha sido creado correctamente.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });

      navigate('/usuarios');

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al guardar usuario';
      setError(errorMsg);
      
      Swal.fire({
        title: 'Error',
        text: errorMsg,
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Cerrar'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Botón Volver protegido */}
      <button className="btn-back" onClick={handleCancel}>
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
                // Quitamos required HTML
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
                // Validamos la obligatoriedad manualmente en handleSubmit
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
          {/* Botón Cancelar protegido */}
          <button type="button" className="btn-cancel" onClick={handleCancel}>
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