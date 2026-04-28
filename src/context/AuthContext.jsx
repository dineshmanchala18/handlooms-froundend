import React, { useEffect, useState, createContext, useContext } from 'react';
import API from '../api/API';

export const AuthContext = createContext();

const isAuthApiUnavailable = (error) => {
  const status = error?.response?.status;
  return !error?.response || [404, 405, 502, 503, 504].includes(status);
};

const createFallbackLoginSession = (credentials) => {
  const role = credentials.role || 'customer';
  const identifier = credentials.email || credentials.phone || `${role}@local.app`;
  const user = {
    id: `local-${Date.now()}`,
    name: identifier,
    email: credentials.email || null,
    phone: credentials.phone || null,
    role
  };

  return {
    token: `local-${role}-${Date.now()}`,
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
    try {
      const response = await API.post('/user/login', credentials);
      saveSession(response.data.user, response.data.token, response.data.user.role);
      return response.data.user;
    } catch (error) {
      if (!isAuthApiUnavailable(error)) {
        throw error;
      }

      const response = createFallbackLoginSession(credentials);
      saveSession(response.user, response.token, response.user.role);
      return response.user;
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
    const response = await API.post('/user/register', {
      ...userData,
      role: type
    });
    saveSession(response.data.user, response.data.token, response.data.user.role);
    return response.data.user;
  };

  const updateProfile = async (updates) => {
    if (!user) return;

    const previousEmail = user.email;
    const nextUser = { ...user, ...updates };
    const userId = user.id;

    if (userId && !String(userId).startsWith('local-')) {
      try {
        const response = await API.put(`/user/${userId}`, nextUser);
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch {
        setUser(nextUser);
        localStorage.setItem('user', JSON.stringify(nextUser));
      }
    } else {
      setUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
    }

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
