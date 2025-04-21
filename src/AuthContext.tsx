import { createContext, useContext, useState, ReactNode } from "react";
import { getUserFromToken } from "@/utils/auth";

interface AuthContextType {
  role: string | null;
  name: string | null;
  email: string | null;
  setAuth: (data: { role: string | null; name: string | null; email: string | null }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const user = getUserFromToken();

  const [authData, setAuthData] = useState({
    role: user?.role ?? null,
    name: user?.name ?? null,
    email: user?.email ?? null,
  });

  const setAuth = (data: { role: string | null; name: string | null; email: string | null }) => {
    setAuthData(data);
  };

  return (
    <AuthContext.Provider value={{ ...authData, setAuth }}>
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
