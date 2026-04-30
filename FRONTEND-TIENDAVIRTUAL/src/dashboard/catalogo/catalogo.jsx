// src/dashboard/catalogo/catalogo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Grid, List, ShoppingCart, Heart, Star, SlidersHorizontal, X } from 'lucide-react';

const Package = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 6.96 12 12.01 20.71 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const Catalogo = () => {
  const navigate = useNavigate();
  const isGuest = sessionStorage.getItem('is_guest') === 'true';
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState([]);

  const [products] = useState([
    { id: 1, name: 'Laptop Pro X1', category: 'Laptops', price: 4999, rating: 4.8, stock: 15, description: 'Laptop de alto rendimiento con procesador i7' },
    { id: 2, name: 'Smartphone Ultra S23', category: 'Smartphones', price: 3499, rating: 4.9, stock: 8, description: 'Smartphone con cámara de 200MP' },
    { id: 3, name: 'Tablet Air M2', category: 'Tablets', price: 2899, rating: 4.6, stock: 3, description: 'Tablet ligera con pantalla Retina' },
    { id: 4, name: 'Smart Watch Pro S3', category: 'Wearables', price: 1299, rating: 4.5, stock: 22, description: 'Smartwatch con monitor de salud' },
    { id: 5, name: 'Auriculares Noise Pro', category: 'Audio', price: 899, rating: 4.7, stock: 0, description: 'Auriculares con cancelación de ruido' },
    { id: 6, name: 'Monitor 4K UltraView', category: 'Monitores', price: 2499, rating: 4.4, stock: 12, description: 'Monitor 4K UHD de 27 pulgadas' },
    { id: 7, name: 'Teclado Mecánico RGB', category: 'Periféricos', price: 549, rating: 4.3, stock: 30, description: 'Teclado mecánico switches Cherry MX' },
    { id: 8, name: 'Mouse Gaming Pro', category: 'Periféricos', price: 349, rating: 4.6, stock: 25, description: 'Mouse gaming 26000 DPI' },
  ]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = (priceRange.min === '' || product.price >= Number(priceRange.min)) &&
                         (priceRange.max === '' || product.price <= Number(priceRange.max));
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const addToCart = (product) => {
    if (isGuest) {
      alert('Inicia sesión para agregar productos al carrito.');
      navigate('/login');
      return;
    }
    navigate('/carrito');
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-base flex items-center gap-3">
            <Search size={28} className="text-primary" />
            Catálogo de Productos
          </h1>
          <p className="text-text-muted mt-1">Explora nuestra selección de productos tecnológicos</p>
        </div>
        <div className="flex items-center gap-2 bg-base-secondary border border-border-color rounded-lg p-1">
          <button 
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-base'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} />
          </button>
          <button 
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-base'}`}
            onClick={() => setViewMode('list')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-base-secondary border border-border-color rounded-lg text-text-base placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {searchTerm && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-base" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            className={`btn-secondary ${showFilters ? 'bg-primary text-white border-primary' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} /> Filtros
          </button>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Mejor Valorados</option>
            <option value="name">Nombre</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="card flex flex-wrap gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-text-muted mb-2">Categoría</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-auto"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold uppercase text-text-muted mb-2">Rango de Precio</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                className="input-field w-24"
              />
              <span className="text-text-muted">-</span>
              <input
                type="number"
                placeholder="Máx"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                className="input-field w-24"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button 
              className="btn-ghost text-danger"
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange({ min: '', max: '' });
                setSearchTerm('');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      <p className="text-text-muted text-sm">
        {sortedProducts.length} productos encontrados
        {searchTerm && <span> para "{searchTerm}"</span>}
      </p>

      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
        {sortedProducts.map(product => (
          <div key={product.id} className={`card group ${viewMode === 'list' ? 'flex' : ''}`}>
            <div className={`relative bg-gradient-to-br from-base-primary to-base-tertiary flex items-center justify-center ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square rounded-lg mb-4'}`}>
              <Package size={48} className="text-text-muted" />
              {product.stock === 0 && (
                <span className="absolute top-2 left-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded">Agotado</span>
              )}
              <button 
                className={`absolute top-2 right-2 p-2 bg-black/40 hover:bg-danger rounded-full text-white transition-colors ${wishlist.includes(product.id) ? 'bg-danger' : ''}`}
                onClick={() => setWishlist(prev => prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id])}
              >
                <Heart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className={`${viewMode === 'list' ? 'flex-1 p-4' : ''}`}>
              <span className="text-xs text-text-muted uppercase tracking-wider">{product.category}</span>
              <h3 className="text-lg font-semibold text-text-base mt-1 group-hover:text-primary transition-colors">{product.name}</h3>
              
              {viewMode === 'list' && (
                <p className="text-text-secondary text-sm mt-2">{product.description}</p>
              )}
              
              <div className="flex items-center gap-1 my-2">
                {renderStars(product.rating)}
                <span className="text-xs text-text-muted ml-1">{product.rating}</span>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="text-xl font-bold text-primary">
                    S/ {product.price.toLocaleString('es-PE')}
                  </span>
                  <span className={`text-xs ml-2 ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button className="btn-secondary btn-sm flex-1">
                  Detalles
                </button>
                <button 
                  className="btn-primary btn-sm flex-1"
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={16} /> {isGuest ? 'Iniciar sesión' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-xl font-semibold text-text-base mb-2">No se encontraron productos</h3>
          <p className="text-text-muted">Intenta ajustar los filtros o el término de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default Catalogo;