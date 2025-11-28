import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { empleadosService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import './EditPage.css';

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

  useEffect(() => {
    if (id) {
      fetchEmpleado();
    }
  }, [id]);

  const fetchEmpleado = async () => {
    setLoading(true);
    try {
      const response = await empleadosService.getById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Error al cargar empleado');
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
        await empleadosService.update(id, formData);
      } else {
        await empleadosService.create(formData);
      }
      navigate('/empleados');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate('/empleados')}>
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
                required
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
                required
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
          <button type="button" className="btn-cancel" onClick={() => navigate('/empleados')}>
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
