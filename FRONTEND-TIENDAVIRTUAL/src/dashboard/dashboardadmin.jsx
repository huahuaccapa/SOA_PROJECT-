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
import { formatCurrency } from '../utils/currency';

const DashboardAdmin = ({ user, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
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

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-base mb-1">Panel de Administración</h1>
          <p className="text-text-muted">Bienvenido, {user?.fullName}. Resumen general del sistema.</p>
        </div>
        <button className="btn-secondary" onClick={loadData}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <DollarSign size={24} />
            </div>
            <div>
              <span className="text-sm text-text-muted">Ventas Totales</span>
              <span className="text-2xl font-bold text-text-base block">{formatCurrency(stats.totalSales)}</span>
              <span className="text-xs text-success flex items-center gap-1">
                <TrendingUp size={12} /> +{stats.monthlyGrowth}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-info/10 text-info">
              <ShoppingCart size={24} />
            </div>
            <div>
              <span className="text-sm text-text-muted">Pedidos Totales</span>
              <span className="text-2xl font-bold text-text-base block">{stats.totalOrders}</span>
              <span className="text-xs text-text-muted">Últimos 30 días</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-success/10 text-success">
              <Package size={24} />
            </div>
            <div>
              <span className="text-sm text-text-muted">Productos Activos</span>
              <span className="text-2xl font-bold text-text-base block">{stats.totalProducts}</span>
              <span className="text-xs text-warning flex items-center gap-1">
                <AlertTriangle size={12} /> {stats.lowStockProducts} con stock bajo
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
              <Users size={24} />
            </div>
            <div>
              <span className="text-sm text-text-muted">Usuarios Registrados</span>
              <span className="text-2xl font-bold text-text-base block">{stats.totalUsers}</span>
              <span className="text-xs text-text-muted">En plataforma</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-base">Pedidos Recientes</h2>
          <button className="text-primary text-sm font-medium hover:text-primary-light flex items-center gap-1" onClick={() => setActiveTab('orders')}>
            Ver todos <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-color">
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">ID Pedido</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Cliente</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Total</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Estado</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Fecha</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="border-b border-border-light hover:bg-base-hover transition-colors">
                  <td className="p-4 font-mono text-text-base">#{order.id}</td>
                  <td className="p-4 text-text-secondary">{order.customer}</td>
                  <td className="p-4 font-semibold text-primary">{formatCurrency(order.total)}</td>
                  <td className="p-4">
                    <span className={`badge-${order.status === 'delivered' ? 'success' : order.status === 'processing' ? 'info' : order.status === 'shipped' ? 'info' : order.status === 'pending' ? 'warning' : 'danger'}`}>
                      {order.status === 'delivered' ? 'Entregado' :
                       order.status === 'processing' ? 'En Proceso' :
                       order.status === 'shipped' ? 'Enviado' :
                       order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                    </span>
                  </td>
                  <td className="p-4 text-text-muted">{order.date}</td>
                  <td className="p-4">
                    <button className="btn-ghost btn-sm" onClick={() => navigate('/pedidos')}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-base">Productos con Stock Bajo</h2>
          <span className="badge-warning flex items-center gap-1">
            <AlertTriangle size={14} /> {stats.lowStockProducts} productos
          </span>
        </div>
        <div className="space-y-3">
          {products.filter(p => p.stock < 5).map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-base-primary rounded-lg">
              <div>
                <span className="font-semibold text-text-base block">{product.name}</span>
                <span className="text-sm text-text-muted">{product.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-semibold ${product.stock === 0 ? 'text-danger' : 'text-warning'}`}>
                  {product.stock} unidades
                </span>
                <button 
                  className="btn-primary btn-sm"
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-base mb-1">Gestión de Productos</h1>
          <p className="text-text-muted">{products.length} productos en inventario</p>
        </div>
        <button className="btn-primary" onClick={() => setShowNewProductModal(true)}>
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3">
          <select className="input-field w-auto">
            <option>Todas las categorías</option>
            <option>Laptops</option>
            <option>Smartphones</option>
            <option>Tablets</option>
          </select>
          <select className="input-field w-auto">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Stock bajo</option>
            <option>Agotado</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Download size={16} /> Exportar
          </button>
          <button className="btn-secondary" onClick={loadData}>
            <RefreshCw size={16} /> Actualizar
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-color">
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">ID</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Producto</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Categoría</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Precio</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Stock</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Estado</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Ventas</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-border-light hover:bg-base-hover transition-colors">
                  <td className="p-4 font-mono text-text-base">#{product.id}</td>
                  <td className="p-4 font-medium text-text-base">{product.name}</td>
                  <td className="p-4 text-text-secondary">{product.category}</td>
                  <td className="p-4 font-semibold text-primary">{formatCurrency(product.price)}</td>
                  <td className="p-4">
                    <input 
                      type="number" 
                      value={product.stock} 
                      className="w-20 px-2 py-1 bg-base-primary border border-border-color rounded text-text-base text-center focus:outline-none focus:border-primary"
                      onChange={(e) => handleUpdateStock(product.id, parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </td>
                  <td className="p-4">
                    <span className={`badge-${product.status === 'active' ? 'success' : product.status === 'low_stock' ? 'warning' : 'danger'}`}>
                      {product.status === 'active' ? 'Activo' : product.status === 'low_stock' ? 'Stock Bajo' : 'Agotado'}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary">{product.sales}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="btn-ghost btn-sm" title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="btn-ghost btn-sm text-danger" onClick={() => handleDeleteProduct(product.id)}>
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

      {showNewProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowNewProductModal(false)}>
          <div className="bg-base-secondary border border-border-color rounded-2xl p-6 max-w-lg w-full animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-base">Nuevo Producto</h2>
              <button className="text-text-muted hover:text-text-base" onClick={() => setShowNewProductModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Nombre del Producto</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                  placeholder="Ej: Laptop Pro X2"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Categoría</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="input-field"
                >
                  <option>Laptops</option>
                  <option>Smartphones</option>
                  <option>Tablets</option>
                  <option>Wearables</option>
                  <option>Audio</option>
                  <option>Monitores</option>
                  <option>Periféricos</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                    placeholder="0.00"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    required
                    placeholder="0"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Descripción</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="3"
                  placeholder="Descripción del producto..."
                  className="input-field"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn-secondary flex-1" onClick={() => setShowNewProductModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-base mb-1">Gestión de Pedidos</h1>
          <p className="text-text-muted">{orders.length} pedidos en total</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => navigate('/pedidos')}>
            <Filter size={16} /> Vista Completa
          </button>
          <button className="btn-secondary">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-color">
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">ID Pedido</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Cliente</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Total</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Items</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Estado</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Fecha</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-border-light hover:bg-base-hover transition-colors">
                  <td className="p-4 font-mono text-text-base">#{order.id}</td>
                  <td className="p-4 text-text-secondary">{order.customer}</td>
                  <td className="p-4 font-semibold text-primary">{formatCurrency(order.total)}</td>
                  <td className="p-4 text-text-secondary">{order.items}</td>
                  <td className="p-4">
                    <select 
                      value={order.status} 
                      className="text-sm bg-base-primary border border-border-color rounded px-2 py-1 text-text-base focus:outline-none focus:border-primary"
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="processing">En Proceso</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                  <td className="p-4 text-text-muted">{order.date}</td>
                  <td className="p-4">
                    <button className="btn-ghost btn-sm" onClick={() => navigate('/pedidos')}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-base mb-1">Analíticas y Reportes</h1>
          <p className="text-text-muted">Estadísticas detalladas del sistema</p>
        </div>
        <select className="input-field w-auto">
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Últimos 90 días</option>
          <option>Este año</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-text-base mb-4">Ventas Totales: {formatCurrency(stats.totalSales)}</h3>
          <div className="flex items-center justify-center p-12 bg-base-primary rounded-lg">
            <BarChart3 size={48} className="text-text-muted" />
            <span className="ml-3 text-text-muted">Gráfico de ventas mensuales</span>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-base mb-4">Productos Más Vendidos</h3>
          <div className="flex items-center justify-center p-12 bg-base-primary rounded-lg">
            <PieChart size={48} className="text-text-muted" />
            <span className="ml-3 text-text-muted">Distribución por categoría</span>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-base mb-4">Métricas Clave</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-base-primary rounded-lg">
              <span className="text-text-secondary">Ticket Promedio</span>
              <strong className="text-text-base">{formatCurrency(stats.totalOrders > 0 ? stats.totalSales / stats.totalOrders : 0)}</strong>
            </div>
            <div className="flex justify-between p-3 bg-base-primary rounded-lg">
              <span className="text-text-secondary">Tasa de Conversión</span>
              <strong className="text-text-base">3.2%</strong>
            </div>
            <div className="flex justify-between p-3 bg-base-primary rounded-lg">
              <span className="text-text-secondary">Carritos Abandonados</span>
              <strong className="text-text-base">24%</strong>
            </div>
            <div className="flex justify-between p-3 bg-base-primary rounded-lg">
              <span className="text-text-secondary">Devoluciones</span>
              <strong className="text-text-base">2.1%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  switch (activeTab) {
    case 'overview': return renderOverview();
    case 'products': return renderProducts();
    case 'orders': return renderOrders();
    case 'analytics': return renderAnalytics();
    default: return renderOverview();
  }
};

export default DashboardAdmin;