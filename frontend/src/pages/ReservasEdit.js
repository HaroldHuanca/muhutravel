import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservasService, clientesService, paquetesService, empleadosService } from '../services/api';
import { ArrowLeft, ArrowRight, Check, Plus, Trash, DollarSign, User, Users, Briefcase } from 'lucide-react';
import './EditPage.css';

function ReservasEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id;

  // Estados generales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientes, setClientes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  // Estado para Wizard (Solo Nuevo)
  const [step, setStep] = useState(1);
  const [viewType, setViewType] = useState('REGULAR'); // REGULAR | PRIVADO

  // Datos del Formulario
  const [formData, setFormData] = useState({
    numero_reserva: `RES-${Date.now()}`, // Autogenerado por defecto
    cliente_id: '',
    paquete_id: '',
    empleado_id: '',
    cantidad_personas: 1,
    precio_total: 0,
    estado: 'pendiente',
    comentario: '',
  });

  // Datos de Pasajeros
  const [pasajeros, setPasajeros] = useState([]);

  // Datos de Pago Inicial (Solo Nuevo)
  const [pagoInicial, setPagoInicial] = useState({
    tipo_pago: 'none', // none, partial (30%), full (100%)
    monto: 0,
    metodo_pago: 'Transferencia',
    notas: 'Pago inicial'
  });

  // Datos para Edición (Listas cargadas)
  const [pagosLista, setPagosLista] = useState([]);
  const [historialLista, setHistorialLista] = useState([]);

  useEffect(() => {
    fetchCatalogos();
    if (!isNew) {
      fetchReservaCompleta();
    }
  }, [id]);

  // Calcular precio automático cuando cambia paquete o cantidad (Solo Nuevo)
  // Calcular precio automático cuando cambia paquete o cantidad (Solo Nuevo)
  useEffect(() => {
    if (isNew && formData.paquete_id && formData.cantidad_personas) {
      const paquete = paquetes.find(p => p.id === parseInt(formData.paquete_id));
      if (paquete) {
        let nuevoPrecio = 0;
        const cantidad = parseInt(formData.cantidad_personas);

        if (paquete.tipo === 'REGULAR') {
          nuevoPrecio = parseFloat(paquete.precio) * cantidad;
        } else if (paquete.tipo === 'PRIVADO') {
          // Precio base del grupo
          nuevoPrecio = parseFloat(paquete.precio_grupo);

          // Calcular extra si excede el máximo recomendado
          const maxRecomendado = paquete.max_pasajeros_recomendado || 0;
          if (cantidad > maxRecomendado && paquete.precio_adicional_persona) {
            const extraPax = cantidad - maxRecomendado;
            nuevoPrecio += extraPax * parseFloat(paquete.precio_adicional_persona);
          }
        }

        setFormData(prev => ({
          ...prev,
          precio_total: nuevoPrecio
        }));
      }
    }
  }, [formData.paquete_id, formData.cantidad_personas, paquetes, isNew]);

  // Inicializar pasajeros cuando cambia cantidad (Solo Nuevo)
  useEffect(() => {
    if (isNew) {
      const cantidad = parseInt(formData.cantidad_personas) || 0;
      setPasajeros(prev => {
        const newPasajeros = [...prev];
        if (cantidad > newPasajeros.length) {
          // Agregar faltantes
          for (let i = newPasajeros.length; i < cantidad; i++) {
            newPasajeros.push({ nombres: '', apellidos: '', tipo_documento: 'DNI', documento: '', fecha_nacimiento: '' });
          }
        } else if (cantidad < newPasajeros.length) {
          // Quitar sobrantes
          newPasajeros.splice(cantidad);
        }
        return newPasajeros;
      });
    }
  }, [formData.cantidad_personas, isNew]);

  // Actualizar monto de pago si cambia el precio total
  useEffect(() => {
    if (pagoInicial.tipo_pago === 'partial') {
      setPagoInicial(prev => ({ ...prev, monto: formData.precio_total * 0.30 }));
    } else if (pagoInicial.tipo_pago === 'full') {
      setPagoInicial(prev => ({ ...prev, monto: formData.precio_total }));
    }
  }, [formData.precio_total, pagoInicial.tipo_pago]);

  const fetchCatalogos = async () => {
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
      console.error('Error al cargar catálogos:', err);
    }
  };

  const fetchReservaCompleta = async () => {
    setLoading(true);
    try {
      const res = await reservasService.getById(id);
      setFormData(res.data);
      setPasajeros(res.data.pasajeros || []);
      setPagosLista(res.data.pagos || []);
      setHistorialLista(res.data.historial || []);
    } catch (err) {
      setError('Error al cargar reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasajeroChange = (index, field, value) => {
    const newPasajeros = [...pasajeros];
    newPasajeros[index][field] = value;
    setPasajeros(newPasajeros);
  };

  const handlePagoChange = (e) => {
    const { name, value } = e.target;
    setPagoInicial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentOptionChange = (option) => {
    let monto = 0;
    if (option === 'partial') {
      monto = formData.precio_total * 0.30;
    } else if (option === 'full') {
      monto = formData.precio_total;
    }

    setPagoInicial(prev => ({
      ...prev,
      tipo_pago: option,
      monto: monto
    }));
  };

  // --- WIZARD NAVIGATION ---
  const nextStep = () => {
    if (step === 1) {
      if (!formData.cliente_id || !formData.paquete_id || !formData.cantidad_personas) {
        setError('Por favor complete los campos obligatorios');
        return;
      }
    }
    if (step === 2) {
      // Validar pasajeros
      const invalidPasajeros = pasajeros.some(p => !p.nombres || !p.apellidos);
      if (invalidPasajeros) {
        setError('Por favor complete los nombres y apellidos de todos los pasajeros');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  // --- SUBMIT (NUEVO) ---
  const handleSubmitNew = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Crear Reserva
      let reservaId;
      try {
        // Determinar estado basado en pago
        let estadoReserva = 'borrador';
        if (pagoInicial.tipo_pago === 'full' || pagoInicial.tipo_pago === 'partial') {
          estadoReserva = 'confirmada';
        } else {
          estadoReserva = 'pendiente_pago';
        }

        const sanitizedData = {
          ...formData,
          empleado_id: formData.empleado_id || null,
          precio_total: parseFloat(formData.precio_total),
          cantidad_personas: parseInt(formData.cantidad_personas),
          estado: estadoReserva
        };

        const resReserva = await reservasService.create(sanitizedData);
        reservaId = resReserva.data.id;
      } catch (err) {
        throw new Error(`Error al crear la reserva base: ${err.response?.data?.error || err.message}`);
      }

      // 2. Crear Pasajeros
      try {
        for (const p of pasajeros) {
          const pasajeroData = {
            ...p,
            fecha_nacimiento: p.fecha_nacimiento || null
          };
          await reservasService.addPasajero(reservaId, pasajeroData);
        }
      } catch (err) {
        console.error('Error pasajeros:', err);
        throw new Error(`Error al guardar pasajeros: ${err.response?.data?.error || err.message}`);
      }

      // 3. Crear Pago (si aplica)
      if (pagoInicial.tipo_pago !== 'none') {
        try {
          await reservasService.addPago(reservaId, {
            monto: parseFloat(pagoInicial.monto),
            metodo_pago: pagoInicial.metodo_pago,
            referencia: null, // Explícitamente null como pidió el usuario
            notas: pagoInicial.tipo_pago === 'partial' ? 'Pago Inicial 30%' : 'Pago Total'
          });
        } catch (err) {
          console.error('Error pago:', err);
          throw new Error(`Error al registrar el pago: ${err.response?.data?.error || err.message}`);
        }
      }

      navigate('/reservas');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error desconocido al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  // --- SUBMIT (EDICION - Solo datos básicos) ---
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reservasService.update(id, formData);
      alert('Reserva actualizada');
      fetchReservaCompleta(); // Recargar para ver historial actualizado
    } catch (err) {
      setError('Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER WIZARD STEPS ---

  const renderStep1 = () => (
    <div className="wizard-step">
      <h2>Paso 1: Datos Generales</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Cliente *</label>
          <select name="cliente_id" value={formData.cliente_id} onChange={handleChange} required>
            <option value="">Seleccionar...</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Tipo de Paquete</label>
          <div className="mini-type-selector">
            <div
              className={`mini-card ${viewType === 'REGULAR' ? 'selected' : ''}`}
              onClick={() => { setViewType('REGULAR'); setFormData({ ...formData, paquete_id: '' }); }}
            >
              <div className="icon-wrapper"><Users size={24} /></div>
              <span className="type-title">Regular</span>
              {viewType === 'REGULAR' && <div className="check-badge"><Check size={10} /></div>}
            </div>

            <div
              className={`mini-card ${viewType === 'PRIVADO' ? 'selected' : ''}`}
              onClick={() => { setViewType('PRIVADO'); setFormData({ ...formData, paquete_id: '' }); }}
            >
              <div className="icon-wrapper"><Briefcase size={24} /></div>
              <span className="type-title">Privado</span>
              {viewType === 'PRIVADO' && <div className="check-badge"><Check size={10} /></div>}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Paquete *</label>
          <select name="paquete_id" value={formData.paquete_id} onChange={handleChange} required>
            <option value="">Seleccionar...</option>
            {paquetes
              .filter(p => p.tipo === viewType)
              .map(p => {
                const cuposDisponibles = p.cupos - (parseInt(p.reservas_actuales) || 0);
                const label = viewType === 'REGULAR'
                  ? `${p.nombre} (S/. ${p.precio} - ${cuposDisponibles} cupos)`
                  : `${p.nombre} (Grupo: S/. ${p.precio_grupo})`;
                return <option key={p.id} value={p.id}>{label}</option>;
              })}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Cantidad Pasajeros *</label>
          <input
            type="number"
            name="cantidad_personas"
            value={formData.cantidad_personas}
            onChange={handleChange}
            min="1"
            max={(() => {
              if (viewType === 'REGULAR' && formData.paquete_id) {
                const p = paquetes.find(pkg => pkg.id === parseInt(formData.paquete_id));
                if (p) return p.cupos - (parseInt(p.reservas_actuales) || 0);
              }
              return undefined;
            })()}
            required
          />
          {viewType === 'REGULAR' && formData.paquete_id && (
            <small style={{ color: '#666' }}>
              Máximo: {(() => {
                const p = paquetes.find(pkg => pkg.id === parseInt(formData.paquete_id));
                return p ? (p.cupos - (parseInt(p.reservas_actuales) || 0)) : '-';
              })()}
            </small>
          )}
        </div>
        <div className="form-group">
          <label>Precio Total (Calculado)</label>
          <input
            type="number"
            name="precio_total"
            value={formData.precio_total}
            onChange={handleChange}
            readOnly
            style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }}
          />

          {viewType === 'PRIVADO' && formData.paquete_id && (
            (() => {
              const p = paquetes.find(pkg => pkg.id === parseInt(formData.paquete_id));
              if (!p) return null;
              const cantidad = parseInt(formData.cantidad_personas) || 1;
              const maxRecomendado = p.max_pasajeros_recomendado || 0;
              const extra = cantidad > maxRecomendado ? cantidad - maxRecomendado : 0;

              return (
                <div className="price-breakdown">
                  <div className="breakdown-row">
                    <span>Precio Base Grupo:</span>
                    <span>S/. {parseFloat(p.precio_grupo).toFixed(2)}</span>
                  </div>
                  {extra > 0 && (
                    <div className="breakdown-row extra">
                      <span>+ {extra} pasajero(s) extra (x S/. {p.precio_adicional_persona}):</span>
                      <span>S/. {(extra * parseFloat(p.precio_adicional_persona)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="breakdown-total">
                    <span>Total:</span>
                    <span>S/. {formData.precio_total.toFixed(2)}</span>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Empleado (Vendedor)</label>
          <select name="empleado_id" value={formData.empleado_id} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            {empleados.map(e => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Número Reserva (Auto)</label>
          <input
            type="text"
            name="numero_reserva"
            value={formData.numero_reserva}
            readOnly
            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="wizard-step">
      <h2>Paso 2: Información de Pasajeros</h2>
      {pasajeros.map((p, index) => (
        <div key={index} className="pasajero-card">
          <h4>Pasajero {index + 1}</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Nombres</label>
              <input value={p.nombres} onChange={(e) => handlePasajeroChange(index, 'nombres', e.target.value)} placeholder="Nombres" />
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input value={p.apellidos} onChange={(e) => handlePasajeroChange(index, 'apellidos', e.target.value)} placeholder="Apellidos" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo Doc.</label>
              <select value={p.tipo_documento} onChange={(e) => handlePasajeroChange(index, 'tipo_documento', e.target.value)}>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="CE">CE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Documento</label>
              <input value={p.documento} onChange={(e) => handlePasajeroChange(index, 'documento', e.target.value)} placeholder="Número" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div className="wizard-step">
      <h2>Paso 3: Opciones de Pago</h2>

      <div className="payment-options">
        <div
          className={`payment-option ${pagoInicial.tipo_pago === 'none' ? 'selected' : ''}`}
          onClick={() => handlePaymentOptionChange('none')}
        >
          <div className="option-header">
            <input type="radio" checked={pagoInicial.tipo_pago === 'none'} readOnly />
            <span>Sin Pago Ahora</span>
          </div>
          <p>La reserva quedará como <strong>Pendiente</strong>.</p>
        </div>

        <div
          className={`payment-option ${pagoInicial.tipo_pago === 'partial' ? 'selected' : ''}`}
          onClick={() => handlePaymentOptionChange('partial')}
        >
          <div className="option-header">
            <input type="radio" checked={pagoInicial.tipo_pago === 'partial'} readOnly />
            <span>Pago Inicial (30%)</span>
          </div>
          <p>Monto: <strong>S/. {(formData.precio_total * 0.30).toFixed(2)}</strong></p>
          <p>La reserva quedará como <strong>Confirmada</strong>.</p>
        </div>

        <div
          className={`payment-option ${pagoInicial.tipo_pago === 'full' ? 'selected' : ''}`}
          onClick={() => handlePaymentOptionChange('full')}
        >
          <div className="option-header">
            <input type="radio" checked={pagoInicial.tipo_pago === 'full'} readOnly />
            <span>Pago Total (100%)</span>
          </div>
          <p>Monto: <strong>S/. {formData.precio_total.toFixed(2)}</strong></p>
          <p>La reserva quedará como <strong>Confirmada</strong>.</p>
        </div>
      </div>

      {pagoInicial.tipo_pago !== 'none' && (
        <div className="payment-form">
          <h3>Detalles del Pago</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Monto a Pagar</label>
              <input
                type="number"
                name="monto"
                value={pagoInicial.monto}
                readOnly
                style={{ backgroundColor: '#f0f0f0' }}
              />
            </div>
            <div className="form-group">
              <label>Método</label>
              <select name="metodo_pago" value={pagoInicial.metodo_pago} onChange={handlePagoChange}>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Yape/Plin">Yape/Plin</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="summary-card">
        <h3>Resumen Final</h3>
        <p><strong>Paquete:</strong> {paquetes.find(p => p.id == formData.paquete_id)?.nombre}</p>
        <p><strong>Pasajeros:</strong> {formData.cantidad_personas}</p>
        <p><strong>Total Reserva:</strong> S/. {formData.precio_total}</p>
        <p><strong>A Pagar Ahora:</strong> S/. {pagoInicial.monto.toFixed(2)}</p>
        <p><strong>Estado Resultante:</strong> {pagoInicial.tipo_pago !== 'none' ? 'CONFIRMADA' : 'PENDIENTE DE PAGO'}</p>
      </div>
    </div>
  );

  // --- RENDER EDIT VIEW (OLD STYLE + TABS/SECTIONS) ---
  const renderEditView = () => (
    <div className="edit-view">
      <form onSubmit={handleSubmitEdit} className="edit-form">
        <h2>Editar Reserva</h2>
        {/* Reutilizar campos básicos aquí si es necesario, simplificado */}
        <div className="form-row">
          <div className="form-group">
            <label>Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div className="form-group">
            <label>Comentario</label>
            <input name="comentario" value={formData.comentario} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="btn-submit">Actualizar Estado</button>
      </form>

      <div className="sections-container">
        <div className="section">
          <h3>Pasajeros ({pasajeros.length})</h3>
          <ul className="list-group">
            {pasajeros.map(p => (
              <li key={p.id} className="list-item">
                {p.nombres} {p.apellidos} ({p.documento})
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>Pagos</h3>
          <ul className="list-group">
            {pagosLista.map(p => (
              <li key={p.id} className="list-item">
                {p.fecha_pago?.substring(0, 10)} - S/. {p.monto} ({p.metodo_pago}) - {p.estado}
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>Historial</h3>
          <ul className="list-group">
            {historialLista.map(h => (
              <li key={h.id} className="list-item history-item">
                <small>{h.fecha_cambio?.substring(0, 16)}</small>: {h.estado_anterior} -&gt; {h.estado_nuevo} ({h.usuario_nombre})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate('/reservas')}>
        <ArrowLeft size={20} /> Volver
      </button>

      {error && <div className="error-message">{error}</div>}

      {isNew ? (
        <div className="wizard-container">
          <div className="wizard-progress">
            <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1. Datos</div>
            <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2. Pasajeros</div>
            <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>3. Pago</div>
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
              <button className="btn-primary" onClick={nextStep}>
                Siguiente <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn-success" onClick={handleSubmitNew} disabled={loading}>
                {loading ? 'Procesando...' : 'Finalizar Reserva'} <Check size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        renderEditView()
      )}
    </div>
  );
}

export default ReservasEdit;
