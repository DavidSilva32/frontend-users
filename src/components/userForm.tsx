import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { UserFormData } from "@/types";
import toast from "react-hot-toast";

interface UserFormProps {
  formData: UserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  title?: string;
  isEditing: boolean;
  onCancel?: () => void;
  onEdit?: () => void;
}

export default function UserForm({
  formData,
  onChange,
  onSubmit,
  title,
  isEditing,
  onCancel,
  onEdit,
}: UserFormProps) {
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (formData.password && formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    onSubmit();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      {title && <h2>{title}</h2>}

      <TextField
        fullWidth
        label="Name"
        name="name"
        margin="normal"
        value={formData.name}
        onChange={onChange}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        margin="normal"
        value={formData.email}
        onChange={onChange}
      />
      {isEditing && (
        <>
          <TextField
            fullWidth
            label="New Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={onChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!isEditing}
          />
        </>
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        {isEditing ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Save Changes
            </Button>
            {onCancel && (
              <Button variant="outlined" onClick={onCancel} fullWidth>
                Cancel
              </Button>
            )}
          </>
        ) : (
          <Button variant="outlined" color="primary" onClick={onEdit} fullWidth>
            Edit Profile
          </Button>
        )}
      </Box>
    </Box>
  );
}
