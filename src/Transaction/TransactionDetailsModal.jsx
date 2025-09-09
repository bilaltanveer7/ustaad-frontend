import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  AccountBalance as AccountBalanceIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  Update as UpdateIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  PauseCircleFilled as PauseIcon,
} from "@mui/icons-material";
import { useAdminStore } from "../store/useAdminStore";

const TransactionDetailsModal = ({ open, onClose, transactionId }) => {
  const {
    selectedPaymentRequest,
    fetchPaymentRequestDetails,
    updatePaymentStatus,
    isLoadingPaymentRequests,
    isUpdatingPaymentRequest,
    paymentRequestsError,
    getPaymentStatusOptions,
    clearSelectedPaymentRequest,
  } = useAdminStore();

  const [localStatus, setLocalStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  console.log("selectedPaymentRequest", selectedPaymentRequest);

  useEffect(() => {
    if (open && transactionId) {
      fetchPaymentRequestDetails(transactionId);
      setUpdateError("");
      setUpdateSuccess("");
    }
  }, [open, transactionId, fetchPaymentRequestDetails]);

  // Update local status when data loads
  useEffect(() => {
    if (selectedPaymentRequest) {
      setLocalStatus(selectedPaymentRequest.status || "");
    }
  }, [selectedPaymentRequest]);

  // Clear data when modal closes
  useEffect(() => {
    if (!open) {
      clearSelectedPaymentRequest();
      setLocalStatus("");
      setUpdateError("");
      setUpdateSuccess("");
    }
  }, [open, clearSelectedPaymentRequest]);

  const handleStatusUpdate = async () => {
    if (!selectedPaymentRequest || !localStatus) return;

    setIsUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");

    try {
      const result = await updatePaymentStatus(
        selectedPaymentRequest.paymentRequest.id,
        localStatus
      );

      if (result.success) {
        setUpdateSuccess("Status updated successfully!");
        // Refresh the details to get updated data
        setTimeout(() => {
          fetchPaymentRequestDetails(transactionId);
        }, 1000);
      } else {
        setUpdateError(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateError("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircleIcon sx={{ color: "#38BC5C" }} />;
      case "REJECTED":
        return <CancelIcon sx={{ color: "#F31616" }} />;
      case "PENDING":
        return <PauseIcon sx={{ color: "#7D879C" }} />;
      case "IN_REVIEW":
      case "REQUESTED":
        return <InfoIcon sx={{ color: "#235DFF" }} />;
      default:
        return <InfoIcon sx={{ color: "#666" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return { bg: "#EEFCF3", color: "#38BC5C", border: "#B2EECC" };
      case "REJECTED":
        return { bg: "#FEECEC", color: "#F31616", border: "#FFCDD2" };
      case "PENDING":
        return { bg: "#F0F2F5", color: "#7D879C", border: "#E0E0E0" };
      case "IN_REVIEW":
      case "REQUESTED":
        return { bg: "#EEF3FF", color: "#235DFF", border: "#C5D9FF" };
      default:
        return { bg: "#F5F5F5", color: "#666", border: "#E0E0E0" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount) => {
    if (!amount) return "$0.00";
    return `${parseFloat(amount).toFixed(2)}/- PKR`;
  };

  const statusOptions = getPaymentStatusOptions();

  if (!selectedPaymentRequest) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading transaction details...</Typography>
      </Box>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ReceiptIcon sx={{ color: "#1E9CBC", fontSize: "28px" }} />
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 600, color: "#101219" }}
          >
            Transaction Details
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {isLoadingPaymentRequests ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>
              Loading transaction details...
            </Typography>
          </Box>
        ) : paymentRequestsError ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              Error loading transaction details: {paymentRequestsError}
            </Alert>
          </Box>
        ) : selectedPaymentRequest ? (
          <Box sx={{ p: 3 }}>
            {/* Status Update Messages */}
            {updateSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {updateSuccess}
              </Alert>
            )}
            {updateError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {updateError}
              </Alert>
            )}

            {/* Transaction Overview Card */}
            <Card sx={{ mb: 3, border: "1px solid #E0E3EB" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#101219" }}
                  >
                    Payment Request #{selectedPaymentRequest.paymentRequest.id}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getStatusIcon(selectedPaymentRequest.status)}
                    <Chip
                      label={selectedPaymentRequest.paymentRequest.status}
                      size="medium"
                      sx={{
                        backgroundColor: getStatusColor(
                          selectedPaymentRequest.paymentRequest.status
                        ).bg,
                        color: getStatusColor(selectedPaymentRequest.paymentRequest.status)
                          .color,
                        border: `1px solid ${
                          getStatusColor(selectedPaymentRequest.paymentRequest.status).border
                        }`,
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <AccountBalanceIcon
                        sx={{ color: "#1E9CBC", fontSize: "20px" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", fontWeight: 500 }}
                      >
                        Amount
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: "#101219" }}
                    >
                      {formatAmount(selectedPaymentRequest.paymentRequest.amount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CalendarIcon
                        sx={{ color: "#1E9CBC", fontSize: "20px" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", fontWeight: 500 }}
                      >
                        Request Date
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "#101219" }}>
                      {formatDate(selectedPaymentRequest.paymentRequest.createdAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <Grid container spacing={3}>
              {/* Tutor Information */}
              
                <Card sx={{ height: "100%", width: "100%", border: "1px solid #E0E3EB" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <PersonIcon sx={{ color: "#1E9CBC" }} />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#101219" }}
                      >
                        Tutor Information
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", mb: 0.5 }}
                      >
                        Tutor ID
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#101219",
                          fontFamily: "monospace",
                          backgroundColor: "#f5f5f5",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          display: "inline-block",
                        }}
                      >
                        {selectedPaymentRequest.paymentRequest.tutorId || "N/A"}
                      </Typography>
                    </Box>

                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 0.5 }}
                        >
                          Name
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#101219" }}>
                          {selectedPaymentRequest.tutor.name || "N/A"}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 0.5 }}
                        >
                          Email
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#101219" }}>
                          {selectedPaymentRequest.tutor.email || "N/A"}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 0.5 }}
                        >
                          Bank Name
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#101219" }}>
                          {selectedPaymentRequest.tutor.bankName || "N/A"}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 0.5 }}
                        >
                          Bank Account Number
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#101219" }}>
                          {selectedPaymentRequest.tutor.accountNumber || "N/A"}
                        </Typography>
                      </Box>
                    </>
                  </CardContent>
                </Card>
              
            </Grid>

            {/* Status Update Section */}
            <Card sx={{ mt: 3, border: "1px solid #E0E3EB" }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <UpdateIcon sx={{ color: "#1E9CBC" }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#101219" }}
                  >
                    Update Status
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={localStatus}
                        label="Status"
                        onChange={(e) => setLocalStatus(e.target.value)}
                        disabled={isUpdating || isUpdatingPaymentRequest}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {getStatusIcon(option.value)}
                              {option.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      onClick={handleStatusUpdate}
                      disabled={
                        isUpdating ||
                        isUpdatingPaymentRequest ||
                        !localStatus ||
                        localStatus === selectedPaymentRequest.status
                      }
                      sx={{
                        backgroundColor: "#1E9CBC",
                        "&:hover": {
                          backgroundColor: "#1a8aa8",
                        },
                        textTransform: "none",
                        px: 3,
                      }}
                    >
                      {isUpdating || isUpdatingPaymentRequest ? (
                        <>
                          <CircularProgress
                            size={20}
                            sx={{ mr: 1, color: "white" }}
                          />
                          Updating...
                        </>
                      ) : (
                        "Update Status"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "#666" }}>
              No transaction details available
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#ddd",
            color: "#666",
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailsModal;
