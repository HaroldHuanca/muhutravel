#!/bin/bash

# Script de instalación rápida de Serenity/JS para MuhuTravel

echo "🚀 Iniciando instalación de Serenity/JS..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor, instálalo primero."
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo ""

# Crear backup del package.json original
if [ -f "package.json" ]; then
    echo "📦 Creando backup de package.json..."
    cp package.json package.json.backup
    echo "✅ Backup creado: package.json.backup"
    echo ""
fi

# Copiar el nuevo package.json
echo "📝 Actualizando package.json con dependencias de Serenity..."
cp SERENITY_PACKAGE_JSON.json package.json
echo "✅ package.json actualizado"
echo ""

# Instalar dependencias
echo "📥 Instalando dependencias (esto puede tomar unos minutos)..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Instalación completada exitosamente!"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Asegúrate de que el frontend esté corriendo: npm start"
    echo "2. En otra terminal, ejecuta: npm run serenity:test"
    echo "3. Los reportes se generarán en: target/"
    echo ""
    echo "🎯 Comandos disponibles:"
    echo "  npm run serenity:test          - Ejecutar todas las pruebas"
    echo "  npm run serenity:test:debug    - Ejecutar en modo debug"
    echo "  npm run serenity:test:chrome   - Ejecutar en Chrome"
    echo "  npm run serenity:test:firefox  - Ejecutar en Firefox"
    echo ""
else
    echo ""
    echo "❌ Error durante la instalación. Revisa los mensajes arriba."
    echo "💡 Intenta ejecutar: npm install --legacy-peer-deps"
    exit 1
fi
