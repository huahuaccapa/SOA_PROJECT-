import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, Star, CheckCircle, Cpu, Sparkles
} from 'lucide-react';

const DashboardInvitado = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const [products] = useState([
    { id: 1, name: 'Laptop Pro X1', category: 'Laptops', price: 1299.99, rating: 4.5, image: null },
    { id: 2, name: 'Smartphone Ultra', category: 'Smartphones', price: 899.99, rating: 4.8, image: null },
    { id: 3, name: 'Tablet Air', category: 'Tablets', price: 499.99, rating: 4.3, image: null },
    { id: 4, name: 'Smart Watch S3', category: 'Wearables', price: 299.99, rating: 4.6, image: null },
    { id: 5, name: 'Auriculares Pro', category: 'Audio', price: 199.99, rating: 4.7, image: null },
    { id: 6, name: 'Monitor 4K', category: 'Monitores', price: 599.99, rating: 4.4, image: null }
  ]);

  const categories = [
    { id: 1, name: 'Laptops', count: 24, icon: '💻' },
    { id: 2, name: 'Smartphones', count: 32, icon: '📱' },
    { id: 3, name: 'Tablets', count: 18, icon: '📟' },
    { id: 4, name: 'Wearables', count: 15, icon: '⌚' },
    { id: 5, name: 'Audio', count: 28, icon: '🎧' },
    { id: 6, name: 'Monitores', count: 12, icon: '🖥️' }
  ];

  const renderCatalog = () => (
    <div className="guest-catalog">
      <div className="page-header">
        <h1>Catálogo de Productos</h1>
        <p>Explora nuestra selección de tecnología de última generación</p>
        <button className="btn btn-primary" onClick={() => navigate('/catalogo')}>
          Ver Catálogo Completo
        </button>
      </div>

      <div className="catalog-banner">
        <div className="banner-content">
          <h2>¡Regístrate y obtén 10% de descuento!</h2>
          <p>Crea una cuenta gratuita y accede a ofertas exclusivas</p>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Registrarme ahora
          </button>
        </div>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-placeholder"></div>
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3>{product.name}</h3>
              <div className="product-rating">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'} 
                  />
                ))}
                <span>({product.rating})</span>
              </div>
              <span className="product-price">${product.price.toLocaleString()}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/catalogo')}>
                <Eye size={16} /> Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="guest-categories">
      <div className="page-header">
        <h1>Categorías</h1>
        <p>Encuentra lo que buscas por categoría</p>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <span className="category-count">{category.count} productos</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/catalogo')}>
              Explorar →
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="guest-offers">
      <div className="page-header">
        <h1>Ofertas Especiales</h1>
        <p>Aprovecha descuentos exclusivos por tiempo limitado</p>
      </div>

      <div className="offers-grid">
        <div className="offer-card featured">
          <div className="offer-badge">-30%</div>
          <h3>Laptop Pro X1</h3>
          <div className="offer-prices">
            <span className="original-price">$1,299.99</span>
            <span className="offer-price">$909.99</span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Inicia sesión para comprar
          </button>
        </div>

        <div className="offer-card">
          <div className="offer-badge">-20%</div>
          <h3>Smart Watch S3</h3>
          <div className="offer-prices">
            <span className="original-price">$299.99</span>
            <span className="offer-price">$239.99</span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Inicia sesión para comprar
          </button>
        </div>

        <div className="offer-card">
          <div className="offer-badge">-25%</div>
          <h3>Auriculares Pro</h3>
          <div className="offer-prices">
            <span className="original-price">$199.99</span>
            <span className="offer-price">$149.99</span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Inicia sesión para comprar
          </button>
        </div>
      </div>

      <div className="register-cta">
        <h2>¿Quieres acceder a estas ofertas?</h2>
        <p>Regístrate gratis y comienza a ahorrar en tus compras</p>
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Crear cuenta
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );

  const renderRegisterPrompt = () => (
    <div className="guest-register-prompt">
      <div className="register-hero">
        <div className="register-content">
          <h1>Únete a TechStore</h1>
          <p>Crea tu cuenta gratuita y disfruta de todos los beneficios</p>
          
          <div className="benefits-list">
            <div className="benefit-item">
              <CheckCircle size={20} className="benefit-icon" />
              <span>Acceso a ofertas exclusivas</span>
            </div>
            <div className="benefit-item">
              <CheckCircle size={20} className="benefit-icon" />
              <span>Seguimiento de pedidos en tiempo real</span>
            </div>
            <div className="benefit-item">
              <CheckCircle size={20} className="benefit-icon" />
              <span>Historial completo de compras</span>
            </div>
            <div className="benefit-item">
              <CheckCircle size={20} className="benefit-icon" />
              <span>Lista de deseos personalizada</span>
            </div>
            <div className="benefit-item">
              <CheckCircle size={20} className="benefit-icon" />
              <span>Devoluciones más rápidas</span>
            </div>
          </div>

          <div className="register-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Registrarme ahora
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
              Ya tengo cuenta
            </button>
          </div>
        </div>
        <div className="register-illustration">
          <Cpu size={120} className="hero-icon" />
          <Sparkles size={40} className="sparkle-icon" />
        </div>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'catalog':
      return renderCatalog();
    case 'categories':
      return renderCategories();
    case 'offers':
      return renderOffers();
    case 'register':
      return renderRegisterPrompt();
    default:
      return renderCatalog();
  }
};

export default DashboardInvitado;