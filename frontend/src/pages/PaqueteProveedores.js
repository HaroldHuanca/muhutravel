import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservasService, proveedoresService } from '../services/api';
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import './EditPage.css';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, rpRes, provRes] = await Promise.all([
        reservasService.getById(id),
        reservasService.getProveedores(id),
        proveedoresService.getAll(''),
      ]);
      setReserva(rRes.data);
      setReservaProveedores(rpRes.data);
      setProveedores(provRes.data);
      setError('');
    } catch (err) {
      console.error('Error completo:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Error al cargar datos';
      setError(errorMsg);
      Swal.fire('Error', 'No se pudieron cargar los datos de la reserva', 'error');
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

  // 2. SUBMIT CON ALERTAS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación
    if (!formData.proveedor_id) {
      Swal.fire({
        title: 'Faltan datos',
        text: 'Debe seleccionar un proveedor de la lista.',
        icon: 'warning'
      });
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
      
      // Alerta de éxito
      Swal.fire({
        title: editingId ? 'Actualizado' : 'Agregado',
        text: 'El proveedor ha sido asignado correctamente a la reserva.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      resetForm();
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al guardar';
      setError(msg);
      Swal.fire('Error', msg, 'error');
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
    // Hacemos scroll hacia el formulario para mejor UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. DELETE CON CONFIRMACIÓN VISUAL
  const handleDelete = (rpId) => {
    Swal.fire({
      title: '¿Quitar proveedor?',
      text: "Se eliminará esta asignación de la reserva.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await reservasService.deleteProveedor(id, rpId);
          
          Swal.fire(
            'Eliminado',
            'El proveedor ha sido quitado de la reserva.',
            'success'
          );
          
          fetchData();
        } catch (err) {
          Swal.fire('Error', 'No se pudo eliminar el proveedor', 'error');
        }
      }
    });
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

  if (loading && !reserva) {
    return (
      <div className="container">
        <p>Cargando información...</p>
      </div>
    );
  }

  if (!reserva && !loading) {
    return (
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/reservas')}>
          <ArrowLeft size={20} />
          Volver
        </button>
        <div className="error-message">
          <p><strong>Reserva no encontrada</strong></p>
          <p>ID buscado: {id}</p>
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
        <h1>Asignar Proveedores a: {reserva?.numero_reserva}</h1>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Cliente: {reserva?.cliente_nombres} {reserva?.cliente_apellidos} | Paquete: {reserva?.paquete_nombre}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Formulario para agregar/editar proveedor */}
      {showForm && (
        <form onSubmit={handleSubmit} className="edit-form" style={{ marginBottom: '30px', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px' }}>
          <div className="form-section">
            <h2 style={{ borderBottom: 'none', marginBottom: '15px' }}>
              {editingId ? 'Editar Asignación' : 'Nueva Asignación'}
            </h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="proveedor_id">Proveedor *</label>
                <select
                  id="proveedor_id"
                  name="proveedor_id"
                  value={formData.proveedor_id}
                  onChange={handleChange}
                  required
                  disabled={editingId !== null} // No se puede cambiar el proveedor al editar, solo borrar y crear nuevo
                  style={{ backgroundColor: editingId ? '#f7fafc' : 'white' }}
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
                  placeholder="0.00"
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
                  placeholder="Detalles adicionales..."
                  rows="2"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {editingId ? 'Actualizar' : 'Guardar'} Asignación
            </button>
          </div>
        </form>
      )}

      {/* Tabla de proveedores asignados */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Proveedores Asignados ({reservaProveedores.length})</h2>
          {!showForm && (
            <button
              className="btn-primary"
              onClick={() => setShowForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} />
              Agregar Proveedor
            </button>
          )}
        </div>

        {reservaProveedores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #cbd5e0' }}>
            <p style={{ color: '#718096' }}>No hay proveedores asignados a esta reserva todavía.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Tipo</th>
                  <th>Servicio</th>
                  <th>Costo (S/.)</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservaProveedores.map((rp) => (
                  <tr key={rp.id}>
                    <td>
                      <span style={{ fontWeight: '600', color: '#2d3748' }}>{rp.proveedor_nombre}</span>
                      <br />
                      <small style={{ color: '#718096' }}>{rp.email}</small>
                    </td>
                    <td><span className="badge badge-info">{rp.proveedor_tipo}</span></td>
                    <td>{rp.tipo_servicio || '-'}</td>
                    <td>{rp.costo ? `S/. ${parseFloat(rp.costo).toFixed(2)}` : '-'}</td>
                    <td style={{ maxWidth: '200px', fontSize: '0.9em', color: '#4a5568' }}>
                      {rp.notas || '-'}
                    </td>
                    <td className="table-actions">
                      <button
                        className="action-btn"
                        style={{ backgroundColor: '#4299e1', color: 'white', marginRight: '5px' }}
                        onClick={() => handleEdit(rp)}
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn"
                        style={{ backgroundColor: '#f56565', color: 'white' }}
                        onClick={() => handleDelete(rp.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
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