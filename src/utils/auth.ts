import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  role: string;
  name: string;
  email: string;
}

export function getUserFromToken(): TokenPayload | null {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return {
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
    };
  } catch {
    return null;
  }
}
