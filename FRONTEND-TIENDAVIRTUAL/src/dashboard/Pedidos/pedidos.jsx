import React, { useState } from 'react';
import { Eye, Star, Download, Truck, Package, CheckCircle, Clock, Search, Filter } from 'lucide-react';

const Pedidos = ({ userRole }) => {
  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Juan Pérez', date: '2024-01-15', total: 1299.99, status: 'delivered', items: 3, tracking: 'TRK123456' },
    { id: 'ORD-002', customer: 'María García', date: '2024-01-14', total: 899.99, status: 'processing', items: 1, tracking: null },
    { id: 'ORD-003', customer: 'Carlos Ruiz', date: '2024-01-14', total: 499.99, status: 'shipped', items: 2, tracking: 'TRK789012' },
    { id: 'ORD-004', customer: 'Ana López', date: '2024-01-13', total: 299.99, status: 'pending', items: 1, tracking: null },
    { id: 'ORD-005', customer: 'Pedro Sánchez', date: '2024-01-12', total: 1599.98, status: 'cancelled', items: 2, tracking: null }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} />;
      case 'processing': return <Clock size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'pending': return <Clock size={16} />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      delivered: 'Entregado',
      processing: 'En Proceso',
      shipped: 'Enviado',
      pending: 'Pendiente',
      cancelled: 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="pedidos-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <Package size={28} />
            {userRole === 'ADMIN' ? 'Gestión de Pedidos' : 'Mis Pedidos'}
          </h1>
          <p>{orders.length} pedidos en total</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="status-filters">
          {statuses.map(status => (
            <button 
              key={status}
              className={`status-filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Todos' : getStatusText(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="table-section">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                {userRole === 'ADMIN' && <th>Cliente</th>}
                <th>Fecha</th>
                <th>Total</th>
                <th>Items</th>
                <th>Estado</th>
                {userRole === 'ADMIN' && <th>Seguimiento</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="mono">#{order.id}</td>
                  {userRole === 'ADMIN' && <td>{order.customer}</td>}
                  <td>{order.date}</td>
                  <td className="amount">${order.total.toLocaleString()}</td>
                  <td>{order.items}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </span>
                  </td>
                  {userRole === 'ADMIN' && (
                    <td>
                      {order.tracking ? (
                        <span className="mono tracking">{order.tracking}</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  )}
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Ver detalles">
                        <Eye size={16} />
                      </button>
                      {order.status === 'delivered' && userRole === 'USER' && (
                        <button className="btn-icon" title="Dejar reseña">
                          <Star size={16} />
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button className="btn-icon" title="Seguimiento">
                          <Truck size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No se encontraron pedidos</h3>
          <p>No hay pedidos que coincidan con los filtros aplicados</p>
        </div>
      )}

      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-label">Total Pedidos</span>
          <span className="stat-value">{orders.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">En Proceso</span>
          <span className="stat-value">{orders.filter(o => o.status === 'processing').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Enviados</span>
          <span className="stat-value">{orders.filter(o => o.status === 'shipped').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Entregados</span>
          <span className="stat-value">{orders.filter(o => o.status === 'delivered').length}</span>
        </div>
      </div>
    </div>
  );
};

export default Pedidos;