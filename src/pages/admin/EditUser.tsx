import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import toast from "react-hot-toast";

import { getToken } from "@/utils/auth";
import { apiRequest } from "@/utils/apiRequest";
import { endpoints } from "@/utils/endpoints";
import { User } from "@/types";
import UserForm from "@/components/userForm";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!id) return;

    const token = getToken();

    const fetchUser = async () => {
      try {
        const { payload } = await apiRequest<User>(
          `${endpoints.getUserById}?id=${id}`,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (payload) {
          setUserData({ name: payload.name, email: payload.email, password: "" });
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("You must be logged in");
      navigate("/auth/login");
      return;
    }

    try {
      const { message } = await apiRequest<User>(
        `${endpoints.updateUser}?id=${id}`,
        "PUT",
        userData,
        { Authorization: `Bearer ${token}` }
      );

      toast.success(message);
      navigate("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Edit User
      </Typography>

      <UserForm
        formData={userData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        title="Edit User"
        isEditing={true}
      />
    </Box>
  );
}
