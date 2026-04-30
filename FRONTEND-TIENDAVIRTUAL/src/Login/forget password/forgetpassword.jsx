// src/Login/forget password/forgetpassword.jsx
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, Cpu, Shield } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError('Error al enviar el correo. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(() => {
    setIsSubmitted(false);
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  }, [email]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 bg-base-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-indigo-400 to-purple-600 -top-48 -left-24 animate-float"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-pink-300 to-rose-500 -bottom-36 -right-12 animate-float-delayed"></div>
        </div>

        <div className="relative z-10 w-full max-w-[440px] bg-base-secondary/95 backdrop-blur-xl border border-border-color rounded-3xl p-10 shadow-2xl text-center animate-slide-up">
          <div className="text-success mb-6">
            <CheckCircle size={48} className="mx-auto" />
          </div>
          
          <h2 className="text-2xl font-semibold text-text-base mb-3">¡Correo enviado!</h2>
          
          <p className="text-text-muted text-sm mb-6">
            Hemos enviado las instrucciones para restablecer tu contraseña a{' '}
            <strong className="text-text-base">{email}</strong>
          </p>

          <div className="bg-primary/5 rounded-xl p-5 mb-6 text-left">
            <h4 className="text-text-base text-sm font-medium mb-3">¿No encuentras el correo?</h4>
            <ul className="space-y-1.5">
              <li className="text-text-muted text-xs pl-6 relative before:content-['•'] before:text-primary before:absolute before:left-2">
                Revisa tu carpeta de spam o correo no deseado
              </li>
              <li className="text-text-muted text-xs pl-6 relative before:content-['•'] before:text-primary before:absolute before:left-2">
                Asegúrate de que la dirección de correo sea correcta
              </li>
              <li className="text-text-muted text-xs pl-6 relative before:content-['•'] before:text-primary before:absolute before:left-2">
                El enlace expirará en 1 hora por seguridad
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleResend}
              className="w-full py-3.5 bg-transparent border border-border-color rounded-xl text-text-base text-sm font-medium flex items-center justify-center gap-2 hover:bg-base-hover transition-all"
            >
              <Send size={16} />
              Reenviar correo
            </button>
            
            <Link to="/login" className="inline-flex items-center justify-center gap-2 text-primary text-sm font-medium py-3 hover:text-primary-light transition-colors">
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-base-primary relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-indigo-400 to-purple-600 -top-48 -left-24 animate-float"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-pink-300 to-rose-500 -bottom-36 -right-12 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-base-secondary/95 backdrop-blur-xl border border-border-color rounded-3xl p-10 shadow-2xl animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Cpu size={28} />
            </div>
            <h1 className="text-3xl font-bold text-text-base">
              Tech<span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Store</span>
            </h1>
          </div>
          
          <div className="mt-5">
            <Shield size={32} className="mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold text-text-base mb-2">Recuperar Contraseña</h2>
            <p className="text-text-muted text-sm">
              No te preocupes. Ingresa tu correo electrónico y te enviaremos las instrucciones.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-muted mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className={`w-full pl-12 pr-4 py-3.5 bg-base-primary border rounded-xl text-text-base text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${
                  error ? 'border-red-400' : 'border-border-color'
                }`}
              />
            </div>
            {error && <span className="text-red-400 text-xs mt-1 block">{error}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-70 relative overflow-hidden group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Enviar Instrucciones</span>
                <Send size={18} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </>
            )}
          </button>

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-text-base transition-colors">
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>

          <div className="text-center pt-4 border-t border-border-color">
            <p className="text-text-muted text-xs">
              ¿Sigues teniendo problemas?{' '}
              <a href="#" className="text-primary font-medium hover:underline">Contacta a soporte</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;