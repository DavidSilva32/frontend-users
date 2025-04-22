import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { decodeToken, getToken } from "@/utils/auth";

interface AuthContextType {
  role: string | null;
  setRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const decoded = decodeToken();
    if (!decoded) return;

    setRole(decoded.role ?? null);
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
