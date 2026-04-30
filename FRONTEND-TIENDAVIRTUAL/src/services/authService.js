// src/services/authService.js

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
};

const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

class AuthService {
  constructor() {
    if (!localStorage.getItem('mock_users_db')) {
      localStorage.setItem('mock_users_db', JSON.stringify(MOCK_USERS_DB));
    }
  }

  getUsersDB() {
    return JSON.parse(localStorage.getItem('mock_users_db') || '{}');
  }

  saveUserToDB(email, userData) {
    const db = this.getUsersDB();
    db[email] = userData;
    localStorage.setItem('mock_users_db', JSON.stringify(db));
  }

  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const db = this.getUsersDB();
    const user = db[email.toLowerCase()];

    if (!user) throw new Error('El correo electrónico no está registrado');
    if (user.password !== password) throw new Error('Contraseña incorrecta');

    const token = generateToken(user);
    const userData = { ...user };
    delete userData.password;

    this.setSession({ token, user: userData });
    return { token, user: userData };
  }

  async register(userData) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const db = this.getUsersDB();
    const email = userData.email.toLowerCase();

    if (db[email]) throw new Error('Este correo electrónico ya está registrado');

    const newUser = {
      id: Date.now(),
      email: email,
      password: userData.password,
      fullName: userData.fullName,
      role: userData.role || 'USER',
      avatar: null,
      phone: userData.phone || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.saveUserToDB(email, newUser);
    return { message: 'Registro exitoso. Por favor inicia sesión.' };
  }

  async forgotPassword(email) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.' };
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_role');
    sessionStorage.removeItem('is_guest');
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_action');
  }

  loginAsGuest() {
    this.logout();
    localStorage.setItem('user_role', 'GUEST');
    sessionStorage.setItem('is_guest', 'true');
  }

  setSession(authResponse) {
    localStorage.setItem('jwt_token', authResponse.token);
    localStorage.setItem('user_data', JSON.stringify(authResponse.user));
    localStorage.setItem('user_role', authResponse.user.role);
    sessionStorage.removeItem('is_guest');
  }

  isAuthenticated() {
    const token = localStorage.getItem('jwt_token');
    const isGuest = sessionStorage.getItem('is_guest') === 'true';
    return !!token || isGuest;
  }

  getUserRole() {
    const isGuest = sessionStorage.getItem('is_guest') === 'true';
    if (isGuest) return 'GUEST';
    return localStorage.getItem('user_role');
  }

  getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : {};
  }
}

const authService = new AuthService();
export default authService;