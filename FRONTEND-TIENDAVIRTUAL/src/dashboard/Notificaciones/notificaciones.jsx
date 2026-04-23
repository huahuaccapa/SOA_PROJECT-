import React, { useState } from 'react';
import {
  Bell, ShoppingCart, AlertTriangle, CheckCircle, Info,
  Package, CreditCard, User, Settings, Trash2, Check
} from 'lucide-react';

const Notificaciones = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nuevo pedido recibido', message: 'Pedido #ORD-001 ha sido recibido y está pendiente de procesamiento', time: 'Hace 5 minutos', type: 'order', read: false },
    { id: 2, title: 'Stock bajo', message: 'El producto "Laptop Pro X1" tiene solo 3 unidades disponibles', time: 'Hace 1 hora', type: 'warning', read: false },
    { id: 3, title: 'Pago confirmado', message: 'El pago del pedido #ORD-002 ha sido confirmado exitosamente', time: 'Hace 2 horas', type: 'payment', read: true },
    { id: 4, title: 'Pedido enviado', message: 'El pedido #ORD-003 ha sido enviado. Número de seguimiento: TRK123456', time: 'Hace 3 horas', type: 'shipping', read: true },
    { id: 5, title: 'Actualización del sistema', message: 'Se ha completado la actualización de precios programada', time: 'Hace 1 día', type: 'system', read: true },
    { id: 6, title: 'Nuevo usuario registrado', message: 'María García se ha registrado en la plataforma', time: 'Hace 2 días', type: 'user', read: true }
  ]);

  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    const icons = {
      order: ShoppingCart,
      warning: AlertTriangle,
      payment: CreditCard,
      shipping: Package,
      system: Settings,
      user: User,
      default: Info
    };
    const Icon = icons[type] || icons.default;
    return <Icon size={18} />;
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notificaciones-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <Bell size={28} />
            Notificaciones
          </h1>
          {unreadCount > 0 && (
            <span className="badge">{unreadCount} no leídas</span>
          )}
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={markAllAsRead}>
            <CheckCircle size={16} /> Marcar todas leídas
          </button>
          <button className="btn btn-secondary danger" onClick={clearAll}>
            <Trash2 size={16} /> Limpiar todas
          </button>
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <Bell size={16} /> Todas
        </button>
        <button 
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          <Info size={16} /> No leídas
        </button>
        <button 
          className={`filter-tab ${filter === 'order' ? 'active' : ''}`}
          onClick={() => setFilter('order')}
        >
          <ShoppingCart size={16} /> Pedidos
        </button>
        <button 
          className={`filter-tab ${filter === 'payment' ? 'active' : ''}`}
          onClick={() => setFilter('payment')}
        >
          <CreditCard size={16} /> Pagos
        </button>
        <button 
          className={`filter-tab ${filter === 'shipping' ? 'active' : ''}`}
          onClick={() => setFilter('shipping')}
        >
          <Package size={16} /> Envíos
        </button>
        <button 
          className={`filter-tab ${filter === 'system' ? 'active' : ''}`}
          onClick={() => setFilter('system')}
        >
          <Settings size={16} /> Sistema
        </button>
      </div>

      <div className="notifications-content">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No hay notificaciones</h3>
            <p>No tienes notificaciones en esta categoría</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-card ${!notification.read ? 'unread' : ''}`}
              >
                <div className={`notification-icon ${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-body">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    {!notification.read && <span className="unread-dot" />}
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="btn-icon"
                      onClick={() => markAsRead(notification.id)}
                      title="Marcar como leída"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button 
                    className="btn-icon danger"
                    onClick={() => deleteNotification(notification.id)}
                    title="Eliminar notificación"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="settings-section">
        <h2>Preferencias de Notificaciones</h2>
        <div className="settings-options">
          <label className="checkbox-option">
            <input type="checkbox" defaultChecked />
            <span>Notificaciones de pedidos</span>
          </label>
          <label className="checkbox-option">
            <input type="checkbox" defaultChecked />
            <span>Alertas de stock bajo</span>
          </label>
          <label className="checkbox-option">
            <input type="checkbox" defaultChecked />
            <span>Confirmaciones de pago</span>
          </label>
          <label className="checkbox-option">
            <input type="checkbox" defaultChecked />
            <span>Actualizaciones de envío</span>
          </label>
          <label className="checkbox-option">
            <input type="checkbox" defaultChecked />
            <span>Notificaciones del sistema</span>
          </label>
        </div>
        <button className="btn btn-primary">Guardar preferencias</button>
      </div>
    </div>
  );
};

export default Notificaciones;