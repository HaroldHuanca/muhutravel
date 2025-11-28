import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservasService, proveedoresService } from '../services/api';
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import './EditPage.css';

function ReservaProveedores({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [reservaProveedores, setReservaProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    proveedor_id: '',
    tipo_servicio: '',
    costo: '',
    notas: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Cargando datos para reserva ID:', id);
      const [rRes, rpRes, provRes] = await Promise.all([
        reservasService.getById(id),
        reservasService.getProveedores(id),
        proveedoresService.getAll(''),
      ]);
      console.log('Datos de reserva:', rRes.data);
      setReserva(rRes.data);
      setReservaProveedores(rpRes.data);
      setProveedores(provRes.data);
      setError('');
    } catch (err) {
      console.error('Error completo:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Error al cargar datos';
      setError(errorMsg);
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

    if (!formData.proveedor_id) {
      setError('Debe seleccionar un proveedor');
      return;
    }

    try {
      if (editingId) {
        await reservasService.updateProveedor(id, editingId, {
          tipo_servicio: formData.tipo_servicio,
          costo: formData.costo,
          notas: formData.notas,
        });
      } else {
        await reservasService.addProveedor(id, formData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
      console.error(err);
    }
  };

  const handleEdit = (rp) => {
    setFormData({
      proveedor_id: rp.proveedor_id,
      tipo_servicio: rp.tipo_servicio || '',
      costo: rp.costo || '',
      notas: rp.notas || '',
    });
    setEditingId(rp.id);
    setShowForm(true);
  };

  const handleDelete = async (rpId) => {
    if (window.confirm('¿Deseas eliminar este proveedor de la reserva?')) {
      try {
        await reservasService.deleteProveedor(id, rpId);
        fetchData();
      } catch (err) {
        setError('Error al eliminar proveedor');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      proveedor_id: '',
      tipo_servicio: '',
      costo: '',
      notas: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="container">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/reservas')}>
          <ArrowLeft size={20} />
          Volver
        </button>
        <div className="error-message">
          <p><strong>Reserva no encontrada</strong></p>
          <p>ID buscado: {id}</p>
          {error && <p>Detalles: {error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate('/reservas')}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="edit-header">
        <h1>Asignar Proveedores a: {reserva.numero_reserva}</h1>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Cliente: {reserva.cliente_nombres} {reserva.cliente_apellidos} | Paquete: {reserva.paquete_nombre}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Formulario para agregar/editar proveedor */}
      {showForm && (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-section">
            <h2>{editingId ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="proveedor_id">Proveedor *</label>
                <select
                  id="proveedor_id"
                  name="proveedor_id"
                  value={formData.proveedor_id}
                  onChange={handleChange}
                  required
                  disabled={editingId !== null}
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.tipo})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="tipo_servicio">Tipo de Servicio</label>
                <input
                  type="text"
                  id="tipo_servicio"
                  name="tipo_servicio"
                  value={formData.tipo_servicio}
                  onChange={handleChange}
                  placeholder="Ej: Hotel, Transporte, Tours"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="costo">Costo (S/.)</label>
                <input
                  type="number"
                  id="costo"
                  name="costo"
                  value={formData.costo}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Ingrese costo"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="notas">Notas</label>
                <textarea
                  id="notas"
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  placeholder="Ingrese notas adicionales"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {editingId ? 'Actualizar' : 'Agregar'} Proveedor
            </button>
          </div>
        </form>
      )}

      {/* Tabla de proveedores asignados */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Proveedores Asignados ({reservaProveedores.length})</h2>
          {!showForm && (
            <button
              className="btn-primary"
              onClick={() => setShowForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={20} />
              Agregar Proveedor
            </button>
          )}
        </div>

        {reservaProveedores.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            No hay proveedores asignados a esta reserva
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Tipo</th>
                  <th>Tipo de Servicio</th>
                  <th>Costo (S/.)</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservaProveedores.map((rp) => (
                  <tr key={rp.id}>
                    <td>
                      <strong>{rp.proveedor_nombre}</strong>
                      <br />
                      <small style={{ color: '#666' }}>{rp.email}</small>
                    </td>
                    <td>{rp.proveedor_tipo}</td>
                    <td>{rp.tipo_servicio || '-'}</td>
                    <td>{rp.costo ? `S/. ${rp.costo}` : '-'}</td>
                    <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>
                      {rp.notas || '-'}
                    </td>
                    <td className="table-actions">
                      <button
                        className="action-btn"
                        style={{ backgroundColor: '#4299e1', color: 'white', marginRight: '8px' }}
                        onClick={() => handleEdit(rp)}
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="action-btn"
                        style={{ backgroundColor: '#f56565', color: 'white' }}
                        onClick={() => handleDelete(rp.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservaProveedores;
