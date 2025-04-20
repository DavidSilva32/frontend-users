import { User } from "@/types";
import { apiRequest } from "@/utils/apiRequest";
import { getUserRoleFromToken } from "@/utils/auth";
import { endpoints } from "@/utils/endpoints";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";

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
        const {payload} = await apiRequest<User[]>(
          endpoints.listAllUsers,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (payload) {
          setUsers(payload);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}>
        Lista de Usuários
      </Typography>

      {users.length > 0 ? (
        users.map((user) => (
          <Card key={user.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Nome: {user.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Email: {user.email}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          No users found
        </Typography>
      )}
    </Box>
  );
}
