//src\App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de componentes de autenticación
import Login from './Login/login';
import Register from './Login/register/register';
import ForgotPassword from './Login/forget password/forgetpassword';

// Importación de dashboards
import DashboardAdmin from './dashboard/dashboardadmin';
import DashboardUsuario from './dashboard/dashboardusuario';
import DashboardInvitado from './dashboard/dashboardinvitado';

// Importación de páginas
import Catalogo from './dashboard/catalogo/catalogo';
import Pedidos from './dashboard/pedidos/pedidos';
import Pagos from './dashboard/pagos/pagos';
import Notificaciones from './dashboard/notificaciones/notificaciones';
import Carrito from './dashboard/carrito/carrito';

// Importación del layout
import DashboardLayout from './components/DashboardLayout';
import './dashboard/dashboard.css';

// Estilos
import './App.css';

// =============================================
// COMPONENTE: ProtectedRoute
// =============================================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwt_token');
  const isGuest = sessionStorage.getItem('is_guest') === 'true';
  
  if (!token && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// =============================================
// COMPONENTE: RoleBasedRoute
// =============================================
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('user_role');
  const isGuest = sessionStorage.getItem('is_guest') === 'true';
  
  if (!token && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  
  if (isGuest) {
    return allowedRoles.includes('GUEST') ? children : <Navigate to="/catalogo" replace />;
  }
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// =============================================
// COMPONENTE: DashboardRouter
// =============================================
const DashboardRouter = () => {
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('user_role');
  const isGuest = sessionStorage.getItem('is_guest') === 'true';
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('dashboard_active_tab') || 'overview';
  });

  useEffect(() => {
    sessionStorage.setItem('dashboard_active_tab', activeTab);
  }, [activeTab]);
  
  if (!token && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  
  const role = isGuest ? 'GUEST' : userRole;
  
  return (
    <DashboardLayout 
      user={userData} 
      role={role} 
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {isGuest ? (
        <DashboardInvitado 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      ) : userRole === 'ADMIN' ? (
        <DashboardAdmin 
          user={userData}
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      ) : (
        <DashboardUsuario 
          user={userData}
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      )}
    </DashboardLayout>
  );
};

// =============================================
// COMPONENTE: PageWithLayout
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

// =============================================
// COMPONENTE: NotFound
// =============================================
const NotFound = () => (
  <div className="access-denied">
    <h1>404 - Página no encontrada</h1>
    <p>La página que buscas no existe.</p>
    <a href="/catalogo" className="btn btn-primary">Ir al Catálogo</a>
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
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Dashboard principal */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          
          {/* Catálogo - Accesible para todos */}
          <Route 
            path="/catalogo" 
            element={
              <ProtectedRoute>
                <PageWithLayout>
                  <Catalogo />
                </PageWithLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Pedidos - Solo ADMIN y USER */}
          <Route 
            path="/pedidos" 
            element={
              <RoleBasedRoute allowedRoles={['ADMIN', 'USER']}>
                <PageWithLayout>
                  <Pedidos userRole={localStorage.getItem('user_role')} />
                </PageWithLayout>
              </RoleBasedRoute>
            } 
          />
          
          {/* Pagos - Solo ADMIN y USER */}
          <Route 
            path="/pagos" 
            element={
              <RoleBasedRoute allowedRoles={['ADMIN', 'USER']}>
                <PageWithLayout>
                  <Pagos userRole={localStorage.getItem('user_role')} />
                </PageWithLayout>
              </RoleBasedRoute>
            } 
          />
          
          {/* Notificaciones - Accesible para todos */}
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
          
          {/* Carrito - Solo USER y GUEST */}
          <Route 
            path="/carrito" 
            element={
              <RoleBasedRoute allowedRoles={['USER', 'GUEST']}>
                <PageWithLayout>
                  <Carrito />
                </PageWithLayout>
              </RoleBasedRoute>
            } 
          />
          
          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;