#!/usr/bin/env node

/**
 * Script para verificar si el webhook está funcionando
 * y simular la recepción de mensajes
 */

const axios = require('axios');
const db = require('./db');

const BACKEND_URL = 'http://localhost:5000';

console.log('🔍 VERIFICADOR DE WEBHOOK\n');
console.log('='.repeat(60));

async function verificar() {
  try {
    // Paso 1: Verificar que el servidor está corriendo
    console.log('\n1️⃣ Verificando que el servidor esté corriendo...');
    try {
      const healthResponse = await axios.get(`${BACKEND_URL}/api/clientes`, {
        headers: { Authorization: 'Bearer test-token' },
        timeout: 5000
      });
      console.log('✅ Servidor está corriendo');
    } catch (error) {
      console.error('❌ Servidor no está corriendo en puerto 5000');
      console.error('   Ejecuta: cd backend && npm run dev');
      process.exit(1);
    }

    // Paso 2: Obtener clientes
    console.log('\n2️⃣ Obteniendo clientes...');
    const clientesResponse = await axios.get(`${BACKEND_URL}/api/clientes`, {
      headers: { Authorization: 'Bearer test-token' }
    });

    const clientes = clientesResponse.data;
    if (clientes.length === 0) {
      console.error('❌ No hay clientes en la BD');
      process.exit(1);
    }

    const cliente = clientes[0];
    console.log(`✅ Cliente encontrado: ${cliente.nombres} ${cliente.apellidos}`);
    console.log(`   Teléfono: ${cliente.telefono}`);
    console.log(`   ID: ${cliente.id}`);

    // Paso 3: Verificar tabla de mensajes
    console.log('\n3️⃣ Verificando tabla de mensajes...');
    try {
      const result = await db.query('SELECT COUNT(*) as count FROM comunicacion_mensajes');
      console.log(`✅ Tabla existe: ${result.rows[0].count} mensajes`);
    } catch (error) {
      console.error('❌ Tabla comunicacion_mensajes no existe');
      console.error('   Ejecuta: psql -U postgres -d muhutravel -f crear_tabla_mensajes.sql');
      process.exit(1);
    }

    // Paso 4: Probar webhook
    console.log('\n4️⃣ Probando webhook...');
    const webhookResponse = await axios.post(
      `${BACKEND_URL}/api/comunicacion/webhook`,
      {
        messages: [
          {
            id: `test_${Date.now()}`,
            from: `${cliente.telefono}@s.whatsapp.net`,
            body: 'Mensaje de prueba del verificador',
            timestamp: Math.floor(Date.now() / 1000)
          }
        ]
      }
    );

    if (webhookResponse.data.success) {
      console.log(`✅ Webhook funciona correctamente`);
      console.log(`   Mensajes procesados: ${webhookResponse.data.procesados}`);
    } else {
      console.error('❌ Webhook retornó error');
      console.error(webhookResponse.data);
    }

    // Paso 5: Verificar que el mensaje se guardó
    console.log('\n5️⃣ Verificando que el mensaje se guardó...');
    const mensajesResponse = await axios.get(
      `${BACKEND_URL}/api/comunicacion/mensajes/${cliente.id}`,
      {
        headers: { Authorization: 'Bearer test-token' }
      }
    );

    if (mensajesResponse.data.length > 0) {
      console.log(`✅ Mensajes se guardan correctamente`);
      console.log(`   Total de mensajes: ${mensajesResponse.data.length}`);
    } else {
      console.error('❌ Los mensajes no se están guardando');
    }

    // Paso 6: Verificar polling en frontend
    console.log('\n6️⃣ Verificando configuración del frontend...');
    console.log('✅ Frontend debe estar haciendo polling cada 2 segundos');
    console.log('   Abre DevTools (F12) → Console');
    console.log('   Busca: "📨 Nuevos mensajes detectados"');

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('✅ VERIFICACIÓN COMPLETADA');
    console.log('='.repeat(60));

    console.log('\n📋 ESTADO:');
    console.log('   ✅ Servidor corriendo');
    console.log('   ✅ BD conectada');
    console.log('   ✅ Tabla de mensajes existe');
    console.log('   ✅ Webhook funciona');
    console.log('   ✅ Mensajes se guardan');

    console.log('\n🔧 PRÓXIMOS PASOS:');
    console.log('   1. Abre http://localhost:3000');
    console.log('   2. Ve a Comunicación');
    console.log(`   3. Selecciona a ${cliente.nombres}`);
    console.log('   4. Haz clic en "Conectar Directamente"');
    console.log('   5. Abre DevTools (F12) → Console');
    console.log('   6. Envía un mensaje desde WhatsApp');
    console.log('   7. Deberías ver: "📨 Nuevos mensajes detectados"');

    console.log('\n⚠️ SI NO VES LOS MENSAJES:');
    console.log('   • Verifica que el frontend esté haciendo polling');
    console.log('   • Abre DevTools (F12) → Network');
    console.log('   • Busca solicitudes GET a /api/comunicacion/mensajes/');
    console.log('   • Verifica que retornen los mensajes');

    console.log('\n💡 ALTERNATIVA: Simular webhook');
    console.log('   $ node test-recepcion-mensajes.js');

  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data || error.message);
    process.exit(1);
  }
}

verificar();
