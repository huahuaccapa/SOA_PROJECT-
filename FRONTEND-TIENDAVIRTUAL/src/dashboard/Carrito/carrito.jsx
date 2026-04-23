import React, { useState } from 'react';
import {
  ShoppingCart, Trash2, Plus, Minus, Heart, Truck,
  Shield, CreditCard, ArrowRight, Package, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Carrito = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Laptop Pro X1', price: 1299.99, quantity: 1, image: null, stock: 15 },
    { id: 2, name: 'Smart Watch S3', price: 299.99, quantity: 2, image: null, stock: 22 },
    { id: 3, name: 'Auriculares Pro', price: 199.99, quantity: 1, image: null, stock: 5 }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const shippingCost = 9.99;
  const freeShippingThreshold = 500;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const totalBeforeShipping = subtotal - discountAmount;
  const finalShippingCost = subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const total = totalBeforeShipping + finalShippingCost;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    const validCoupons = {
      'WELCOME10': 10,
      'SAVE20': 20,
      'TECH15': 15
    };
    
    const upperCode = couponCode.toUpperCase();
    if (validCoupons[upperCode]) {
      setDiscount(validCoupons[upperCode]);
      setAppliedCoupon(upperCode);
    } else {
      alert('Cupón inválido');
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleCheckout = () => {
    const userRole = localStorage.getItem('user_role');
    const isGuest = sessionStorage.getItem('is_guest') === 'true';
    
    if (!userRole || isGuest) {
      navigate('/login');
    } else {
      navigate('/pagos');
    }
  };

  return (
    <div className="carrito-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <ShoppingCart size={28} />
            Mi Carrito de Compras
          </h1>
          <p>{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/catalogo')}>
            <ChevronLeft size={18} /> Seguir Comprando
          </button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingCart size={64} />
          </div>
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestro catálogo y encuentra productos increíbles</p>
          <button className="btn btn-primary" onClick={() => navigate('/catalogo')}>
            Ir al Catálogo
          </button>
        </div>
      ) : (
        <div className="carrito-content">
          <div className="carrito-items-section">
            <div className="shipping-banner">
              {subtotal >= freeShippingThreshold ? (
                <div className="shipping-achieved">
                  <CheckCircle size={20} />
                  <span>¡Envío gratis conseguido! Disfruta de envío sin costo</span>
                </div>
              ) : (
                <div className="shipping-progress">
                  <div className="shipping-info">
                    <Truck size={18} />
                    <span>Te faltan <strong>${(freeShippingThreshold - subtotal).toLocaleString()}</strong> para envío gratis</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-image">
                    <div className="image-placeholder">
                      <Package size={32} />
                    </div>
                  </div>
                  
                  <div className="cart-item-info">
                    <div className="item-header">
                      <h3 className="item-name">{item.name}</h3>
                      <span className="item-price">${item.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="item-meta">
                      <span className={`stock-badge ${item.stock > 5 ? 'in-stock' : 'low-stock'}`}>
                        {item.stock > 0 ? `${item.stock} disponibles` : 'Agotado'}
                      </span>
                    </div>

                    <div className="item-actions">
                      <div className="quantity-selector">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <div className="item-secondary-actions">
                        <button className="btn-text">
                          <Heart size={16} /> Guardar
                        </button>
                        <button 
                          className="btn-text danger"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    <span className="total-label">Subtotal</span>
                    <span className="total-amount">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carrito-summary">
            <div className="summary-card">
              <h2>Resumen del Pedido</h2>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="summary-row discount">
                    <span>
                      Descuento ({appliedCoupon})
                      <button className="remove-coupon" onClick={removeCoupon}>✕</button>
                    </span>
                    <span>-${discountAmount.toLocaleString()}</span>
                  </div>
                )}

                {!appliedCoupon && (
                  <div className="coupon-input">
                    <input
                      type="text"
                      placeholder="Código de descuento"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="btn btn-secondary btn-sm" onClick={applyCoupon}>
                      Aplicar
                    </button>
                  </div>
                )}

                <div className="summary-row">
                  <span>Envío</span>
                  {finalShippingCost === 0 ? (
                    <span className="free-shipping">Gratis</span>
                  ) : (
                    <span>${finalShippingCost.toLocaleString()}</span>
                  )}
                </div>

                <div className="summary-divider" />

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <button className="btn btn-primary btn-block checkout-button" onClick={handleCheckout}>
                Proceder al Pago <ArrowRight size={18} />
              </button>

              <div className="secure-payment">
                <Shield size={16} />
                <span>Pago seguro con encriptación SSL</span>
              </div>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <Truck size={20} />
                <div>
                  <strong>Envío Rápido</strong>
                  <p>Entrega en 2-3 días hábiles</p>
                </div>
              </div>
              <div className="info-card">
                <Shield size={20} />
                <div>
                  <strong>Compra Protegida</strong>
                  <p>Garantía de devolución de 30 días</p>
                </div>
              </div>
              <div className="info-card">
                <CreditCard size={20} />
                <div>
                  <strong>Pago Seguro</strong>
                  <p>Múltiples métodos de pago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;