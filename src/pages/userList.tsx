import { User } from "@/types";
import { apiRequest } from "@/utils/apiRequest";
import { getUserRoleFromToken } from "@/utils/auth";
import { endpoints } from "@/utils/endpoints";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getUserRoleFromToken();
    if (role !== "ADMIN") {
      navigate("/");
    }
    const token = localStorage.getItem("authToken");

    const fetchUsers = async () => {
      try {
        const data = await apiRequest<User[]>(
          endpoints.listAllUsers,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (data) {
          setUsers(data);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-surface p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">
        Lista de Usuários
      </h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 bg-background rounded-md border border-border shadow-sm"
          >
            <p>
              <strong>Nome:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
