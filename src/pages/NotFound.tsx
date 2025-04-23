import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        textAlign: "center",
        p: 2,
      }}
    >
      <Typography variant="h1" sx={{ mb: 4 }}>
        😕
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
        404 - Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/auth/login")}
        sx={{
          fontSize: "0.875rem",
          paddingX: 4,
          paddingY: 2,
          borderRadius: 1,
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        Back to Login
      </Button>
    </Box>
  );
}
