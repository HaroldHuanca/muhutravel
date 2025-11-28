import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservasService, clientesService, paquetesService, empleadosService } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import './EditPage.css';

function ReservasEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    numero_reserva: '',
    cliente_id: '',
    paquete_id: '',
    empleado_id: '',
    cantidad_personas: '',
    precio_total: '',
    estado: 'pendiente',
    comentario: '',
  });
  const [clientes, setClientes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDatos();
    if (id) {
      fetchReserva();
    }
  }, [id]);

  const fetchDatos = async () => {
    try {
      const [cRes, pRes, eRes] = await Promise.all([
        clientesService.getAll(''),
        paquetesService.getAll(''),
        empleadosService.getAll(''),
      ]);
      setClientes(cRes.data);
      setPaquetes(pRes.data);
      setEmpleados(eRes.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    }
  };

  const fetchReserva = async () => {
    setLoading(true);
    try {
      const response = await reservasService.getById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Error al cargar reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (id) {
        await reservasService.update(id, formData);
      } else {
        await reservasService.create(formData);
      }
      navigate('/reservas');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate('/reservas')}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="edit-header">
        <h1>{id ? 'Editar Reserva' : 'Nueva Reserva'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h2>Información de la Reserva</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numero_reserva">Número de Reserva *</label>
              <input
                type="text"
                id="numero_reserva"
                name="numero_reserva"
                value={formData.numero_reserva}
                onChange={handleChange}
                required
                placeholder="Ej: RES001"
              />
            </div>
            <div className="form-group">
              <label htmlFor="estado">Estado *</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cliente_id">Cliente *</label>
              <select
                id="cliente_id"
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombres} {c.apellidos}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="paquete_id">Paquete *</label>
              <select
                id="paquete_id"
                name="paquete_id"
                value={formData.paquete_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar paquete</option>
                {paquetes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - S/. {p.precio}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cantidad_personas">Cantidad de Personas *</label>
              <input
                type="number"
                id="cantidad_personas"
                name="cantidad_personas"
                value={formData.cantidad_personas}
                onChange={handleChange}
                required
                placeholder="Ingrese cantidad"
              />
            </div>
            <div className="form-group">
              <label htmlFor="precio_total">Precio Total *</label>
              <input
                type="number"
                id="precio_total"
                name="precio_total"
                value={formData.precio_total}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="Ingrese precio total"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="empleado_id">Empleado</label>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="comentario">Comentario</label>
              <textarea
                id="comentario"
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
                placeholder="Ingrese comentarios adicionales"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/reservas')}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservasEdit;
