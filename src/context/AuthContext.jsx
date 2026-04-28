import React, { useEffect, useState, createContext, useContext } from 'react';
import API from '../api/API';

export const AuthContext = createContext();

const LOCAL_USERS_KEY = 'registeredUsers';
const hasConfiguredApiUrl = Boolean(import.meta.env.VITE_API_URL);
const shouldUseRemoteAuth = import.meta.env.DEV || hasConfiguredApiUrl;
const shouldUseLocalDemoAuth = !import.meta.env.DEV && !hasConfiguredApiUrl;

const normalizeIdentifier = (value) => (value || '').trim().toLowerCase();

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const createLocalToken = (user) => `local-${user.role || 'customer'}-${Date.now()}`;

const registerLocally = (userData, type) => {
  const users = getLocalUsers();
  const email = normalizeIdentifier(userData.email);
  const phone = normalizeIdentifier(userData.phone);

  const duplicateUser = users.find((registeredUser) => (
    (email && normalizeIdentifier(registeredUser.email) === email) ||
    (phone && normalizeIdentifier(registeredUser.phone) === phone)
  ));

  if (duplicateUser) {
    throw new Error('An account already exists with this email or phone number.');
  }

  const user = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    role: type,
    createdAt: new Date().toISOString()
  };

  saveLocalUsers([
    ...users,
    {
      ...user,
      password: userData.password
    }
  ]);

  return {
    token: createLocalToken(user),
    user
  };
};

const loginLocally = (credentials, { allowFirstLogin = false } = {}) => {
  if (credentials.role === 'admin') {
    const adminUser = {
      id: 'admin',
      name: 'Admin',
      email: credentials.email,
      role: 'admin'
    };

    return {
      token: createLocalToken(adminUser),
      user: adminUser
    };
  }

  const users = getLocalUsers();
  const email = normalizeIdentifier(credentials.email);
  const phone = normalizeIdentifier(credentials.phone);
  const role = normalizeIdentifier(credentials.role);

  const userRecord = users.find((registeredUser) => {
    const matchesIdentifier =
      (email && normalizeIdentifier(registeredUser.email) === email) ||
      (phone && normalizeIdentifier(registeredUser.phone) === phone);
    const matchesRole = !role || normalizeIdentifier(registeredUser.role) === role;

    return matchesIdentifier && matchesRole && registeredUser.password === credentials.password;
  });

  if (!userRecord) {
    if (allowFirstLogin && (email || phone) && credentials.password) {
      const user = {
        id: Date.now(),
        name: email || phone,
        email: credentials.email,
        phone: credentials.phone,
        role: credentials.role || 'customer',
        createdAt: new Date().toISOString()
      };

      saveLocalUsers([
        ...users,
        {
          ...user,
          password: credentials.password
        }
      ]);

      return {
        token: createLocalToken(user),
        user
      };
    }

    throw new Error('Login failed. Please check your credentials or create an account first.');
  }

  const { password, ...user } = userRecord;

  return {
    token: createLocalToken(user),
    user
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    const savedToken = localStorage.getItem('authToken');

    if (savedUser && savedUserType && savedToken) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
      setIsAuthenticated(true);
    }
  }, []);

  const saveSession = (userData, token, type) => {
    const resolvedType = type || userData.role || 'customer';
    setUser(userData);
    setUserType(resolvedType);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', resolvedType);
    localStorage.setItem('authToken', token);
  };

  const login = async (credentials) => {
    if (shouldUseLocalDemoAuth) {
      const response = loginLocally(credentials, { allowFirstLogin: true });
      saveSession(response.user, response.token, response.user.role);
      return response.user;
    }

    try {
      const response = await API.post('/user/login', credentials);
      saveSession(response.data.user, response.data.token, response.data.user.role);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('authToken');
  };

  const register = async (userData, type = 'customer') => {
    if (shouldUseLocalDemoAuth) {
      const response = registerLocally(userData, type);
      saveSession(response.user, response.token, response.user.role);
      return response.user;
    }

    try {
      const response = await API.post('/user/register', {
        ...userData,
        role: type
      });
      saveSession(response.data.user, response.data.token, response.data.user.role);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = (updates) => {
    if (!user) return;

    const previousEmail = user.email;
    const nextUser = { ...user, ...updates };

    setUser(nextUser);
    localStorage.setItem('user', JSON.stringify(nextUser));

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const nextRegisteredUsers = registeredUsers.map((registeredUser) => (
      registeredUser.email === previousEmail
        ? { ...registeredUser, ...updates, role: registeredUser.role || userType }
        : registeredUser
    ));

    localStorage.setItem('registeredUsers', JSON.stringify(nextRegisteredUsers));
  };

  const requestPasswordReset = (email) => {
    const resetRequests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
    const nextRequests = [
      ...resetRequests,
      { email, requestedAt: new Date().toISOString() }
    ];
    localStorage.setItem('passwordResetRequests', JSON.stringify(nextRequests));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userType, login, logout, register, requestPasswordReset, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
