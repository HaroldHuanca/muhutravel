import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import UsuariosEdit from './pages/UsuariosEdit';
import Clientes from './pages/Clientes';
import ClientesEdit from './pages/ClientesEdit';
import Empleados from './pages/Empleados';
import EmpleadosEdit from './pages/EmpleadosEdit';
import Proveedores from './pages/Proveedores';
import ProveedoresEdit from './pages/ProveedoresEdit';
import Paquetes from './pages/Paquetes';
import PaquetesEdit from './pages/PaquetesEdit';
import Reservas from './pages/Reservas';
import ReservasEdit from './pages/ReservasEdit';
import Inactivos from './pages/Inactivos';
import Comunicacion from './pages/Comunicacion';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        {token ? (
          <>
            <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
            
            {user?.rol === 'admin' && (
              <>
                <Route path="/usuarios" element={<Usuarios user={user} onLogout={handleLogout} />} />
                <Route path="/usuarios/edit/:id" element={<UsuariosEdit user={user} onLogout={handleLogout} />} />
                <Route path="/usuarios/new" element={<UsuariosEdit user={user} onLogout={handleLogout} />} />
              </>
            )}
            
            <Route path="/clientes" element={<Clientes user={user} onLogout={handleLogout} />} />
            <Route path="/clientes/edit/:id" element={<ClientesEdit user={user} onLogout={handleLogout} />} />
            <Route path="/clientes/new" element={<ClientesEdit user={user} onLogout={handleLogout} />} />
            
            <Route path="/empleados" element={<Empleados user={user} onLogout={handleLogout} />} />
            <Route path="/empleados/edit/:id" element={<EmpleadosEdit user={user} onLogout={handleLogout} />} />
            <Route path="/empleados/new" element={<EmpleadosEdit user={user} onLogout={handleLogout} />} />
            
            <Route path="/proveedores" element={<Proveedores user={user} onLogout={handleLogout} />} />
            <Route path="/proveedores/edit/:id" element={<ProveedoresEdit user={user} onLogout={handleLogout} />} />
            <Route path="/proveedores/new" element={<ProveedoresEdit user={user} onLogout={handleLogout} />} />
            
            <Route path="/paquetes" element={<Paquetes user={user} onLogout={handleLogout} />} />
            <Route path="/paquetes/edit/:id" element={<PaquetesEdit user={user} onLogout={handleLogout} />} />
            <Route path="/paquetes/new" element={<PaquetesEdit user={user} onLogout={handleLogout} />} />
            
            <Route path="/reservas" element={<Reservas user={user} onLogout={handleLogout} />} />
            <Route path="/reservas/edit/:id" element={<ReservasEdit user={user} onLogout={handleLogout} />} />
            <Route path="/reservas/new" element={<ReservasEdit user={user} onLogout={handleLogout} />} />
            
            <Route path="/comunicacion" element={<Comunicacion user={user} onLogout={handleLogout} />} />
            
            <Route path="/inactivos/:tipo" element={<Inactivos user={user} onLogout={handleLogout} />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
