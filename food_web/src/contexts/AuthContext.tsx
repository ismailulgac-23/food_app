import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

type User = { id: string; fullName: string; phone: string; role: string; address?: string } | null;

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setUser(null); return; }
      const res: any = await authAPI.me();
      setUser(res.data.data);
    } catch {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


