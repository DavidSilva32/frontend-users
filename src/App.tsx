import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  Button,
} from "@mui/material";
import { Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { getUserRoleFromToken } from "./utils/auth";
import { useAuth } from "./AuthContext";

const drawerWidth = 240;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const { role, setRole } = useAuth();

  useEffect(() => {
    const currentRole = getUserRoleFromToken();
    setRole(currentRole);
  }, [setRole]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode]
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        My App
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button component={RouterLink} to="/login" color="inherit">Login</Button>
        <Button component={RouterLink} to="/register" color="inherit">Register</Button>
        <Button component={RouterLink} to="/profile" color="inherit">Profile</Button>
        {role === "ADMIN" && (
          <Button component={RouterLink} to="/userList" color="inherit">Users</Button>
        )}
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar component="nav" position="static">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
              <Button component={RouterLink} to="/login" color="inherit">Login</Button>
              <Button component={RouterLink} to="/register" color="inherit">Register</Button>
              <Button component={RouterLink} to="/profile" color="inherit">Profile</Button>
              {role === "ADMIN" && (
                <Button component={RouterLink} to="/userList" color="inherit">Users</Button>
              )}
            </Box>
            <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>

        <Box component="footer" sx={{ py: 2, textAlign: "center", mt: "auto", bgcolor: "background.paper" }}>
          <Typography variant="body2">&copy; 2025 My App</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
