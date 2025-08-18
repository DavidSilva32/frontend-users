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
  Container,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { Delete, Edit, SortByAlpha } from "@mui/icons-material";
import { useAuth } from "@/AuthContext";
import { useTheme } from "@mui/material/styles";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px

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
    <Container maxWidth="md" sx={{ mt: isMobile ? 2 : 4, p: isMobile ? 1 : 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{ fontWeight: "bold", flexGrow: 1, mb: isMobile ? 2 : 0 }}
        >
          User List
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <IconButton onClick={() => setSortAsc(!sortAsc)}>
            <SortByAlpha />
          </IconButton>
          <TextField
            size="small"
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      <Grid container spacing={isMobile ? 1 : 3}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={user.id}
              sx={{
                display: "flex",
              }}
            >
              <Card
                sx={{
                  mb: isMobile ? 1 : 3,
                  width: "100%",
                  minHeight: isMobile ? 180 : 260,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "stretch",
                }}
              >
                <CardContent
                  sx={{
                    p: isMobile ? 2 : 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column", // sempre coluna
                    alignItems: "stretch",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {user.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      Email: {user.email}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={user.role}
                        color={user.role === "ADMIN" ? "primary" : "secondary"}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          fontSize: isMobile ? "0.75rem" : "1rem",
                          height: isMobile ? 24 : 36,
                          px: isMobile ? 1 : 2,
                          minWidth: 90,
                          maxWidth: 140,
                          flexShrink: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row", // botões em linha, mas embaixo dos dados
                      gap: 2,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      width: "100%",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                      fullWidth={isMobile}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => openDeleteDialog(user.id)}
                      fullWidth={isMobile}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary" align="center">
              No users found
            </Typography>
          </Grid>
        )}
      </Grid>

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
    </Container>
  );
}
