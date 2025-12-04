import io from 'socket.io-client';
import QRCode from 'qrcode';

export class WhatsAppUI {
    constructor(setConnectionStatus, setQrVisible, setActiveChat, setChats, setMessages, updateChatInList) {
        this.socket = io('http://localhost:5000'); // Ajusta la URL según tu configuración
        this.chats = [];
        this.activeChat = null;
        this.setConnectionStatus = setConnectionStatus;
        this.setQrVisible = setQrVisible;
        this.setActiveChat = setActiveChat;
        this.setChats = setChats;
        this.setMessages = setMessages;
        this.updateChatInList = updateChatInList;
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.socket.on('connected', (isConnected) => {
            this.updateConnectionStatus(isConnected);
        });

        this.socket.on('status', (status) => {
            console.log('Status:', status);
        });

        this.socket.on('qr', (qrCode) => {
            this.showQRCode(qrCode);
        });

        this.socket.on('chats_loaded', (chats) => {
            this.chats = chats;
            this.setChats(chats);
        });

        this.socket.on('active_chat_changed', (data) => {
            this.setActiveChatUI(data);
        });

        this.socket.on('new_message', (message) => {
            this.addMessageToChat(message);
        });

        this.socket.on('chat_updated', (chatData) => {
            this.updateChatInList(chatData);
        });

        this.socket.on('error', (error) => {
            console.error('Error:', error);
            alert(`Error: ${error}`);
        });
    }

    updateConnectionStatus(isConnected) {
        this.setConnectionStatus(isConnected ? 'Conectado' : 'Desconectado');
        this.setQrVisible(!isConnected);
    }

    selectChat(chatJid) {
        this.socket.emit('select_chat', chatJid);
        this.activeChat = chatJid;
    }

    createNewChat(number) {
        if (!number) {
            alert('Por favor ingresa un número');
            return false;
        }

        const numberRegex = /^[0-9]{10,15}$/;
        if (!numberRegex.test(number)) {
            alert('Por favor ingresa un número válido (10-15 dígitos)');
            return false;
        }

        const chatJid = number + '@s.whatsapp.net';
        this.selectChat(chatJid);
        return true;
    }

    setActiveChatUI(data) {
        this.activeChat = data.chatJid;
        this.setActiveChat({
            id: data.chatJid,
            name: data.chatName,
            type: data.isGroup ? 'group' : 'individual'
        });
        this.setMessages(data.messages || []);
    }

    addMessageToChat(message) {
        this.setMessages(prevMessages => [...prevMessages, message]);
    }

    sendMessage(text) {
        if (!this.activeChat) {
            alert('Por favor selecciona un chat primero');
            return;
        }

        if (!text) {
            alert('Por favor escribe un mensaje');
            return;
        }

        this.socket.emit('send_to_active', text);
    }

    showQRCode(qrCode) {
        this.setQrVisible(true);
        // El QR se renderizará automáticamente por el componente QRCode de react-qrcode
    }

    // Métodos auxiliares
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

export default WhatsAppUI;
