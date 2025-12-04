import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaRobot, FaComments, FaBullhorn, FaUsers, FaPlus, FaPaperPlane, FaTrash, FaPlug, FaCommentSlash, FaUser, FaPaste } from 'react-icons/fa';
import QRCode from 'qrcode.react';
import WhatsAppService, { WhatsAppUI } from '../services/WhatsAppService';
import './Comunicacion.css';

function Comunicacion() {
  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const newMessagesBtnRef = useRef(null);
  const qrCodeRef = useRef(null);
  const whatsappUIRef = useRef(null);

  // State for the app
  const [activeSection, setActiveSection] = useState('chat');
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [qrVisible, setQrVisible] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [chats, setChats] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatNumber, setNewChatNumber] = useState('');
  const [bulkNumbers, setBulkNumbers] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');
  const [showClassifyModal, setShowClassifyModal] = useState(false);
  const [classifyInput, setClassifyInput] = useState('');
  const [showClassifyResults, setShowClassifyResults] = useState(false);
  const [entradaList, setEntradaList] = useState([]);
  const [decisionList, setDecisionList] = useState([]);
  const [finalList, setFinalList] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 });
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !whatsappUIRef.current) return;
    
    whatsappUIRef.current.sendMessage(messageText);
    setMessageText('');
  };

  // Handle creating a new chat
  const handleCreateChat = () => {
    if (!newChatNumber.trim() || !whatsappUIRef.current) return;
    
    if (whatsappUIRef.current.createNewChat(newChatNumber)) {
      setShowNewChatModal(false);
      setNewChatNumber('');
    }
  };

  // Handle sending bulk messages
  const handleSendBulk = () => {
    const numbers = bulkNumbers.split(/[\n,]+/).filter(n => n.trim() !== '');
    if (numbers.length === 0 || !bulkMessage.trim()) {
      alert('Por favor ingresa al menos un número y un mensaje');
      return;
    }
    
    // In a real implementation, you would call the bulk send method from WhatsAppUI
    // For now, we'll just show a success message
    alert(`Mensaje masivo programado para enviar a ${numbers.length} contactos`);
    
    // Reset form
    setBulkNumbers('');
    setBulkMessage('');
    
    // Simulate progress (remove this in production)
    setProgress({
      current: 0,
      total: numbers.length,
      success: 0,
      failed: 0
    });
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newCurrent = Math.min(prev.current + 5, prev.total);
        const isComplete = newCurrent >= prev.total;
        
        if (isComplete) {
          clearInterval(interval);
          setTimeout(() => {
            setProgress({ current: 0, total: 0, success: 0, failed: 0 });
          }, 2000);
        }
        
        return {
          ...prev,
          current: newCurrent,
          success: Math.floor(newCurrent * 0.9), // 90% success rate
          failed: Math.ceil(newCurrent * 0.1)    // 10% failure rate
        };
      });
    }, 100);
  };

  // Classify conversation
  const handleClassify = () => {
    const lines = classifyInput.split('\n').filter(line => line.trim() !== '');
    const entrada = [];
    const decision = [];
    const final = [];
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.startsWith('entrada ')) {
        entrada.push(line.substring(8).trim());
      } else if (lowerLine.startsWith('desicion ') || lowerLine.startsWith('decisión ')) {
        decision.push(line.substring(lowerLine.startsWith('desicion ') ? 9 : 10).trim());
      } else if (lowerLine.startsWith('final ')) {
        final.push(line.substring(6).trim());
      } else {
        // If no prefix, add to entrada by default
        entrada.push(line);
      }
    });
    
    setEntradaList(entrada);
    setDecisionList(decision);
    setFinalList(final);
    setShowClassifyResults(true);
  };

  // Toggle QR code visibility
  const toggleQRCode = () => {
    setQrVisible(!qrVisible);
  };

  // Initialize WhatsApp UI
  useEffect(() => {
    whatsappUIRef.current = new WhatsAppUI(
      setConnectionStatus,
      setQrVisible,
      setActiveChat,
      setChats,
      setMessages,
      (chatData) => {
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === chatData.id ? { ...chat, ...chatData } : chat
          )
        );
      }
    );

    // Cleanup on unmount
    return () => {
      if (whatsappUIRef.current && whatsappUIRef.current.socket) {
        whatsappUIRef.current.socket.disconnect();
      }
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update stats when chats or messages change
  useEffect(() => {
    setStats({
      totalChats: chats.length,
      totalMessages: messages.length
    });
  }, [chats, messages]);

  return (
    <div className="comunicacion-container">
      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="user-info">
              <div className="avatar">
                <FaRobot />
              </div>
              <div className="user-details">
                <h3>WhatsApp Bot</h3>
                <span className={`status ${connectionStatus === 'Conectado' ? 'connected' : 'disconnected'}`}>
                  {connectionStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="sidebar-menu">
            <button 
              className={`menu-btn ${activeSection === 'chat' ? 'active' : ''}`} 
              onClick={() => setActiveSection('chat')}
            >
              <FaComments />
              Chat Individual
            </button>
            <button 
              className={`menu-btn ${activeSection === 'bulk' ? 'active' : ''}`}
              onClick={() => setActiveSection('bulk')}
            >
              <FaBullhorn />
              Mensaje Masivo
            </button>
            <button 
              className={`menu-btn ${activeSection === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveSection('contacts')}
            >
              <FaUsers />
              Estadísticas
            </button>
          </div>

          {/* Chats List */}
          <div className="chats-list">
            <div className="chats-header">
              <h4><FaComments /> Chats</h4>
              <button className="new-chat-btn" onClick={() => setShowNewChatModal(true)}>
                <FaPlus /> Nuevo
              </button>
            </div>
            <div className="chats-container" id="chats-container">
              {chats.length === 0 ? (
                <div className="no-chats">
                  <FaCommentSlash />
                  <p>No hay chats disponibles</p>
                </div>
              ) : (
                chats.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                    onClick={() => whatsappUIRef.current.selectChat(chat.id)}
                  >
                    <div className={`chat-avatar ${chat.type}`}>
                      {chat.name.charAt(0)}
                    </div>
                    <div className="chat-info">
                      <div className="chat-name">{chat.name}</div>
                      <div className="chat-last-message">{chat.lastMessage}</div>
                    </div>
                    {chat.unread > 0 && (
                      <div className="chat-unread">{chat.unread}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* QR Code Section */}
          {qrVisible && (
            <div className="qr-container">
              <h4>Escanear QR</h4>
              <div ref={qrCodeRef}>
                <QRCode 
                  value="https://web.whatsapp.com" 
                  size={200} 
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p>Escanea con WhatsApp</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Chat Section */}
          <div id="chat-section" className={`section ${activeSection === 'chat' ? 'active' : ''}`}>
            {activeChat ? (
              <>
                <div className="chat-header">
                  <div className="chat-info">
                    <h2>
                      <FaUser />
                      {activeChat.name}
                    </h2>
                    <span className="chat-type">{activeChat.type === 'group' ? 'Grupo' : 'Individual'}</span>
                  </div>
                  <div className="header-actions">
                    <button className="btn btn-clear" onClick={() => setMessages([])}>
                      <FaTrash /> Limpiar
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setShowClassifyModal(true)}
                    >
                      <FaPaste /> Clasificar Conversación
                    </button>
                  </div>
                </div>

                <div className="chat-container">
                  <div className="messages-container" ref={messagesContainerRef}>
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`message ${message.type === 'sent' ? 'own' : ''}`}
                      >
                        {message.type !== 'sent' && (
                          <div className="message-avatar">
                            {message.sender.charAt(0)}
                          </div>
                        )}
                        <div className="message-bubble">
                          {message.type !== 'sent' && (
                            <div className="message-header">
                              <span className="message-sender">{message.sender}</span>
                              <span className="message-time">{message.time}</span>
                            </div>
                          )}
                          <div className="message-content">
                            {message.text}
                          </div>
                          {message.type === 'sent' && (
                            <div className="message-time">{message.time}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="message-input-container">
                    <form onSubmit={handleSendMessage} className="input-group">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="text-input"
                      />
                      <button type="submit" className="btn btn-send">
                        <FaPaperPlane /> Enviar
                      </button>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              <div className="welcome-message">
                <FaComments />
                <h3>Bienvenido al Chat</h3>
                <p>Selecciona un contacto o grupo de la lista para comenzar a chatear</p>
                <p style={{ marginTop: '10px', fontSize: '14px' }}>
                  O crea un nuevo chat usando el botón "+ Nuevo"
                </p>
              </div>
            )}
          </div>

          {/* Bulk Message Section */}
          <div id="bulk-section" className={`section ${activeSection === 'bulk' ? 'active' : ''}`}>
            <div className="chat-header">
              <h2><FaBullhorn /> Mensaje Masivo</h2>
            </div>

            <div className="bulk-container">
              <div className="bulk-form">
                <div className="form-group">
                  <label htmlFor="bulk-numbers">
                    <FaUsers /> Números de destino
                  </label>
                  <textarea 
                    id="bulk-numbers" 
                    value={bulkNumbers}
                    onChange={(e) => setBulkNumbers(e.target.value)}
                    placeholder="Ingresa los números separados por coma o por línea. Ejemplo:
1234567890
0987654321
1112223333" 
                    rows="6"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="bulk-message">
                    <FaPaperPlane /> Mensaje
                  </label>
                  <textarea 
                    id="bulk-message" 
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                    placeholder="Escribe el mensaje que quieres enviar masivamente..." 
                    rows="4"
                  ></textarea>
                </div>

                <button 
                  id="send-bulk-btn" 
                  className="btn btn-bulk"
                  onClick={handleSendBulk}
                >
                  <FaPaperPlane /> Enviar Mensaje Masivo
                </button>

                {(progress.total > 0) && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="progress-info">
                      <span>{progress.current}/{progress.total}</span>
                      <span>✅ {progress.success} | ❌ {progress.failed}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div id="contacts-section" className={`section ${activeSection === 'contacts' ? 'active' : ''}`}>
            <div className="chat-header">
              <h2><FaUsers /> Estadísticas</h2>
            </div>

            <div className="stats-container">
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#25D366' }}>
                    <FaPlug />
                  </div>
                  <div className="stat-info">
                    <h3 id="status-connected">
                      {connectionStatus === 'Conectado' ? 'Conectado' : 'Desconectado'}
                    </h3>
                    <p>Estado de Conexión</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#FF6B6B' }}>
                    <FaComments />
                  </div>
                  <div className="stat-info">
                    <h3 id="total-chats">{stats.totalChats}</h3>
                    <p>Chats Activos</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#4ECDC4' }}>
                    <FaUsers />
                  </div>
                  <div className="stat-info">
                    <h3 id="total-messages">{stats.totalMessages}</h3>
                    <p>Total Mensajes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="modal">
            <div className="modal-content">
              <h3><FaPlus /> Nuevo Chat</h3>
              <div className="modal-input-group">
                <input
                  type="text"
                  id="new-chat-number"
                  className="modal-input"
                  placeholder="Número (ej: 1234567890)"
                  maxLength="15"
                  value={newChatNumber}
                  onChange={(e) => setNewChatNumber(e.target.value)}
                />
              </div>
              <div className="modal-buttons">
                <button 
                  className="btn btn-cancel" 
                  onClick={() => setShowNewChatModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn btn-create" 
                  onClick={handleCreateChat}
                >
                  Crear Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Classify Modal */}
        {showClassifyModal && (
          <div className="modal">
            <div className="modal-content classify-modal">
              <h3><FaPaste /> Clasificar conversación</h3>
              <p style={{fontSize: '13px', color: '#555'}}>
                Pega aquí las líneas de la conversación. Cada línea se considera un chat. 
                Añade una palabra (entrada / desicion / final) en la línea para moverla a la sección correspondiente. 
                Ejemplo: "entrada Hola, necesito ayuda"
              </p>

              <textarea 
                id="classify-input" 
                rows="10" 
                placeholder="Pega aquí la conversación... Ej:
entrada Hola, ¿puedes ayudarme?
desicion Revisar el contrato
final Confirmado y enviado"
                value={classifyInput}
                onChange={(e) => setClassifyInput(e.target.value)}
              ></textarea>

              <div className="modal-buttons classify-actions">
                <button 
                  className="btn btn-cancel" 
                  onClick={() => {
                    setShowClassifyModal(false);
                    setShowClassifyResults(false);
                  }}
                >
                  Cerrar
                </button>
                <button 
                  className="btn btn-create" 
                  id="classify-btn"
                  onClick={handleClassify}
                >
                  Clasificar
                </button>
              </div>

              {showClassifyResults && (
                <div id="classify-results" className="classify-results">
                  <div className="classify-column">
                    <h4>Entrada</h4>
                    <div id="entrada-list" className="classify-list">
                      {entradaList.map((item, index) => (
                        <div key={`entrada-${index}`} className="classify-item">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="classify-column">
                    <h4>Decisión</h4>
                    <div id="decision-list" className="classify-list">
                      {decisionList.map((item, index) => (
                        <div key={`decision-${index}`} className="classify-item">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="classify-column">
                    <h4>Decisión Final</h4>
                    <div id="final-list" className="classify-list">
                      {finalList.map((item, index) => (
                        <div key={`final-${index}`} className="classify-item">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comunicacion;