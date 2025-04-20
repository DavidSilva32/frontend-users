import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUserRoleFromToken } from "@/utils/auth";

interface AuthContextType {
  role: string | null;
  setRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const currentRole = getUserRoleFromToken();
    setRole(currentRole);
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
