// src/services/api.js

/**
 * Servicio API Simulado
 * Proporciona todos los endpoints mock para el funcionamiento del frontend
 */

import { formatCurrency } from '../utils/currency';
import emailService from './emailService';

// =============================================
// DATOS INICIALES SIMULADOS
// =============================================

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Laptop Pro X1', category: 'Laptops', price: 4.999, stock: 15, status: 'active', sales: 45, rating: 4.8, description: 'Laptop de alto rendimiento con procesador Intel Core i7 de 13va generación, 16GB RAM DDR5, SSD 1TB NVMe, pantalla 15.6" 4K OLED', image: null, createdAt: '2024-01-15' },
  { id: 2, name: 'Smartphone Ultra S23', category: 'Smartphones', price: 3.499, stock: 8, status: 'active', sales: 128, rating: 4.9, description: 'Smartphone con cámara de 200MP, procesador Snapdragon 8 Gen 3, 12GB RAM, 512GB almacenamiento, pantalla AMOLED 6.8"', image: null, createdAt: '2024-02-20' },
  { id: 3, name: 'Tablet Air M2', category: 'Tablets', price: 2.899, stock: 3, status: 'low_stock', sales: 67, rating: 4.6, description: 'Tablet con chip M2, pantalla Liquid Retina 11", compatible con Apple Pencil 2da gen, 256GB', image: null, createdAt: '2024-03-10' },
  { id: 4, name: 'Smart Watch Pro S3', category: 'Wearables', price: 1.299, stock: 22, status: 'active', sales: 89, rating: 4.5, description: 'Smartwatch con monitor de frecuencia cardíaca, GPS, resistencia al agua 50m, pantalla always-on, 7 días de batería', image: null, createdAt: '2024-04-05' },
  { id: 5, name: 'Auriculares Noise Pro', category: 'Audio', price: 899, stock: 0, status: 'out_of_stock', sales: 156, rating: 4.7, description: 'Auriculares con cancelación de ruido activa ANC, 40h batería, Bluetooth 5.3, carga inalámbrica', image: null, createdAt: '2024-01-28' },
  { id: 6, name: 'Monitor 4K UltraView', category: 'Monitores', price: 2.499, stock: 12, status: 'active', sales: 34, rating: 4.4, description: 'Monitor 4K UHD 27 pulgadas, panel IPS, 144Hz, 1ms respuesta, HDR10, FreeSync Premium', image: null, createdAt: '2024-05-15' },
  { id: 7, name: 'Teclado Mecánico RGB', category: 'Periféricos', price: 549, stock: 30, status: 'active', sales: 78, rating: 4.3, description: 'Teclado mecánico switches Cherry MX Red, retroiluminación RGB por tecla, reposamuñecas magnético', image: null, createdAt: '2024-02-14' },
  { id: 8, name: 'Mouse Gaming Pro', category: 'Periféricos', price: 349, stock: 25, status: 'active', sales: 92, rating: 4.6, description: 'Mouse gaming 26000 DPI, sensor óptico, 8 botones programables, peso ajustable, cable paracord', image: null, createdAt: '2024-03-22' },
  { id: 9, name: 'Cámara Web 4K Stream', category: 'Periféricos', price: 749, stock: 18, status: 'active', sales: 23, rating: 4.2, description: 'Cámara web 4K 60fps, autoenfoque, micrófono estéreo integrado, ángulo 90°, compatible con todas las plataformas', image: null, createdAt: '2024-06-01' },
  { id: 10, name: 'SSD Portátil 2TB', category: 'Almacenamiento', price: 649, stock: 40, status: 'active', sales: 56, rating: 4.7, description: 'SSD externo 2TB, USB-C 3.2 Gen 2x2, velocidad lectura/escritura 2000MB/s, resistente a caídas 2m', image: null, createdAt: '2024-04-18' },
  { id: 11, name: 'Cargador Inalámbrico 3en1', category: 'Accesorios', price: 299, stock: 35, status: 'active', sales: 112, rating: 4.4, description: 'Cargador inalámbrico para smartphone, smartwatch y auriculares, carga rápida 15W, diseño plegable', image: null, createdAt: '2024-05-30' },
  { id: 12, name: 'Hub USB-C Multipuerto', category: 'Accesorios', price: 199, stock: 50, status: 'active', sales: 67, rating: 4.1, description: 'Hub USB-C 7 en 1: HDMI 4K, 3x USB-A 3.0, USB-C PD 100W, lector SD/TF, Ethernet RJ45', image: null, createdAt: '2024-07-12' },
];

const INITIAL_ORDERS = [
  { id: 'ORD-001', customer: 'Juan Pérez', customerEmail: 'juan@email.com', date: '2024-10-15', total: 4.999, status: 'delivered', items: 3, tracking: 'TRK123456789PE', paymentMethod: 'Tarjeta Visa ****4242' },
  { id: 'ORD-002', customer: 'María García', customerEmail: 'maria@email.com', date: '2024-10-14', total: 899, status: 'processing', items: 1, tracking: null, paymentMethod: 'Yape' },
  { id: 'ORD-003', customer: 'Carlos Ruiz', customerEmail: 'carlos@email.com', date: '2024-10-14', total: 2.899, status: 'shipped', items: 2, tracking: 'TRK987654321PE', paymentMethod: 'Tarjeta Mastercard ****8888' },
  { id: 'ORD-004', customer: 'Ana López Sánchez', customerEmail: 'ana@email.com', date: '2024-10-13', total: 1.299, status: 'pending', items: 1, tracking: null, paymentMethod: 'PayPal' },
  { id: 'ORD-005', customer: 'Pedro Sánchez', customerEmail: 'pedro@email.com', date: '2024-10-12', total: 6.498, status: 'cancelled', items: 2, tracking: null, paymentMethod: 'Tarjeta Visa ****1111' },
  { id: 'ORD-101', customer: 'Usuario Demo', customerEmail: 'usuario@techstore.com', date: '2024-10-10', total: 4.999, status: 'delivered', items: 2, tracking: 'TRK111222333PE', paymentMethod: 'Tarjeta Visa ****4242' },
  { id: 'ORD-102', customer: 'Usuario Demo', customerEmail: 'usuario@techstore.com', date: '2024-10-05', total: 1.299, status: 'shipped', items: 1, tracking: 'TRK444555666PE', paymentMethod: 'PayPal' },
  { id: 'ORD-103', customer: 'Usuario Demo', customerEmail: 'usuario@techstore.com', date: '2024-09-28', total: 3.499, status: 'processing', items: 1, tracking: null, paymentMethod: 'Yape' },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, userId: 2, title: '¡Pedido entregado!', message: 'Tu pedido #ORD-101 ha sido entregado exitosamente', time: 'Hace 2 horas', type: 'shipping', read: false, icon: 'Package' },
  { id: 2, userId: 2, title: 'Oferta especial para ti', message: '20% de descuento en accesorios hasta el domingo', time: 'Hace 5 horas', type: 'promotion', read: false, icon: 'Tag' },
  { id: 3, userId: 2, title: 'Pago confirmado', message: 'El pago de S/ 1,299.00 ha sido procesado exitosamente', time: 'Hace 1 día', type: 'payment', read: true, icon: 'CreditCard' },
  { id: 4, userId: 1, title: 'Stock bajo: Tablet Air M2', message: 'Quedan solo 3 unidades de Tablet Air M2', time: 'Hace 30 min', type: 'warning', read: false, icon: 'AlertTriangle' },
  { id: 5, userId: 1, title: 'Nuevo pedido #ORD-006', message: 'Pedido de Ana López por S/ 2,499.00 requiere atención', time: 'Hace 1 hora', type: 'order', read: false, icon: 'ShoppingCart' },
];

// =============================================
// CLASE API SIMULADA
// =============================================

class ApiService {
  constructor() {
    // Inicializar datos en localStorage
    this.initData();
  }

  initData() {
    if (!localStorage.getItem('mock_products')) {
      localStorage.setItem('mock_products', JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem('mock_orders')) {
      localStorage.setItem('mock_orders', JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem('mock_notifications')) {
      localStorage.setItem('mock_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem('mock_cart')) {
      localStorage.setItem('mock_cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('mock_payment_methods')) {
      localStorage.setItem('mock_payment_methods', JSON.stringify([
        { id: 1, userId: 2, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
        { id: 2, userId: 2, type: 'Mastercard', last4: '8888', expiry: '06/25', isDefault: false },
      ]));
    }
  }

  // Helpers
  getProducts() { return JSON.parse(localStorage.getItem('mock_products')); }
  setProducts(data) { localStorage.setItem('mock_products', JSON.stringify(data)); }
  
  getOrders() { return JSON.parse(localStorage.getItem('mock_orders')); }
  setOrders(data) { localStorage.setItem('mock_orders', JSON.stringify(data)); }
  
  getNotifications() { return JSON.parse(localStorage.getItem('mock_notifications')); }
  setNotifications(data) { localStorage.setItem('mock_notifications', JSON.stringify(data)); }
  
  getCart() { return JSON.parse(localStorage.getItem('mock_cart')); }
  setCart(data) { localStorage.setItem('mock_cart', JSON.stringify(data)); }
  
  getPaymentMethods() { return JSON.parse(localStorage.getItem('mock_payment_methods')); }
  setPaymentMethods(data) { localStorage.setItem('mock_payment_methods', JSON.stringify(data)); }

  delay(ms = 800) { return new Promise(resolve => setTimeout(resolve, ms)); }

  // =============================================
  // PRODUCTOS
  // =============================================
  
  async getProducts(filters = {}) {
    await this.delay(500);
    let products = this.getProducts();

    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
    }
    if (filters.category && filters.category !== 'all') {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters.minPrice) {
      products = products.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.sortBy === 'price-asc') products.sort((a, b) => a.price - b.price);
    if (filters.sortBy === 'price-desc') products.sort((a, b) => b.price - a.price);
    if (filters.sortBy === 'rating') products.sort((a, b) => b.rating - a.rating);
    if (filters.sortBy === 'name') products.sort((a, b) => a.name.localeCompare(b.name));

    return products;
  }

  async getProductById(productId) {
    await this.delay(300);
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Producto no encontrado');
    return product;
  }

  async createProduct(productData) {
    await this.delay(500);
    const products = this.getProducts();
    const newProduct = {
      id: Date.now(),
      ...productData,
      sales: 0,
      rating: 0,
      status: productData.stock > 10 ? 'active' : productData.stock > 0 ? 'low_stock' : 'out_of_stock',
      createdAt: new Date().toISOString().split('T')[0],
    };
    products.push(newProduct);
    this.setProducts(products);
    return newProduct;
  }

  async updateProduct(productId, productData) {
    await this.delay(500);
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) throw new Error('Producto no encontrado');
    
    products[index] = { 
      ...products[index], 
      ...productData,
      status: productData.stock > 10 ? 'active' : productData.stock > 0 ? 'low_stock' : 'out_of_stock'
    };
    this.setProducts(products);
    return products[index];
  }

  async deleteProduct(productId) {
    await this.delay(500);
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== productId);
    this.setProducts(filtered);
    return { message: 'Producto eliminado exitosamente' };
  }

  // =============================================
  // CARRITO
  // =============================================

  async getCartItems() {
    await this.delay(300);
    const cartItems = this.getCart();
    const products = this.getProducts();
    
    return cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product || null,
      };
    });
  }

  async addToCart(productId, quantity = 1) {
    await this.delay(300);
    const cart = this.getCart();
    const existing = cart.find(item => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    this.setCart(cart);
    return cart;
  }

  async updateCartItem(productId, quantity) {
    await this.delay(200);
    const cart = this.getCart();
    const item = cart.find(i => i.productId === productId);
    if (!item) throw new Error('Producto no encontrado en el carrito');
    
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }
    
    item.quantity = quantity;
    this.setCart(cart);
    return cart;
  }

  async removeFromCart(productId) {
    await this.delay(200);
    let cart = this.getCart();
    cart = cart.filter(i => i.productId !== productId);
    this.setCart(cart);
    return cart;
  }

  async clearCart() {
    await this.delay(200);
    this.setCart([]);
    return [];
  }

  async applyCoupon(code) {
    await this.delay(400);
    const validCoupons = {
      'WELCOME10': 10,
      'TECH20': 20,
      'SAVE15': 15,
      'PERU25': 25,
    };
    
    const discount = validCoupons[code.toUpperCase()];
    if (!discount) throw new Error('Cupón inválido o expirado');
    return { discount, code: code.toUpperCase() };
  }

  // =============================================
  // PEDIDOS
  // =============================================

  async createOrder(orderData) {
    await this.delay(1500);
    const orders = this.getOrders();
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customer: userData.fullName || orderData.customerName || 'Cliente',
      customerEmail: userData.email || orderData.customerEmail,
      date: new Date().toISOString().split('T')[0],
      total: orderData.total,
      status: 'pending',
      items: orderData.items?.length || 1,
      tracking: null,
      paymentMethod: orderData.paymentMethod || 'Tarjeta',
    };

    orders.unshift(newOrder);
    this.setOrders(orders);

    // Vaciar carrito
    this.setCart([]);

    // Enviar email de confirmación simulado
    if (userData.email) {
      await emailService.sendOrderConfirmation(userData.email, {
        orderId: newOrder.id,
        total: orderData.total,
        items: orderData.items || [],
      });
    }

    // Crear notificación
    this.addNotification({
      userId: userData.id || 0,
      title: '¡Pedido creado!',
      message: `Tu pedido #${newOrder.id} ha sido registrado por S/ ${orderData.total?.toLocaleString('es-PE', {minimumFractionDigits: 2})}`,
      type: 'order',
      icon: 'ShoppingCart',
    });

    return newOrder;
  }

  async getMyOrders(filters = {}) {
    await this.delay(600);
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    let orders = this.getOrders();

    // Filtrar por email del usuario actual
    orders = orders.filter(o => o.customerEmail === userData.email);

    if (filters.status && filters.status !== 'all') {
      orders = orders.filter(o => o.status === filters.status);
    }

    return orders;
  }

  async getAllOrders(filters = {}) {
    await this.delay(600);
    let orders = this.getOrders();

    if (filters.status && filters.status !== 'all') {
      orders = orders.filter(o => o.status === filters.status);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      orders = orders.filter(o => 
        o.id.toLowerCase().includes(search) || 
        o.customer.toLowerCase().includes(search)
      );
    }

    return orders;
  }

  async updateOrderStatus(orderId, newStatus) {
    await this.delay(500);
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado');

    if (order.status === 'completed') {
      throw new Error('No se puede modificar un pedido completado');
    }

    order.status = newStatus;
    if (newStatus === 'shipped') {
      order.tracking = `TRK${Date.now().toString().slice(-9)}PE`;
      
      // Enviar email de envío
      await emailService.sendShippingNotification(order.customerEmail, orderId, order.tracking);
    }

    this.setOrders(orders);
    return order;
  }

  // =============================================
  // PAGOS
  // =============================================

  async processPayment(paymentData) {
    await this.delay(2000);

    // Simular procesamiento exitoso
    const transactionId = `TXN-${Date.now()}`;
    
    // Confirmar pago
    await emailService.sendPaymentConfirmation(paymentData.billingEmail || 'cliente@email.com', {
      amount: paymentData.amount,
      method: paymentData.method,
      transactionId,
    });

    return {
      success: true,
      transactionId,
      message: 'Pago procesado exitosamente',
    };
  }

  async confirmPayment(paymentId) {
    await this.delay(500);
    return { success: true, paymentId, status: 'confirmed' };
  }

  async getPaymentMethodsList() {
    await this.delay(400);
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    const methods = this.getPaymentMethods();
    return methods.filter(m => m.userId === userData.id);
  }

  async savePaymentMethod(methodData) {
    await this.delay(500);
    const methods = this.getPaymentMethods();
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    
    const newMethod = {
      id: Date.now(),
      userId: userData.id,
      ...methodData,
    };
    
    methods.push(newMethod);
    this.setPaymentMethods(methods);
    return newMethod;
  }

  async deletePaymentMethod(methodId) {
    await this.delay(400);
    const methods = this.getPaymentMethods();
    const filtered = methods.filter(m => m.id !== methodId);
    this.setPaymentMethods(filtered);
    return { message: 'Método de pago eliminado' };
  }

  // =============================================
  // NOTIFICACIONES
  // =============================================

  async getNotificationsList(filters = {}) {
    await this.delay(400);
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    let notifications = this.getNotifications();

    // Filtrar por usuario
    if (userData.role !== 'ADMIN') {
      notifications = notifications.filter(n => n.userId === userData.id || !n.userId);
    }

    if (filters.type && filters.type !== 'all') {
      notifications = notifications.filter(n => n.type === filters.type);
    }
    if (filters.read === 'unread') {
      notifications = notifications.filter(n => !n.read);
    }

    return notifications.sort((a, b) => b.id - a.id);
  }

  addNotification(notifData) {
    const notifications = this.getNotifications();
    notifications.push({
      id: Date.now(),
      ...notifData,
      time: 'Ahora',
      read: false,
    });
    this.setNotifications(notifications);
  }

  async markAsRead(notificationId) {
    await this.delay(200);
    const notifications = this.getNotifications();
    const notif = notifications.find(n => n.id === notificationId);
    if (notif) notif.read = true;
    this.setNotifications(notifications);
    return notif;
  }

  async markAllAsRead() {
    await this.delay(300);
    const notifications = this.getNotifications();
    notifications.forEach(n => n.read = true);
    this.setNotifications(notifications);
    return notifications;
  }

  async deleteNotification(notificationId) {
    await this.delay(200);
    const notifications = this.getNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    this.setNotifications(filtered);
    return { message: 'Notificación eliminada' };
  }

  // =============================================
  // ESTADÍSTICAS (ADMIN)
  // =============================================

  async getDashboardStats() {
    await this.delay(600);
    const products = this.getProducts();
    const orders = this.getOrders();
    const usersDb = JSON.parse(localStorage.getItem('mock_users_db') || '{}');

    const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = Object.keys(usersDb).length;
    const lowStockProducts = products.filter(p => p.stock < 5).length;
    const pendingRefunds = orders.filter(o => o.status === 'refunded' || o.status === 'pending').length;

    return {
      totalSales,
      totalOrders,
      totalProducts,
      totalUsers,
      monthlyGrowth: 12.5,
      lowStockProducts,
      pendingRefunds,
    };
  }

  async getCategories() {
    await this.delay(300);
    const products = this.getProducts();
    const categories = [...new Set(products.map(p => p.category))];
    return categories.map(cat => ({
      name: cat,
      count: products.filter(p => p.category === cat).length,
    }));
  }
}

const apiService = new ApiService();
export default apiService;