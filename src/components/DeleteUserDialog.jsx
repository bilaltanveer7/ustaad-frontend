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

const DeleteUserDialog = ({
  open,
  onClose,
  onConfirm,
  userName,
  userId,
  isDeleting,
  error,
}) => {
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
            Delete User Account
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
          Are you sure you want to delete this user account?
        </Typography>

        <Box
          sx={{
            p: 2,
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            User Details:
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
            <strong>Name:</strong> {userName}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            <strong>ID:</strong> #{userId}
          </Typography>
        </Box>

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
            ⚠️ Warning: This action cannot be undone. All user data, including
            contracts and history, may be affected.
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
          onClick={onConfirm}
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
            "Delete User"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;
