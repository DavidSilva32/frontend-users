import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LoginData } from "@/types";
import { apiRequest } from "@/utils/apiRequest";
import { endpoints } from "@/utils/endpoints";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {payload} = await apiRequest<LoginData>(endpoints.login, "POST", {
        email,
        password,
      });

      if (payload) {
        localStorage.setItem("authToken", payload.token);
        navigate("/profile");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login to Your Account
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              required
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              required
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                Logging in...
              </Box>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
