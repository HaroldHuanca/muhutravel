import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import './Header.css';

function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <span className="logo-text">🌍 MuhuTravel</span>
          </Link>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/clientes" className="nav-link" onClick={() => setMenuOpen(false)}>
            Clientes
          </Link>
          <Link to="/empleados" className="nav-link" onClick={() => setMenuOpen(false)}>
            Empleados
          </Link>
          <Link to="/proveedores" className="nav-link" onClick={() => setMenuOpen(false)}>
            Proveedores
          </Link>
          <Link to="/paquetes" className="nav-link" onClick={() => setMenuOpen(false)}>
            Paquetes
          </Link>
          <Link to="/reservas" className="nav-link" onClick={() => setMenuOpen(false)}>
            Reservas
          </Link>
          {user?.rol === 'admin' && (
            <Link to="/usuarios" className="nav-link" onClick={() => setMenuOpen(false)}>
              Usuarios
            </Link>
          )}
        </nav>

        <div className="header-user">
          <span className="user-info">
            {user?.username} <span className="user-role">({user?.rol})</span>
          </span>
          <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={20} />
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
