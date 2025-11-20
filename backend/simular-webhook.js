#!/usr/bin/env node

/**
 * Script para simular la recepción de mensajes desde whapi
 * Útil para pruebas sin necesidad de configurar webhook real
 * 
 * Uso: node simular-webhook.js
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';
const WEBHOOK_ENDPOINT = '/api/comunicacion/webhook';

console.log('🧪 SIMULADOR DE WEBHOOK DE WHAPI\n');
console.log('='.repeat(60));

// Mensajes de prueba
const mensajesPrueba = [
  {
    id: 'test_msg_001',
    from: '51984438516@s.whatsapp.net',
    body: '¡Hola! Gracias por contactarme. ¿Cómo estás?',
    timestamp: Math.floor(Date.now() / 1000)
  },
  {
    id: 'test_msg_002',
    from: '51984438516@s.whatsapp.net',
    body: 'Me interesa conocer más sobre tus servicios',
    timestamp: Math.floor(Date.now() / 1000) + 5
  },
  {
    id: 'test_msg_003',
    from: '51930466769@s.whatsapp.net',
    body: 'Hola, ¿tienen disponibilidad para este fin de semana?',
    timestamp: Math.floor(Date.now() / 1000) + 10
  }
];

async function simularWebhook(mensajes) {
  try {
    const url = `${BACKEND_URL}${WEBHOOK_ENDPOINT}`;
    
    console.log(`\n📤 Enviando webhook a: ${url}`);
    console.log(`📨 Mensajes a procesar: ${mensajes.length}\n`);

    for (let i = 0; i < mensajes.length; i++) {
      const msg = mensajes[i];
      console.log(`\n[${i + 1}/${mensajes.length}] Simulando mensaje:`);
      console.log(`  ID: ${msg.id}`);
      console.log(`  De: ${msg.from}`);
      console.log(`  Texto: "${msg.body}"`);
      console.log(`  Timestamp: ${msg.timestamp}`);

      try {
        const response = await axios.post(
          url,
          { messages: [msg] },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        console.log(`  ✅ Respuesta: ${response.data.message}`);
      } catch (error) {
        console.error(`  ❌ Error:`, error.response?.data || error.message);
      }

      // Esperar 1 segundo entre mensajes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ SIMULACIÓN COMPLETADA');
    console.log('='.repeat(60));

    // Mostrar instrucciones para verificar
    console.log('\n📋 Próximos pasos:');
    console.log('1. Abre http://localhost:3000');
    console.log('2. Ve a Comunicación');
    console.log('3. Selecciona un cliente');
    console.log('4. Deberías ver los mensajes simulados en el chat');
    console.log('\n💡 Tip: Abre la consola del backend para ver los logs');

  } catch (error) {
    console.error('\n❌ Error fatal:', error.message);
    process.exit(1);
  }
}

// Menú interactivo
async function mostrarMenu() {
  console.log('\n📝 OPCIONES:');
  console.log('1. Simular 3 mensajes de prueba');
  console.log('2. Simular mensaje personalizado');
  console.log('3. Salir');

  // Para simplificar, ejecutar opción 1 por defecto
  console.log('\n▶️ Ejecutando opción 1: Simular 3 mensajes de prueba\n');
  await simularWebhook(mensajesPrueba);
}

// Ejecutar
mostrarMenu().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
