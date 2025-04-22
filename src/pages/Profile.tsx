import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useAuth } from "@/AuthContext";
import { apiRequest } from "@/utils/apiRequest";
import { endpoints } from "@/utils/endpoints";
import { getToken, decodeToken } from "@/utils/auth";

export default function Profile() {
  const { role, setRole } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = decodeToken();
    if (decoded?.role) {
      setRole(decoded.role);
    }

    const fetchProfile = async () => {
      try {
        const { payload } = await apiRequest<{ name: string; email: string }>(
          endpoints.getProfile,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setName(payload.name);
        setEmail(payload.email);
      } catch (error) {
        toast.error("Erro ao carregar perfil");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, setRole]);

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

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Name:</strong> {name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> {email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Role:</strong> {role}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 4 }}
          onClick={() => {
            localStorage.removeItem("authToken");
            navigate("/login");
            toast.success("Logged out successfully");
          }}
        >
          Log Out
        </Button>
      </Paper>
    </Container>
  );
}
