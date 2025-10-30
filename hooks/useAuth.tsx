import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const savedAuth = localStorage.getItem('vanalexcars_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setUser(authData.user);
      } catch (error) {
        localStorage.removeItem('vanalexcars_auth');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Pour la démo, on accepte n'importe quel email/password
    // En production, vous devriez vérifier avec votre backend
    if (email && password) {
      const userData: User = {
        id: 1,
        name: 'Administrateur',
        email: email
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      
      // Sauvegarder en localStorage
      localStorage.setItem('vanalexcars_auth', JSON.stringify({
        user: userData,
        timestamp: Date.now()
      }));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('vanalexcars_auth');
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
