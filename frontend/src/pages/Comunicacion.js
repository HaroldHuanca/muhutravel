import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import QRCode from 'qrcode.react';
import { Send, Phone, MessageCircle, X, CheckCircle, AlertCircle, Loader, FileText } from 'lucide-react';
import './Comunicacion.css';

function Comunicacion({ user, onLogout }) {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [qrVisible, setQrVisible] = useState(false);
  const [conexionEstablecida, setConexionEstablecida] = useState(false);
  const [buscador, setBuscador] = useState('');
  const [whapiConfigured, setWhapiConfigured] = useState(false);
  const [newToken, setNewToken] = useState('');
  const [plantillas, setPlantillas] = useState([]);
  const [showPlantillas, setShowPlantillas] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // Cargar clientes y estado de whapi al montar
  useEffect(() => {
    cargarClientes();
    checkWhapiStatus();
    cargarPlantillas();
  }, []);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Polling automático para nuevos mensajes
  useEffect(() => {
    if (selectedCliente && conexionEstablecida) {
      cargarMensajes();
      pollingIntervalRef.current = setInterval(() => {
        cargarMensajesConDeteccion();
      }, 2000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCliente, conexionEstablecida]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkWhapiStatus = async () => {
    try {
      const response = await api.get('/comunicacion/status');
      setWhapiConfigured(response.data.whapiConfigured);
    } catch (err) {
      console.error('Error al verificar estado de whapi:', err);
    }
  };

  const guardarToken = async () => {
    try {
      setLoading(true);
      const response = await api.post('/comunicacion/config', { token: newToken });
      if (response.data.success) {
        setSuccess('Token guardado y activado correctamente');
        setWhapiConfigured(true);
        setConexionEstablecida(true); // Auto-conectar
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error al guardar token: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clientes');
      setClientes(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar clientes: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const seleccionarCliente = (cliente) => {
    setSelectedCliente(cliente);
    setMensajes([]);
    // Si whapi está configurado, conectar automáticamente
    setConexionEstablecida(whapiConfigured);
    setQrVisible(false);
    setNuevoMensaje('');
    setError('');
    setSuccess('');

    // Si ya está conectado (automáticamente), cargar mensajes
    // El useEffect se encargará de cargar los mensajes cuando cambie el cliente
  };

  const cargarPlantillas = async () => {
    try {
      const response = await api.get('/comunicacion/plantillas');
      setPlantillas(response.data);
    } catch (err) {
      console.error('Error al cargar plantillas:', err);
    }
  };

  const usarPlantilla = (plantilla) => {
    if (!selectedCliente) return;

    const nombreCliente = selectedCliente.nombres || selectedCliente.nombre || '';
    const texto = plantilla.contenido.replace('{{nombre}}', nombreCliente.split(' ')[0]);

    setNuevoMensaje(texto);
    setShowPlantillas(false);
  };

  const generarQR = () => {
    if (!selectedCliente?.telefono) {
      setError('El cliente no tiene número de teléfono registrado');
      return;
    }
    setQrVisible(true);
  };

  const establecerConexion = async () => {
    if (!selectedCliente?.telefono) {
      setError('Número de teléfono no disponible');
      return;
    }

    try {
      setLoading(true);

      // Simular conexión con WhatsApp API
      const nombreCompleto = `${selectedCliente.nombres || ''} ${selectedCliente.apellidos || ''}`.trim();
      const response = await api.post(
        '/comunicacion/conectar',
        {
          clienteId: selectedCliente.id,
          telefono: selectedCliente.telefono,
          nombre: nombreCompleto || selectedCliente.nombre
        }
      );

      if (response.data.success) {
        setConexionEstablecida(true);
        setSuccess('Conexión establecida correctamente');
        setQrVisible(false);
        setError('');

        // Cargar mensajes previos
        cargarMensajes();
      }
    } catch (err) {
      setError('Error al establecer conexión: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const cargarMensajes = async () => {
    if (!selectedCliente) return;

    try {
      const response = await api.get(`/comunicacion/mensajes/${selectedCliente.id}`);
      setMensajes(response.data);
      lastMessageCountRef.current = response.data.length;
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
    }
  };

  const cargarMensajesConDeteccion = async () => {
    if (!selectedCliente) return;

    try {
      const response = await api.get(`/comunicacion/mensajes/${selectedCliente.id}`);

      // Solo actualizar si hay nuevos mensajes
      if (response.data.length > lastMessageCountRef.current) {
        console.log(`📨 Nuevos mensajes detectados: ${response.data.length - lastMessageCountRef.current}`);
        setMensajes(response.data);
        lastMessageCountRef.current = response.data.length;

        // Mostrar notificación de nuevo mensaje
        const nuevosMensajes = response.data.slice(lastMessageCountRef.current);
        if (nuevosMensajes.length > 0 && nuevosMensajes[0].tipo === 'recibido') {
          setSuccess('📨 Nuevo mensaje recibido');
          setTimeout(() => setSuccess(''), 3000);
        }
      }
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
    }
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();

    if (!nuevoMensaje.trim()) {
      setError('El mensaje no puede estar vacío');
      return;
    }

    if (!selectedCliente) {
      setError('Selecciona un cliente primero');
      return;
    }

    if (!conexionEstablecida) {
      setError('Debes establecer conexión primero');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        '/comunicacion/enviar',
        {
          clienteId: selectedCliente.id,
          telefono: selectedCliente.telefono,
          mensaje: nuevoMensaje,
          remitente: user.username
        }
      );

      if (response.data.success) {
        // Agregar mensaje a la lista
        setMensajes([
          ...mensajes,
          {
            id: response.data.messageId,
            texto: nuevoMensaje,
            remitente: 'Yo',
            timestamp: new Date().toLocaleTimeString(),
            tipo: 'enviado'
          }
        ]);
        setNuevoMensaje('');
        setSuccess('Mensaje enviado');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error al enviar mensaje: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const nombreCompleto = `${cliente.nombres || ''} ${cliente.apellidos || ''}`.toLowerCase();
    return nombreCompleto.includes(buscador.toLowerCase()) ||
      cliente.telefono?.includes(buscador);
  });

  return (
    <div className="comunicacion-container">
      <div className="comunicacion-header">
        <h1>Centro de Comunicación</h1>
        <p>Conecta y comunícate con tus clientes a través de WhatsApp</p>
      </div>

      <div className="comunicacion-layout">
        {/* Panel de Clientes */}
        <div className="clientes-panel">
          <div className="panel-header">
            <h2>Clientes</h2>
            <MessageCircle size={24} />
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="clientes-list">
            {loading && !clientes.length ? (
              <div className="loading-state">
                <Loader size={32} />
                <p>Cargando clientes...</p>
              </div>
            ) : clientesFiltrados.length === 0 ? (
              <div className="empty-state">
                <Phone size={32} />
                <p>No hay clientes disponibles</p>
              </div>
            ) : (
              clientesFiltrados.map(cliente => (
                <div
                  key={cliente.id}
                  className={`cliente-item ${selectedCliente?.id === cliente.id ? 'active' : ''}`}
                  onClick={() => seleccionarCliente(cliente)}
                >
                  <div className="cliente-avatar">
                    {(cliente.nombres || cliente.nombre || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="cliente-info">
                    <h4>{`${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() || cliente.nombre}</h4>
                    <p>{cliente.telefono || 'Sin teléfono'}</p>
                  </div>
                  {selectedCliente?.id === cliente.id && conexionEstablecida && (
                    <CheckCircle size={20} className="connected-badge" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel de Chat */}
        <div className="chat-panel">
          {selectedCliente ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <h3>{`${selectedCliente.nombres || ''} ${selectedCliente.apellidos || ''}`.trim() || selectedCliente.nombre}</h3>
                  <p>{selectedCliente.telefono}</p>
                </div>
                <button
                  className="close-btn"
                  onClick={() => setSelectedCliente(null)}
                  title="Cerrar"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Alertas */}
              {error && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                  <button onClick={() => setError('')} className="close-alert">
                    <X size={16} />
                  </button>
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  <CheckCircle size={18} />
                  <span>{success}</span>
                </div>
              )}

              {/* Sección de Conexión / Configuración */}
              {!conexionEstablecida ? (
                <div className="connection-section">
                  <div className="connection-info">
                    <MessageCircle size={32} />
                    <h4>Configuración de WhatsApp</h4>

                    {!whapiConfigured ? (
                      user.rol === 'admin' ? (
                        <div className="config-admin-panel">
                          <p>El token de Whapi no está configurado. Ingrésalo para activar el servicio.</p>
                          <div className="token-input-group">
                            <input
                              type="text"
                              placeholder="Pegar WHAPI_TOKEN aquí..."
                              value={newToken}
                              onChange={(e) => setNewToken(e.target.value)}
                              className="token-input"
                            />
                            <button
                              className="btn btn-primary"
                              onClick={guardarToken}
                              disabled={loading || !newToken.trim()}
                            >
                              {loading ? 'Guardando...' : 'Guardar y Activar'}
                            </button>
                          </div>
                          <p className="help-text">
                            Obtén tu token en <a href="https://whapi.cloud" target="_blank" rel="noopener noreferrer">whapi.cloud</a>
                          </p>
                        </div>
                      ) : (
                        <div className="config-user-message">
                          <AlertCircle size={48} className="text-warning" />
                          <p>El servicio de mensajería no está configurado.</p>
                          <p className="sub-text">Por favor, contacte al administrador del sistema para activar la integración con WhatsApp.</p>
                        </div>
                      )
                    ) : (
                      <div className="connection-actions">
                        <p>Servicio activo. Conectando...</p>
                        <Loader className="spin" />
                      </div>
                    )}
                  </div>

                  {/* Mantener opción de QR solo para admin si lo desea como fallback o testing */}
                  {user.rol === 'admin' && !whapiConfigured && (
                    <div className="qr-fallback">
                      <button className="btn-link" onClick={() => setQrVisible(!qrVisible)}>
                        {qrVisible ? 'Ocultar QR de prueba' : 'Mostrar QR de prueba (Simulación)'}
                      </button>

                      {qrVisible && (
                        <div className="qr-container">
                          <QRCode
                            value={`https://wa.me/${selectedCliente.telefono.replace(/\D/g, '')}`}
                            size={200}
                          />
                          <p>QR para pruebas locales</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Área de Mensajes */}
                  <div className="messages-area">
                    {mensajes.length === 0 ? (
                      <div className="empty-messages">
                        <MessageCircle size={48} />
                        <p>No hay mensajes aún. ¡Inicia la conversación!</p>
                      </div>
                    ) : (
                      mensajes.map((msg, index) => (
                        <div
                          key={index}
                          className={`message ${msg.tipo === 'enviado' ? 'sent' : 'received'}`}
                        >
                          <div className="message-content">
                            <p className="message-text">{msg.texto}</p>
                            <span className="message-time">{msg.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Formulario de Envío */}
                  <form className="message-form" onSubmit={enviarMensaje}>
                    <button
                      type="button"
                      className="template-btn"
                      onClick={() => setShowPlantillas(!showPlantillas)}
                      title="Usar plantilla"
                    >
                      <FileText size={20} />
                    </button>

                    {showPlantillas && (
                      <div className="templates-popup">
                        <div className="templates-header">
                          <h4>Plantillas</h4>
                          <button type="button" onClick={() => setShowPlantillas(false)}><X size={16} /></button>
                        </div>
                        <div className="templates-list">
                          {plantillas.map(p => (
                            <div key={p.id} className="template-item" onClick={() => usarPlantilla(p)}>
                              <strong>{p.nombre}</strong>
                              <p>{p.contenido.substring(0, 50)}...</p>
                            </div>
                          ))}
                          {plantillas.length === 0 && <p className="no-templates">No hay plantillas</p>}
                        </div>
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Escribe tu mensaje..."
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      disabled={loading}
                      className="message-input"
                    />
                    <button
                      type="submit"
                      disabled={loading || !nuevoMensaje.trim()}
                      className="send-btn"
                      title="Enviar mensaje"
                    >
                      {loading ? <Loader size={20} /> : <Send size={20} />}
                    </button>
                  </form>
                </>
              )}
            </>
          ) : (
            <div className="no-selection">
              <MessageCircle size={64} />
              <h3>Selecciona un cliente</h3>
              <p>Elige un cliente de la lista para comenzar a comunicarte</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comunicacion;
