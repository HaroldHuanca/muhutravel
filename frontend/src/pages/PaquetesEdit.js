import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paquetesService, proveedoresService, empleadosService } from '../services/api';
import { ArrowLeft, ArrowRight, Check, Package, Users } from 'lucide-react';
import './EditPage.css';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

function PaquetesEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estados
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 2. ESTADO PARA DETECTAR CAMBIOS
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setHasUnsavedChanges(false); // Datos cargados, sin cambios pendientes
      
      // Si editamos, saltamos la selección de tipo
      setStep(2);
    } catch (err) {
      Swal.fire('Error', 'No se pudo cargar el paquete', 'error');
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
    setHasUnsavedChanges(true); // Marcamos cambios
  };

  const handleTypeSelect = (type) => {
    setFormData({ ...formData, tipo: type });
    setHasUnsavedChanges(true);
    setStep(2);
  };

  // 3. PROTECCIÓN AL SALIR
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Swal.fire({
        title: '¿Salir sin guardar?',
        text: "Perderás los datos ingresados.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) navigate('/paquetes');
      });
    } else {
      navigate('/paquetes');
    }
  };

  // 4. VALIDACIÓN DE NAVEGACIÓN (PASO 2 -> 3)
  const nextStep = () => {
    if (step === 2) {
      if (!formData.nombre || !formData.destino || !formData.duracion_dias || !formData.fecha_inicio || !formData.fecha_fin) {
        Swal.fire({
          title: 'Datos incompletos',
          text: 'Por favor complete los campos obligatorios del Paso 2 (Nombre, Destino, Fechas, Duración).',
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  // 5. SUBMIT CON VALIDACIÓN FINAL Y ALERTAS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones finales según el tipo
      if (formData.tipo === 'REGULAR') {
        if (!formData.precio || !formData.cupos) {
          throw new Error('Debe ingresar el Precio por Persona y los Cupos Máximos.');
        }
      } else {
        if (!formData.precio_grupo) {
          throw new Error('Debe ingresar el Precio por Grupo.');
        }
      }

      if (id) {
        await paquetesService.update(id, formData);
      } else {
        await paquetesService.create(formData);
      }

      setHasUnsavedChanges(false);

      await Swal.fire({
        title: '¡Paquete Guardado!',
        text: id ? 'El paquete se actualizó correctamente.' : 'El nuevo paquete ha sido creado.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });

      navigate('/paquetes');

    } catch (err) {
      const msg = err.message || err.response?.data?.error || 'Error al guardar paquete';
      Swal.fire({
        title: 'Faltan datos',
        text: msg,
        icon: 'warning', // Usamos warning si es validación, error si es de servidor
        confirmButtonText: 'Revisar'
      });
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
          <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Machu Picchu Full Day" />
        </div>
        <div className="form-group">
          <label>Destino *</label>
          <input name="destino" value={formData.destino} onChange={handleChange} placeholder="Ej: Cusco" />
        </div>
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Duración (días) *</label>
          <input type="number" name="duracion_dias" value={formData.duracion_dias} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Fecha Inicio *</label>
          <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Fecha Fin *</label>
          <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} />
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
            <input type="number" name="precio" value={formData.precio} onChange={handleChange} step="0.01" placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>Cupos Máximos *</label>
            <input type="number" name="cupos" value={formData.cupos} onChange={handleChange} placeholder="Ej: 20" />
          </div>
          <div className="form-group">
            <label>Cupo Mínimo</label>
            <input type="number" name="min_cupos" value={formData.min_cupos} onChange={handleChange} placeholder="Ej: 1" />
          </div>
        </div>
      ) : (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Precio por Grupo *</label>
              <input type="number" name="precio_grupo" value={formData.precio_grupo} onChange={handleChange} step="0.01" placeholder="0.00" />
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
      {/* Botón protegido */}
      <button className="btn-back" onClick={handleCancel}>
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="wizard-container">
        <div className="wizard-progress">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1. Tipo</div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2. Datos Básicos</div>
          <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>3. Detalles</div>
        </div>

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
            step === 1 ? null : ( 
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