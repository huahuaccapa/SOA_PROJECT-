// src/services/authService.js

/**
 * Servicio de Autenticación Simulado
 * Maneja login, registro, Google OAuth, roles y sesiones
 */

// Usuarios de prueba con contraseñas (simulación de base de datos)
const MOCK_USERS_DB = {
  'admin@techstore.com': {
    id: 1,
    email: 'admin@techstore.com',
    password: 'admin123',
    fullName: 'Administrador TechStore',
    role: 'ADMIN',
    avatar: null,
    phone: '+51 999 888 777',
    createdAt: '2024-01-01',
  },
  'usuario@techstore.com': {
    id: 2,
    email: 'usuario@techstore.com',
    password: 'user123',
    fullName: 'Usuario Demo',
    role: 'USER',
    avatar: null,
    phone: '+51 987 654 321',
    createdAt: '2024-03-15',
  },
  'maria@email.com': {
    id: 3,
    email: 'maria@email.com',
    password: 'maria123',
    fullName: 'María García López',
    role: 'USER',
    avatar: null,
    phone: '+51 955 123 456',
    createdAt: '2024-06-20',
  },
  'carlos@email.com': {
    id: 4,
    email: 'carlos@email.com',
    password: 'carlos123',
    fullName: 'Carlos Ruiz Mendoza',
    role: 'USER',
    avatar: null,
    phone: '+51 944 567 890',
    createdAt: '2024-08-10',
  },
};

// Simulación de tokens JWT
const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 horas
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

class AuthService {
  constructor() {
    // Inicializar usuarios en localStorage si no existen
    if (!localStorage.getItem('mock_users_db')) {
      localStorage.setItem('mock_users_db', JSON.stringify(MOCK_USERS_DB));
    }
  }

  /**
   * Obtiene la base de datos de usuarios
   */
  getUsersDB() {
    return JSON.parse(localStorage.getItem('mock_users_db') || '{}');
  }

  /**
   * Guarda un usuario en la BD simulada
   */
  saveUserToDB(email, userData) {
    const db = this.getUsersDB();
    db[email] = userData;
    localStorage.setItem('mock_users_db', JSON.stringify(db));
  }

  /**
   * Inicia sesión con email y contraseña
   */
  async login(email, password) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));

    const db = this.getUsersDB();
    const user = db[email.toLowerCase()];

    if (!user) {
      throw new Error('El correo electrónico no está registrado');
    }

    if (user.password !== password) {
      throw new Error('Contraseña incorrecta');
    }

    const token = generateToken(user);
    const userData = { ...user };
    delete userData.password;

    this.setSession({ token, user: userData });
    return { token, user: userData };
  }

  /**
   * Inicia sesión con Google (simulado)
   */
  async loginWithGoogle(googleEmail, googleProfile) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const db = this.getUsersDB();
    let user = db[googleEmail.toLowerCase()];

    if (!user) {
      // Auto-registrar si no existe
      user = {
        id: Date.now(),
        email: googleEmail,
        password: null, // Sin contraseña local
        fullName: googleProfile?.name || googleEmail.split('@')[0],
        role: 'USER',
        avatar: googleProfile?.picture || null,
        phone: '',
        createdAt: new Date().toISOString().split('T')[0],
        isGoogleAccount: true,
      };
      this.saveUserToDB(googleEmail, user);
    }

    const token = generateToken(user);
    const userData = { ...user };
    delete userData.password;

    this.setSession({ token, user: userData });
    return { token, user: userData };
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const db = this.getUsersDB();
    const email = userData.email.toLowerCase();

    if (db[email]) {
      throw new Error('Este correo electrónico ya está registrado');
    }

    const newUser = {
      id: Date.now(),
      email: email,
      password: userData.password,
      fullName: userData.fullName,
      role: userData.role || 'USER',
      avatar: null,
      phone: userData.phone || '',
      createdAt: new Date().toISOString().split('T')[0],
      isGoogleAccount: false,
    };

    this.saveUserToDB(email, newUser);
    return { message: 'Registro exitoso. Por favor inicia sesión.' };
  }

  /**
   * Solicita recuperación de contraseña
   */
  async forgotPassword(email) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const db = this.getUsersDB();
    const user = db[email.toLowerCase()];

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return { message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.' };
    }

    // Simular envío de email
    console.log(`[EMAIL SIMULADO] Enviando link de recuperación a: ${email}`);
    console.log(`[EMAIL SIMULADO] Link: http://localhost:5173/reset-password?token=mock-reset-token-${user.id}`);

    return { message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.' };
  }

  /**
   * Restablece la contraseña
   */
  async resetPassword(token, newPassword) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // En una implementación real, validaríamos el token
    const userId = token.replace('mock-reset-token-', '');
    const db = this.getUsersDB();
    
    let foundEmail = null;
    for (const [email, user] of Object.entries(db)) {
      if (user.id === parseInt(userId)) {
        user.password = newPassword;
        foundEmail = email;
        break;
      }
    }

    if (foundEmail) {
      this.saveUserToDB(foundEmail, db[foundEmail]);
      return { message: 'Contraseña actualizada exitosamente.' };
    }

    throw new Error('Token inválido o expirado');
  }

  /**
   * Cierra sesión
   */
  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');
    sessionStorage.removeItem('is_guest');
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_action');
  }

  /**
   * Accede como invitado
   */
  loginAsGuest() {
    this.logout();
    localStorage.setItem('user_role', 'GUEST');
    sessionStorage.setItem('is_guest', 'true');
  }

  /**
   * Guarda la sesión
   */
  setSession(authResponse) {
    localStorage.setItem('jwt_token', authResponse.token);
    localStorage.setItem('user_data', JSON.stringify(authResponse.user));
    localStorage.setItem('user_role', authResponse.user.role);
    sessionStorage.removeItem('is_guest');
  }

  /**
   * Verifica si está autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem('jwt_token');
    const isGuest = sessionStorage.getItem('is_guest') === 'true';
    return !!token || isGuest;
  }

  /**
   * Obtiene el rol del usuario
   */
  getUserRole() {
    const isGuest = sessionStorage.getItem('is_guest') === 'true';
    if (isGuest) return 'GUEST';
    return localStorage.getItem('user_role');
  }

  /**
   * Obtiene datos del usuario
   */
  getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : {};
  }

  /**
   * Actualiza datos del perfil
   */
  updateProfile(profileData) {
    const userData = this.getUserData();
    const updatedUser = { ...userData, ...profileData };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));

    // También actualizar en la BD simulada
    const db = this.getUsersDB();
    if (db[updatedUser.email]) {
      db[updatedUser.email] = { ...db[updatedUser.email], ...profileData };
      this.saveUserToDB(updatedUser.email, db[updatedUser.email]);
    }

    return updatedUser;
  }

  /**
   * Genera state para OAuth
   */
  generateOAuthState() {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  /**
   * URL de autenticación de Google (simulada)
   */
  getGoogleAuthUrl(action = 'login') {
    const state = this.generateOAuthState();
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_action', action);

    // En producción, esto sería la URL real de Google
    // Para demo, simulamos el flujo
    return `/auth/callback?code=mock-google-code&state=${state}&action=${action}`;
  }
}

const authService = new AuthService();
export default authService;