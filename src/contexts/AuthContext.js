'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentEmail, setCurrentEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem('adminEmail');
    if (storedEmail) {
      setCurrentEmail(storedEmail);
    }
    setLoading(false);
  }, []);

  const login = (email) => {
    localStorage.setItem('adminEmail', email);
    setCurrentEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('adminEmail');
    setCurrentEmail(null);
  };

  return (
    <AuthContext.Provider value={{ currentEmail, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);