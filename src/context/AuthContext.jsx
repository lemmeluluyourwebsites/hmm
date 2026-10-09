import React, { createContext, useContext, useState, useEffect } from 'react';

const USERS = [
  { username: 'tirth', password: 'hehe', name: 'Tirth', isInfluencer: false },
  { username: 'krisha', password: 'hehe', name: 'Krisha', isInfluencer: false },
  { username: 'influencer', password: 'influence', name: 'Influencer', isInfluencer: true },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hamper_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const matched = USERS.find(
      (u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass
    );

    if (matched) {
      const userData = {
        username: matched.username,
        name: matched.name,
        isInfluencer: matched.isInfluencer,
      };
      setCurrentUser(userData);
      try {
        localStorage.setItem('hamper_auth_user', JSON.stringify(userData));
      } catch (err) {
        console.error('Storage error:', err);
      }
      return { success: true };
    }

    return { success: false, message: 'Invalid username or password' };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('hamper_auth_user');
    } catch (err) {
      console.error('Storage error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: Boolean(currentUser) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
