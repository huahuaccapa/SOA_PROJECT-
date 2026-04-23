import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle, XCircle, Cpu 
} from 'lucide-react';
import '../login.css'; // Importación del CSS

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    role: 'USER'
  });
  const [passwordStrength, setPasswordStrength] = useState({ 
    score: 0, 
    message: '', 
    color: '' 
  });
  const [error, setError] = useState('');

  const checkPasswordStrength = useCallback((password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
    if (password.match(/\d/)) score++;
    if (password.match(/[^a-zA-Z\d]/)) score++;

    const messages = ['', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    const colors = ['', '#ef4444', '#f59e0b', '#10b981', '#059669'];
    
    setPasswordStrength({ 
      score, 
      message: messages[score] || '', 
      color: colors[score] || '' 
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordStrength.score < 2) {
      setError('La contraseña es demasiado débil');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular POST a /api/auth/register (Servicio de Autenticación SOA)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Registro exitoso
      navigate('/login', { 
        state: { 
          message: 'Registro exitoso. Por favor inicia sesión.',
          email: formData.email 
        } 
      });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al registrar. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = useCallback(() => {
    // Registro con Google OAuth 2.0
    const state = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_action', 'register');
    
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID || '');
    googleAuthUrl.searchParams.append('redirect_uri', `${window.location.origin}/auth/callback`);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'email profile openid');
    googleAuthUrl.searchParams.append('state', state);
    googleAuthUrl.searchParams.append('prompt', 'select_account');
    
    window.location.assign(googleAuthUrl.toString());
  }, []);

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

      <div className="relative z-10 w-full max-w-[480px] bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-indigo-500/20 animate-slide-up">
        
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
          <p className="text-gray-400 text-sm">
            Únete a la revolución tecnológica
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre completo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
              Nombre completo
            </label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-4 text-gray-500" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
                className="w-full py-3 pl-12 pr-4 bg-slate-900/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
              Correo electrónico
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-4 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full py-3 pl-12 pr-4 bg-slate-900/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full py-3 pl-12 pr-12 bg-slate-900/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                className="absolute right-4 text-gray-500 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-1.5">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300"
                    style={{ 
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: passwordStrength.color 
                    }}
                  ></div>
                </div>
                <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                  {passwordStrength.message}
                </span>
              </div>
            )}
          </div>

          {/* Confirmar Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
              Confirmar contraseña
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-4 text-gray-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full py-3 pl-12 pr-12 bg-slate-900/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                className="absolute right-4 text-gray-500 hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="flex items-center gap-1.5 mt-1">
                {formData.password === formData.confirmPassword ? (
                  <span className="text-green-400 text-xs flex items-center gap-1">
                    <CheckCircle size={12} /> Las contraseñas coinciden
                  </span>
                ) : (
                  <span className="text-red-400 text-xs flex items-center gap-1">
                    <XCircle size={12} /> Las contraseñas no coinciden
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Selector de Rol */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
              Tipo de cuenta
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full py-3 px-4 bg-slate-900/80 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-400 cursor-pointer"
            >
              <option value="USER">Usuario</option>
              <option value="SELLER">Vendedor</option>
            </select>
            <p className="text-gray-500 text-xs">
              * Las cuentas de Administrador son asignadas por el sistema
            </p>
          </div>

          {/* Términos y condiciones */}
          <div className="mt-2">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
                className="sr-only peer"
              />
              <div className="w-5 h-5 bg-slate-900/80 border border-white/10 rounded-md mr-2.5 mt-0.5 transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-400 peer-checked:to-purple-600 peer-checked:border-transparent relative peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:left-1.5 peer-checked:after:top-0.5 peer-checked:after:w-1.5 peer-checked:after:h-2.5 peer-checked:after:border-white peer-checked:after:border-r-2 peer-checked:after:border-b-2 peer-checked:after:rotate-45"></div>
              <span className="text-gray-400 text-sm">
                Acepto los{' '}
                <a href="#" className="text-indigo-400 hover:underline">Términos</a>
                {' '}y la{' '}
                <a href="#" className="text-indigo-400 hover:underline">Política de Privacidad</a>
              </span>
            </label>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Botón submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl text-white text-base font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-70 relative overflow-hidden group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Crear Cuenta</span>
                <UserPlus size={18} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </>
            )}
          </button>

          {/* Separador */}
          <div className="relative text-center my-2">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10"></div>
            <span className="relative bg-slate-800/95 px-3 text-gray-500 text-xs uppercase">
              o regístrate con
            </span>
          </div>

          {/* Botón Google */}
          <button 
            type="button" 
            onClick={handleGoogleRegister}
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

          {/* Login link */}
          <p className="text-center text-gray-500 text-sm mt-2">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-purple-400 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;