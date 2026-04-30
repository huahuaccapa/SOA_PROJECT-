// src/Login/register/register.jsx
import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle, XCircle, Cpu } from 'lucide-react';

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

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Guardar usuario en localStorage
      const users = JSON.parse(localStorage.getItem('registered_users') || '{}');
      users[formData.email.toLowerCase()] = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('registered_users', JSON.stringify(users));
      
      navigate('/login', { 
        state: { 
          message: 'Registro exitoso. Por favor inicia sesión.',
          email: formData.email 
        } 
      });
    } catch (err) {
      setError('Error al registrar. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-base-primary relative overflow-hidden">
      {/* Fondos decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-indigo-400 to-purple-600 -top-48 -left-24 animate-float"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-pink-300 to-rose-500 -bottom-36 -right-12 animate-float-delayed"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-30 bg-gradient-to-br from-cyan-400 to-blue-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-slow"></div>
      </div>

      <div className="relative z-10 w-full max-w-[480px] bg-base-secondary/95 backdrop-blur-xl border border-border-color rounded-3xl p-10 shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Cpu size={28} />
            </div>
            <h1 className="text-3xl font-bold text-text-base">
              Tech<span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Store</span>
            </h1>
          </div>
          <p className="text-text-muted text-sm">
            Únete a la revolución tecnológica
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre completo */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-muted mb-1.5">
              Nombre completo
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
                className="w-full pl-12 pr-4 py-3 bg-base-primary border border-border-color rounded-xl text-text-base text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-muted mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full pl-12 pr-4 py-3 bg-base-primary border border-border-color rounded-xl text-text-base text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-muted mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full pl-12 pr-12 py-3 bg-base-primary border border-border-color rounded-xl text-text-base text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-base transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="h-1 bg-border-color rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: passwordStrength.color 
                    }}
                  ></div>
                </div>
                <span className="text-xs font-medium mt-1 block" style={{ color: passwordStrength.color }}>
                  {passwordStrength.message}
                </span>
              </div>
            )}
          </div>

          {/* Confirmar Password */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-muted mb-1.5">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-12 py-3 bg-base-primary border border-border-color rounded-xl text-text-base text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-base transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="flex items-center gap-1.5 mt-1">
                {formData.password === formData.confirmPassword ? (
                  <span className="text-success text-xs flex items-center gap-1">
                    <CheckCircle size={12} /> Las contraseñas coinciden
                  </span>
                ) : (
                  <span className="text-danger text-xs flex items-center gap-1">
                    <XCircle size={12} /> Las contraseñas no coinciden
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tipo de cuenta */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-muted mb-1.5">
              Tipo de cuenta
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full py-3 px-4 bg-base-primary border border-border-color rounded-xl text-text-base text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="USER">Usuario</option>
              <option value="SELLER">Vendedor</option>
            </select>
            <p className="text-text-muted text-xs mt-1">
              * Las cuentas de Administrador son asignadas por el sistema
            </p>
          </div>

          {/* Términos */}
          <div>
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
                className="sr-only peer"
              />
              <div className="w-5 h-5 bg-base-primary border border-border-color rounded mr-2.5 mt-0.5 transition-all peer-checked:bg-primary peer-checked:border-primary relative peer-checked:after:absolute peer-checked:after:left-1.5 peer-checked:after:top-0.5 peer-checked:after:w-1.5 peer-checked:after:h-2.5 peer-checked:after:border-white peer-checked:after:border-r-2 peer-checked:after:border-b-2 peer-checked:after:rotate-45"></div>
              <span className="text-text-muted text-sm">
                Acepto los{' '}
                <a href="#" className="text-primary hover:underline">Términos</a>
                {' '}y la{' '}
                <a href="#" className="text-primary hover:underline">Política de Privacidad</a>
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-70 relative overflow-hidden group"
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

          {/* Google */}
          <div className="relative text-center my-4">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border-color"></div>
            <span className="relative bg-base-secondary px-3 text-text-muted text-xs uppercase">
              o regístrate con
            </span>
          </div>

          <button 
            type="button"
            className="w-full py-3 bg-white border border-border-color rounded-xl text-gray-800 text-sm font-medium flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-all"
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
          <p className="text-center text-text-muted text-sm mt-4">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-light transition-colors">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;