// src/services/api.js
import emailService from './emailService';

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Laptop Pro X1', category: 'Laptops', price: 4999, stock: 15, status: 'active', sales: 45, rating: 4.8, description: 'Laptop de alto rendimiento', image: null, createdAt: '2024-01-15' },
  { id: 2, name: 'Smartphone Ultra S23', category: 'Smartphones', price: 3499, stock: 8, status: 'active', sales: 128, rating: 4.9, description: 'Smartphone con cámara de 200MP', image: null, createdAt: '2024-02-20' },
  { id: 3, name: 'Tablet Air M2', category: 'Tablets', price: 2899, stock: 3, status: 'low_stock', sales: 67, rating: 4.6, description: 'Tablet con chip M2', image: null, createdAt: '2024-03-10' },
  { id: 4, name: 'Smart Watch Pro S3', category: 'Wearables', price: 1299, stock: 22, status: 'active', sales: 89, rating: 4.5, description: 'Smartwatch con monitor de salud', image: null, createdAt: '2024-04-05' },
  { id: 5, name: 'Auriculares Noise Pro', category: 'Audio', price: 899, stock: 0, status: 'out_of_stock', sales: 156, rating: 4.7, description: 'Auriculares con cancelación de ruido', image: null, createdAt: '2024-01-28' },
  { id: 6, name: 'Monitor 4K UltraView', category: 'Monitores', price: 2499, stock: 12, status: 'active', sales: 34, rating: 4.4, description: 'Monitor 4K UHD 27 pulgadas', image: null, createdAt: '2024-05-15' },
  { id: 7, name: 'Teclado Mecánico RGB', category: 'Periféricos', price: 549, stock: 30, status: 'active', sales: 78, rating: 4.3, description: 'Teclado mecánico Cherry MX Red', image: null, createdAt: '2024-02-14' },
  { id: 8, name: 'Mouse Gaming Pro', category: 'Periféricos', price: 349, stock: 25, status: 'active', sales: 92, rating: 4.6, description: 'Mouse gaming 26000 DPI', image: null, createdAt: '2024-03-22' },
  { id: 9, name: 'Cámara Web 4K Stream', category: 'Periféricos', price: 749, stock: 18, status: 'active', sales: 23, rating: 4.2, description: 'Cámara web 4K 60fps', image: null, createdAt: '2024-06-01' },
  { id: 10, name: 'SSD Portátil 2TB', category: 'Almacenamiento', price: 649, stock: 40, status: 'active', sales: 56, rating: 4.7, description: 'SSD externo 2TB USB-C', image: null, createdAt: '2024-04-18' },
];

const INITIAL_ORDERS = [
  { id: 'ORD-001', customer: 'Juan Pérez', customerEmail: 'juan@email.com', date: '2024-10-15', total: 4999, status: 'delivered', items: 3, tracking: 'TRK123456PE', paymentMethod: 'Tarjeta Visa' },
  { id: 'ORD-002', customer: 'María García', customerEmail: 'maria@email.com', date: '2024-10-14', total: 899, status: 'processing', items: 1, tracking: null, paymentMethod: 'Yape' },
  { id: 'ORD-003', customer: 'Carlos Ruiz', customerEmail: 'carlos@email.com', date: '2024-10-14', total: 2899, status: 'shipped', items: 2, tracking: 'TRK987654PE', paymentMethod: 'Mastercard' },
  { id: 'ORD-004', customer: 'Ana López', customerEmail: 'ana@email.com', date: '2024-10-13', total: 1299, status: 'pending', items: 1, tracking: null, paymentMethod: 'PayPal' },
  { id: 'ORD-005', customer: 'Pedro Sánchez', customerEmail: 'pedro@email.com', date: '2024-10-12', total: 6498, status: 'cancelled', items: 2, tracking: null, paymentMethod: 'Visa' },
];

class ApiService {
  constructor() {
    this.initData();
  }

  initData() {
    if (!localStorage.getItem('mock_products')) {
      localStorage.setItem('mock_products', JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem('mock_orders')) {
      localStorage.setItem('mock_orders', JSON.stringify(INITIAL_ORDERS));
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

  getProducts() { return JSON.parse(localStorage.getItem('mock_products') || '[]'); }
  setProducts(data) { localStorage.setItem('mock_products', JSON.stringify(data)); }
  
  getOrders() { return JSON.parse(localStorage.getItem('mock_orders') || '[]'); }
  setOrders(data) { localStorage.setItem('mock_orders', JSON.stringify(data)); }
  
  getCart() { return JSON.parse(localStorage.getItem('mock_cart') || '[]'); }
  setCart(data) { localStorage.setItem('mock_cart', JSON.stringify(data)); }
  
  getPaymentMethods() { return JSON.parse(localStorage.getItem('mock_payment_methods') || '[]'); }
  setPaymentMethods(data) { localStorage.setItem('mock_payment_methods', JSON.stringify(data)); }

  delay(ms = 500) { return new Promise(resolve => setTimeout(resolve, ms)); }

  async getProducts(filters = {}) {
    await this.delay(300);
    let products = this.getProducts();

    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    if (filters.category && filters.category !== 'all') {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters.minPrice) products = products.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) products = products.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.sortBy === 'price-asc') products.sort((a, b) => a.price - b.price);
    if (filters.sortBy === 'price-desc') products.sort((a, b) => b.price - a.price);
    if (filters.sortBy === 'rating') products.sort((a, b) => b.rating - a.rating);

    return products;
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
    this.setProducts(products.filter(p => p.id !== productId));
    return { message: 'Producto eliminado exitosamente' };
  }

  async getAllOrders(filters = {}) {
    await this.delay(400);
    let orders = this.getOrders();
    if (filters.status && filters.status !== 'all') {
      orders = orders.filter(o => o.status === filters.status);
    }
    return orders;
  }

  async updateOrderStatus(orderId, newStatus) {
    await this.delay(500);
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado');

    order.status = newStatus;
    if (newStatus === 'shipped') {
      order.tracking = `TRK${Date.now().toString().slice(-9)}PE`;
      await emailService.sendShippingNotification(order.customerEmail, orderId, order.tracking);
    }

    this.setOrders(orders);
    return order;
  }

  async processPayment(paymentData) {
    await this.delay(2000);
    const transactionId = `TXN-${Date.now()}`;
    
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

  async getDashboardStats() {
    await this.delay(400);
    const products = this.getProducts();
    const orders = this.getOrders();

    return {
      totalSales: orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0),
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: 4,
      monthlyGrowth: 12.5,
      lowStockProducts: products.filter(p => p.stock < 5).length,
      pendingRefunds: orders.filter(o => o.status === 'pending').length,
    };
  }
}

const apiService = new ApiService();
export default apiService;