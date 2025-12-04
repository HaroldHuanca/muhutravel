import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { reservasService, clientesService, paquetesService, empleadosService } from '../services/api';
import { ArrowLeft, ArrowRight, Check, DollarSign, Users, Briefcase } from 'lucide-react';
import './EditPage.css';
import MiniChat from '../components/MiniChat';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

function ReservasEdit({ user, onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isNew = !id;

  // Estados generales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientes, setClientes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  // Estado para Wizard (Solo Nuevo)
  const [step, setStep] = useState(1);
  const [viewType, setViewType] = useState('REGULAR');

  // 2. ESTADO PARA DETECTAR CAMBIOS SIN GUARDAR
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Datos del Formulario
  const [formData, setFormData] = useState({
    numero_reserva: 'Por generar...',
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
    tipo_pago: 'none',
    monto: 0,
    metodo_pago: 'Transferencia',
    notas: 'Pago inicial'
  });

  // Datos para Edición
  const [pagosLista, setPagosLista] = useState([]);
  const [historialLista, setHistorialLista] = useState([]);

  // Estado para Modal de Pago (Edición)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState({
    tipo_pago: 'partial',
    monto: 0,
    metodo_pago: 'Transferencia',
    notas: ''
  });

  // --- EFECTO: CAPTURAR CLIENTE ENVIADO ---
  useEffect(() => {
    if (isNew && location.state?.clientePreseleccionado) {
      const clienteRecibido = location.state.clientePreseleccionado;

      setFormData(prev => ({
        ...prev,
        cliente_id: clienteRecibido.id
      }));

      setPasajeros(prev => {
        const nuevoArreglo = prev.length > 0 ? [...prev] : [{ nombres: '', apellidos: '', tipo_documento: 'DNI', documento: '', fecha_nacimiento: '' }];
        nuevoArreglo[0] = {
          ...nuevoArreglo[0],
          nombres: clienteRecibido.nombres,
          apellidos: clienteRecibido.apellidos,
          documento: clienteRecibido.documento,
        };
        return nuevoArreglo;
      });
      setHasUnsavedChanges(true); // Se pre-cargaron datos, hay cambios
    }
  }, [isNew, location.state]);

  useEffect(() => {
    fetchCatalogos();
    if (!isNew) {
      fetchReservaCompleta();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Calcular precio automático
  useEffect(() => {
    if (isNew && formData.paquete_id && formData.cantidad_personas) {
      const paquete = paquetes.find(p => p.id === parseInt(formData.paquete_id));
      if (paquete) {
        let nuevoPrecio = 0;
        const cantidad = parseInt(formData.cantidad_personas);

        if (paquete.tipo === 'REGULAR') {
          nuevoPrecio = parseFloat(paquete.precio) * cantidad;
        } else if (paquete.tipo === 'PRIVADO') {
          nuevoPrecio = parseFloat(paquete.precio_grupo);
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

  // Inicializar pasajeros
  useEffect(() => {
    if (isNew) {
      const cantidad = parseInt(formData.cantidad_personas) || 0;
      setPasajeros(prev => {
        const newPasajeros = [...prev];
        if (cantidad > newPasajeros.length) {
          for (let i = newPasajeros.length; i < cantidad; i++) {
            newPasajeros.push({ nombres: '', apellidos: '', tipo_documento: 'DNI', documento: '', fecha_nacimiento: '' });
          }
        } else if (cantidad < newPasajeros.length) {
          newPasajeros.splice(cantidad);
        }
        return newPasajeros;
      });
    }
  }, [formData.cantidad_personas, isNew]);

  // Actualizar monto de pago
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
      setHasUnsavedChanges(false); // Datos cargados, resetear cambios
    } catch (err) {
      Swal.fire('Error', 'No se pudo cargar la reserva', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setHasUnsavedChanges(true);
  };

  const handlePasajeroChange = (index, field, value) => {
    const newPasajeros = [...pasajeros];
    newPasajeros[index][field] = value;
    setPasajeros(newPasajeros);
    setHasUnsavedChanges(true);
  };

  const handlePagoChange = (e) => {
    const { name, value } = e.target;
    setPagoInicial(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
  };

  // 3. PROTECCIÓN AL SALIR
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Swal.fire({
        title: '¿Salir sin guardar?',
        text: "Se perderán los datos de la reserva.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) navigate('/reservas');
      });
    } else {
      navigate('/reservas');
    }
  };

  // --- WIZARD NAVIGATION CON ALERTAS ---
  const nextStep = () => {
    if (step === 1) {
      if (!formData.cliente_id || !formData.paquete_id || !formData.cantidad_personas) {
        Swal.fire({
          title: 'Datos incompletos',
          text: 'Por favor seleccione Cliente, Paquete y Cantidad de Pasajeros.',
          icon: 'warning',
          confirmButtonText: 'Ok'
        });
        return;
      }
    }
    if (step === 2) {
      const invalidPasajeros = pasajeros.some(p => !p.nombres || !p.apellidos);
      if (invalidPasajeros) {
        Swal.fire({
          title: 'Datos de Pasajeros',
          text: 'Por favor complete los nombres y apellidos de todos los pasajeros.',
          icon: 'warning',
          confirmButtonText: 'Ok'
        });
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  // --- SUBMIT (NUEVO) CON SWEETALERT ---
  const handleSubmitNew = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Crear Reserva
      let reservaId;
      try {
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
        throw new Error(`Error al guardar pasajeros: ${err.response?.data?.error || err.message}`);
      }

      // 3. Crear Pago (si aplica)
      if (pagoInicial.tipo_pago !== 'none') {
        try {
          await reservasService.addPago(reservaId, {
            monto: parseFloat(pagoInicial.monto),
            metodo_pago: pagoInicial.metodo_pago,
            referencia: null,
            notas: pagoInicial.tipo_pago === 'partial' ? 'Pago Inicial 30%' : 'Pago Total'
          });
        } catch (err) {
          throw new Error(`Error al registrar el pago: ${err.response?.data?.error || err.message}`);
        }
      }

      setHasUnsavedChanges(false);

      await Swal.fire({
        title: '¡Reserva Exitosa!',
        text: 'La reserva y sus detalles se han registrado correctamente.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ir a Lista'
      });

      navigate('/reservas');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message || 'Error desconocido al procesar la reserva', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- SUBMIT (EDICION) ---
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reservasService.update(id, formData);
      setHasUnsavedChanges(false);

      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'El estado de la reserva se ha actualizado.',
        timer: 1500,
        showConfirmButton: false
      });

      fetchReservaCompleta();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.error || 'Error al actualizar', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- PAYMENT MODAL LOGIC (EDICION) ---
  const handleOpenPaymentModal = () => {
    const totalPagado = pagosLista.reduce((acc, p) => acc + (p.estado === 'completado' ? parseFloat(p.monto) : 0), 0);
    const precioTotal = parseFloat(formData.precio_total);
    const saldoPendiente = precioTotal - totalPagado;

    if (saldoPendiente <= 0) {
      Swal.fire({
        icon: 'info',
        title: 'Pago Completo',
        text: 'Esta reserva ya está pagada en su totalidad.'
      });
      return;
    }

    let tipoInicial = 'remaining';
    let montoInicial = saldoPendiente;

    if (totalPagado === 0) {
      tipoInicial = 'partial';
      montoInicial = precioTotal * 0.30;
    }

    setPaymentModalData({
      tipo_pago: tipoInicial,
      monto: montoInicial,
      metodo_pago: 'Transferencia',
      notas: tipoInicial === 'partial' ? 'Pago Inicial 30%' : (tipoInicial === 'full' ? 'Pago Total' : 'Saldo Restante')
    });
    setShowPaymentModal(true);
  };

  const handlePaymentModalChange = (e) => {
    const { name, value } = e.target;
    setPaymentModalData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentTypeChange = (type) => {
    const totalPagado = pagosLista.reduce((acc, p) => acc + (p.estado === 'completado' ? parseFloat(p.monto) : 0), 0);
    const precioTotal = parseFloat(formData.precio_total);
    const saldoPendiente = precioTotal - totalPagado;

    let nuevoMonto = 0;
    let nuevasNotas = '';

    if (type === 'partial') {
      nuevoMonto = precioTotal * 0.30;
      nuevasNotas = 'Pago Inicial 30%';
    } else if (type === 'full') {
      nuevoMonto = precioTotal;
      nuevasNotas = 'Pago Total';
    } else if (type === 'remaining') {
      nuevoMonto = saldoPendiente;
      nuevasNotas = 'Saldo Restante';
    }

    setPaymentModalData(prev => ({
      ...prev,
      tipo_pago: type,
      monto: nuevoMonto,
      notas: nuevasNotas
    }));
  };

  const handleSubmitPayment = async () => {
    setLoading(true);
    try {
      await reservasService.addPago(id, {
        monto: parseFloat(paymentModalData.monto),
        metodo_pago: paymentModalData.metodo_pago,
        referencia: null,
        notas: paymentModalData.notas
      });

      setShowPaymentModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Pago Registrado',
        text: 'El pago se ha registrado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
      fetchReservaCompleta();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al registrar el pago: ' + (err.response?.data?.error || err.message)
      });
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
      </div >
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
          <label>Número Reserva (Automático)</label>
          <input
            type="text"
            name="numero_reserva"
            value={isNew ? '(Se generará al guardar)' : formData.numero_reserva}
            readOnly
            style={{
              backgroundColor: '#e9ecef',
              color: '#6c757d',
              cursor: 'not-allowed',
              fontStyle: 'italic'
            }}
          />
        </div>
      </div>
    </div >
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
        <p><strong>Paquete:</strong> {paquetes.find(p => p.id === parseInt(formData.paquete_id))?.nombre}</p>
        <p><strong>Pasajeros:</strong> {formData.cantidad_personas}</p>
        <p><strong>Total Reserva:</strong> S/. {formData.precio_total}</p>
        <p><strong>A Pagar Ahora:</strong> S/. {pagoInicial.monto.toFixed(2)}</p>
        <p><strong>Estado Resultante:</strong> {pagoInicial.tipo_pago !== 'none' ? 'CONFIRMADA' : 'PENDIENTE DE PAGO'}</p>
      </div>
    </div>
  );

  const renderEditView = () => (
    <div className="edit-view">
      <form onSubmit={handleSubmitEdit} className="edit-form">
        <h2>Editar Reserva</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="pendiente_pago">Pendiente de Pago</option>
              <option value="confirmada">Confirmada</option>
              <option value="en_servicio">En Servicio</option>
              <option value="completada">Completada</option>
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

      {(() => {
        const totalPagado = pagosLista.reduce((acc, p) => acc + (p.estado === 'completado' ? parseFloat(p.monto) : 0), 0);
        const precioTotal = parseFloat(formData.precio_total);
        const saldoPendiente = precioTotal - totalPagado;

        if (saldoPendiente > 0.1 && (formData.estado === 'pendiente_pago' || formData.estado === 'confirmada')) {
          return (
            <div className="payment-action-container" style={{ margin: '20px 0', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Saldo Pendiente: </strong> S/. {saldoPendiente.toFixed(2)}
              </div>
              <button type="button" className="btn-success" onClick={handleOpenPaymentModal}>
                <DollarSign size={16} style={{ marginRight: '5px' }} /> Registrar Pago
              </button>
            </div>
          );
        }
        return null;
      })()}

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Registrar Pago</h3>

            <div className="payment-options-modal" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              {pagosLista.length === 0 && (
                <>
                  <button
                    type="button"
                    className={`btn-option ${paymentModalData.tipo_pago === 'partial' ? 'active' : ''}`}
                    onClick={() => handlePaymentTypeChange('partial')}
                    style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: paymentModalData.tipo_pago === 'partial' ? '#e3f2fd' : 'white' }}
                  >
                    Pago Inicial (30%)
                  </button>
                  <button
                    type="button"
                    className={`btn-option ${paymentModalData.tipo_pago === 'full' ? 'active' : ''}`}
                    onClick={() => handlePaymentTypeChange('full')}
                    style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: paymentModalData.tipo_pago === 'full' ? '#e3f2fd' : 'white' }}
                  >
                    Pago Total (100%)
                  </button>
                </>
              )}
              {pagosLista.length > 0 && (
                <button
                  type="button"
                  className={`btn-option ${paymentModalData.tipo_pago === 'remaining' ? 'active' : ''}`}
                  onClick={() => handlePaymentTypeChange('remaining')}
                  style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#e3f2fd' }}
                >
                  Pagar Restante
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Monto a Pagar</label>
              <input
                type="number"
                name="monto"
                value={paymentModalData.monto}
                onChange={handlePaymentModalChange}
              />
            </div>

            <div className="form-group">
              <label>Método de Pago</label>
              <select name="metodo_pago" value={paymentModalData.metodo_pago} onChange={handlePaymentModalChange}>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Yape/Plin">Yape/Plin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notas</label>
              <input
                type="text"
                name="notas"
                value={paymentModalData.notas}
                onChange={handlePaymentModalChange}
              />
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancelar</button>
              <button type="button" className="btn-success" onClick={handleSubmitPayment}>Confirmar Pago</button>
            </div>
          </div>
        </div>
      )}

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
    <div className="edit-page">
      <div className="page-header">
        <button className="btn-back" onClick={handleCancel}>
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>
        <h1>{isNew ? 'Nueva Reserva' : `Reserva ${formData.numero_reserva}`}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isNew ? (
        <div className="wizard-container">
          <div className="wizard-progress">
            <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className="step-line"></div>
            <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className="step-line"></div>
            <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>

          <div className="wizard-content">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>

          <div className="wizard-actions">
            {step > 1 && (
              <button className="btn-secondary" onClick={prevStep}>
                <ArrowLeft size={16} /> Anterior
              </button>
            )}
            {step < 3 ? (
              <button className="btn-primary" onClick={nextStep}>
                Siguiente <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn-success" onClick={handleSubmitNew} disabled={loading}>
                {loading ? 'Guardando...' : 'Confirmar Reserva'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {renderEditView()}
          {/* Mini Chat Widget - Solo en edición y si hay cliente */}
          {formData.cliente_id && (
            <MiniChat
              clienteId={formData.cliente_id}
              clienteNombre={
                clientes.find(c => c.id === formData.cliente_id)
                  ? `${clientes.find(c => c.id === formData.cliente_id).nombres} ${clientes.find(c => c.id === formData.cliente_id).apellidos}`
                  : 'Cliente'
              }
              telefono={clientes.find(c => c.id === formData.cliente_id)?.telefono}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ReservasEdit;