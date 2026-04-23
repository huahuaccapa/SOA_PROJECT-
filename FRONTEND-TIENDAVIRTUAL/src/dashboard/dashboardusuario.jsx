import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Heart, Star, Award, Truck, ChevronRight,
  Plus, Edit, Trash2, Eye, User, CreditCard
} from 'lucide-react';

const DashboardUsuario = ({ user, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const [userOrders, setUserOrders] = useState([
    { id: 'ORD-101', date: '2024-01-10', total: 1299.99, status: 'delivered', items: 2 },
    { id: 'ORD-102', date: '2024-01-05', total: 299.99, status: 'shipped', items: 1 },
    { id: 'ORD-103', date: '2023-12-28', total: 899.99, status: 'processing', items: 1 }
  ]);

  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Laptop Pro X1', price: 1299.99, image: null, inStock: true },
    { id: 2, name: 'Smart Watch S3', price: 299.99, image: null, inStock: true },
    { id: 3, name: 'Tablet Air', price: 499.99, image: null, inStock: false }
  ]);

  const [profile, setProfile] = useState({
    fullName: user?.fullName || 'Usuario TechStore',
    email: user?.email || 'usuario@email.com',
    phone: '+34 612 345 678',
    birthDate: '1990-01-01',
    avatar: null
  });

  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Principal', street: 'Calle Principal 123', city: 'Madrid', zip: '28001', country: 'España' },
    { id: 2, type: 'Trabajo', street: 'Avenida Negocio 456', city: 'Barcelona', zip: '08001', country: 'España' }
  ]);

  const renderOverview = () => (
    <div className="user-overview">
      <div className="page-header">
        <h1>Mi Panel</h1>
        <p>Bienvenido de vuelta, {profile.fullName}</p>
      </div>

      <div className="user-stats-grid">
        <div className="user-stat-card" onClick={() => navigate('/pedidos')}>
          <ShoppingBag size={24} />
          <div>
            <span className="stat-value">{userOrders.length}</span>
            <span className="stat-label">Pedidos Totales</span>
          </div>
        </div>
        <div className="user-stat-card">
          <Heart size={24} />
          <div>
            <span className="stat-value">{wishlist.length}</span>
            <span className="stat-label">Lista de Deseos</span>
          </div>
        </div>
        <div className="user-stat-card">
          <Star size={24} />
          <div>
            <span className="stat-value">12</span>
            <span className="stat-label">Reseñas</span>
          </div>
        </div>
        <div className="user-stat-card">
          <Award size={24} />
          <div>
            <span className="stat-value">Gold</span>
            <span className="stat-label">Nivel</span>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <div className="section-header">
          <h2>Pedidos Recientes</h2>
          <button className="btn btn-text" onClick={() => navigate('/pedidos')}>
            Ver todos <ChevronRight size={16} />
          </button>
        </div>
        <div className="orders-list">
          {userOrders.slice(0, 3).map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Pedido #{order.id}</span>
                <span className={`order-status ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <p>Fecha: {order.date}</p>
                <p>Total: ${order.total.toLocaleString()}</p>
                <p>Items: {order.items}</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/pedidos')}>
                <Truck size={16} /> Seguimiento
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="recommendations">
        <h2>Recomendado para ti</h2>
        <div className="product-carousel">
          <div className="product-card">
            <div className="product-image-placeholder"></div>
            <span className="product-name">Laptop Pro X1</span>
            <span className="product-price">$1,299.99</span>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/carrito')}>
              Agregar al carrito
            </button>
          </div>
          <div className="product-card">
            <div className="product-image-placeholder"></div>
            <span className="product-name">Smartphone Ultra</span>
            <span className="product-price">$899.99</span>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/carrito')}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="user-orders">
      <div className="page-header">
        <h1>Mis Pedidos</h1>
        <button className="btn btn-primary" onClick={() => navigate('/pedidos')}>
          Ver todos los pedidos
        </button>
      </div>

      <div className="orders-filter">
        <select className="filter-select">
          <option>Todos los pedidos</option>
          <option>Últimos 30 días</option>
          <option>Últimos 3 meses</option>
          <option>Último año</option>
        </select>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {userOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.date}</td>
                <td>${order.total.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Ver detalles" onClick={() => navigate('/pedidos')}>
                      <Eye size={16} />
                    </button>
                    {order.status === 'delivered' && (
                      <button className="btn-icon" title="Dejar reseña">
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
    <div className="user-wishlist">
      <div className="page-header">
        <h1>Mi Lista de Deseos</h1>
        <button className="btn btn-primary" onClick={() => navigate('/catalogo')}>
          <Plus size={18} /> Agregar productos
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlist.map(item => (
          <div key={item.id} className="wishlist-card">
            <div className="wishlist-image-placeholder"></div>
            <div className="wishlist-info">
              <h3>{item.name}</h3>
              <span className="wishlist-price">${item.price.toLocaleString()}</span>
              <span className={`stock-status ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {item.inStock ? 'En stock' : 'Agotado'}
              </span>
              <div className="wishlist-actions">
                {item.inStock ? (
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/carrito')}>
                    Agregar al carrito
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-sm" disabled>Notificarme</button>
                )}
                <button className="btn-icon danger" title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="user-profile">
      <div className="page-header">
        <h1>Mi Perfil</h1>
      </div>

      <div className="profile-container">
        <div className="profile-avatar-section">
          <div className="avatar-large">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.fullName} />
            ) : (
              <User size={64} />
            )}
          </div>
          <button className="btn btn-secondary">Cambiar foto</button>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input 
              type="text" 
              value={profile.fullName}
              onChange={(e) => setProfile({...profile, fullName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="tel" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input 
              type="date" 
              value={profile.birthDate}
              onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
            />
          </div>
          <button className="btn btn-primary">Guardar cambios</button>
        </div>
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="user-addresses">
      <div className="page-header">
        <h1>Mis Direcciones</h1>
        <button className="btn btn-primary">
          <Plus size={18} /> Nueva dirección
        </button>
      </div>

      <div className="addresses-grid">
        {addresses.map(address => (
          <div key={address.id} className="address-card">
            <div className="address-type">{address.type}</div>
            <div className="address-details">
              <p>{address.street}</p>
              <p>{address.city}, {address.zip}</p>
              <p>{address.country}</p>
            </div>
            <div className="address-actions">
              <button className="btn-icon">
                <Edit size={16} />
              </button>
              {address.type !== 'Principal' && (
                <button className="btn-icon danger">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="user-reviews">
      <div className="page-header">
        <h1>Mis Reseñas</h1>
      </div>

      <div className="reviews-list">
        <div className="review-card">
          <div className="review-product">
            <div className="product-image-small"></div>
            <span>Laptop Pro X1</span>
          </div>
          <div className="review-rating">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={16} fill={i <= 4 ? '#fbbf24' : 'none'} />
            ))}
          </div>
          <p className="review-text">Excelente producto, muy rápido y buena calidad de construcción.</p>
          <span className="review-date">15 de enero, 2024</span>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="user-payment">
      <div className="page-header">
        <h1>Métodos de Pago</h1>
        <button className="btn btn-primary" onClick={() => navigate('/pagos')}>
          <Plus size={18} /> Agregar método
        </button>
      </div>

      <div className="payment-methods">
        <div className="payment-card">
          <div className="card-icon">
            <CreditCard size={24} />
          </div>
          <div className="card-details">
            <span className="card-type">Visa</span>
            <span className="card-number">**** **** **** 4242</span>
            <span className="card-expiry">Expira 12/25</span>
          </div>
          <span className="default-badge">Predeterminada</span>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/pagos')}>
          Ver todos los métodos de pago
        </button>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'overview':
      return renderOverview();
    case 'orders':
      return renderOrders();
    case 'wishlist':
      return renderWishlist();
    case 'profile':
      return renderProfile();
    case 'addresses':
      return renderAddresses();
    case 'reviews':
      return renderReviews();
    case 'payment':
      return renderPayment();
    default:
      return renderOverview();
  }
};

export default DashboardUsuario;