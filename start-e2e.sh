#!/bin/bash

# Script para iniciar backend, frontend y Cypress automáticamente

echo "🚀 Iniciando MuhuTravel E2E Tests..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Ejecuta este script desde la raíz del proyecto${NC}"
    exit 1
fi

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}⏹️  Deteniendo servicios...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT

# Paso 1: Iniciar Backend
echo -e "${YELLOW}1️⃣  Iniciando Backend en puerto 5000...${NC}"
cd backend
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"

# Esperar a que el backend esté listo
echo -e "${YELLOW}⏳ Esperando a que el backend esté listo...${NC}"
sleep 5

# Verificar que el backend está corriendo
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ El backend no se inició correctamente${NC}"
    cat /tmp/backend.log
    exit 1
fi

# Paso 2: Iniciar Frontend
echo ""
echo -e "${YELLOW}2️⃣  Iniciando Frontend en puerto 3000...${NC}"
cd ../frontend
npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"

# Esperar a que el frontend esté listo
echo -e "${YELLOW}⏳ Esperando a que el frontend esté listo...${NC}"
sleep 10

# Verificar que el frontend está corriendo
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ El frontend no se inició correctamente${NC}"
    cat /tmp/frontend.log
    exit 1
fi

# Paso 3: Verificar conectividad
echo ""
echo -e "${YELLOW}3️⃣  Verificando conectividad...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend accesible en http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Frontend no accesible${NC}"
fi

if curl -s http://localhost:5000 > /dev/null; then
    echo -e "${GREEN}✅ Backend accesible en http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Backend no accesible${NC}"
fi

# Paso 4: Abrir Cypress
echo ""
echo -e "${YELLOW}4️⃣  Abriendo Cypress...${NC}"
echo -e "${GREEN}✅ Cypress se abrirá en unos momentos${NC}"
echo ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo -e "${YELLOW}⏹️  Para detener: Presiona Ctrl+C${NC}"
echo ""

# Abrir Cypress
npm run cypress:open

# Mantener los procesos corriendo
wait
