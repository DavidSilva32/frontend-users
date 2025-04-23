import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useAuth } from "@/AuthContext";
import { apiRequest } from "@/utils/apiRequest";
import { endpoints } from "@/utils/endpoints";
import { getToken, decodeToken } from "@/utils/auth";
import { User } from "@/types";
import UserForm from "@/components/userForm";

export default function Profile() {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/auth/login");
      return;
    }

    const decoded = decodeToken();
    if (decoded?.role) {
      setRole(decoded.role);
    }

    const fetchProfile = async () => {
      try {
        const { payload } = await apiRequest<User>(
          endpoints.getProfile,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setUser(payload);
      } catch (error) {
        toast.error("Erro ao carregar perfil");
        navigate("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, setRole]);

  const handleSave = async () => {
    const token = getToken();
    if (!token || !user) {
      navigate("/auth/login");
      return;
    }

    const updatedProfile = { name: user.name, email: user.email, password: user.password };

    try {
      const { message } = await apiRequest(
        `${endpoints.updateUser}?id=${user.id}`,
        "PUT",
        updatedProfile,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success(message);
      setIsEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bad request");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          User Profile
        </Typography>

        <UserForm
          formData={{
            name: user?.name || "",
            email: user?.email || "",
            password: user?.password || "",
          }}
          onChange={(e) => {
            setUser((prev) =>
              prev ? { ...prev, [e.target.name]: e.target.value } : prev
            );
          }}
          onSubmit={handleSave}
          title="Edit Profile"
          isEditing={isEditing}
          onCancel={handleCancelEdit}
          onEdit={handleEdit}
        />
      </Paper>
    </Container>
  );
}
