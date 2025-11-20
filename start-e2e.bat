@echo off
REM Script para iniciar backend, frontend y Cypress en Windows

echo.
echo ========================================
echo   MuhuTravel E2E Tests
echo ========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "backend" (
    echo Error: Ejecuta este script desde la raiz del proyecto
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: Ejecuta este script desde la raiz del proyecto
    pause
    exit /b 1
)

REM Paso 1: Iniciar Backend
echo 1. Iniciando Backend en puerto 5000...
cd backend
start "Backend - MuhuTravel" cmd /k npm run dev
cd ..
timeout /t 5 /nobreak

REM Paso 2: Iniciar Frontend
echo.
echo 2. Iniciando Frontend en puerto 3000...
cd frontend
start "Frontend - MuhuTravel" cmd /k npm start
cd ..
timeout /t 10 /nobreak

REM Paso 3: Abrir Cypress
echo.
echo 3. Abriendo Cypress...
cd frontend
start "Cypress - MuhuTravel" cmd /k npm run cypress:open
cd ..

echo.
echo ========================================
echo   Servicios iniciados!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Para detener: Cierra las ventanas de comando
echo.
pause
