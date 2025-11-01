import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const extractAuth = (res) => {
    const data = res?.data ?? res;
    let userObj = data?.user ?? data?.data?.user ?? null;
    if (!userObj) {
      // Backend returns flattened user fields
      const { _id, name, email, role } = data;
      if (_id || name || email || role) {
        userObj = { _id, name, email, role };
      }
    }
    return { user: userObj };
  };

  const setAuth = ({ user: u }) => {
    if (u) {
      localStorage.setItem('user', JSON.stringify(u));
    } else {
      localStorage.removeItem('user');
    }
    setUser(u || null);
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const auth = extractAuth(res);
      setAuth(auth);
      // Fetch full profile after login
      await checkAuth();
      return auth;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const auth = extractAuth(res);
      setAuth(auth);
      // Fetch full profile after signup
      await checkAuth();
      return auth;
    } catch (error) {
      throw error;
    }
  };

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/profile');
      const userData = res?.data ?? res;
      const userObj = userData.user || userData;
      setAuth({ user: userObj });
      return userObj;
    } catch (error) {
      setAuth({ user: null });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // Ignore errors during logout
    } finally {
      setAuth({ user: null });
    }
  };

  const value = useMemo(() => ({ user, login, signup, logout, loading, checkAuth }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}