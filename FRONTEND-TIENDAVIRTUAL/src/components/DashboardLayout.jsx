// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, TrendingUp,
  Settings, Plus, Edit, Trash2, Eye, Download, Upload, Filter,
  RefreshCw, DollarSign, AlertTriangle, ChevronRight, BarChart3,
  PieChart, CheckCircle, XCircle, Search, Bell, Menu, X,
  ShoppingBag, Heart, Star, Award, Truck, CreditCard,
  LogOut, User, MapPin, MessageSquare, Cpu, Sparkles,
  Grid, List, SlidersHorizontal, ArrowUpDown, Tag
} from 'lucide-react';
import authService from '../services/authService';

export const FileText = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const DashboardLayout = ({ children, user, role, activeTab, onTabChange }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications] = useState([
    { id: 1, type: 'success', icon: CheckCircle, title: 'Pedido completado', message: 'Tu pedido #ORD-101 ha sido entregado exitosamente', time: 'Hace 5 min', read: false },
    { id: 2, type: 'warning', icon: AlertTriangle, title: 'Stock bajo', message: 'El producto "Tablet Air M2" está por agotarse', time: 'Hace 1 hora', read: false },
    { id: 3, type: 'info', icon: Truck, title: 'Envío en camino', message: 'Tu pedido #ORD-102 está en ruta de entrega', time: 'Hace 3 horas', read: true },
    { id: 4, type: 'success', icon: Award, title: '¡Nivel Gold!', message: 'Has alcanzado el nivel Gold con 1000 puntos', time: 'Hace 1 día', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notification-area')) setShowNotifications(false);
      if (!e.target.closest('.user-area')) setShowUserMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getNavigationItems = () => {
    if (!role) return [];
    
    switch (role) {
      case 'ADMIN':
        return [
          { 
            section: 'Principal',
            items: [
              { id: 'overview', icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
              { id: 'analytics', icon: TrendingUp, label: 'Analíticas', path: '/admin/dashboard?tab=analytics' }
            ]
          },
          {
            section: 'Gestión',
            items: [
              { id: 'products', icon: Package, label: 'Productos', path: '/admin/dashboard?tab=products' },
              { id: 'orders', icon: ShoppingCart, label: 'Pedidos', path: '/admin/dashboard?tab=orders' },
              { id: 'users', icon: Users, label: 'Usuarios', path: '/admin/dashboard?tab=users' }
            ]
          },
          {
            section: 'Finanzas',
            items: [
              { id: 'refunds', icon: CreditCard, label: 'Reembolsos', path: '/admin/dashboard?tab=refunds' },
              { id: 'reports', icon: FileText, label: 'Reportes', path: '/admin/dashboard?tab=reports' }
            ]
          },
          {
            section: 'Configuración',
            items: [
              { id: 'settings', icon: Settings, label: 'Ajustes', path: '/admin/dashboard?tab=settings' }
            ]
          }
        ];
      case 'USER':
        return [
          {
            section: 'Mi Cuenta',
            items: [
              { id: 'overview', icon: LayoutDashboard, label: 'Panel Principal', path: '/dashboard' },
              { id: 'orders', icon: ShoppingBag, label: 'Mis Pedidos', path: '/pedidos' }
            ]
          },
          {
            section: 'Compras',
            items: [
              { id: 'wishlist', icon: Heart, label: 'Lista de Deseos', path: '/dashboard?tab=wishlist' },
              { id: 'cart', icon: ShoppingCart, label: 'Carrito', path: '/carrito' },
              { id: 'payment', icon: CreditCard, label: 'Pagos', path: '/pagos' }
            ]
          },
          {
            section: 'Personal',
            items: [
              { id: 'profile', icon: User, label: 'Mi Perfil', path: '/dashboard?tab=profile' },
              { id: 'addresses', icon: MapPin, label: 'Direcciones', path: '/dashboard?tab=addresses' },
              { id: 'reviews', icon: MessageSquare, label: 'Mis Reseñas', path: '/dashboard?tab=reviews' }
            ]
          }
        ];
      case 'GUEST':
        return [
          {
            section: 'Explorar',
            items: [
              { id: 'catalog', icon: Grid, label: 'Catálogo', path: '/catalogo' },
              { id: 'categories', icon: SlidersHorizontal, label: 'Categorías', path: '/catalogo?tab=categories' }
            ]
          },
          {
            section: 'Ofertas',
            items: [
              { id: 'offers', icon: Tag, label: 'Ofertas', path: '/catalogo?tab=offers' },
              { id: 'cart', icon: ShoppingCart, label: 'Carrito', path: '/carrito' }
            ]
          },
          {
            section: 'Cuenta',
            items: [
              { id: 'register', icon: User, label: 'Crear Cuenta', path: '/register' },
              { id: 'login', icon: LogOut, label: 'Iniciar Sesión', path: '/login' }
            ]
          }
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigationItems();
  const currentPath = location.pathname;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleNavClick = (item) => (e) => {
    e.preventDefault();
    navigate(item.path);
    setMobileMenuOpen(false);
  };

  const displayUser = user || authService.getUserData();
  const displayRole = role || authService.getUserRole();

  return (
    <div className={`flex min-h-screen bg-base-primary ${mobileMenuOpen ? 'overflow-hidden' : ''}`}>
      {/* Sidebar Backdrop Mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50
        bg-base-secondary border-r border-border-color
        flex flex-col transition-all duration-300
        ${sidebarCollapsed && !mobileMenuOpen ? 'w-[72px]' : 'w-[260px]'}
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-border-color min-h-[72px]">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate(role === 'ADMIN' ? '/admin/dashboard' : '/catalogo')}>
            <Cpu size={28} className="text-primary flex-shrink-0" />
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <span className="text-2xl font-extrabold text-text-base whitespace-nowrap">
                Tech<span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Store</span>
              </span>
            )}
          </div>
          <button 
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg border border-border-color text-text-muted hover:bg-base-hover hover:text-text-base transition-colors"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <ChevronRight size={18} className={`transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {navigation.map((section, idx) => (
            <div key={idx}>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <h3 className="px-3 py-2 text-[0.7rem] font-bold uppercase tracking-widest text-text-muted">
                  {section.section}
                </h3>
              )}
              {section.items.map(item => {
                const isActive = activeTab === item.id || currentPath === item.path;
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={handleNavClick(item)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1
                      text-text-secondary font-medium
                      hover:bg-base-hover hover:text-text-base
                      transition-all duration-200
                      ${isActive ? 'bg-primary/10 text-primary font-semibold' : ''}
                      ${(sidebarCollapsed && !mobileMenuOpen) ? 'justify-center px-2' : ''}
                    `}
                    title={(sidebarCollapsed && !mobileMenuOpen) ? item.label : undefined}
                  >
                    <item.icon size={20} />
                    {(!sidebarCollapsed || mobileMenuOpen) && <span>{item.label}</span>}
                    {isActive && (!sidebarCollapsed || mobileMenuOpen) && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer - Logout */}
        {displayRole && displayRole !== 'GUEST' && (
          <div className="p-3 border-t border-border-color">
            <button 
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut size={20} />
              {(!sidebarCollapsed || mobileMenuOpen) && <span>Cerrar Sesión</span>}
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-[72px] px-6 bg-base-secondary border-b border-border-color gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border-color text-text-secondary hover:bg-base-hover"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h2 className="text-xl font-semibold text-text-base">
                {displayRole === 'ADMIN' ? 'Panel de Administración' : 
                 displayRole === 'USER' ? 'Mi Cuenta' : 'TechStore'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                className="w-[300px] pl-10 pr-4 py-2 bg-base-primary border border-border-color rounded-full text-sm text-text-base placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Notifications */}
            {displayRole && displayRole !== 'GUEST' && (
              <div className="notification-area relative">
                <button 
                  className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-border-color text-text-secondary hover:bg-base-hover transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-danger text-white text-[0.65rem] font-bold rounded-full border-2 border-base-secondary px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-base-secondary border border-border-color rounded-xl shadow-2xl z-50 animate-dropdown-in overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border-color">
                      <h4 className="font-semibold text-text-base">Notificaciones</h4>
                      <button className="text-sm text-primary hover:text-primary-light">Marcar todas</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`flex gap-3 p-4 hover:bg-base-hover cursor-pointer border-b border-border-light ${!notif.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notif.type === 'success' ? 'bg-success/10 text-success' :
                            notif.type === 'warning' ? 'bg-warning/10 text-warning' :
                            'bg-info/10 text-info'
                          }`}>
                            <notif.icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-base">{notif.title}</p>
                            <p className="text-xs text-text-secondary truncate">{notif.message}</p>
                            <span className="text-[0.7rem] text-text-muted">{notif.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {displayRole && displayRole !== 'GUEST' && displayUser && (
              <div className="user-area relative">
                <button 
                  className="flex items-center gap-2 p-1.5 rounded-full border border-border-color hover:bg-base-hover transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-white font-semibold text-sm">
                    {displayUser.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-base-secondary border border-border-color rounded-xl shadow-2xl z-50 animate-dropdown-in overflow-hidden">
                    <div className="p-4 border-b border-border-color">
                      <p className="font-semibold text-text-base">{displayUser.fullName}</p>
                      <p className="text-sm text-text-muted">{displayUser.email}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-text-secondary hover:bg-base-hover hover:text-text-base transition-colors"
                        onClick={() => { navigate('/notificaciones'); setShowUserMenu(false); }}
                      >
                        <Bell size={16} /> Notificaciones
                      </button>
                      <button 
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons for Guest */}
            {displayRole === 'GUEST' && (
              <div className="flex items-center gap-2">
                <button 
                  className="btn-secondary text-sm"
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </button>
                <button 
                  className="btn-primary text-sm"
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;