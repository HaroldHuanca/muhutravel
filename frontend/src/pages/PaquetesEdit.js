import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { paquetesService, proveedoresService, empleadosService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import './EditPage.css';

function PaquetesEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    destino: '',
    duracion_dias: '',
    precio: '',
    cupos: '',
    fecha_inicio: '',
    fecha_fin: '',
    proveedor_id: '',
    empleado_id: '',
    activo: true,
  });
  const [proveedores, setProveedores] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProveedoresEmpleados();
    if (id) {
      fetchPaquete();
    }
  }, [id]);

  const fetchProveedoresEmpleados = async () => {
    try {
      const [pRes, eRes] = await Promise.all([
        proveedoresService.getAll(''),
        empleadosService.getAll(''),
      ]);
      setProveedores(pRes.data);
      setEmpleados(eRes.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    }
  };

  const fetchPaquete = async () => {
    setLoading(true);
    try {
      const response = await paquetesService.getById(id);
      const data = response.data;
      
      // Asegurar que las fechas estén en formato YYYY-MM-DD para el input type="date"
      if (data.fecha_inicio) {
        data.fecha_inicio = data.fecha_inicio.split('T')[0];
      }
      if (data.fecha_fin) {
        data.fecha_fin = data.fecha_fin.split('T')[0];
      }
      
      setFormData(data);
    } catch (err) {
      setError('Error al cargar paquete');
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
        await paquetesService.update(id, formData);
      } else {
        await paquetesService.create(formData);
      }
      navigate('/paquetes');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar paquete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />
      <div className="page-content">
        <div className="container">
          <button className="btn-back" onClick={() => navigate('/paquetes')}>
            <ArrowLeft size={20} />
            Volver
          </button>

          <div className="edit-header">
            <h1>{id ? 'Editar Paquete' : 'Nuevo Paquete'}</h1>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-section">
              <h2>Información del Paquete</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese nombre del paquete"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="destino">Destino *</label>
                  <input
                    type="text"
                    id="destino"
                    name="destino"
                    value={formData.destino}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese destino"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duracion_dias">Duración (días) *</label>
                  <input
                    type="number"
                    id="duracion_dias"
                    name="duracion_dias"
                    value={formData.duracion_dias}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese duración"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="precio">Precio *</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    step="0.01"
                    placeholder="Ingrese precio"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cupos">Cupos *</label>
                  <input
                    type="number"
                    id="cupos"
                    name="cupos"
                    value={formData.cupos}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese cupos"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha_inicio">Fecha Inicio *</label>
                  <input
                    type="date"
                    id="fecha_inicio"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fecha_fin">Fecha Fin *</label>
                  <input
                    type="date"
                    id="fecha_fin"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="proveedor_id">Proveedor</label>
                  <select
                    id="proveedor_id"
                    name="proveedor_id"
                    value={formData.proveedor_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="empleado_id">Empleado Gestor</label>
                  <select
                    id="empleado_id"
                    name="empleado_id"
                    value={formData.empleado_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar empleado</option>
                    {empleados.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombres} {e.apellidos}
                      </option>
                    ))}
                  </select>
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
              <button type="button" className="btn-cancel" onClick={() => navigate('/paquetes')}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Paquete'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaquetesEdit;
