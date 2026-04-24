// src/dashboard/dashboardadmin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, TrendingUp,
  Settings, Plus, Edit, Trash2, Eye, Download, Upload, Filter,
  RefreshCw, DollarSign, AlertTriangle, ChevronRight, BarChart3,
  PieChart, CheckCircle, XCircle, Star
} from 'lucide-react';
import { FileText } from '../components/DashboardLayout';
import apiService from '../services/api';
import { formatCurrency, formatCurrencyNoDecimals } from '../utils/currency';

const DashboardAdmin = ({ user, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  // Estados
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlyGrowth: 12.5,
    lowStockProducts: 0,
    pendingRefunds: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Laptops',
    price: '',
    stock: '',
    description: '',
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, statsData] = await Promise.all([
        apiService.getProducts(),
        apiService.getAllOrders(),
        apiService.getDashboardStats(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Productos
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const product = await apiService.createProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        description: newProduct.description,
        image: null,
      });
      setProducts(prev => [...prev, product]);
      setShowNewProductModal(false);
      setNewProduct({ name: '', category: 'Laptops', price: '', stock: '', description: '' });
      alert('Producto creado exitosamente');
    } catch (error) {
      alert('Error al crear producto: ' + error.message);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      const updated = await apiService.updateProduct(productId, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === productId ? updated : p));
    } catch (error) {
      alert('Error al actualizar stock');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await apiService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      alert('No se puede eliminar: hay pedidos activos con este producto');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updated = await apiService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (error) {
      alert(error.message);
    }
  };

  // =============================================
  // VISTAS
  // =============================================

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="page-header">
        <div>
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {user?.fullName}. Resumen general del sistema.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadData}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Ventas Totales</span>
            <span className="stat-value">{formatCurrency(stats.totalSales)}</span>
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
            <span className="stat-value">{stats.totalOrders}</span>
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
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-subtitle">En plataforma</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Pedidos Recientes</h2>
          <button className="btn btn-text" onClick={() => setActiveTab('orders')}>
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
                  <td className="amount">{formatCurrency(order.total)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status === 'delivered' ? 'Entregado' :
                       order.status === 'processing' ? 'En Proceso' :
                       order.status === 'shipped' ? 'Enviado' :
                       order.status === 'pending' ? 'Pendiente' :
                       order.status === 'cancelled' ? 'Cancelado' : order.status}
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
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleUpdateStock(product.id, product.stock + 10)}
                >
                  <Plus size={14} /> Reponer +10
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
          <p>{products.length} productos en inventario</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewProductModal(true)}>
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
            <option>Wearables</option>
            <option>Audio</option>
            <option>Monitores</option>
            <option>Periféricos</option>
            <option>Almacenamiento</option>
            <option>Accesorios</option>
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
          <button className="btn btn-secondary" onClick={loadData}>
            <RefreshCw size={16} /> Actualizar
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
                <td>
                  <span className="product-name">{product.name}</span>
                </td>
                <td>{product.category}</td>
                <td className="amount">{formatCurrency(product.price)}</td>
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

      {/* Modal Nuevo Producto */}
      {showNewProductModal && (
        <div className="modal-overlay" onClick={() => setShowNewProductModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo Producto</h2>
              <button className="modal-close" onClick={() => setShowNewProductModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                  placeholder="Ej: Laptop Pro X2"
                />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option>Laptops</option>
                  <option>Smartphones</option>
                  <option>Tablets</option>
                  <option>Wearables</option>
                  <option>Audio</option>
                  <option>Monitores</option>
                  <option>Periféricos</option>
                  <option>Almacenamiento</option>
                  <option>Accesorios</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    required
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="3"
                  placeholder="Descripción del producto..."
                  style={{ width: '100%', padding: '0.625rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewProductModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="admin-orders">
      <div className="page-header">
        <div>
          <h1>Gestión de Pedidos</h1>
          <p>{orders.length} pedidos en total</p>
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
        {['Todos', 'Pendientes', 'En Proceso', 'Enviados', 'Completados', 'Cancelados'].map(tab => (
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
                <td className="amount">{formatCurrency(order.total)}</td>
                <td>{order.items}</td>
                <td>
                  <select 
                    value={order.status} 
                    className="status-select"
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    disabled={order.status === 'completed'}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">En Proceso</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
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
          <p>Estadísticas detalladas del sistema</p>
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
          <h3>Ventas Totales: {formatCurrency(stats.totalSales)}</h3>
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Gráfico de ventas mensuales</p>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Productos Más Vendidos</h3>
          <div className="chart-placeholder">
            <PieChart size={48} />
            <p>Distribución de ventas por categoría</p>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Métricas Clave</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <span>Ticket Promedio</span>
              <strong>{formatCurrency(stats.totalOrders > 0 ? stats.totalSales / stats.totalOrders : 0)}</strong>
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
          {['Ventas', 'Inventario', 'Clientes', 'Financiero'].map(report => (
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
        {orders.filter(o => o.status === 'cancelled' || o.status === 'pending').map(order => (
          <div key={order.id} className="refund-card">
            <div className="refund-header">
              <span className="mono">{order.id}</span>
              <span className={`status-badge ${order.status}`}>
                {order.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
              </span>
            </div>
            <div className="refund-details">
              <p><strong>Cliente:</strong> {order.customer}</p>
              <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
              <p><strong>Fecha:</strong> {order.date}</p>
              <p><strong>Items:</strong> {order.items}</p>
            </div>
            <div className="refund-actions">
              {order.status === 'pending' ? (
                <>
                  <button className="btn btn-primary btn-sm" onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}>
                    <CheckCircle size={16} /> Aprobar Reembolso
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
    <div className="admin-users">
      <div className="page-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>{stats.totalUsers} usuarios registrados</p>
        </div>
      </div>
      <div className="empty-state">
        <Users size={48} />
        <h3>Usuarios del Sistema</h3>
        <p>Total: {stats.totalUsers} usuarios registrados en la plataforma</p>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="admin-reports">
      <div className="page-header">
        <h1>Reportes</h1>
      </div>
      <div className="report-cards">
        {['Ventas Diarias', 'Inventario Actual', 'Pedidos por Estado', 'Clientes Nuevos'].map(report => (
          <div key={report} className="report-card">
            <FileText size={24} />
            <span>{report}</span>
            <button className="btn btn-primary btn-sm">
              <Download size={16} /> Descargar
            </button>
          </div>
        ))}
      </div>
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
            <select className="filter-select" defaultValue="PEN">
              <option value="PEN">Soles Peruanos (S/)</option>
              <option value="USD">Dólares ($)</option>
              <option value="EUR">Euros (€)</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Zona Horaria</label>
            <select className="filter-select" defaultValue="America/Lima">
              <option value="America/Lima">Lima, Perú (GMT-5)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Europe/Madrid">Madrid (GMT+1)</option>
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

  if (loading && products.length === 0) {
    return (
      <div className="empty-state">
        <RefreshCw size={48} className="animate-spin" />
        <h3>Cargando datos...</h3>
      </div>
    );
  }

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