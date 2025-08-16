import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken } from "@/utils/auth";

interface AuthContextType {
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (token && role) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [role]);

  return (
    <AuthContext.Provider value={{ role, setRole, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook para acessar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
