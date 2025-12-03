import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientesService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import './EditPage.css';

import Swal from 'sweetalert2';

function ClientesEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    documento: '',
    telefono: '',
    email: '',
    ciudad: '',
    pais: 'Peru',
    activo: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 1. NUEVO ESTADO: PARA SABER SI HUBO CAMBIOS
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCliente();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCliente = async () => {
    setLoading(true);
    try {
      const response = await clientesService.getById(id);
      setFormData(response.data);
      // Al cargar datos iniciales, no consideramos que haya cambios aún
      setHasUnsavedChanges(false);
    } catch (err) {
      setError('Error al cargar cliente');
      Swal.fire('Error', 'No se pudieron cargar los datos del cliente', 'error');
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
    // 2. MARCAMOS QUE HUBO CAMBIOS AL ESCRIBIR
    setHasUnsavedChanges(true);
  };

  // 3. NUEVA FUNCIÓN PARA SALIR DE MANERA SEGURA
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
          navigate('/clientes');
        }
      });
    } else {
      // Si no hay cambios, salimos directo
      navigate('/clientes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 4. VALIDACIÓN MANUAL DE CAMPOS OBLIGATORIOS
    if (!formData.nombres || !formData.apellidos || !formData.documento) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa los campos obligatorios (Nombres, Apellidos, Documento).',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return; // Detenemos la función aquí
    }

    setLoading(true);

    try {
      if (id) {
        await clientesService.update(id, formData);
      } else {
        await clientesService.create(formData);
      }

      // Resetear la bandera de cambios porque ya guardamos
      setHasUnsavedChanges(false);

      await Swal.fire({
        title: '¡Operación Exitosa!',
        text: id ? 'El cliente ha sido actualizado correctamente.' : 'El nuevo cliente ha sido registrado correctamente.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });

      navigate('/clientes');

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al guardar cliente';
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
        <h1>{id ? 'Editar Cliente' : 'Nuevo Cliente'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h2>Información Personal</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombres">Nombres *</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                // Quitamos 'required' para que salte nuestra alerta SweetAlert
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
              <label htmlFor="documento">Documento *</label>
              <input
                type="text"
                id="documento"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                placeholder="DNI, CE o Pasaporte"
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
            {loading ? 'Guardando...' : 'Guardar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClientesEdit;