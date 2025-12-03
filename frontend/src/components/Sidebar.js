import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Building2,
    Package,
    Calendar,
    MessageCircle,
    FileText,
    Briefcase,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import './Sidebar.css';

// 1. IMPORTAMOS SWEETALERT2
import Swal from 'sweetalert2';

const Sidebar = ({ user, onLogout, collapsed, setCollapsed }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/clientes', label: 'Clientes', icon: Users },
        { path: '/empleados', label: 'Empleados', icon: UserCheck },
        { path: '/proveedores', label: 'Proveedores', icon: Building2 },
        { path: '/paquetes', label: 'Paquetes', icon: Package },
        { path: '/reservas', label: 'Reservas', icon: Calendar },
        { path: '/comunicacion', label: 'Comunicación', icon: MessageCircle },
        { path: '/reportes', label: 'Reportes', icon: FileText },
    ];

    // Filter out Empleados for agents
    if (user?.rol === 'agente') {
        const empleadosIndex = menuItems.findIndex(item => item.path === '/empleados');
        if (empleadosIndex > -1) {
            menuItems.splice(empleadosIndex, 1);
        }
    }

    if (user?.rol === 'admin') {
        menuItems.push({ path: '/usuarios', label: 'Usuarios', icon: Briefcase });
    }

    // 2. FUNCIÓN PARA CONFIRMAR SALIDA
    const handleLogoutClick = () => {
        Swal.fire({
            title: '¿Cerrar Sesión?',
            text: "¿Estás seguro de que deseas salir del sistema?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Azul
            cancelButtonColor: '#d33',     // Rojo
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Si confirma, ejecutamos la función original que viene de App.js
                onLogout();
            }
        });
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && <span className="logo-text">🌍 MuhuTravel</span>}
                <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            title={collapsed ? item.label : ''}
                        >
                            <Icon size={20} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    {!collapsed && (
                        <div className="user-details">
                            <span className="username">{user?.username}</span>
                            <span className="user-role">{user?.rol}</span>
                        </div>
                    )}
                </div>
                
                {/* 3. BOTÓN CONECTADO A LA NUEVA FUNCIÓN */}
                <button className="logout-btn" onClick={handleLogoutClick} title="Cerrar sesión">
                    <LogOut size={20} />
                    {!collapsed && <span>Salir</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;