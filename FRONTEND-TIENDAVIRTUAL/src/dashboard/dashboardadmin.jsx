import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, TrendingUp,
  Settings, Plus, Edit, Trash2, Eye, Download, Upload, Filter,
  RefreshCw, DollarSign, AlertTriangle, ChevronRight, BarChart3,
  PieChart, CheckCircle, XCircle
} from 'lucide-react';
import { FileText } from '../components/DashboardLayout';

const DashboardAdmin = ({ user, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    
    if (userRole !== 'ADMIN' || userData.role !== 'ADMIN') {
      if (userRole === 'USER') {
        navigate('/dashboard');
      } else {
        navigate('/catalogo');
      }
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="access-denied">
        <h1>Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta sección.</p>
        <button className="btn btn-primary" onClick={() => navigate('/catalogo')}>
          Ir al Catálogo
        </button>
      </div>
    );
  }

  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop Pro X1', category: 'Laptops', price: 1299.99, stock: 15, status: 'active', sales: 45 },
    { id: 2, name: 'Smartphone Ultra', category: 'Smartphones', price: 899.99, stock: 8, status: 'active', sales: 128 },
    { id: 3, name: 'Tablet Air', category: 'Tablets', price: 499.99, stock: 3, status: 'low_stock', sales: 67 },
    { id: 4, name: 'Smart Watch S3', category: 'Wearables', price: 299.99, stock: 22, status: 'active', sales: 89 },
    { id: 5, name: 'Auriculares Pro', category: 'Audio', price: 199.99, stock: 0, status: 'out_of_stock', sales: 156 }
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Juan Pérez', total: 1299.99, status: 'completed', date: '2024-01-15', items: 3 },
    { id: 'ORD-002', customer: 'María García', total: 899.99, status: 'processing', date: '2024-01-14', items: 1 },
    { id: 'ORD-003', customer: 'Carlos Ruiz', total: 499.99, status: 'pending', date: '2024-01-14', items: 2 },
    { id: 'ORD-004', customer: 'Ana López', total: 299.99, status: 'shipped', date: '2024-01-13', items: 1 },
    { id: 'ORD-005', customer: 'Pedro Sánchez', total: 1599.98, status: 'refunded', date: '2024-01-12', items: 2 }
  ]);

  const stats = {
    totalSales: 456789.99,
    totalOrders: 1234,
    totalProducts: 156,
    totalUsers: 8921,
    monthlyGrowth: 15.8,
    pendingRefunds: 3,
    lowStockProducts: 8
  };

  const handleDeleteProduct = (productId) => {
    const hasActiveOrders = orders.some(order => 
      order.status === 'processing' || order.status === 'pending'
    );
    
    if (hasActiveOrders) {
      alert('No se puede eliminar: hay pedidos activos que contienen este producto');
      return;
    }
    
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleUpdateStock = (productId, newStock) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { 
        ...p, 
        stock: newStock,
        status: newStock === 0 ? 'out_of_stock' : newStock < 5 ? 'low_stock' : 'active'
      } : p
    ));
  };

  const isOrderDeletable = (orderStatus) => {
    return orderStatus !== 'completed' && orderStatus !== 'shipped';
  };

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="page-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.fullName}. Aquí tienes el resumen general del sistema.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Ventas Totales</span>
            <span className="stat-value">${stats.totalSales.toLocaleString()}</span>
            <span className="stat-trend positive">
              <TrendingUp size={14} /> +{stats.monthlyGrowth}%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Pedidos Totales</span>
            <span className="stat-value">{stats.totalOrders.toLocaleString()}</span>
            <span className="stat-subtitle">Últimos 30 días</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Productos Activos</span>
            <span className="stat-value">{stats.totalProducts}</span>
            <span className="stat-subtitle warning">
              <AlertTriangle size={12} /> {stats.lowStockProducts} con stock bajo
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Usuarios Registrados</span>
            <span className="stat-value">{stats.totalUsers.toLocaleString()}</span>
            <span className="stat-subtitle">+342 este mes</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Pedidos Recientes</h2>
          <button className="btn btn-text" onClick={() => navigate('/pedidos')}>
            Ver todos <ChevronRight size={16} />
          </button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td className="mono">#{order.id}</td>
                  <td>{order.customer}</td>
                  <td className="amount">${order.total.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <button className="btn-icon" title="Ver detalles" onClick={() => navigate('/pedidos')}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Productos con Stock Bajo</h2>
          <span className="badge warning">
            <AlertTriangle size={16} /> {stats.lowStockProducts} productos
          </span>
        </div>
        <div className="low-stock-grid">
          {products.filter(p => p.stock < 5).map(product => (
            <div key={product.id} className="low-stock-card">
              <div className="product-info">
                <span className="product-name">{product.name}</span>
                <span className="product-category">{product.category}</span>
              </div>
              <div className="stock-info">
                <span className={`stock-value ${product.stock === 0 ? 'out' : 'low'}`}>
                  {product.stock} unidades
                </span>
                <button className="btn btn-secondary btn-sm">
                  <Plus size={14} /> Reponer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="admin-products">
      <div className="page-header">
        <div>
          <h1>Gestión de Productos (CRUD)</h1>
          <p>Administra el inventario de productos</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <select className="filter-select">
            <option>Todas las categorías</option>
            <option>Laptops</option>
            <option>Smartphones</option>
            <option>Tablets</option>
          </select>
          <select className="filter-select">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Stock bajo</option>
            <option>Agotado</option>
          </select>
        </div>
        <div className="action-group">
          <button className="btn btn-secondary">
            <Download size={16} /> Exportar
          </button>
          <button className="btn btn-secondary">
            <Upload size={16} /> Importar
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Ventas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="mono">#{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td className="amount">${product.price.toLocaleString()}</td>
                <td>
                  <input 
                    type="number" 
                    value={product.stock} 
                    className="stock-input"
                    onChange={(e) => {
                      const newStock = parseInt(e.target.value) || 0;
                      handleUpdateStock(product.id, newStock);
                    }}
                    min="0"
                  />
                </td>
                <td>
                  <span className={`status-badge ${product.status}`}>
                    {product.status === 'active' ? 'Activo' : 
                     product.status === 'low_stock' ? 'Stock Bajo' : 'Agotado'}
                  </span>
                </td>
                <td>{product.sales}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Editar">
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon danger" 
                      title="Eliminar"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-orders">
      <div className="page-header">
        <div>
          <h1>Gestión de Pedidos</h1>
          <p>Todos los pedidos del sistema</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/pedidos')}>
            <Filter size={16} /> Vista Completa
          </button>
          <button className="btn btn-secondary">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="order-tabs">
        {['Todos', 'Pendientes', 'En Proceso', 'Enviados', 'Completados', 'Reembolsados'].map(tab => (
          <button key={tab} className="tab-btn">{tab}</button>
        ))}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Items</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="mono">#{order.id}</td>
                <td>{order.customer}</td>
                <td className="amount">${order.total.toLocaleString()}</td>
                <td>{order.items}</td>
                <td>
                  <select 
                    value={order.status} 
                    className="status-select"
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      if (order.status === 'completed' && newStatus !== 'completed') {
                        alert('No se puede modificar un pedido completado');
                        return;
                      }
                      setOrders(prev => prev.map(o => 
                        o.id === order.id ? { ...o, status: newStatus } : o
                      ));
                    }}
                    disabled={order.status === 'completed'}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">En Proceso</option>
                    <option value="shipped">Enviado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="refunded">Reembolsado</option>
                  </select>
                </td>
                <td>{order.date}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Ver detalles" onClick={() => navigate('/pedidos')}>
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon" title="Actualizar estado">
                      <RefreshCw size={16} />
                    </button>
                    {!isOrderDeletable(order.status) && (
                      <span className="text-muted text-xs ml-2">No eliminable</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="admin-analytics">
      <div className="page-header">
        <div>
          <h1>Analíticas y Reportes</h1>
          <p>Acceso exclusivo para administradores</p>
        </div>
        <select className="filter-select">
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Últimos 90 días</option>
          <option>Este año</option>
        </select>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card large">
          <h3>Ventas por Período</h3>
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Gráfico de ventas</p>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Productos Más Vendidos</h3>
          <div className="chart-placeholder">
            <PieChart size={48} />
            <p>Distribución de ventas</p>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Métricas Clave</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <span>Ticket Promedio</span>
              <strong>$370.12</strong>
            </div>
            <div className="metric-item">
              <span>Tasa de Conversión</span>
              <strong>3.2%</strong>
            </div>
            <div className="metric-item">
              <span>Carritos Abandonados</span>
              <strong>24%</strong>
            </div>
            <div className="metric-item">
              <span>Devoluciones</span>
              <strong>2.1%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h3>Reportes Disponibles</h3>
        <div className="report-cards">
          {['Ventas', 'Inventario', 'Clientes'].map(report => (
            <div key={report} className="report-card">
              <FileText size={24} />
              <span>Reporte de {report}</span>
              <button className="btn-icon">
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRefunds = () => (
    <div className="admin-refunds">
      <div className="page-header">
        <div>
          <h1>Gestión de Reembolsos</h1>
          <p>{stats.pendingRefunds} solicitudes pendientes</p>
        </div>
        <span className="badge warning">{stats.pendingRefunds} pendientes</span>
      </div>

      <div className="refunds-list">
        {orders.filter(o => o.status === 'refunded' || o.status === 'pending').map(order => (
          <div key={order.id} className="refund-card">
            <div className="refund-header">
              <span className="mono">{order.id}</span>
              <span className={`status-badge ${order.status}`}>{order.status}</span>
            </div>
            <div className="refund-details">
              <p><strong>Cliente:</strong> {order.customer}</p>
              <p><strong>Total:</strong> ${order.total.toLocaleString()}</p>
              <p><strong>Fecha:</strong> {order.date}</p>
              <p><strong>Items:</strong> {order.items}</p>
            </div>
            <div className="refund-actions">
              {order.status === 'pending' ? (
                <>
                  <button className="btn btn-primary btn-sm">
                    <CheckCircle size={16} /> Aprobar
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    <XCircle size={16} /> Rechazar
                  </button>
                </>
              ) : (
                <button className="btn btn-secondary btn-sm">
                  <Eye size={16} /> Ver detalles
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="empty-state">
      <Users size={48} />
      <h3>Gestión de Usuarios</h3>
      <p>Sección en desarrollo</p>
    </div>
  );

  const renderReports = () => (
    <div className="empty-state">
      <FileText size={48} />
      <h3>Reportes</h3>
      <p>Sección en desarrollo</p>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-settings">
      <div className="page-header">
        <h1>Configuración del Sistema</h1>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Configuración General</h3>
          <div className="setting-item">
            <label>Nombre de la Tienda</label>
            <input type="text" defaultValue="TechStore" className="form-input" />
          </div>
          <div className="setting-item">
            <label>Moneda</label>
            <select className="filter-select">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Zona Horaria</label>
            <select className="filter-select">
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
        </div>

        <div className="settings-card">
          <h3>Notificaciones</h3>
          <div className="setting-item checkbox">
            <input type="checkbox" id="notify-orders" defaultChecked />
            <label htmlFor="notify-orders">Notificar nuevos pedidos</label>
          </div>
          <div className="setting-item checkbox">
            <input type="checkbox" id="notify-stock" defaultChecked />
            <label htmlFor="notify-stock">Alertas de stock bajo</label>
          </div>
          <div className="setting-item checkbox">
            <input type="checkbox" id="notify-refunds" defaultChecked />
            <label htmlFor="notify-refunds">Solicitudes de reembolso</label>
          </div>
        </div>

        <div className="settings-card">
          <h3>Seguridad</h3>
          <div className="setting-item">
            <label>Autenticación de Dos Factores</label>
            <button className="btn btn-secondary btn-sm">Configurar</button>
          </div>
          <div className="setting-item">
            <label>Sesiones Activas</label>
            <button className="btn btn-secondary btn-sm">Gestionar</button>
          </div>
        </div>
      </div>

      <button className="btn btn-primary mt-4">Guardar Cambios</button>
    </div>
  );

  switch (activeTab) {
    case 'overview': return renderOverview();
    case 'products': return renderProducts();
    case 'orders': return renderOrders();
    case 'analytics': return renderAnalytics();
    case 'refunds': return renderRefunds();
    case 'reports': return renderReports();
    case 'users': return renderUsers();
    case 'settings': return renderSettings();
    default: return renderOverview();
  }
};

export default DashboardAdmin;