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
  TextField,
} from "@mui/material";
import { useAuth } from "@/AuthContext";
import { apiRequest } from "@/utils/apiRequest";
import { endpoints } from "@/utils/endpoints";
import { getToken, decodeToken } from "@/utils/auth";
import { User } from "@/types";

export default function Profile() {
  const { role, setRole } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, setRole]);

  const handleSave = async () => {
    const token = getToken();
    if (!token || !user) {
      navigate("/login");
      return;
    }

    const updatedProfile = { name: user.name, email: user.email };

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
      console.error(error);
    }
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

        <Box sx={{ mt: 4 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user?.name || ""}
            onChange={(e) =>
              setUser((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
            disabled={!isEditing}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user?.email || ""}
            onChange={(e) =>
              setUser((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
            disabled={!isEditing}
          />
          <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
            <strong>Role:</strong> {role}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
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
