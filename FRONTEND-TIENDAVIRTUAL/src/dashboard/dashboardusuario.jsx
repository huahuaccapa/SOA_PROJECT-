// src/dashboard/dashboardusuario.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Heart, Star, Award, Truck, ChevronRight,
  Plus, Edit, Trash2, Eye, User, CreditCard, Package
} from 'lucide-react';

const DashboardUsuario = ({ user, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const [userOrders] = useState([
    { id: 'ORD-101', date: '2024-01-10', total: 4999, status: 'delivered', items: 2 },
    { id: 'ORD-102', date: '2024-01-05', total: 1299, status: 'shipped', items: 1 },
    { id: 'ORD-103', date: '2023-12-28', total: 3499, status: 'processing', items: 1 }
  ]);

  const [wishlist] = useState([
    { id: 1, name: 'Laptop Pro X1', price: 4999, image: null, inStock: true },
    { id: 2, name: 'Smart Watch S3', price: 1299, image: null, inStock: true },
    { id: 3, name: 'Tablet Air', price: 2899, image: null, inStock: false }
  ]);

  const [profile, setProfile] = useState({
    fullName: user?.fullName || 'Usuario TechStore',
    email: user?.email || 'usuario@email.com',
    phone: '+51 987 654 321',
    birthDate: '1990-01-01',
    avatar: null
  });

  const [addresses] = useState([
    { id: 1, type: 'Principal', street: 'Av. Principal 123', city: 'Lima', zip: '15001', country: 'Perú' },
    { id: 2, type: 'Trabajo', street: 'Jr. Comercio 456', city: 'Lima', zip: '15002', country: 'Perú' }
  ]);

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
      shipped: 'Enviado',
      processing: 'En proceso',
      pending: 'Pendiente',
      cancelled: 'Cancelado'
    };
    return texts[status] || status;
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-base mb-1">Mi Panel</h1>
        <p className="text-text-muted">Bienvenido de vuelta, {profile.fullName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShoppingBag, label: 'Pedidos Totales', value: userOrders.length, color: 'text-primary' },
          { icon: Heart, label: 'Lista de Deseos', value: wishlist.length, color: 'text-danger' },
          { icon: Star, label: 'Reseñas', value: '12', color: 'text-warning' },
          { icon: Award, label: 'Nivel', value: 'Gold', color: 'text-success' }
        ].map((stat, index) => (
          <div key={index} className="card flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform">
            <div className={`p-3 rounded-lg bg-base-tertiary ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <span className="text-2xl font-bold text-text-base block">{stat.value}</span>
              <span className="text-sm text-text-muted">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pedidos Recientes */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-base">Pedidos Recientes</h2>
          <button 
            className="text-primary text-sm font-medium hover:text-primary-light transition-colors flex items-center gap-1"
            onClick={() => navigate('/pedidos')}
          >
            Ver todos <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {userOrders.slice(0, 3).map(order => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-base-primary rounded-lg hover:bg-base-hover transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <Package size={24} className="text-primary" />
                <div>
                  <span className="font-semibold text-text-base">Pedido #{order.id}</span>
                  <p className="text-sm text-text-muted">{order.date} • {order.items} items</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-primary">
                  S/ {order.total.toLocaleString('es-PE')}
                </span>
                <span className={getStatusBadge(order.status)}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendados */}
      <div className="card">
        <h2 className="text-xl font-semibold text-text-base mb-6">Recomendado para ti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-base-primary rounded-lg p-4 flex items-center gap-4 hover:border-primary border border-border-color transition-all cursor-pointer">
            <div className="w-20 h-20 bg-gradient-to-br from-base-tertiary to-base-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={32} className="text-text-muted" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-base">Laptop Pro X1</h3>
              <span className="text-primary font-bold">S/ 4,999.00</span>
              <button className="btn-primary btn-sm w-full mt-2">Agregar al carrito</button>
            </div>
          </div>
          <div className="bg-base-primary rounded-lg p-4 flex items-center gap-4 hover:border-primary border border-border-color transition-all cursor-pointer">
            <div className="w-20 h-20 bg-gradient-to-br from-base-tertiary to-base-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={32} className="text-text-muted" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-base">Smartphone Ultra</h3>
              <span className="text-primary font-bold">S/ 3,499.00</span>
              <button className="btn-primary btn-sm w-full mt-2">Agregar al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-base mb-1">Mis Pedidos</h1>
          <p className="text-text-muted">{userOrders.length} pedidos en total</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/pedidos')}>
          Ver todos los pedidos
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-color">
              <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Pedido</th>
              <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Fecha</th>
              <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Total</th>
              <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Estado</th>
              <th className="text-left p-4 text-xs font-semibold uppercase text-text-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {userOrders.map(order => (
              <tr key={order.id} className="border-b border-border-light hover:bg-base-hover transition-colors">
                <td className="p-4 font-mono text-text-base">#{order.id}</td>
                <td className="p-4 text-text-secondary">{order.date}</td>
                <td className="p-4 font-semibold text-primary">S/ {order.total.toLocaleString('es-PE')}</td>
                <td className="p-4">
                  <span className={getStatusBadge(order.status)}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="btn-ghost btn-sm" title="Ver detalles">
                      <Eye size={16} />
                    </button>
                    {order.status === 'delivered' && (
                      <button className="btn-ghost btn-sm" title="Dejar reseña">
                        <Star size={16} />
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
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-base mb-1">Mi Lista de Deseos</h1>
          <p className="text-text-muted">{wishlist.length} productos guardados</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/catalogo')}>
          <Plus size={18} /> Agregar productos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map(item => (
          <div key={item.id} className="card">
            <div className="aspect-square bg-gradient-to-br from-base-primary to-base-tertiary rounded-lg flex items-center justify-center mb-4">
              <Heart size={48} className="text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text-base mb-2">{item.name}</h3>
            <span className="text-xl font-bold text-primary block mb-2">
              S/ {item.price.toLocaleString('es-PE')}
            </span>
            <span className={`text-sm ${item.inStock ? 'text-success' : 'text-danger'}`}>
              {item.inStock ? '✓ En stock' : '✗ Agotado'}
            </span>
            <div className="flex gap-2 mt-4">
              {item.inStock ? (
                <button className="btn-primary btn-sm flex-1" onClick={() => navigate('/carrito')}>
                  Agregar al carrito
                </button>
              ) : (
                <button className="btn-secondary btn-sm flex-1" disabled>Notificarme</button>
              )}
              <button className="btn-ghost btn-sm text-danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-base mb-6">Mi Perfil</h1>
      
      <div className="card">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-white">
              <User size={64} />
            </div>
            <button className="btn-secondary btn-sm">Cambiar foto</button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Nombre completo</label>
              <input 
                type="text" 
                value={profile.fullName}
                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Correo electrónico</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Teléfono</label>
              <input 
                type="tel" 
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Fecha de nacimiento</label>
              <input 
                type="date" 
                value={profile.birthDate}
                onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                className="input-field"
              />
            </div>
            <button className="btn-primary">Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-base">Mis Direcciones</h1>
        <button className="btn-primary">
          <Plus size={18} /> Nueva dirección
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map(address => (
          <div key={address.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <span className="badge-info">{address.type}</span>
              <div className="flex gap-2">
                <button className="btn-ghost btn-sm">
                  <Edit size={16} />
                </button>
                {address.type !== 'Principal' && (
                  <button className="btn-ghost btn-sm text-danger">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1 text-text-secondary">
              <p className="font-medium text-text-base">{address.street}</p>
              <p>{address.city}, {address.zip}</p>
              <p>{address.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-base">Mis Reseñas</h1>
      
      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-base-primary to-base-tertiary rounded-lg flex items-center justify-center">
            <Package size={24} className="text-text-muted" />
          </div>
          <div>
            <h3 className="font-semibold text-text-base">Laptop Pro X1</h3>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} fill={i <= 4 ? '#fbbf24' : 'none'} stroke={i <= 4 ? '#fbbf24' : '#64748b'} />
              ))}
            </div>
          </div>
        </div>
        <p className="text-text-secondary text-sm">Excelente producto, muy rápido y buena calidad de construcción.</p>
        <span className="text-text-muted text-xs mt-2 block">15 de enero, 2024</span>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-base">Métodos de Pago</h1>
        <button className="btn-primary" onClick={() => navigate('/pagos')}>
          <Plus size={18} /> Agregar método
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 p-4 bg-base-primary rounded-lg">
          <CreditCard size={32} className="text-primary" />
          <div className="flex-1">
            <span className="font-semibold text-text-base block">Visa</span>
            <span className="text-text-muted font-mono">**** **** **** 4242</span>
            <span className="text-text-muted text-sm block">Expira 12/2025</span>
          </div>
          <span className="badge-success">Predeterminada</span>
        </div>
      </div>
      
      <button className="btn-secondary w-full" onClick={() => navigate('/pagos')}>
        Ver todos los métodos de pago
      </button>
    </div>
  );

  switch (activeTab) {
    case 'overview': return renderOverview();
    case 'orders': return renderOrders();
    case 'wishlist': return renderWishlist();
    case 'profile': return renderProfile();
    case 'addresses': return renderAddresses();
    case 'reviews': return renderReviews();
    case 'payment': return renderPayment();
    default: return renderOverview();
  }
};

export default DashboardUsuario;