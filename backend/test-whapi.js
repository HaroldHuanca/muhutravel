#!/usr/bin/env node

/**
 * Script de prueba para verificar la integración con whapi
 * Uso: node test-whapi.js
 */

require('dotenv').config();
const axios = require('axios');

const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
const WHAPI_API_URL = process.env.WHAPI_API_URL || 'https://api.whapi.cloud';

console.log('🧪 Iniciando prueba de whapi...\n');

// Verificar configuración
if (!WHAPI_TOKEN) {
  console.error('❌ Error: WHAPI_TOKEN no está configurado en .env');
  console.error('Por favor, agrega WHAPI_TOKEN=tu_token a tu archivo .env');
  process.exit(1);
}

console.log('✅ WHAPI_TOKEN encontrado');
console.log(`📍 API URL: ${WHAPI_API_URL}`);
console.log(`🔑 Token: ${WHAPI_TOKEN.substring(0, 10)}...\n`);

// Números de prueba
const NUMEROS_PRUEBA = [
  {
    numero: '51984438516',
    descripcion: 'Número principal (sincronizado en whapi)'
  },
  {
    numero: '51930466769',
    descripcion: 'Número alternativo'
  }
];

// Función para enviar mensaje de prueba
async function enviarMensajePrueba(numero, descripcion) {
  try {
    console.log(`\n📤 Enviando mensaje a ${numero} (${descripcion})...`);
    
    const response = await axios.post(
      `${WHAPI_API_URL}/messages/text`,
      {
        to: numero,
        body: '🧪 Mensaje de prueba desde MuhuTravel - Centro de Comunicación'
      },
      {
        headers: {
          'Authorization': `Bearer ${WHAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    console.log('✅ Mensaje enviado exitosamente!');
    console.log('📊 Respuesta:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error al enviar mensaje:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Datos: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
      console.error(error.request);
    } else {
      console.error(error.message);
    }
    
    return false;
  }
}

// Función para verificar configuración de whapi
async function verificarConfiguracion() {
  try {
    console.log('\n🔍 Verificando configuración de whapi...');
    
    const response = await axios.get(
      `${WHAPI_API_URL}/settings`,
      {
        headers: {
          'Authorization': `Bearer ${WHAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ Configuración verificada');
    console.log('📊 Datos:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('⚠️ No se pudo verificar la configuración');
    console.error('Esto puede ser normal si el endpoint no está disponible');
    return false;
  }
}

// Ejecutar pruebas
async function ejecutarPruebas() {
  try {
    // Verificar configuración
    await verificarConfiguracion();

    // Enviar mensajes de prueba
    console.log('\n' + '='.repeat(60));
    console.log('📨 ENVIANDO MENSAJES DE PRUEBA');
    console.log('='.repeat(60));

    let enviados = 0;
    for (const { numero, descripcion } of NUMEROS_PRUEBA) {
      const exito = await enviarMensajePrueba(numero, descripcion);
      if (exito) enviados++;
      
      // Esperar 2 segundos entre intentos
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS');
    console.log('='.repeat(60));
    console.log(`✅ Mensajes enviados exitosamente: ${enviados}/${NUMEROS_PRUEBA.length}`);
    
    if (enviados === NUMEROS_PRUEBA.length) {
      console.log('\n🎉 ¡Todas las pruebas fueron exitosas!');
      console.log('La integración con whapi está funcionando correctamente.');
    } else if (enviados > 0) {
      console.log('\n⚠️ Algunas pruebas fallaron.');
      console.log('Verifica los números de teléfono y la configuración de whapi.');
    } else {
      console.log('\n❌ No se pudo enviar ningún mensaje.');
      console.log('Verifica tu WHAPI_TOKEN y la configuración.');
    }

    process.exit(enviados > 0 ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Error fatal:', error.message);
    process.exit(1);
  }
}

// Iniciar pruebas
ejecutarPruebas();
