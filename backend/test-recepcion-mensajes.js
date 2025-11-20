#!/usr/bin/env node

/**
 * Script para probar la recepción de mensajes
 * Simula mensajes entrantes desde whapi
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

console.log('🧪 PRUEBA DE RECEPCIÓN DE MENSAJES\n');
console.log('='.repeat(60));

async function pruebas() {
  try {
    // Paso 1: Obtener clientes
    console.log('\n📋 PASO 1: Obteniendo clientes...');
    const clientesResponse = await axios.get(`${BACKEND_URL}/api/clientes`, {
      headers: { Authorization: 'Bearer test-token' }
    });

    const clientes = clientesResponse.data;
    console.log(`✅ ${clientes.length} clientes encontrados`);

    if (clientes.length === 0) {
      console.error('❌ No hay clientes disponibles');
      return;
    }

    // Usar el primer cliente
    const cliente = clientes[0];
    console.log(`\n📱 Cliente seleccionado: ${cliente.nombres} ${cliente.apellidos}`);
    console.log(`   Teléfono: ${cliente.telefono}`);
    console.log(`   ID: ${cliente.id}`);

    // Paso 2: Conectar con el cliente
    console.log('\n🔗 PASO 2: Conectando con cliente...');
    const conectarResponse = await axios.post(
      `${BACKEND_URL}/api/comunicacion/conectar`,
      {
        clienteId: cliente.id,
        telefono: cliente.telefono,
        nombre: `${cliente.nombres} ${cliente.apellidos}`
      },
      {
        headers: { Authorization: 'Bearer test-token' }
      }
    );

    console.log(`✅ Conexión establecida`);

    // Paso 3: Obtener mensajes iniciales
    console.log('\n📨 PASO 3: Obteniendo mensajes iniciales...');
    const mensajesInicialResponse = await axios.get(
      `${BACKEND_URL}/api/comunicacion/mensajes/${cliente.id}`,
      {
        headers: { Authorization: 'Bearer test-token' }
      }
    );

    console.log(`✅ ${mensajesInicialResponse.data.length} mensajes encontrados`);

    // Paso 4: Simular webhook de mensaje entrante
    console.log('\n📤 PASO 4: Simulando mensaje entrante...');
    const webhookResponse = await axios.post(
      `${BACKEND_URL}/api/comunicacion/webhook`,
      {
        messages: [
          {
            id: `msg_${Date.now()}`,
            from: `${cliente.telefono}@s.whatsapp.net`,
            body: '¡Hola! Este es un mensaje de prueba desde el webhook',
            timestamp: Math.floor(Date.now() / 1000)
          }
        ]
      }
    );

    console.log(`✅ Webhook procesado`);
    console.log(`   Mensajes procesados: ${webhookResponse.data.procesados}`);
    console.log(`   Errores: ${webhookResponse.data.errores}`);

    // Paso 5: Obtener mensajes nuevamente
    console.log('\n📨 PASO 5: Obteniendo mensajes nuevamente...');
    const mensajesFinalResponse = await axios.get(
      `${BACKEND_URL}/api/comunicacion/mensajes/${cliente.id}`,
      {
        headers: { Authorization: 'Bearer test-token' }
      }
    );

    console.log(`✅ ${mensajesFinalResponse.data.length} mensajes encontrados`);

    // Verificar que se agregó el mensaje
    const nuevosMensajes = mensajesFinalResponse.data.filter(m => m.tipo === 'recibido');
    console.log(`   Mensajes recibidos: ${nuevosMensajes.length}`);

    if (nuevosMensajes.length > 0) {
      const ultimoMensaje = nuevosMensajes[nuevosMensajes.length - 1];
      console.log(`\n✅ ÚLTIMO MENSAJE RECIBIDO:`);
      console.log(`   Texto: ${ultimoMensaje.texto}`);
      console.log(`   De: ${ultimoMensaje.remitente}`);
      console.log(`   Hora: ${ultimoMensaje.timestamp}`);
      console.log(`   Estado: ${ultimoMensaje.estado}`);
    }

    // Paso 6: Probar endpoint de prueba
    console.log('\n🧪 PASO 6: Probando endpoint de prueba...');
    const testResponse = await axios.post(
      `${BACKEND_URL}/api/comunicacion/webhook/test`,
      {
        clienteId: cliente.id,
        telefono: cliente.telefono,
        mensaje: 'Mensaje de prueba desde endpoint /webhook/test'
      },
      {
        headers: { Authorization: 'Bearer test-token' }
      }
    );

    console.log(`✅ Mensaje de prueba guardado: ${testResponse.data.messageId}`);

    // Paso 7: Verificar que se guardó
    console.log('\n📨 PASO 7: Verificando mensaje de prueba...');
    const mensajesFinalesResponse = await axios.get(
      `${BACKEND_URL}/api/comunicacion/mensajes/${cliente.id}`,
      {
        headers: { Authorization: 'Bearer test-token' }
      }
    );

    console.log(`✅ ${mensajesFinalesResponse.data.length} mensajes totales`);

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('✅ PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('='.repeat(60));

    console.log('\n📊 RESUMEN:');
    console.log(`   Cliente: ${cliente.nombres} ${cliente.apellidos}`);
    console.log(`   Teléfono: ${cliente.telefono}`);
    console.log(`   Total de mensajes: ${mensajesFinalesResponse.data.length}`);
    console.log(`   Mensajes recibidos: ${mensajesFinalesResponse.data.filter(m => m.tipo === 'recibido').length}`);
    console.log(`   Mensajes enviados: ${mensajesFinalesResponse.data.filter(m => m.tipo === 'enviado').length}`);

    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('   1. Abre http://localhost:3000');
    console.log('   2. Ve a Comunicación');
    console.log(`   3. Selecciona a ${cliente.nombres}`);
    console.log('   4. Haz clic en "Conectar Directamente"');
    console.log('   5. ¡Deberías ver los mensajes de prueba!');

  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data || error.message);
    process.exit(1);
  }
}

pruebas();
