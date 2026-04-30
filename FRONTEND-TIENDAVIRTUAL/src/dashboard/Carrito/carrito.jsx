// src/dashboard/carrito/carrito.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, Heart, Truck,
  Shield, CreditCard, ArrowRight, Package, ChevronLeft
} from 'lucide-react';

const CheckCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Carrito = () => {
  const navigate = useNavigate();
  const isGuest = sessionStorage.getItem('is_guest') === 'true';
  
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Laptop Pro X1', price: 4999, quantity: 1, image: null, stock: 15 },
    { id: 2, name: 'Smart Watch Pro S3', price: 1299, quantity: 2, image: null, stock: 22 },
    { id: 3, name: 'Auriculares Noise Pro', price: 899, quantity: 1, image: null, stock: 5 }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const shippingCost = 35;
  const freeShippingThreshold = 5000;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const totalBeforeShipping = subtotal - discountAmount;
  const finalShippingCost = subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const total = totalBeforeShipping + finalShippingCost;

  useEffect(() => {
    if (isGuest) {
      navigate('/login');
    }
  }, [isGuest, navigate]);

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
      'TECH15': 15,
      'PERU25': 25
    };
    
    const upperCode = couponCode.toUpperCase();
    if (validCoupons[upperCode]) {
      setDiscount(validCoupons[upperCode]);
      setAppliedCoupon(upperCode);
    } else {
      alert('Cupón inválido o expirado');
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleCheckout = () => {
    const userRole = localStorage.getItem('user_role');
    if (!userRole || isGuest) {
      navigate('/login');
    } else {
      navigate('/pagos');
    }
  };

  if (isGuest) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-base flex items-center gap-3">
            <ShoppingCart size={28} className="text-primary" />
            Mi Carrito de Compras
          </h1>
          <p className="text-text-muted mt-1">
            {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/catalogo')}>
          <ChevronLeft size={18} /> Seguir Comprando
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={64} className="mx-auto text-text-muted mb-4" />
          <h2 className="text-2xl font-semibold text-text-base mb-2">Tu carrito está vacío</h2>
          <p className="text-text-muted mb-6">Explora nuestro catálogo y encuentra productos increíbles</p>
          <button className="btn-primary" onClick={() => navigate('/catalogo')}>
            Ir al Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {/* Banner de envío gratis */}
            <div className="card">
              {subtotal >= freeShippingThreshold ? (
                <div className="flex items-center gap-3 text-success">
                  <CheckCircle size={20} />
                  <span className="font-medium">¡Envío gratis conseguido! Disfruta de envío sin costo</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 text-text-secondary mb-3">
                    <Truck size={18} />
                    <span>
                      Te faltan{' '}
                      <strong className="text-primary">
                        S/ {(freeShippingThreshold - subtotal).toLocaleString('es-PE')}
                      </strong>{' '}
                      para envío gratis
                    </span>
                  </div>
                  <div className="h-2 bg-base-tertiary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Items del carrito */}
            {cartItems.map(item => (
              <div key={item.id} className="card hover:border-primary/50 transition-all">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-base-primary to-base-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={40} className="text-text-muted" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-text-base">{item.name}</h3>
                      <span className="text-xl font-bold text-primary">
                        S/ {item.price.toLocaleString('es-PE')}
                      </span>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      item.stock > 5 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {item.stock > 0 ? `${item.stock} disponibles` : 'Agotado'}
                    </span>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                      <div className="flex items-center gap-3 bg-base-primary border border-border-color rounded-lg p-1">
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary hover:text-white transition-colors disabled:opacity-30"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[30px] text-center font-semibold text-text-base">{item.quantity}</span>
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary hover:text-white transition-colors disabled:opacity-30"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button className="text-text-muted hover:text-danger transition-colors flex items-center gap-1 text-sm">
                          <Heart size={16} /> Guardar
                        </button>
                        <button 
                          className="text-text-muted hover:text-danger transition-colors flex items-center gap-1 text-sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:min-w-[100px]">
                    <span className="text-xs text-text-muted block mb-1">Subtotal</span>
                    <span className="text-lg font-bold text-text-base">
                      S/ {(item.price * item.quantity).toLocaleString('es-PE')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold text-text-base mb-6 pb-4 border-b border-border-color">
                Resumen del Pedido
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos)</span>
                  <span>S/ {subtotal.toLocaleString('es-PE')}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-2">
                      Descuento ({appliedCoupon})
                      <button className="text-text-muted hover:text-danger text-xs" onClick={removeCoupon}>✕</button>
                    </span>
                    <span>-S/ {discountAmount.toLocaleString('es-PE')}</span>
                  </div>
                )}

                {!appliedCoupon && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código de descuento"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="input-field flex-1"
                    />
                    <button className="btn-secondary btn-sm" onClick={applyCoupon}>
                      Aplicar
                    </button>
                  </div>
                )}

                <div className="flex justify-between text-text-secondary">
                  <span>Envío</span>
                  {finalShippingCost === 0 ? (
                    <span className="text-success font-medium">Gratis</span>
                  ) : (
                    <span>S/ {finalShippingCost.toLocaleString('es-PE')}</span>
                  )}
                </div>

                <div className="border-t border-border-color pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-text-base">Total</span>
                    <span className="font-bold text-primary">
                      S/ {total.toLocaleString('es-PE')}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary w-full mt-6 py-3 text-lg font-semibold"
                onClick={handleCheckout}
              >
                Proceder al Pago <ArrowRight size={20} />
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-text-muted text-sm">
                <Shield size={16} />
                <span>Pago seguro con encriptación SSL</span>
              </div>
            </div>

            {/* Info cards */}
            <div className="space-y-3 mt-4">
              <div className="card flex items-center gap-4">
                <Truck size={24} className="text-primary" />
                <div>
                  <strong className="text-text-base block text-sm">Envío Rápido</strong>
                  <p className="text-text-muted text-xs">Entrega en 2-3 días hábiles</p>
                </div>
              </div>
              <div className="card flex items-center gap-4">
                <Shield size={24} className="text-primary" />
                <div>
                  <strong className="text-text-base block text-sm">Compra Protegida</strong>
                  <p className="text-text-muted text-xs">Garantía de devolución de 30 días</p>
                </div>
              </div>
              <div className="card flex items-center gap-4">
                <CreditCard size={24} className="text-primary" />
                <div>
                  <strong className="text-text-base block text-sm">Pago Seguro</strong>
                  <p className="text-text-muted text-xs">Múltiples métodos de pago</p>
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