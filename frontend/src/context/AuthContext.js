'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from localStorage on initial mount
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('ishop_token') : null;
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('ishop_user') : null;

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('ishop_token');
        localStorage.removeItem('ishop_user');
        setToken(null);
        setUser(null);
      }
    } else {
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  // User & Admin Login
  const login = async (email, password) => {
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('ishop_token', data.token);
        localStorage.setItem('ishop_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Invalid email or password' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed. Please check your credentials.' };
    }
  };

  // User Registration - Directly saves to MongoDB via backend API
  const register = async (name, email, password) => {
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('ishop_token', data.token);
        localStorage.setItem('ishop_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed. Please try again.' };
    }
  };

  // Update Profile
  const updateProfile = async (formData) => {
    try {
      const data = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('ishop_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Update failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ishop_token');
      localStorage.removeItem('ishop_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
