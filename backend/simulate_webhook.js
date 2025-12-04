const axios = require('axios');

async function simulateWebhook() {
    try {
        console.log('Simulando webhook entrante...');
        const response = await axios.post('http://localhost:5000/api/comunicacion/webhook/test', {
            clienteId: 42,
            telefono: '994761559',
            mensaje: 'Hola, este es un mensaje entrante simulado.'
        });
        console.log('Respuesta:', response.data);
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

simulateWebhook();
