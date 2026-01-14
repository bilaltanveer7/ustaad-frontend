import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

const DeleteAdminDialog = ({
  open,
  onClose,
  onConfirm,
  admin,
  isDeleting,
  error,
}) => {
  const handleConfirm = () => {
    if (admin) {
      onConfirm(admin.id);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <WarningIcon sx={{ color: "#f44336", fontSize: "28px" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#101219" }}>
            Delete Admin Account
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 2, color: "#333" }}>
          Are you sure you want to delete this admin account?
        </Typography>

        {admin && (
          <Box
            sx={{
              p: 2,
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Admin Details:
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
              <strong>Name:</strong> {admin.firstName} {admin.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
              <strong>Email:</strong> {admin.email}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              <strong>ID:</strong> #{admin.id}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            border: "1px solid #ffeaa7",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#856404", fontWeight: 500 }}
          >
            ⚠️ Warning: This action cannot be undone. The admin will lose access
            to the system immediately.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isDeleting}
          sx={{
            borderColor: "#ddd",
            color: "#666",
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isDeleting}
          sx={{
            backgroundColor: "#f44336",
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
          }}
        >
          {isDeleting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
              Deleting...
            </>
          ) : (
            "Delete Admin"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAdminDialog;
