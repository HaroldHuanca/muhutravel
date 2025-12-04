import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Send, MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import './MiniChat.css';

const MiniChat = ({ clienteId, clienteNombre, telefono }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Cargar mensajes al abrir
    useEffect(() => {
        if (isOpen && clienteId) {
            loadMessages();
            const interval = setInterval(loadMessages, 5000); // Polling cada 5s
            return () => clearInterval(interval);
        }
    }, [isOpen, clienteId]);

    // Scroll al fondo al recibir mensajes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isMinimized]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = async () => {
        try {
            const response = await api.get(`/comunicacion/mensajes/${clienteId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error cargando mensajes:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            // Optimistic update
            const tempMsg = {
                id: 'temp-' + Date.now(),
                mensaje: newMessage,
                remitente: 'usuario',
                tipo: 'enviado',
                creado_en: new Date().toISOString()
            };
            setMessages(prev => [...prev, tempMsg]);
            setNewMessage('');

            await api.post('/comunicacion/enviar', {
                clienteId,
                telefono,
                mensaje: tempMsg.mensaje,
                remitente: 'usuario'
            });

            loadMessages(); // Recargar para confirmar
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            // Revertir si falla (opcional, por simplicidad solo logueamos)
        } finally {
            setLoading(false);
        }
    };

    if (!clienteId) return null;

    if (!isOpen) {
        return (
            <button className="mini-chat-trigger" onClick={() => setIsOpen(true)}>
                <MessageSquare size={20} />
                <span>Chat con {clienteNombre?.split(' ')[0]}</span>
            </button>
        );
    }

    return (
        <div className={`mini-chat-window ${isMinimized ? 'minimized' : ''}`}>
            <div className="mini-chat-header" onClick={() => !isMinimized && setIsMinimized(!isMinimized)}>
                <div className="header-info">
                    <MessageSquare size={16} />
                    <span className="client-name">{clienteNombre}</span>
                </div>
                <div className="header-actions">
                    <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
                        {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                        <X size={14} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <div className="mini-chat-messages">
                        {messages.length === 0 ? (
                            <div className="empty-chat">
                                <p>No hay mensajes previos.</p>
                                <small>Envía un mensaje para iniciar la conversación.</small>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`chat-bubble ${msg.remitente === 'usuario' ? 'sent' : 'received'}`}
                                >
                                    <div className="bubble-content">{msg.mensaje}</div>
                                    <span className="bubble-time">
                                        {new Date(msg.creado_en).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="mini-chat-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading || !newMessage.trim()}>
                            <Send size={16} />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default MiniChat;
