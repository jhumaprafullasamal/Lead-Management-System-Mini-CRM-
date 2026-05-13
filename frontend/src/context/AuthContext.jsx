import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lf_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('lf_token'));

  const persist = (userData, tokenData) => {
    localStorage.setItem('lf_user', JSON.stringify(userData));
    localStorage.setItem('lf_token', tokenData);
    setUser(userData);
    setToken(tokenData);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password });
    persist(data.user, data.token);
    return data.user;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const { data } = await authApi.register({ name, email, password });
    persist(data.user, data.token);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lf_user');
    localStorage.removeItem('lf_token');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
