import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserFromToken } from "@/utils/auth";
import { apiRequest } from "@/utils/apiRequest";
import { endpoints } from "@/utils/endpoints";
import { User } from "@/types";

interface AuthState {
  id: string | null;
  role: string | null;
  name: string | null;
  email: string | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: (data: AuthState) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuthState] = useState<AuthState>({
    id: null,
    role: null,
    name: null,
    email: null,
  });

  useEffect(() => {
    const user = getUserFromToken();
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const { payload } = await apiRequest<User>(
          endpoints.getProfile,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }
        );

        if (payload) {
          setAuthState({
            id: user.id,
            role: user.role,
            email: user.email,
            name: payload.name,
          });
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        localStorage.removeItem("authToken");
        setAuthState({
          id: null,
          role: null,
          name: null,
          email: null,
        });
      }
    };

    fetchUserProfile();
  }, []);

  const setAuth = (data: AuthState) => {
    setAuthState(data);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
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
