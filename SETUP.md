# Guía de Configuración Rápida (Setup)

Sigue estos pasos al clonar el repositorio por primera vez.

## 1. Requisitos Previos
- Node.js (v18+)
- PostgreSQL

## 2. Configuración de Entorno
Crea los archivos `.env` en `backend/` y `frontend/` basándote en los `.env.example`.

## 3. Instalación de Dependencias
Ejecuta en dos terminales separadas:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## 4. Base de Datos
Asegúrate de que PostgreSQL esté corriendo y la base de datos configurada en tu `.env` exista.

```bash
cd backend

# Ejecutar migraciones (crear tablas)
npm run migrate

# Poblar datos de prueba (opcional)
npm run seed
```

## 5. Iniciar Aplicación

```bash
# Terminal 1 (Backend)
cd backend
npm run dev

# Terminal 2 (Frontend)
cd frontend
npm run dev
```
