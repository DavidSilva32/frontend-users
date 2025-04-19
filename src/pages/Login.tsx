import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";  // <--- Importa o toast
import { ApiResponse } from "@/types";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const responseData: ApiResponse<{ token: string }> = await response.json();
  
      if (!response.ok) {
        toast.error(responseData.message || "Erro no login");
        return;
      }
  
      localStorage.setItem("authToken", responseData.data.token);
      navigate("/profile");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="E-mail"
          className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
