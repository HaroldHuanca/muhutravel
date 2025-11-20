#!/usr/bin/env node

/**
 * Script para simular mensajes reales desde WhatsApp
 * Simula lo que haría whapi.cloud cuando un cliente envía un mensaje
 * 
 * Uso: node simular-mensajes-reales.js
 */

const axios = require('axios');
const readline = require('readline');

const BACKEND_URL = 'http://localhost:5000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 SIMULADOR DE MENSAJES REALES DE WHATSAPP\n');
console.log('='.repeat(60));

async function obtenerClientes() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/clientes`, {
      headers: { Authorization: 'Bearer test-token' }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener clientes:', error.message);
    return [];
  }
}

async function enviarMensajeSimulado(clienteId, telefono, mensaje) {
  try {
    console.log(`\n📤 Enviando mensaje simulado...`);
    console.log(`   Cliente ID: ${clienteId}`);
    console.log(`   Teléfono: ${telefono}`);
    console.log(`   Mensaje: "${mensaje}"`);

    const response = await axios.post(
      `${BACKEND_URL}/api/comunicacion/webhook`,
      {
        messages: [
          {
            id: `msg_${Date.now()}`,
            from: `${telefono}@s.whatsapp.net`,
            body: mensaje,
            timestamp: Math.floor(Date.now() / 1000)
          }
        ]
      }
    );

    if (response.data.success) {
      console.log(`✅ Mensaje simulado enviado correctamente`);
      console.log(`   Mensajes procesados: ${response.data.procesados}`);
      console.log(`   Errores: ${response.data.errores}`);
      
      if (response.data.detalles.procesados.length > 0) {
        const procesado = response.data.detalles.procesados[0];
        console.log(`   ID en BD: ${procesado.dbId}`);
      }

      console.log('\n💡 El mensaje debería aparecer en la página en 2 segundos');
    } else {
      console.error('❌ Error al procesar webhook');
      console.error(response.data);
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function mostrarMenu() {
  try {
    console.log('\n📋 Obteniendo clientes...');
    const clientes = await obtenerClientes();

    if (clientes.length === 0) {
      console.error('❌ No hay clientes disponibles');
      rl.close();
      return;
    }

    console.log('\n📱 CLIENTES DISPONIBLES:\n');
    clientes.forEach((cliente, index) => {
      console.log(`${index + 1}. ${cliente.nombres} ${cliente.apellidos}`);
      console.log(`   Teléfono: ${cliente.telefono}`);
      console.log(`   ID: ${cliente.id}\n`);
    });

    rl.question('Selecciona el número del cliente (1-' + clientes.length + '): ', async (respuesta) => {
      const indice = parseInt(respuesta) - 1;

      if (indice < 0 || indice >= clientes.length) {
        console.error('❌ Selección inválida');
        rl.close();
        return;
      }

      const cliente = clientes[indice];

      rl.question('Escribe el mensaje a simular: ', async (mensaje) => {
        if (!mensaje.trim()) {
          console.error('❌ El mensaje no puede estar vacío');
          rl.close();
          return;
        }

        await enviarMensajeSimulado(cliente.id, cliente.telefono, mensaje);

        rl.question('\n¿Enviar otro mensaje? (s/n): ', async (respuesta) => {
          if (respuesta.toLowerCase() === 's') {
            await mostrarMenu();
          } else {
            console.log('\n✅ Simulador cerrado');
            rl.close();
          }
        });
      });
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
  }
}

// Verificar que el servidor esté corriendo
axios.get(`${BACKEND_URL}/api/clientes`, {
  headers: { Authorization: 'Bearer test-token' },
  timeout: 5000
}).then(() => {
  mostrarMenu();
}).catch(() => {
  console.error('❌ El servidor no está corriendo en puerto 5000');
  console.error('   Ejecuta: cd backend && npm run dev');
  rl.close();
});
