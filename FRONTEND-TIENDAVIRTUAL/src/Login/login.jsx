//src\Login\login.jsx
import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, Cpu, Sparkles 
} from 'lucide-react';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Usuarios de prueba para demostración
  const MOCK_USERS = {
    'admin@techstore.com': {
      password: 'admin123',
      user: {
        id: 1,
        email: 'admin@techstore.com',
        fullName: 'Administrador TechStore',
        role: 'ADMIN'
      }
    },
    'usuario@techstore.com': {
      password: 'user123',
      user: {
        id: 2,
        email: 'usuario@techstore.com',
        fullName: 'Usuario TechStore',
        role: 'USER'
      }
    },
    'maria@email.com': {
      password: 'maria123',
      user: {
        id: 3,
        email: 'maria@email.com',
        fullName: 'María García',
        role: 'USER'
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular llamada al Servicio de Autenticación (SOA)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verificar credenciales contra usuarios mock
      const mockUser = MOCK_USERS[formData.email.toLowerCase()];
      
      if (!mockUser || mockUser.password !== formData.password) {
        throw new Error('Credenciales inválidas');
      }
      
      const mockResponse = {
        token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: mockUser.user
      };
      
      // Almacenar JWT en localStorage (stateless)
      localStorage.setItem('jwt_token', mockResponse.token);
      localStorage.setItem('user_data', JSON.stringify(mockResponse.user));
      localStorage.setItem('user_role', mockResponse.user.role);
      
      // Limpiar cualquier estado de invitado
      sessionStorage.removeItem('is_guest');
      
      // Redirigir según rol específico
      switch (mockResponse.user.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'USER':
          navigate('/dashboard');
          break;
        default:
          navigate('/catalogo');
      }
    } catch (err) {
      setError('Credenciales inválidas. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomState = useCallback(() => {
    return Math.random().toString(36).substring(2, 15) + 
           Date.now().toString(36);
  }, []);

  const handleGoogleLogin = useCallback(() => {
    // Implementación OAuth 2.0 con Google
    const state = generateRandomState();
    sessionStorage.setItem('oauth_state', state);
    
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID || '');
    googleAuthUrl.searchParams.append('redirect_uri', `${window.location.origin}/auth/callback`);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'email profile openid');
    googleAuthUrl.searchParams.append('state', state);
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');
    
    window.location.assign(googleAuthUrl.toString());
  }, [generateRandomState]);

  const handleGuestAccess = useCallback(() => {
    // Acceso como Invitado (Guest) - SIN autenticación
    localStorage.setItem('user_role', 'GUEST');
    sessionStorage.setItem('is_guest', 'true');
    
    // Limpiar datos de usuario autenticado
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    
    navigate('/catalogo');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[#0f141e] relative overflow-hidden font-sans">
      {/* Fondos decorativos */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-indigo-400 to-purple-600 -top-48 -left-24 animate-float"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-pink-300 to-rose-500 -bottom-36 -right-12 animate-float-delayed"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-30 bg-gradient-to-br from-cyan-400 to-blue-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-slow"></div>
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Tarjeta de Login */}
      <div className="relative z-10 w-full max-w-[440px] bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-indigo-500/20 animate-slide-up">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Cpu size={28} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Tech<span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Store</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm flex items-center justify-center gap-1.5">
            Bienvenido de vuelta a la innovación
            <Sparkles size={16} className="text-amber-400" />
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Campo Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-400 text-xs font-medium uppercase tracking-wide">
              Correo electrónico
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-4 text-gray-500 pointer-events-none transition-colors" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className={`w-full py-3.5 pl-12 pr-4 bg-slate-900/80 border rounded-xl text-white text-sm outline-none transition-all
                  ${error ? 'border-red-400' : 'border-white/10'} 
                  focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10`}
              />
            </div>
          </div>

          {/* Campo Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-400 text-xs font-medium uppercase tracking-wide">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-4 text-gray-500 pointer-events-none transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={`w-full py-3.5 pl-12 pr-12 bg-slate-900/80 border rounded-xl text-white text-sm outline-none transition-all
                  ${error ? 'border-red-400' : 'border-white/10'} 
                  focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10`}
              />
              <button
                type="button"
                className="absolute right-4 text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Opciones adicionales */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-5 h-5 bg-slate-900/80 border border-white/10 rounded-md mr-2.5 transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-400 peer-checked:to-purple-600 peer-checked:border-transparent relative peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:left-1.5 peer-checked:after:top-0.5 peer-checked:after:w-1.5 peer-checked:after:h-2.5 peer-checked:after:border-white peer-checked:after:border-r-2 peer-checked:after:border-b-2 peer-checked:after:rotate-45"></div>
              <span className="text-gray-400 text-sm">Recordarme</span>
            </label>
            
            <Link to="/forgot-password" className="text-indigo-400 text-sm font-medium hover:text-purple-400 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón de submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl text-white text-base font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <LogIn size={18} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </>
            )}
          </button>

          {/* Separador */}
          <div className="relative text-center my-2">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10"></div>
            <span className="relative bg-slate-800/95 px-3 text-gray-500 text-xs uppercase">
              o continúa con
            </span>
          </div>

          {/* Botón Google OAuth 2.0 */}
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-white border border-white/10 rounded-xl text-gray-800 text-sm font-medium flex items-center justify-center gap-2.5 transition-all hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continuar con Google</span>
          </button>

          {/* Registro - Con roles */}
          <p className="text-center text-gray-500 text-sm mt-4">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:text-purple-400 transition-colors">
              Regístrate gratis
            </Link>
          </p>

          {/* Acceso como Invitado (Guest) */}
          <div className="text-center pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleGuestAccess}
              className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
            >
              Continuar como Invitado
            </button>
          </div>

          {/* Info de usuarios de prueba */}
          <div className="text-center pt-2 border-t border-white/10">
            <p className="text-gray-600 text-xs">
              <span className="font-medium text-gray-500">Usuarios de prueba:</span><br/>
              <span className="text-indigo-400/70">admin@techstore.com</span> / <span className="text-gray-500">admin123</span> → <span className="text-purple-400/70">ADMIN</span><br/>
              <span className="text-indigo-400/70">usuario@techstore.com</span> / <span className="text-gray-500">user123</span> → <span className="text-cyan-400/70">USUARIO</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;