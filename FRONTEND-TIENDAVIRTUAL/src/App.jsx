// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';

// Componentes de Autenticación
import Login from './Login/login';
import Register from './Login/register/register';
import ForgotPassword from './Login/forget password/forgetpassword';

// Dashboards
import DashboardAdmin from './dashboard/dashboardadmin';
import DashboardUsuario from './dashboard/dashboardusuario';
import DashboardInvitado from './dashboard/dashboardinvitado';

// Páginas
import Catalogo from './dashboard/catalogo/catalogo';
import Pedidos from './dashboard/pedidos/pedidos';
import Pagos from './dashboard/pagos/pagos';
import Notificaciones from './dashboard/notificaciones/notificaciones';
import Carrito from './dashboard/carrito/carrito';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Estilos
import './App.css';

// =============================================
// COMPONENTES DE RUTA PROTEGIDA
// =============================================

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwt_token');
  const isGuest = sessionStorage.getItem('is_guest') === 'true';
  
  if (!token && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('user_role');
  const isGuest = sessionStorage.getItem('is_guest') === 'true';
  const effectiveRole = isGuest ? 'GUEST' : userRole;

  if (!token && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(effectiveRole)) {
    if (effectiveRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (effectiveRole === 'USER') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/catalogo" replace />;
  }
  return children;
};

// =============================================
// LAYOUT WRAPPERS
// =============================================

const PageWithLayout = ({ children }) => {
  const userRole = localStorage.getItem('user_role');
  const isGuest = sessionStorage.getItem('is_guest') === 'true';
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const role = isGuest ? 'GUEST' : userRole;

  return (
    <DashboardLayout user={userData} role={role}>
      {children}
    </DashboardLayout>
  );
};

const AdminPageWithLayout = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  return (
    <DashboardLayout user={userData} role="ADMIN">
      {children}
    </DashboardLayout>
  );
};

// =============================================
// DASHBOARD ROUTERS
// =============================================

const UserDashboardRouter = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('user_active_tab') || 'overview';
  });
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  
  useEffect(() => {
    sessionStorage.setItem('user_active_tab', activeTab);
  }, [activeTab]);

  return (
    <DashboardLayout user={userData} role="USER" activeTab={activeTab} onTabChange={setActiveTab}>
      <DashboardUsuario user={userData} activeTab={activeTab} setActiveTab={setActiveTab} />
    </DashboardLayout>
  );
};

const AdminDashboardRouter = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('admin_active_tab') || 'overview';
  });
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  
  useEffect(() => {
    sessionStorage.setItem('admin_active_tab', activeTab);
  }, [activeTab]);

  return (
    <DashboardLayout user={userData} role="ADMIN" activeTab={activeTab} onTabChange={setActiveTab}>
      <DashboardAdmin user={userData} activeTab={activeTab} setActiveTab={setActiveTab} />
    </DashboardLayout>
  );
};

const GuestDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('guest_active_tab') || 'catalog';
  });

  useEffect(() => {
    sessionStorage.setItem('guest_active_tab', activeTab);
  }, [activeTab]);

  return (
    <DashboardLayout user={null} role="GUEST" activeTab={activeTab} onTabChange={setActiveTab}>
      <DashboardInvitado activeTab={activeTab} setActiveTab={setActiveTab} />
    </DashboardLayout>
  );
};

// =============================================
// COMPONENTE 404
// =============================================

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-base-primary">
    <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
    <h2 className="text-2xl font-semibold text-text-base mb-2">Página no encontrada</h2>
    <p className="text-text-muted mb-8">La página que buscas no existe o ha sido movida.</p>
    <a href="/catalogo" className="btn-primary">
      Ir al Catálogo
    </a>
  </div>
);

// =============================================
// COMPONENTE PRINCIPAL: App
// =============================================

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Rutas Públicas - Sin autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Catálogo público - Cualquiera puede ver */}
          <Route path="/catalogo" element={<GuestDashboard />} />
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          
          {/* Rutas para Usuarios Registrados */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboardRouter />
              </ProtectedRoute>
            } 
          />
          
          {/* Pedidos - Solo USER y ADMIN */}
          <Route 
            path="/pedidos" 
            element={
              <RoleBasedRoute allowedRoles={['USER', 'ADMIN']}>
                <PageWithLayout>
                  <Pedidos userRole={localStorage.getItem('user_role')} />
                </PageWithLayout>
              </RoleBasedRoute>
            } 
          />
          
          {/* Pagos - Solo USER y ADMIN */}
          <Route 
            path="/pagos" 
            element={
              <RoleBasedRoute allowedRoles={['USER', 'ADMIN']}>
                <PageWithLayout>
                  <Pagos userRole={localStorage.getItem('user_role')} />
                </PageWithLayout>
              </RoleBasedRoute>
            } 
          />
          
          {/* Carrito - USER y GUEST (pero con restricciones en el componente) */}
          <Route 
            path="/carrito" 
            element={
              <ProtectedRoute>
                <PageWithLayout>
                  <Carrito />
                </PageWithLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Notificaciones - Cualquier usuario autenticado */}
          <Route 
            path="/notificaciones" 
            element={
              <ProtectedRoute>
                <PageWithLayout>
                  <Notificaciones />
                </PageWithLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas exclusivas de Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardRouter />
              </RoleBasedRoute>
            } 
          />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;