import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { endpoints } from "@/utils/endpoints";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

export default function Register() {
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !inputData.name ||
      !inputData.email ||
      !inputData.password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (inputData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(endpoints.createUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed");
        return;
      }

      toast.success("Account successfully created!");
      navigate("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create Your Account
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={inputData.name}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={inputData.email}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={inputData.password}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                Registering...
              </Box>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
