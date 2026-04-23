import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, Cpu, Shield } from 'lucide-react';
import '../login.css'; // Importación del CSS

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
      // Simular POST a /api/auth/forgot-password (Servicio de Notificaciones SOA)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al enviar el correo. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(() => {
    setIsSubmitted(false);
    // Disparar reenvío automáticamente
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  }, [email]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 bg-[#0f141e] relative overflow-hidden font-sans">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-indigo-400 to-purple-600 -top-48 -left-24 animate-float"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-pink-300 to-rose-500 -bottom-36 -right-12 animate-float-delayed"></div>
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-[440px] bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-indigo-500/20 text-center animate-slide-up">
          <div className="text-green-400 mb-6 filter drop-shadow-[0_0_30px_rgba(72,187,120,0.4)] animate-pulse">
            <CheckCircle size={48} className="mx-auto" />
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-3">¡Correo enviado!</h2>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Hemos enviado las instrucciones para restablecer tu contraseña a{' '}
            <strong className="text-white">{email}</strong>
          </p>

          <div className="bg-indigo-500/10 rounded-xl p-5 mb-6 text-left">
            <h4 className="text-white text-sm font-medium mb-3">¿No encuentras el correo?</h4>
            <ul className="list-none space-y-1.5">
              <li className="text-gray-400 text-xs pl-6 relative before:content-['•'] before:text-indigo-400 before:absolute before:left-2 before:text-base">
                Revisa tu carpeta de spam o correo no deseado
              </li>
              <li className="text-gray-400 text-xs pl-6 relative before:content-['•'] before:text-indigo-400 before:absolute before:left-2 before:text-base">
                Asegúrate de que la dirección de correo sea correcta
              </li>
              <li className="text-gray-400 text-xs pl-6 relative before:content-['•'] before:text-indigo-400 before:absolute before:left-2 before:text-base">
                El enlace expirará en 1 hora por seguridad
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleResend}
              className="w-full py-3.5 bg-transparent border border-white/10 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-white/5"
            >
              <Send size={16} />
              Reenviar correo
            </button>
            
            <Link to="/login" className="inline-flex items-center justify-center gap-2 text-indigo-400 text-sm font-medium py-3 transition-all hover:text-purple-400 hover:gap-3">
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[#0f141e] relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-indigo-400 to-purple-600 -top-48 -left-24 animate-float"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-50 bg-gradient-to-br from-pink-300 to-rose-500 -bottom-36 -right-12 animate-float-delayed"></div>
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-indigo-500/20 animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Cpu size={28} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Tech<span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Store</span>
            </h1>
          </div>
          
          <div className="mt-5">
            <Shield size={32} className="mx-auto text-indigo-400 mb-4 filter drop-shadow-[0_0_20px_rgba(102,126,234,0.4)]" />
            <h2 className="text-xl font-semibold text-white mb-2">Recuperar Contraseña</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              No te preocupes, nos pasa a todos. Ingresa tu correo electrónico 
              y te enviaremos las instrucciones.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-400 text-xs font-medium uppercase tracking-wide">
              Correo electrónico
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-4 text-gray-500" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className={`w-full py-3.5 pl-12 pr-4 bg-slate-900/80 border rounded-xl text-white text-sm outline-none transition-all
                  ${error ? 'border-red-400' : 'border-white/10'} 
                  focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10`}
              />
            </div>
            {error && <span className="text-red-400 text-xs">{error}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl text-white text-base font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-70 relative overflow-hidden group"
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
            <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-gray-300 transition-colors">
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>

          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-gray-500 text-xs">
              ¿Sigues teniendo problemas?{' '}
              <a href="#" className="text-indigo-400 font-medium hover:underline">Contacta a soporte</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;