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

// Componente FileText centralizado
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

  // Notificaciones de ejemplo en el header
  const [notifications] = useState([
    { id: 1, type: 'success', icon: CheckCircle, title: 'Pedido completado', message: 'Tu pedido #ORD-101 ha sido entregado exitosamente', time: 'Hace 5 min', read: false },
    { id: 2, type: 'warning', icon: AlertTriangle, title: 'Stock bajo', message: 'El producto "Tablet Air M2" está por agotarse', time: 'Hace 1 hora', read: false },
    { id: 3, type: 'info', icon: Truck, title: 'Envío en camino', message: 'Tu pedido #ORD-102 está en ruta de entrega', time: 'Hace 3 horas', read: true },
    { id: 4, type: 'success', icon: Award, title: '¡Nivel Gold!', message: 'Has alcanzado el nivel Gold con 1000 puntos', time: 'Hace 1 día', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Persistir estado del sidebar
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notification-area')) {
        setShowNotifications(false);
      }
      if (!e.target.closest('.user-area')) {
        setShowUserMenu(false);
      }
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
              { id: 'overview', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard?tab=overview' },
              { id: 'analytics', icon: TrendingUp, label: 'Analíticas', path: '/dashboard?tab=analytics' }
            ]
          },
          {
            section: 'Gestión',
            items: [
              { id: 'products', icon: Package, label: 'Productos', path: '/dashboard?tab=products' },
              { id: 'orders', icon: ShoppingCart, label: 'Pedidos', path: '/dashboard?tab=orders' },
              { id: 'users', icon: Users, label: 'Usuarios', path: '/dashboard?tab=users' }
            ]
          },
          {
            section: 'Finanzas',
            items: [
              { id: 'refunds', icon: CreditCard, label: 'Reembolsos', path: '/dashboard?tab=refunds' },
              { id: 'reports', icon: FileText, label: 'Reportes', path: '/dashboard?tab=reports' }
            ]
          },
          {
            section: 'Configuración',
            items: [
              { id: 'settings', icon: Settings, label: 'Ajustes', path: '/dashboard?tab=settings' }
            ]
          }
        ];
      case 'USER':
        return [
          {
            section: 'Mi Cuenta',
            items: [
              { id: 'overview', icon: LayoutDashboard, label: 'Panel Principal', path: '/dashboard?tab=overview' },
              { id: 'orders', icon: ShoppingBag, label: 'Mis Pedidos', path: '/dashboard?tab=orders' }
            ]
          },
          {
            section: 'Compras',
            items: [
              { id: 'wishlist', icon: Heart, label: 'Lista de Deseos', path: '/dashboard?tab=wishlist' },
              { id: 'cart', icon: ShoppingCart, label: 'Carrito', path: '/carrito' },
              { id: 'payment', icon: CreditCard, label: 'Métodos de Pago', path: '/dashboard?tab=payment' }
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
              { id: 'categories', icon: SlidersHorizontal, label: 'Categorías', path: '/dashboard?tab=categories' }
            ]
          },
          {
            section: 'Ofertas',
            items: [
              { id: 'offers', icon: Tag, label: 'Ofertas Especiales', path: '/dashboard?tab=offers' },
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
    if (item.path.includes('?tab=')) {
      const tab = new URLSearchParams(item.path.split('?')[1]).get('tab');
      if (onTabChange) {
        onTabChange(tab);
      }
      navigate('/dashboard');
    } else {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
  };

  const displayUser = user || authService.getUserData();
  const displayRole = role || authService.getUserRole();

  return (
    <div className={`dashboard-wrapper ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div 
        className="sidebar-backdrop" 
        onClick={() => setMobileMenuOpen(false)}
      />
      
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <div className="brand-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
              <Cpu className="brand-icon" size={28} />
              {!sidebarCollapsed && (
                <span className="brand-text">
                  Tech<span className="text-primary">Store</span>
                </span>
              )}
            </div>
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              <ChevronRight size={18} style={{ transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }} />
            </button>
          </div>

          <nav className="sidebar-nav">
            {navigation.map((section, idx) => (
              <div key={idx} className="nav-section">
                {!sidebarCollapsed && (
                  <h3 className="nav-section-title">{section.section}</h3>
                )}
                {section.items.map(item => {
                  const isActive = (activeTab === item.id) || 
                    (currentPath === item.path && !item.path.includes('?tab='));
                  
                  return (
                    <a
                      key={item.id}
                      href={item.path}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      onClick={handleNavClick(item)}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <item.icon size={20} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                      {isActive && !sidebarCollapsed && <div className="active-dot" />}
                    </a>
                  );
                })}
              </div>
            ))}
          </nav>

          {displayRole && displayRole !== 'GUEST' && (
            <div className="sidebar-footer">
              <button 
                className="nav-link logout-btn"
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <LogOut size={20} />
                {!sidebarCollapsed && <span>Cerrar Sesión</span>}
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="page-context">
              <h2 className="current-page">
                {displayRole === 'ADMIN' ? 'Panel de Administración' : 
                 displayRole === 'USER' ? 'Mi Cuenta' : 'TechStore'}
              </h2>
            </div>
          </div>

          <div className="header-right">
            <form className="header-search" onSubmit={handleSearch}>
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <button 
              className="icon-btn" 
              onClick={() => navigate('/catalogo')}
              title="Catálogo"
            >
              <Grid size={20} />
            </button>

            {displayRole !== 'ADMIN' && (
              <button 
                className="icon-btn" 
                onClick={() => navigate('/carrito')}
                title="Carrito"
              >
                <ShoppingCart size={20} />
              </button>
            )}

            {displayRole && displayRole !== 'GUEST' && (
              <div className="notification-area">
                <button 
                  className="icon-btn notification-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  title="Notificaciones"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </button>

                {showNotifications && (
                  <div className="dropdown notification-dropdown" onClick={e => e.stopPropagation()}>
                    <div className="dropdown-header">
                      <h4>Notificaciones</h4>
                      <button className="text-btn">Marcar todas leídas</button>
                    </div>
                    <div className="notification-list">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`notification-item ${notif.read ? '' : 'unread'}`}>
                          <div className={`notif-icon ${notif.type}`}>
                            <notif.icon size={16} />
                          </div>
                          <div className="notif-content">
                            <p className="notif-title">{notif.title}</p>
                            <p className="notif-text">{notif.message}</p>
                            <span className="notif-time">{notif.time}</span>
                          </div>
                          {!notif.read && <div className="unread-indicator" />}
                        </div>
                      ))}
                    </div>
                    <div className="dropdown-footer">
                      <button className="text-btn" onClick={() => navigate('/notificaciones')}>
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {displayRole && displayRole !== 'GUEST' && displayUser && (
              <div className="user-area">
                <button 
                  className="user-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                >
                  <div className="avatar">
                    {displayUser.avatar ? (
                      <img src={displayUser.avatar} alt={displayUser.fullName || 'Usuario'} />
                    ) : (
                      <span className="avatar-text">
                        {displayUser.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{displayUser.fullName || 'Usuario'}</span>
                    <span className="user-role">{displayRole}</span>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="dropdown user-dropdown" onClick={e => e.stopPropagation()}>
                    <div className="dropdown-header">
                      <div className="avatar large">
                        {displayUser.avatar ? (
                          <img src={displayUser.avatar} alt={displayUser.fullName || 'Usuario'} />
                        ) : (
                          <span className="avatar-text">
                            {displayUser.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="user-name">{displayUser.fullName || 'Usuario'}</p>
                        <p className="user-email">{displayUser.email || 'usuario@email.com'}</p>
                      </div>
                    </div>
                    <div className="dropdown-body">
                      <button onClick={() => { if(onTabChange) onTabChange('profile'); setShowUserMenu(false); }}>
                        <User size={16} /> Mi Perfil
                      </button>
                      {displayRole === 'ADMIN' && (
                        <button onClick={() => { if(onTabChange) onTabChange('settings'); setShowUserMenu(false); }}>
                          <Settings size={16} /> Configuración
                        </button>
                      )}
                      <button onClick={() => { navigate('/notificaciones'); setShowUserMenu(false); }}>
                        <Bell size={16} /> Notificaciones
                      </button>
                    </div>
                    <div className="dropdown-footer">
                      <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={16} /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {displayRole === 'GUEST' && (
              <div className="auth-buttons">
                <button className="btn btn-outline" onClick={() => navigate('/login')}>
                  Iniciar Sesión
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/register')}>
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;