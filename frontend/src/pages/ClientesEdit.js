import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { clientesService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import './EditPage.css';

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

  useEffect(() => {
    if (id) {
      fetchCliente();
    }
  }, [id]);

  const fetchCliente = async () => {
    setLoading(true);
    try {
      const response = await clientesService.getById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Error al cargar cliente');
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
        await clientesService.update(id, formData);
      } else {
        await clientesService.create(formData);
      }
      navigate('/clientes');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />
      <div className="page-content">
        <div className="container">
          <button className="btn-back" onClick={() => navigate('/clientes')}>
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
                  <label htmlFor="documento">Documento *</label>
                  <input
                    type="text"
                    id="documento"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    required
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
              <button type="button" className="btn-cancel" onClick={() => navigate('/clientes')}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientesEdit;
