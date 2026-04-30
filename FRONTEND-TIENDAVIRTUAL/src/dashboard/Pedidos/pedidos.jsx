// src/dashboard/pedidos/pedidos.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Star, Download, Truck, Package, CheckCircle, Clock, Search } from 'lucide-react';

const Pedidos = ({ userRole }) => {
  const navigate = useNavigate();
  
  const [orders] = useState([
    { id: 'ORD-001', customer: 'Juan Pérez', date: '2024-01-15', total: 4999, status: 'delivered', items: 3, tracking: 'TRK123456PE' },
    { id: 'ORD-002', customer: 'María García', date: '2024-01-14', total: 899, status: 'processing', items: 1, tracking: null },
    { id: 'ORD-003', customer: 'Carlos Ruiz', date: '2024-01-14', total: 2899, status: 'shipped', items: 2, tracking: 'TRK789012PE' },
    { id: 'ORD-004', customer: 'Ana López', date: '2024-01-13', total: 1299, status: 'pending', items: 1, tracking: null },
    { id: 'ORD-005', customer: 'Pedro Sánchez', date: '2024-01-12', total: 6498, status: 'cancelled', items: 2, tracking: null },
    { id: 'ORD-101', customer: 'Usuario Demo', date: '2024-01-10', total: 4999, status: 'delivered', items: 2, tracking: 'TRK111222PE' },
    { id: 'ORD-102', customer: 'Usuario Demo', date: '2024-01-05', total: 1299, status: 'shipped', items: 1, tracking: 'TRK444555PE' },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status) => {
    const styles = {
      delivered: 'badge-success',
      shipped: 'badge-info',
      processing: 'badge-warning',
      pending: 'badge-warning',
      cancelled: 'badge-danger'
    };
    return styles[status] || 'badge-info';
  };

  const getStatusText = (status) => {
    const texts = {
      delivered: 'Entregado',
      processing: 'En Proceso',
      shipped: 'Enviado',
      pending: 'Pendiente',
      cancelled: 'Cancelado'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={14} />;
      case 'processing': return <Clock size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'pending': return <Clock size={14} />;
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-base flex items-center gap-3">
            <Package size={28} className="text-primary" />
            {userRole === 'ADMIN' ? 'Gestión de Pedidos' : 'Mis Pedidos'}
          </h1>
          <p className="text-text-muted mt-1">{orders.length} pedidos en total</p>
        </div>
        <button className="btn-secondary">
          <Download size={16} /> Exportar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-base-secondary border border-border-color rounded-lg text-text-base placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button 
              key={status}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                filterStatus === status 
                  ? 'bg-primary text-white' 
                  : 'bg-transparent border border-border-color text-text-secondary hover:bg-base-hover hover:text-text-base'
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Todos' : getStatusText(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-color">
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">ID Pedido</th>
                {userRole === 'ADMIN' && (
                  <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Cliente</th>
                )}
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Fecha</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Total</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Items</th>
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Estado</th>
                {userRole === 'ADMIN' && (
                  <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Seguimiento</th>
                )}
                <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-border-light hover:bg-base-hover transition-colors">
                  <td className="p-4 font-mono font-medium text-text-base">#{order.id}</td>
                  {userRole === 'ADMIN' && (
                    <td className="p-4 text-text-secondary">{order.customer}</td>
                  )}
                  <td className="p-4 text-text-secondary">{order.date}</td>
                  <td className="p-4 font-semibold text-primary">
                    S/ {order.total.toLocaleString('es-PE')}
                  </td>
                  <td className="p-4 text-text-secondary">{order.items}</td>
                  <td className="p-4">
                    <span className={getStatusBadge(order.status)}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  {userRole === 'ADMIN' && (
                    <td className="p-4">
                      {order.tracking ? (
                        <span className="font-mono text-info text-sm">{order.tracking}</span>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                  )}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="btn-ghost btn-sm" title="Ver detalles">
                        <Eye size={16} />
                      </button>
                      {order.status === 'delivered' && userRole === 'USER' && (
                        <button className="btn-ghost btn-sm text-warning" title="Dejar reseña">
                          <Star size={16} />
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button className="btn-ghost btn-sm text-info" title="Seguimiento">
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
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-base mb-2">No se encontraron pedidos</h3>
            <p className="text-text-muted">No hay pedidos que coincidan con los filtros aplicados</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <span className="text-text-muted text-sm block mb-1">Total Pedidos</span>
          <span className="text-2xl font-bold text-text-base">{orders.length}</span>
        </div>
        <div className="card text-center">
          <span className="text-text-muted text-sm block mb-1">En Proceso</span>
          <span className="text-2xl font-bold text-info">{orders.filter(o => o.status === 'processing').length}</span>
        </div>
        <div className="card text-center">
          <span className="text-text-muted text-sm block mb-1">Enviados</span>
          <span className="text-2xl font-bold text-primary">{orders.filter(o => o.status === 'shipped').length}</span>
        </div>
        <div className="card text-center">
          <span className="text-text-muted text-sm block mb-1">Entregados</span>
          <span className="text-2xl font-bold text-success">{orders.filter(o => o.status === 'delivered').length}</span>
        </div>
      </div>
    </div>
  );
};

export default Pedidos;