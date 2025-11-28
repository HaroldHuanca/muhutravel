import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ user, onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="layout-container">
            <Sidebar
                user={user}
                onLogout={onLogout}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <main className={`main-content ${collapsed ? 'expanded' : ''}`}>
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
