import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Package, Calendar, Building2, UserCheck } from 'lucide-react';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const modules = [
    {
      title: 'Clientes',
      description: 'Gestionar información de clientes',
      icon: Users,
      link: '/clientes',
      color: '#667eea',
    },
    {
      title: 'Empleados',
      description: 'Gestionar empleados y personal',
      icon: UserCheck,
      link: '/empleados',
      color: '#48bb78',
    },
    {
      title: 'Proveedores',
      description: 'Gestionar proveedores de servicios',
      icon: Building2,
      link: '/proveedores',
      color: '#f6ad55',
    },
    {
      title: 'Paquetes',
      description: 'Gestionar paquetes turísticos',
      icon: Package,
      link: '/paquetes',
      color: '#ed8936',
    },
    {
      title: 'Reservas',
      description: 'Gestionar reservas de clientes',
      icon: Calendar,
      link: '/reservas',
      color: '#9f7aea',
    },
    {
      title: 'Reportes',
      description: 'Ver reportes de ventas y clientes',
      icon: Calendar, // Using Calendar as a placeholder, ideally should import BarChart or similar if available
      link: '/reportes',
      color: '#e53e3e',
    },
  ];

  if (user?.rol === 'admin') {
    modules.push({
      title: 'Usuarios',
      description: 'Gestionar usuarios del sistema',
      icon: Briefcase,
      link: '/usuarios',
      color: '#f56565',
    });
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.username}!</h1>
        <p>Selecciona un módulo para comenzar</p>
      </div>

      <div className="modules-grid">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.link} to={module.link} className="module-card">
              <div className="module-icon" style={{ backgroundColor: module.color }}>
                <Icon size={32} color="white" />
              </div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
