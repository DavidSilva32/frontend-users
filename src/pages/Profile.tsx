import { User } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useAuth } from "@/AuthContext";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.name && auth.email) {
      setUser({
        id: auth.id as string,
        name: auth.name,
        email: auth.email,
      });
    } else {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      // const fetchUserProfile = async () => {
      //   try {
      //     const { payload } = await apiRequest<User>(
      //       endpoints.getProfile,
      //       "GET",
      //       undefined,
      //       {
      //         Authorization: `Bearer ${token}`,
      //       }
      //     );

      //     if (payload) {
      //       setUser(payload);
      //       setAuth({
      //         role: payload.role,
      //         name: payload.name,
      //         email: payload.email,
      //       });
      //     }
      //   } catch (error) {
      //     toast.error(error instanceof Error ? error.message : "Unexpected error");
      //     localStorage.removeItem("authToken");
      //     navigate("/login");
      //   }
      // };

      // fetchUserProfile();
    }
  }, [auth,setUser, navigate]);

  if (!user) {
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
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          User Profile
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Name:</strong> {user.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> {user.email}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 4 }}
          onClick={() => {
            localStorage.removeItem("authToken");
            setAuth({ id:null,role: null, name: null, email: null });
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
