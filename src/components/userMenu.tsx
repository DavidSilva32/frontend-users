import { useAuth } from "@/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";

function stringAvatar(name: string) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return {
    children: initials,
  };
}

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { role, name } = auth;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuth({ id: null, role: null, name: null, email: null });
    handleClose();
    navigate("/login");
  };

  const handleGoToProfile = () => {
    handleClose();
    navigate("/profile");
  };

  if (!role) return null;

  return (
    <>
      <IconButton onClick={handleMenu} color="inherit">
        <Avatar {...stringAvatar(name || "U")} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleGoToProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
