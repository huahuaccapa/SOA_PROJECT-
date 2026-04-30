// src/dashboard/notificaciones/notificaciones.jsx
import React, { useState } from 'react';
import {
  Bell, ShoppingCart, AlertTriangle, CheckCircle, Info,
  Package, CreditCard, User, Settings, Trash2
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
    };
    const Icon = icons[type] || Info;
    return <Icon size={18} />;
  };

  const getIconStyle = (type) => {
    const styles = {
      order: 'bg-info/10 text-info',
      warning: 'bg-warning/10 text-warning',
      payment: 'bg-success/10 text-success',
      shipping: 'bg-purple-500/10 text-purple-500',
      system: 'bg-text-muted/10 text-text-muted',
      user: 'bg-pink-500/10 text-pink-500',
    };
    return styles[type] || 'bg-info/10 text-info';
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
    if (window.confirm('¿Eliminar todas las notificaciones?')) {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filters = [
    { id: 'all', label: 'Todas', icon: Bell },
    { id: 'unread', label: 'No leídas', icon: Info },
    { id: 'order', label: 'Pedidos', icon: ShoppingCart },
    { id: 'payment', label: 'Pagos', icon: CreditCard },
    { id: 'shipping', label: 'Envíos', icon: Package },
    { id: 'system', label: 'Sistema', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-text-base flex items-center gap-3">
            <Bell size={28} className="text-primary" />
            Notificaciones
          </h1>
          {unreadCount > 0 && (
            <span className="badge-danger">
              {unreadCount} no leídas
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={markAllAsRead}>
            <CheckCircle size={16} /> Marcar todas leídas
          </button>
          <button className="btn-secondary text-danger hover:bg-danger/10 hover:text-danger hover:border-danger" onClick={clearAll}>
            <Trash2 size={16} /> Limpiar todas
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button 
            key={f.id}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
              filter === f.id 
                ? 'bg-primary text-white' 
                : 'bg-transparent border border-border-color text-text-secondary hover:bg-base-hover hover:text-text-base'
            }`}
            onClick={() => setFilter(f.id)}
          >
            <f.icon size={16} />
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-semibold text-text-base mb-2">No hay notificaciones</h3>
            <p className="text-text-muted">No tienes notificaciones en esta categoría</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`card flex items-start gap-4 hover:border-primary/50 transition-all ${
                !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconStyle(notification.type)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-text-base">{notification.title}</h3>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-text-secondary text-sm mb-1">{notification.message}</p>
                <span className="text-text-muted text-xs">{notification.time}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <button 
                    className="btn-ghost btn-sm text-success"
                    onClick={() => markAsRead(notification.id)}
                    title="Marcar como leída"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
                <button 
                  className="btn-ghost btn-sm text-danger"
                  onClick={() => deleteNotification(notification.id)}
                  title="Eliminar notificación"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Settings Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-text-base mb-6">Preferencias de Notificaciones</h2>
        <div className="space-y-4 mb-6">
          {[
            'Notificaciones de pedidos',
            'Alertas de stock bajo',
            'Confirmaciones de pago',
            'Actualizaciones de envío',
            'Notificaciones del sistema'
          ].map((label, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked 
                className="w-4 h-4 rounded border-border-color bg-base-primary text-primary focus:ring-primary focus:ring-2"
              />
              <span className="text-text-secondary">{label}</span>
            </label>
          ))}
        </div>
        <button className="btn-primary">Guardar preferencias</button>
      </div>
    </div>
  );
};

export default Notificaciones;