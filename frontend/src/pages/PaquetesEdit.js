import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paquetesService, proveedoresService, empleadosService } from '../services/api';
import { ArrowLeft, ArrowRight, Check, Package, Users } from 'lucide-react';
import './EditPage.css';

function PaquetesEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estados
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    destino: '',
    duracion_dias: '',
    fecha_inicio: '',
    fecha_fin: '',
    proveedor_id: '',
    empleado_id: '',
    tipo: 'REGULAR', // REGULAR, PRIVADO
    // Regular
    precio: '',
    cupos: '',
    min_cupos: 1,
    // Privado
    precio_grupo: '',
    max_pasajeros_recomendado: '',
    precio_adicional_persona: '',
    activo: true,
  });

  const [proveedores, setProveedores] = useState([]);
  const [empleados, setEmpleados] = useState([]);

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

      if (data.fecha_inicio) data.fecha_inicio = data.fecha_inicio.split('T')[0];
      if (data.fecha_fin) data.fecha_fin = data.fecha_fin.split('T')[0];

      setFormData(data);
      // Si ya existe, saltar al paso 2 (o 3 si se quiere editar todo junto, pero paso 1 es tipo)
      // Para editar, podríamos mostrar todo en una sola vista o mantener el wizard.
      // Mantendremos wizard para consistencia, pero saltando selección de tipo si ya está definido.
      setStep(2);
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

  const handleTypeSelect = (type) => {
    setFormData({ ...formData, tipo: type });
    setStep(2);
  };

  const nextStep = () => {
    // Validaciones paso 2
    if (step === 2) {
      if (!formData.nombre || !formData.destino || !formData.duracion_dias || !formData.fecha_inicio || !formData.fecha_fin) {
        setError('Por favor complete los campos obligatorios del paso 2');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones finales específicas por tipo
      if (formData.tipo === 'REGULAR') {
        if (!formData.precio || !formData.cupos) throw new Error('Precio y Cupos son obligatorios para tours regulares');
      } else {
        if (!formData.precio_grupo) throw new Error('Precio por grupo es obligatorio para tours privados');
      }

      if (id) {
        await paquetesService.update(id, formData);
      } else {
        await paquetesService.create(formData);
      }
      navigate('/paquetes');
    } catch (err) {
      setError(err.message || err.response?.data?.error || 'Error al guardar paquete');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER STEPS ---

  const renderStep1 = () => (
    <div className="wizard-step">
      <h2>Seleccione el Tipo de Paquete</h2>
      <div className="type-selection">
        <div
          className={`type-card ${formData.tipo === 'REGULAR' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('REGULAR')}
        >
          <Users size={48} />
          <h3>Tour Regular</h3>
          <p>Salidas compartidas con cupos limitados y precio por persona.</p>
        </div>
        <div
          className={`type-card ${formData.tipo === 'PRIVADO' ? 'selected' : ''}`}
          onClick={() => handleTypeSelect('PRIVADO')}
        >
          <Package size={48} />
          <h3>Tour Privado</h3>
          <p>Servicio exclusivo por grupo. Precio global y personalización.</p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="wizard-step">
      <h2>Datos Básicos</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Nombre del Tour *</label>
          <input name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Destino *</label>
          <input name="destino" value={formData.destino} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Duración (días) *</label>
          <input type="number" name="duracion_dias" value={formData.duracion_dias} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Fecha Inicio *</label>
          <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Fecha Fin *</label>
          <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Proveedor</label>
          <select name="proveedor_id" value={formData.proveedor_id} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Empleado Gestor</label>
          <select name="empleado_id" value={formData.empleado_id} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            {empleados.map(e => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="wizard-step">
      <h2>Detalles Específicos ({formData.tipo})</h2>

      {formData.tipo === 'REGULAR' ? (
        <div className="form-row">
          <div className="form-group">
            <label>Precio por Persona *</label>
            <input type="number" name="precio" value={formData.precio} onChange={handleChange} step="0.01" required />
          </div>
          <div className="form-group">
            <label>Cupos Máximos *</label>
            <input type="number" name="cupos" value={formData.cupos} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Cupo Mínimo</label>
            <input type="number" name="min_cupos" value={formData.min_cupos} onChange={handleChange} />
          </div>
        </div>
      ) : (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Precio por Grupo *</label>
              <input type="number" name="precio_grupo" value={formData.precio_grupo} onChange={handleChange} step="0.01" required />
            </div>
            <div className="form-group">
              <label>Máx. Pasajeros Rec.</label>
              <input type="number" name="max_pasajeros_recomendado" value={formData.max_pasajeros_recomendado} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Precio Adicional por Persona (Extra)</label>
            <input type="number" name="precio_adicional_persona" value={formData.precio_adicional_persona} onChange={handleChange} step="0.01" />
            <small>Costo unitario si se excede el máximo recomendado</small>
          </div>
        </>
      )}

      {id && (
        <div className="form-group checkbox">
          <label>
            <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
            Activo
          </label>
        </div>
      )}
    </div>
  );

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate('/paquetes')}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="wizard-container">
        <div className="wizard-progress">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1. Tipo</div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2. Datos Básicos</div>
          <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>3. Detalles</div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="wizard-content">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="wizard-actions">
          {step > 1 && (
            <button className="btn-secondary" onClick={prevStep}>
              Atrás
            </button>
          )}
          {step < 3 ? (
            step === 1 ? null : ( // En paso 1 se avanza al seleccionar tarjeta
              <button className="btn-primary" onClick={nextStep}>
                Siguiente <ArrowRight size={16} />
              </button>
            )
          ) : (
            <button className="btn-success" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Paquete'} <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaquetesEdit;
