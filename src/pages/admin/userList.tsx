import { User } from "@/types";
import { apiRequest } from "@/utils/apiRequest";
import { getToken } from "@/utils/auth";
import { endpoints } from "@/utils/endpoints";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Edit, SortByAlpha } from "@mui/icons-material";
import { useAuth } from "@/AuthContext";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/");
    }

    const token = getToken();

    const fetchUsers = async () => {
      try {
        const { payload } = await apiRequest<User[]>(
          endpoints.listAllUsers,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (payload) {
          setUsers(payload);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unexpected error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const openDeleteDialog = (id: string) => {
    setUserIdToDelete(id);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setUserIdToDelete(null);
  };

  const handleDelete = async () => {
    if (!userIdToDelete) return;

    const token = getToken();
    if (!token) {
      toast.error("User not authenticated.");
      navigate("/auth/login");
      return;
    }

    try {
      const { message } = await apiRequest(
        `${endpoints.deleteUser}?id=${userIdToDelete}`,
        "DELETE",
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      toast.success(message);
      setUsers((prev) => prev.filter((user) => user.id !== userIdToDelete));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      closeDialog();
    }
  };

  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [users, search, sortAsc]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", flexGrow: 1 }}>
          User List
        </Typography>

        <IconButton onClick={() => setSortAsc(!sortAsc)}>
          <SortByAlpha />
        </IconButton>

        <TextField
          size="small"
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <Card key={user.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Email: {user.email}
                  </Typography>
                  <Chip
                    label={user.role}
                    color={user.role === "ADMIN" ? "primary" : "secondary"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => openDeleteDialog(user.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          No users found
        </Typography>
      )}

      {/* Dialog for delete confirmation */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
