import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { proveedoresService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import './EditPage.css';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

function ProveedoresEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    telefono: '',
    email: '',
    pais: '',
    ciudad: '',
    activo: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. ESTADO PARA DETECTAR CAMBIOS SIN GUARDAR
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProveedor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProveedor = async () => {
    setLoading(true);
    try {
      const response = await proveedoresService.getById(id);
      setFormData(response.data);
      // Al cargar, no hay cambios pendientes
      setHasUnsavedChanges(false);
    } catch (err) {
      setError('Error al cargar proveedor');
      Swal.fire('Error', 'No se pudieron cargar los datos del proveedor', 'error');
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
          navigate('/proveedores');
        }
      });
    } else {
      navigate('/proveedores');
    }
  };

  // 4. SUBMIT CON VALIDACIÓN Y ALERTAS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación manual
    if (!formData.nombre) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor ingresa el Nombre del proveedor.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    setLoading(true);

    try {
      if (id) {
        await proveedoresService.update(id, formData);
      } else {
        await proveedoresService.create(formData);
      }

      // Reseteamos bandera de cambios
      setHasUnsavedChanges(false);

      // Alerta de Éxito
      await Swal.fire({
        title: '¡Operación Exitosa!',
        text: id ? 'El proveedor ha sido actualizado correctamente.' : 'El nuevo proveedor ha sido registrado correctamente.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });

      navigate('/proveedores');

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al guardar proveedor';
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
        <h1>{id ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h2>Información del Proveedor</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                // Quitamos required para usar la alerta personalizada
                placeholder="Ingrese nombre del proveedor"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tipo">Tipo</label>
              <input
                type="text"
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                placeholder="Ej: Hotel, Transporte, Agencia Local"
              />
            </div>
          </div>

          <div className="form-row">
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Ingrese ciudad"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pais">País</label>
              <input
                type="text"
                id="pais"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                placeholder="Ingrese país"
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
            {loading ? 'Guardando...' : 'Guardar Proveedor'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProveedoresEdit;