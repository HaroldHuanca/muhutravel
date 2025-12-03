import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { empleadosService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import './EditPage.css';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

function EmpleadosEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    puesto: '',
    telefono: '',
    email: '',
    activo: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. ESTADO PARA DETECTAR CAMBIOS SIN GUARDAR
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEmpleado();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEmpleado = async () => {
    setLoading(true);
    try {
      const response = await empleadosService.getById(id);
      setFormData(response.data);
      setHasUnsavedChanges(false); // Al cargar, no hay cambios pendientes
    } catch (err) {
      setError('Error al cargar empleado');
      Swal.fire('Error', 'No se pudieron cargar los datos del empleado', 'error');
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
    // Marcamos que hubo cambios
    setHasUnsavedChanges(true);
  };

  // 3. FUNCIÓN PARA PROTEGER LA SALIDA
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
          navigate('/empleados');
        }
      });
    } else {
      navigate('/empleados');
    }
  };

  // 4. SUBMIT CON VALIDACIÓN Y ALERTAS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación manual
    if (!formData.nombres || !formData.apellidos) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor ingresa Nombres y Apellidos.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    setLoading(true);

    try {
      if (id) {
        await empleadosService.update(id, formData);
      } else {
        await empleadosService.create(formData);
      }

      // Reseteamos bandera de cambios
      setHasUnsavedChanges(false);

      // Alerta de Éxito
      await Swal.fire({
        title: '¡Operación Exitosa!',
        text: id ? 'El empleado ha sido actualizado correctamente.' : 'El nuevo empleado ha sido registrado correctamente.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });

      navigate('/empleados');

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al guardar empleado';
      setError(errorMsg);
      
      // Alerta de Error
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
        <h1>{id ? 'Editar Empleado' : 'Nuevo Empleado'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h2>Información del Empleado</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombres">Nombres *</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                // Quitamos required para que salte nuestra alerta personalizada
                placeholder="Ingrese nombres"
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos *</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ingrese apellidos"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="puesto">Puesto</label>
              <input
                type="text"
                id="puesto"
                name="puesto"
                value={formData.puesto}
                onChange={handleChange}
                placeholder="Ej: Asesor, Guía, Soporte"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingrese email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ingrese teléfono"
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
            {loading ? 'Guardando...' : 'Guardar Empleado'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmpleadosEdit;