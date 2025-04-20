import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LoginData } from "@/types";
import { apiRequest } from "@/utils/apiRequest";
import { endpoints } from "@/utils/endpoints";
import { getUserRoleFromToken } from "@/utils/auth";
import { useAuth } from "@/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiRequest<LoginData>(endpoints.login, "POST", {
        email,
        password,
      });

      if (data) {
        localStorage.setItem("authToken", data.token);
        const role = getUserRoleFromToken();
        setRole(role);
        navigate("/profile");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{ width: "100%", p: 4, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h5" align="center" fontWeight="bold">
          Login
        </Typography>

        <TextField
          label="E-mail"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ py: 1.5, fontWeight: 500 }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Logging in...
            </Box>
          ) : (
            "Login"
          )}
        </Button>
      </Paper>
    </Container>
  );
}
