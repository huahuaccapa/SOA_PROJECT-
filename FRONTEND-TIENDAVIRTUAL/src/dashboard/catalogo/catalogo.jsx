import React, { useState } from 'react';
import {
  Search, Filter, Grid, List, ShoppingCart, Heart,
  Star, ChevronDown, X, Eye, SlidersHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';

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
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState([]);

  const [products] = useState([
    { id: 1, name: 'Laptop Pro X1', category: 'Laptops', price: 4999.00, rating: 4.5, stock: 15, image: null, description: 'Laptop de alto rendimiento con procesador i7' },
    { id: 2, name: 'Smartphone Ultra', category: 'Smartphones', price: 3499.00, rating: 4.8, stock: 8, image: null, description: 'Smartphone con cámara de 108MP' },
    { id: 3, name: 'Tablet Air', category: 'Tablets', price: 2899.00, rating: 4.3, stock: 3, image: null, description: 'Tablet ligera con pantalla Retina' },
    { id: 4, name: 'Smart Watch S3', category: 'Wearables', price: 1299.00, rating: 4.6, stock: 22, image: null, description: 'Smartwatch con monitor de salud' },
    { id: 5, name: 'Auriculares Pro', category: 'Audio', price: 899.00, rating: 4.7, stock: 0, image: null, description: 'Auriculares con cancelación de ruido' },
    { id: 6, name: 'Monitor 4K', category: 'Monitores', price: 2499.00, rating: 4.4, stock: 12, image: null, description: 'Monitor 4K UHD de 27 pulgadas' },
    { id: 7, name: 'Teclado Mecánico', category: 'Periféricos', price: 549.00, rating: 4.2, stock: 30, image: null, description: 'Teclado mecánico RGB' },
    { id: 8, name: 'Mouse Gaming', category: 'Periféricos', price: 349.00, rating: 4.5, stock: 25, image: null, description: 'Mouse gaming 16000 DPI' }
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

  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product) => {
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
    <div className="catalogo-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Catálogo de Productos</h1>
          <p>Explora nuestra selección de productos tecnológicos de última generación</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vista en cuadrícula"
            >
              <Grid size={18} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vista en lista"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="catalogo-controls">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="control-buttons">
          <button 
            className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} /> Filtros
          </button>
          
          <div className="sort-wrapper">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
              <option value="name">Nombre</option>
            </select>
            <ChevronDown size={16} className="sort-icon" />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">Categoría</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Rango de Precio (S/)</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Mín"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                className="price-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="Máx"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                className="price-input"
              />
            </div>
          </div>
          
          <button 
            className="btn btn-text danger"
            onClick={() => {
              setSelectedCategory('all');
              setPriceRange({ min: '', max: '' });
              setSearchTerm('');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="catalogo-stats">
        <span>{sortedProducts.length} productos encontrados</span>
        {searchTerm && (
          <span> para "{searchTerm}"</span>
        )}
      </div>

      <div className={`products-container ${viewMode}`}>
        {sortedProducts.length === 0 ? (
          <div className="empty-state">
            <Search size={48} />
            <h3>No se encontraron productos</h3>
            <p>Intenta ajustar los filtros o el término de búsqueda</p>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange({ min: '', max: '' });
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          sortedProducts.map(product => (
            <div key={product.id} className={`product-card ${viewMode}`}>
              <div className="product-image-wrapper">
                <div className="image-placeholder">
                  <Package size={48} />
                </div>
                {product.stock === 0 && (
                  <span className="out-of-stock-badge">Agotado</span>
                )}
                <button 
                  className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                  title="Agregar a lista de deseos"
                >
                  <Heart size={18} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <div className="product-details">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                
                {viewMode === 'list' && (
                  <p className="product-description">{product.description}</p>
                )}
                
                <div className="product-rating">
                  <div className="stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-value">{product.rating}</span>
                </div>
                
                <div className="product-footer">
                  <div className="price-stock">
                    <span className="product-price">{formatCurrency(product.price)}</span>
                    <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                    </span>
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/catalogo/${product.id}`)}
                    >
                      <Eye size={16} /> Detalles
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      disabled={product.stock === 0}
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart size={16} /> Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Catalogo;