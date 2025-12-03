import React, { useState, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Users, DollarSign, Calendar, TrendingUp,
  Package, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { getVentasReport, getPaquetesPopularesReport, getClientesReport, getPendientesReport } from '../services/reportes';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeClients: 0,
    pendingReservations: 0,
    totalReservations: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all required data in parallel
      const [ventas, paquetes, clientes, pendientes] = await Promise.all([
        getVentasReport({}),
        getPaquetesPopularesReport(),
        getClientesReport({}),
        getPendientesReport()
      ]);

      // Process Revenue & Sales Trend
      const revenue = ventas.reduce((sum, item) => sum + Number(item.precio_total), 0);

      // Group sales by date for the chart
      const salesByDate = ventas.reduce((acc, item) => {
        const date = new Date(item.fecha_reserva).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + Number(item.precio_total);
        return acc;
      }, {});

      const chartData = Object.keys(salesByDate).map(date => ({
        name: date,
        ventas: salesByDate[date]
      })).slice(-7); // Last 7 days/entries

      // Process Status Distribution
      const statusCount = ventas.reduce((acc, item) => {
        acc[item.estado] = (acc[item.estado] || 0) + 1;
        return acc;
      }, {});

      const statusData = Object.keys(statusCount).map(status => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: statusCount[status]
      }));

      setStats({
        totalRevenue: revenue,
        activeClients: clientes.length,
        pendingReservations: pendientes.length,
        totalReservations: ventas.length
      });

      setSalesData(chartData);
      setPopularPackages(paquetes.slice(0, 5)); // Top 5
      setStatusDistribution(statusData);
      setRecentActivity(ventas.slice(0, 5)); // Most recent 5

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Cargando datos del dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Hola, {user?.username || 'Usuario'} 👋</h1>
          <p>Aquí tienes un resumen de tu negocio hoy.</p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <Activity size={18} /> Actualizar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon">
            <DollarSign size={24} color="#fff" />
          </div>
          <div className="kpi-info">
            <h3>Ingresos Totales</h3>
            <p>{formatCurrency(stats.totalRevenue)}</p>
            <span className="trend positive">
              <TrendingUp size={14} /> +12% vs mes anterior
            </span>
          </div>
        </div>

        <div className="kpi-card clients">
          <div className="kpi-icon">
            <Users size={24} color="#fff" />
          </div>
          <div className="kpi-info">
            <h3>Clientes Activos</h3>
            <p>{stats.activeClients}</p>
            <span className="trend positive">
              <ArrowUpRight size={14} /> +5 nuevos esta semana
            </span>
          </div>
        </div>

        <div className="kpi-card bookings">
          <div className="kpi-icon">
            <Calendar size={24} color="#fff" />
          </div>
          <div className="kpi-info">
            <h3>Reservas Pendientes</h3>
            <p>{stats.pendingReservations}</p>
            <span className="trend warning">
              <Activity size={14} /> Requieren atención
            </span>
          </div>
        </div>

        <div className="kpi-card packages">
          <div className="kpi-icon">
            <Package size={24} color="#fff" />
          </div>
          <div className="kpi-info">
            <h3>Total Reservas</h3>
            <p>{stats.totalReservations}</p>
            <span className="trend neutral">
              <ArrowDownRight size={14} /> Estable
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card main-chart">
          <div className="chart-header">
            <h3>Tendencia de Ingresos</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="ventas" stroke="#8884d8" fillOpacity={1} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Estado de Reservas</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Popular Packages & Recent Activity */}
      <div className="bottom-grid">
        <div className="list-card">
          <div className="card-header">
            <h3>Paquetes Más Populares</h3>
          </div>
          <div className="list-body">
            {popularPackages.map((pkg, index) => (
              <div key={index} className="list-item">
                <div className="item-icon">
                  <span className="rank">#{index + 1}</span>
                </div>
                <div className="item-details">
                  <h4>{pkg.nombre}</h4>
                  <p>{pkg.total_reservas} reservas</p>
                </div>
                <div className="item-value">
                  {formatCurrency(pkg.total_ingresos)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="list-card">
          <div className="card-header">
            <h3>Actividad Reciente</h3>
          </div>
          <div className="list-body">
            {recentActivity.map((activity, index) => (
              <div key={index} className="list-item activity">
                <div className={`status-indicator ${activity.estado}`}></div>
                <div className="item-details">
                  <h4>{activity.cliente_nombres} {activity.cliente_apellidos}</h4>
                  <p>Reservó {activity.paquete_nombre}</p>
                </div>
                <div className="item-date">
                  {new Date(activity.fecha_reserva).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
