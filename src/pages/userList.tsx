import { User } from "@/types";
import { apiRequest } from "@/utils/apiRequest";
import { getToken } from "@/utils/auth";
import { endpoints } from "@/utils/endpoints";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { SortByAlpha } from "@mui/icons-material";
import { useAuth } from "@/AuthContext";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/");
    }
    const token = getToken();

    const fetchUsers = async () => {
      try {
        const { payload } = await apiRequest<User[]>(
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
        toast.error(
          error instanceof Error ? error.message : "Unexpected error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [users, search, sortAsc]);

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", flexGrow: 1 }}>
          Lista de Usuários
        </Typography>

        <IconButton onClick={() => setSortAsc(!sortAsc)}>
          <SortByAlpha />
        </IconButton>

        <TextField
          size="small"
          label="Buscar"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <Card key={user.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {user.name}
                </Typography>
                <Chip
                  label={user.role}
                  color={user.role === "ADMIN" ? "primary" : "default"}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>
              <Typography variant="body1" color="textSecondary">
                Email: {user.email}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          Nenhum usuário encontrado
        </Typography>
      )}
    </Box>
  );
}
