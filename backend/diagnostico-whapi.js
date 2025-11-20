#!/usr/bin/env node

/**
 * Script de diagnóstico para identificar problemas con whapi
 * Uso: node diagnostico-whapi.js
 */

require('dotenv').config();
const axios = require('axios');

console.log('🔍 DIAGNÓSTICO DE WHAPI\n');
console.log('='.repeat(60));

// 1. Verificar variables de entorno
console.log('\n1️⃣ VERIFICANDO VARIABLES DE ENTORNO');
console.log('-'.repeat(60));

const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
const WHAPI_API_URL = process.env.WHAPI_API_URL;

if (!WHAPI_TOKEN) {
  console.error('❌ WHAPI_TOKEN no está configurado');
  process.exit(1);
} else {
  console.log(`✅ WHAPI_TOKEN: ${WHAPI_TOKEN.substring(0, 10)}...${WHAPI_TOKEN.substring(WHAPI_TOKEN.length - 5)}`);
}

if (!WHAPI_API_URL) {
  console.warn('⚠️ WHAPI_API_URL no está configurado, usando default');
  console.log(`   URL por defecto: https://api.whapi.cloud`);
} else {
  console.log(`✅ WHAPI_API_URL: ${WHAPI_API_URL}`);
}

// 2. Verificar conectividad
console.log('\n2️⃣ VERIFICANDO CONECTIVIDAD');
console.log('-'.repeat(60));

async function verificarConectividad() {
  try {
    const url = WHAPI_API_URL || 'https://api.whapi.cloud';
    console.log(`📡 Intentando conectar a: ${url}`);
    
    const response = await axios.get(`${url}/settings`, {
      headers: {
        'Authorization': `Bearer ${WHAPI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Conexión exitosa');
    console.log('📊 Configuración de whapi:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error de conectividad:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('   No se recibió respuesta del servidor');
      console.error(`   URL: ${error.config?.url}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    return false;
  }
}

// 3. Verificar formato de número
console.log('\n3️⃣ VERIFICANDO FORMATO DE NÚMERO');
console.log('-'.repeat(60));

const numeroOriginal = '51984438516';
const numeroLimpio = numeroOriginal.replace(/\D/g, '');

console.log(`Número original: ${numeroOriginal}`);
console.log(`Número limpio: ${numeroLimpio}`);
console.log(`✅ Formato correcto: ${numeroLimpio === numeroOriginal ? 'SÍ' : 'NO'}`);

// 4. Simular envío de mensaje
console.log('\n4️⃣ SIMULANDO ENVÍO DE MENSAJE');
console.log('-'.repeat(60));

async function simularEnvio() {
  try {
    let url = WHAPI_API_URL || 'https://api.whapi.cloud';
    // Remover barra diagonal final si existe
    url = url.replace(/\/$/, '');
    const fullUrl = `${url}/messages/text`;
    
    console.log(`📤 URL: ${fullUrl}`);
    console.log(`📱 Número: ${numeroLimpio}`);
    console.log(`💬 Mensaje: "Prueba de diagnóstico"`);
    
    const response = await axios.post(
      fullUrl,
      {
        to: numeroLimpio,
        body: 'Prueba de diagnóstico desde script'
      },
      {
        headers: {
          'Authorization': `Bearer ${WHAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    console.log('✅ Mensaje enviado exitosamente');
    console.log('📊 Respuesta:');
    console.log(JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error al enviar mensaje:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error('   No se recibió respuesta del servidor');
    } else {
      console.error(`   Error: ${error.message}`);
    }
    return false;
  }
}

// 5. Ejecutar diagnóstico
async function ejecutarDiagnostico() {
  try {
    const conectividadOk = await verificarConectividad();
    
    if (conectividadOk) {
      console.log('\n5️⃣ ENVIANDO MENSAJE DE PRUEBA');
      console.log('-'.repeat(60));
      await simularEnvio();
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ DIAGNÓSTICO COMPLETADO');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Error fatal:', error.message);
    process.exit(1);
  }
}

ejecutarDiagnostico();
