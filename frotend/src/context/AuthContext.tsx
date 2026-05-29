import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('agrirent_token');
      if (token) {
        try {
          const fullUser = await authService.getMe();
          setUser(fullUser);
        } catch (error) {
          console.error("Session expired or invalid", error);
          authService.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    // Redirect based on role
    if (newUser.role === 'provider') {
      navigate('/provider/dashboard');
    } else {
      navigate('/seeker/home');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  // Protected routes logic
  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/splash', '/language', '/login'];
    const isPublic = publicPaths.includes(location.pathname);

    if (!user && !isPublic && location.pathname !== '/') {
      navigate('/login');
    }
  }, [user, location.pathname, isLoading, navigate]);

  if (isLoading) {
    return <div className="h-full bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
