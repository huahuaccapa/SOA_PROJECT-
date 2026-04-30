// src/dashboard/dashboardinvitado.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Star, CheckCircle, Cpu, Sparkles, ShoppingCart, Heart } from 'lucide-react';

const DashboardInvitado = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const [products] = useState([
    { id: 1, name: 'Laptop Pro X1', category: 'Laptops', price: 4999, rating: 4.8, image: null, description: 'Laptop de alto rendimiento con procesador i7' },
    { id: 2, name: 'Smartphone Ultra S23', category: 'Smartphones', price: 3499, rating: 4.9, image: null, description: 'Smartphone con cámara de 200MP' },
    { id: 3, name: 'Tablet Air M2', category: 'Tablets', price: 2899, rating: 4.6, image: null, description: 'Tablet ligera con pantalla Retina' },
    { id: 4, name: 'Smart Watch Pro S3', category: 'Wearables', price: 1299, rating: 4.5, image: null, description: 'Smartwatch con monitor de salud' },
    { id: 5, name: 'Auriculares Noise Pro', category: 'Audio', price: 899, rating: 4.7, image: null, description: 'Auriculares con cancelación de ruido' },
    { id: 6, name: 'Monitor 4K UltraView', category: 'Monitores', price: 2499, rating: 4.4, image: null, description: 'Monitor 4K UHD de 27 pulgadas' },
  ]);

  const categories = [
    { id: 1, name: 'Laptops', count: 24, icon: '💻' },
    { id: 2, name: 'Smartphones', count: 32, icon: '📱' },
    { id: 3, name: 'Tablets', count: 18, icon: '📟' },
    { id: 4, name: 'Wearables', count: 15, icon: '⌚' },
    { id: 5, name: 'Audio', count: 28, icon: '🎧' },
    { id: 6, name: 'Monitores', count: 12, icon: '🖥️' },
    { id: 7, name: 'Periféricos', count: 20, icon: '🖱️' },
    { id: 8, name: 'Almacenamiento', count: 16, icon: '💾' },
  ];

  const offers = [
    { id: 1, name: 'Laptop Pro X1', originalPrice: 4999, offerPrice: 3499, discount: 30, featured: true },
    { id: 2, name: 'Smart Watch Pro S3', originalPrice: 1299, offerPrice: 899, discount: 30, featured: false },
    { id: 3, name: 'Auriculares Noise Pro', originalPrice: 899, offerPrice: 629, discount: 30, featured: false },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        fill={i < Math.floor(rating) ? '#fbbf24' : 'none'} 
        stroke={i < Math.floor(rating) ? '#fbbf24' : '#64748b'}
      />
    ));
  };

  const renderCatalog = () => (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-info rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">¡Regístrate y obtén 10% de descuento!</h2>
        <p className="text-white/80 mb-6">Crea una cuenta gratuita y accede a ofertas exclusivas</p>
        <button 
          className="btn-primary bg-white text-primary hover:bg-gray-100"
          onClick={() => navigate('/register')}
        >
          Registrarme ahora
        </button>
      </div>

      {/* Grid de productos */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-base">Productos Destacados</h3>
          <button 
            className="text-primary text-sm font-medium hover:text-primary-light transition-colors"
            onClick={() => navigate('/catalogo')}
          >
            Ver todos →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="card group cursor-pointer" onClick={() => navigate('/catalogo')}>
              <div className="aspect-square bg-gradient-to-br from-base-primary to-base-tertiary rounded-lg flex items-center justify-center mb-4">
                <Cpu size={64} className="text-text-muted" />
              </div>
              <span className="text-xs text-text-muted uppercase tracking-wider">{product.category}</span>
              <h3 className="text-lg font-semibold text-text-base mt-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <div className="flex items-center gap-1 my-2">
                {renderStars(product.rating)}
                <span className="text-xs text-text-muted ml-1">{product.rating}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-primary">
                  S/ {product.price.toLocaleString('es-PE')}
                </span>
                <button className="btn-primary btn-sm">
                  <ShoppingCart size={16} /> Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-base mb-2">Categorías</h2>
        <p className="text-text-muted">Encuentra lo que buscas por categoría</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(category => (
          <div 
            key={category.id} 
            className="card text-center cursor-pointer hover:border-primary hover:-translate-y-1 transition-all"
            onClick={() => navigate('/catalogo')}
          >
            <div className="text-4xl mb-3">{category.icon}</div>
            <h3 className="text-text-base font-semibold mb-1">{category.name}</h3>
            <span className="text-text-muted text-sm">{category.count} productos</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-base mb-2">Ofertas Especiales</h2>
        <p className="text-text-muted">Aprovecha descuentos exclusivos por tiempo limitado</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className={`card text-center relative ${offer.featured ? 'border-primary shadow-lg shadow-primary/20' : ''}`}>
            {offer.discount > 0 && (
              <span className="absolute -top-3 right-4 bg-danger text-white px-3 py-1 rounded-full text-xs font-bold">
                -{offer.discount}%
              </span>
            )}
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-base-primary to-base-tertiary rounded-full flex items-center justify-center">
              <Sparkles size={32} className="text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-text-base mb-4">{offer.name}</h3>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-text-muted line-through text-sm">
                S/ {offer.originalPrice.toLocaleString('es-PE')}
              </span>
              <span className="text-2xl font-bold text-primary">
                S/ {offer.offerPrice.toLocaleString('es-PE')}
              </span>
            </div>
            <button 
              className="btn-primary w-full"
              onClick={() => navigate('/login')}
            >
              Inicia sesión para comprar
            </button>
          </div>
        ))}
      </div>

      <div className="card text-center mt-8">
        <h2 className="text-2xl font-bold text-text-base mb-2">¿Quieres acceder a estas ofertas?</h2>
        <p className="text-text-muted mb-6">Regístrate gratis y comienza a ahorrar en tus compras</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            className="btn-primary"
            onClick={() => navigate('/register')}
          >
            Crear cuenta
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );

  const renderRegisterPrompt = () => (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-base mb-4">Únete a TechStore</h1>
            <p className="text-text-muted mb-8">Crea tu cuenta gratuita y disfruta de todos los beneficios</p>
            
            <div className="space-y-4 mb-8">
              {[
                'Acceso a ofertas exclusivas',
                'Seguimiento de pedidos en tiempo real',
                'Historial completo de compras',
                'Lista de deseos personalizada',
                'Devoluciones más rápidas'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-success flex-shrink-0" />
                  <span className="text-text-secondary">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="btn-primary flex-1"
                onClick={() => navigate('/register')}
              >
                Registrarme ahora
              </button>
              <button 
                className="btn-secondary flex-1"
                onClick={() => navigate('/login')}
              >
                Ya tengo cuenta
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center relative">
            <Cpu size={120} className="text-primary/30" />
            <Sparkles size={40} className="text-warning absolute top-10 right-10" />
          </div>
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