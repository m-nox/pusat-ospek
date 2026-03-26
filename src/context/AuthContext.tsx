import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User } from '../types';
import { getSession, setSession as saveSession, clearSession } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const session = getSession();
    if (session.isAuthenticated) {
      setUser(session.user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    saveSession(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
