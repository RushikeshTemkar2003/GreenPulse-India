// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ REGISTER FUNCTION (for signup)
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        setUser(res.data.user);
        setIsAuthenticated(true);

        return { success: true, user: res.data.user };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  // ✅ LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        setUser(res.data.user);
        setIsAuthenticated(true);

        return { success: true, user: res.data.user };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
