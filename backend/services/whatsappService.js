const db = require('../db');
const axios = require('axios');

// Función auxiliar para obtener token (DB o ENV)
const obtenerWhapiToken = async () => {
    try {
        // 1. Buscar en DB
        const result = await db.query('SELECT valor FROM configuracion WHERE clave = $1', ['WHAPI_TOKEN']);
        if (result.rows.length > 0 && result.rows[0].valor) {
            return result.rows[0].valor;
        }
        // 2. Fallback a ENV
        return process.env.WHAPI_TOKEN || null;
    } catch (err) {
        console.error('Error al obtener token:', err);
        return process.env.WHAPI_TOKEN || null;
    }
};

// Verificar configuración de whapi
const verificarWhapiConfig = async () => {
    const token = await obtenerWhapiToken();
    return !!token;
};

// Enviar mensaje
const enviarMensaje = async (clienteId, telefono, mensaje, remitente = 'sistema') => {
    try {
        if (!clienteId || !telefono || !mensaje) {
            throw new Error('Faltan datos requeridos');
        }

        // Normalizar número de teléfono (remover caracteres especiales)
        let numeroLimpio = telefono.replace(/\D/g, '');

        // Si tiene 9 dígitos (formato Perú sin código), agregar 51
        if (numeroLimpio.length === 9) {
            numeroLimpio = '51' + numeroLimpio;
        }

        console.log(`📤 Intentando enviar mensaje a ${numeroLimpio}: ${mensaje}`);

        let messageId = `msg_${Date.now()}`;
        let estado = 'sent';
        let whapi = false;

        // Intentar enviar con whapi si está configurado
        if (await verificarWhapiConfig()) {
            const token = await obtenerWhapiToken();
            let whapiUrl = process.env.WHAPI_API_URL || 'https://gate.whapi.cloud';
            whapiUrl = whapiUrl.replace(/\/$/, '');
            const fullUrl = `${whapiUrl}/messages/text`;

            try {
                const response = await axios.post(
                    fullUrl,
                    {
                        to: numeroLimpio,
                        body: mensaje
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 15000
                    }
                );

                console.log('✅ Mensaje enviado exitosamente a través de whapi');
                messageId = response.data.message?.id || response.data.result?.id || messageId;
                whapi = true;
            } catch (whapiError) {
                console.error('❌ Error de whapi:', whapiError.message);
                // Si falla whapi, lanzamos error para que quien llame sepa
                throw whapiError;
            }
        } else {
            console.log(`⚠️ Simulando envío a ${numeroLimpio}: ${mensaje}`);
        }

        // Guardar mensaje en la base de datos
        try {
            await db.query(
                'INSERT INTO comunicacion_mensajes (cliente_id, mensaje, remitente, tipo, estado, whapi_message_id) VALUES ($1, $2, $3, $4, $5, $6)',
                [clienteId, mensaje, remitente, 'enviado', estado, messageId]
            );
            console.log('💾 Mensaje guardado en BD');
        } catch (dbError) {
            console.error('⚠️ Error al guardar mensaje en BD:', dbError.message);
        }

        return {
            success: true,
            messageId,
            whapi
        };

    } catch (error) {
        console.error('Error en whatsappService.enviarMensaje:', error);
        throw error;
    }
};

module.exports = {
    enviarMensaje,
    obtenerWhapiToken,
    verificarWhapiConfig
};
