import { ApiResponse, User } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
    } else {
      fetch("http://localhost:3000/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((ApiResponse: ApiResponse<User>) => {setUser(ApiResponse.data)})
        .catch((error) => {
            toast.error(error instanceof Error ? error.message : "Unexpected error");
            console.error("Error fetching user profile:", error);
        });
    }
  }, [navigate]);

  if (!user) return <div className="text-center mt-8 text-gray-600">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">Perfil do Usuário</h1>
        <div className="space-y-4">
          <p className="text-lg text-gray-700"><span className="font-semibold">Nome:</span> {user.name}</p>
          <p className="text-lg text-gray-700"><span className="font-semibold">Email:</span> {user.email}</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            navigate("/login");
          }}
          className="w-full mt-6 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
