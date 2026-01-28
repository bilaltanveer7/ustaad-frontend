import React, { useState, useEffect, useRef } from "react";
import SideNav from "../sidebar/sidenav";
import { useAdminStore } from "../store/useAdminStore";
import { CircularProgress, Alert, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Divider,
  TablePagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Update as UpdateIcon,
  ContentCopy as ContentCopyIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  UnfoldMore as UnfoldMoreIcon,
} from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const drawerWidth = 260;

const ContractDashboard = () => {
  const {
    disputedContracts,
    isLoadingDisputedContracts,
    fetchDisputedContracts,
    disputedContractsPagination,
    disputedContractsError,
    isResolvingDispute,
    resolveDisputeContract,
    resolveDisputeError,
  } = useAdminStore();
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Fetch with pagination
  useEffect(() => {
    const query = `?page=${page + 1}&limit=${rowsPerPage}`;
    fetchDisputedContracts(query);
  }, [fetchDisputedContracts, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [selectedContract, setSelectedContract] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Resolution Modal State
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState(""); // "active" | "cancelled" | "completed"
  const [adminNotes, setAdminNotes] = useState("");
  const [contractToResolve, setContractToResolve] = useState(null);

  const handleOpenResolutionModal = (contract, status) => {
    setContractToResolve(contract);
    setTargetStatus(status);
    setAdminNotes("");
    setResolutionModalOpen(true);
  };

  const handleCloseResolutionModal = () => {
    setResolutionModalOpen(false);
    setContractToResolve(null);
    setTargetStatus("");
    setAdminNotes("");
  };

  const handleSubmitResolution = async () => {
    if (!contractToResolve || !targetStatus) return;

    console.log("fasdfasdf");

    try {
      await resolveDisputeContract(
        contractToResolve.id,
        targetStatus,
        adminNotes
      );
      handleCloseResolutionModal();
    } catch (error) {
      // Error is handled in store
    }
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedContract(null);
  };

  const tableData = disputedContracts || [];

  return (
    <>
      <SideNav />
      <div
        style={{
          marginLeft: `${drawerWidth}px`,
          transition: "margin-left 0.3s ease-in-out",
          marginTop: "4rem",
        }}
      >
        <div
          className="container-fluid"
          style={{ minHeight: "100vh", paddingTop: "10px" }}
        >
          {/* Header */}
          <div
            className="row"
            style={{
              padding: "10px",
              paddingBottom: "1rem",
              borderBottom: "1px solid #E0E3EB",
            }}
          >
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <IconButton size="small" style={{ marginRight: "10px" }}>
                    <ArrowBackIcon />
                  </IconButton>
                  <h4
                    className="mb-0 me-3"
                    style={{
                      fontWeight: 600,
                      fontSize: "20px",
                      color: "#101219",
                    }}
                  >
                    Contracts
                  </h4>
                </div>
                <div style={{ width: "300px" }}>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            style={{ color: "#666", fontSize: "20px" }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: searchValue && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setSearchValue("")}
                          >
                            <CloseIcon style={{ fontSize: "18px" }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: {
                        backgroundColor: "white",
                        borderRadius: "25px",
                        fontSize: "14px",
                      },
                    }}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}

          <div className="row">
            <div className="col-12">
              <TableContainer style={{ marginTop: "1rem" }}>
                <Table style={{ boxShadow: "none", overflowX: "auto" }}>
                  <TableHead>
                    <TableRow sx={{ height: 32, bgcolor: "#1E9CBC" }}>
                      {[
                        { label: "Parent Name", key: "parent_name" },
                        { label: "Child Name", key: "child_name" },
                        { label: "Budget", key: "budget" },
                        { label: "Start Date", key: "start_date" },
                        { label: "Sessions", key: "sessions" },
                        { label: "Subjects", key: "sunjects" },
                        { label: "Days", key: "days" },
                        { label: "Description", key: "description" },
                        { label: "Status", key: "status" },
                        { label: "Action", key: "action" },
                      ].map(({ label, key }) => (
                        <TableCell
                          key={key}
                          sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoadingDisputedContracts ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <CircularProgress size={30} />
                        </TableCell>
                      </TableRow>
                    ) : disputedContractsError ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <Alert severity="error">
                            {disputedContractsError}
                          </Alert>
                        </TableCell>
                      </TableRow>
                    ) : tableData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No disputed contracts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableData.map((row) => {
                        return (
                          <TableRow
                            key={row.id}
                            hover
                            // onClick={() => handleViewDetails(row)}
                            sx={{
                              cursor: "pointer",
                              height: "40px",
                              backgroundColor: "transparent",
                            }}
                          >
                            <TableCell
                              sx={{
                                padding: "0 8px",
                                height: "40px",
                                lineHeight: "40px",
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              <Tooltip
                                title={
                                  row.parent?.firstName +
                                  " " +
                                  row.parent?.lastName
                                }
                                arrow
                              >
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: "#000",
                                    // height: 48,
                                    cursor: "pointer",
                                    maxWidth: "120px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {row.parent?.firstName} {row.parent?.lastName}
                                </div>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              style={{
                                border: "1px solid #e0e0e0",
                                padding: "0 8px",
                                height: "40px",
                                lineHeight: "40px",
                                // height: 48,
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <Tooltip
                                    title={row.Offer?.childName || ""}
                                    arrow
                                  >
                                    <div
                                      style={{
                                        fontWeight: 400,
                                        fontSize: "14px",
                                        color: "#000",
                                        cursor: "pointer",
                                        maxWidth: "100px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {row.Offer?.childName}
                                    </div>
                                  </Tooltip>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "14px",
                                color: "#000",
                                fontWeight: 400,
                                border: "1px solid #e0e0e0",
                                padding: "0 8px",
                                height: "40px",
                                lineHeight: "40px",
                                // height: 48,
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                <Tooltip title={row.amount} arrow>
                                  <div
                                    style={{
                                      fontWeight: 400,
                                      fontSize: "14px",
                                      color: "#000",
                                      cursor: "pointer",
                                      maxWidth: "140px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {row.amount}
                                  </div>
                                </Tooltip>
                              </div>
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "14px",
                                color: "#000",
                                fontWeight: 400,
                                padding: "0 8px",
                                height: "40px",
                                lineHeight: "40px",
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                <Tooltip
                                  title={
                                    row.startDate
                                      ? new Date(
                                          row.startDate
                                        ).toLocaleDateString()
                                      : "N/A"
                                  }
                                  arrow
                                >
                                  <div
                                    style={{
                                      fontWeight: 400,
                                      fontSize: "14px",
                                      color: "#000",
                                      cursor: "pointer",
                                      maxWidth: "120px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {new Date(
                                      row.startDate
                                    ).toLocaleDateString() || "N/A"}
                                  </div>
                                </Tooltip>
                              </div>
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "14px",
                                color: "#000",
                                fontWeight: 400,
                                border: "1px solid #e0e0e0",
                                padding: "0 8px",
                                height: "40px",
                                lineHeight: "40px",
                                // height: 48,
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                {row.completedSessions}
                              </div>
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "14px",
                                color: "#000",
                                fontWeight: 400,
                                border: "1px solid #e0e0e0",
                                padding: "0 8px",
                                height: "40px",
                                lineHeight: "40px",
                                maxWidth: "220px",
                              }}
                            >
                              <Tooltip
                                title={row.Offer?.subject?.join(", ") || ""}
                                arrow
                                placement="top"
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      fontSize: "13px",
                                      maxWidth: "300px",
                                      backgroundColor: "#333",
                                      padding: "8px 12px",
                                      lineHeight: 1.4,
                                    },
                                  },
                                }}
                              >
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                  }}
                                >
                                  {row.Offer?.subject?.join(", ") || "-"}
                                </div>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "14px",
                                color: "#000",
                                fontWeight: 400,
                                border: "1px solid #e0e0e0",
                                padding: "0 8px",
                                height: "40px",
                                lineHeight: "40px",
                                maxWidth: "220px",
                              }}
                            >
                              <Tooltip
                                title={row.Offer?.days?.join(", ") || ""}
                                arrow
                                placement="top"
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      fontSize: "13px",
                                      maxWidth: "300px",
                                      backgroundColor: "#333",
                                      padding: "8px 12px",
                                      lineHeight: 1.4,
                                    },
                                  },
                                }}
                              >
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                  }}
                                >
                                  {row.Offer?.days?.join(", ") || "-"}
                                </div>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "14px",
                                color: "#000",
                                fontWeight: 400,
                                border: "1px solid #e0e0e0",
                                padding: "0 8px",
                                height: "40px",
                                maxWidth: "220px",
                              }}
                            >
                              <Tooltip
                                title={row.disputeReason || ""}
                                arrow
                                placement="top"
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      fontSize: "13px",
                                      maxWidth: "300px",
                                      backgroundColor: "#333",
                                      padding: "8px 12px",
                                      lineHeight: 1.4,
                                    },
                                  },
                                }}
                              >
                                <div
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                  }}
                                >
                                  {row.disputeReason || "-"}
                                </div>
                              </Tooltip>
                            </TableCell>

                            <TableCell
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                height: "40px",
                                textAlign: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: "#2e7d32",
                                  border: "1px solid #2e7d32",
                                  padding: "2px 8px",
                                }}
                              >
                                {row.status}
                              </span>
                            </TableCell>

                            <TableCell
                              style={{
                                fontSize: "14px",
                                color: "#000",
                                fontWeight: 400,
                                border: "1px solid #e0e0e0",
                                padding: "0 24px",
                                // height: "40px",
                              }}
                            >
                              <Box display="flex" justifyContent="flex-end">
                                <IconButton
                                  size="small"
                                  onClick={handleMenuOpen}
                                >
                                  <MoreVertIcon />
                                </IconButton>

                                <Menu
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleMenuClose}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  PaperProps={{
                                    sx: {
                                      borderRadius: "8px",
                                      minWidth: "140px",
                                    },
                                  }}
                                >
                                  <MenuItem
                                    onClick={() => {
                                      handleMenuClose();
                                      handleViewDetails(row);
                                    }}
                                    sx={{
                                      color: "#fff",
                                      bgcolor: "#1976d2",
                                      "&:hover": {
                                        bgcolor: "#1565c0",
                                      },
                                      borderRadius: "4px",
                                      mx: 1,
                                      my: 0.5,
                                    }}
                                  >
                                    View
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      handleMenuClose();
                                      handleOpenResolutionModal(row, "ACTIVE");
                                    }}
                                    sx={{
                                      color: "#fff",
                                      bgcolor: "#ED6C02", // Warning/Orange color for Active/Reactivate
                                      "&:hover": {
                                        bgcolor: "#E65100",
                                      },
                                      borderRadius: "4px",
                                      mx: 1,
                                      my: 0.5,
                                    }}
                                  >
                                    Active
                                  </MenuItem>

                                  <MenuItem
                                    onClick={() => {
                                      handleMenuClose();
                                      handleOpenResolutionModal(
                                        row,
                                        "CANCELLED"
                                      );
                                    }}
                                    sx={{
                                      color: "#fff",
                                      bgcolor: "#d32f2f",
                                      "&:hover": {
                                        bgcolor: "#b71c1c",
                                      },
                                      borderRadius: "4px",
                                      mx: 1,
                                      my: 0.5,
                                    }}
                                  >
                                    Terminate
                                  </MenuItem>

                                  <MenuItem
                                    onClick={() => {
                                      handleMenuClose();
                                      handleOpenResolutionModal(
                                        row,
                                        "COMPLETED"
                                      );
                                    }}
                                    sx={{
                                      color: "#fff",
                                      bgcolor: "#2E7D32",
                                      "&:hover": {
                                        bgcolor: "#1b5e20",
                                      },
                                      borderRadius: "4px",
                                      mx: 1,
                                      my: 0.5,
                                    }}
                                  >
                                    Complete
                                  </MenuItem>
                                </Menu>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {disputedContractsPagination && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={disputedContractsPagination.total || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contract Details Modal */}
      <Dialog
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Contract Details
          </Typography>
          <IconButton onClick={handleCloseDetailsModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedContract && (
            <Grid container spacing={3}>
              {/* Dispute Info */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="error"
                  gutterBottom
                >
                  Dispute Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Reason
                    </Typography>
                    <Typography variant="body1">
                      {selectedContract.disputeReason}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedContract.status}
                      color="error"
                      size="small"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Disputed At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedContract.disputedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Parties */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Parent Details
                </Typography>
                <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedContract.parent?.firstName}{" "}
                    {selectedContract.parent?.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedContract.parent?.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedContract.parent?.phone}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Tutor Details
                </Typography>
                <Box sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedContract.tutor?.firstName}{" "}
                    {selectedContract.tutor?.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedContract.tutor?.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedContract.tutor?.phone}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Contract Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Contract Specification
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Child Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedContract.Offer?.childName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Amount
                    </Typography>
                    <Typography variant="body1">
                      {selectedContract.amount} {selectedContract.currency}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Plan Type
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {selectedContract.planType}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Start Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(
                        selectedContract.startDate
                      ).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Completed Sessions
                    </Typography>
                    <Typography variant="body1">
                      {selectedContract.completedSessions}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Subjects
                    </Typography>
                    <Typography variant="body1">
                      {selectedContract.Offer?.subject?.join(", ")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Days
                    </Typography>
                    <Typography variant="body1">
                      {selectedContract.Offer?.days?.join(", ")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Next Billing
                    </Typography>
                    <Typography variant="body1">
                      {new Date(
                        selectedContract.nextBillingDate
                      ).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDetailsModal}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resolution Confirmation Modal */}
      <Dialog
        open={resolutionModalOpen}
        onClose={handleCloseResolutionModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle sx={{ bgcolor: "#f5f5f5" }}>
          Resolve Dispute -{" "}
          <span style={{ textTransform: "capitalize" }}>{targetStatus}</span>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to mark this contract as{" "}
            <strong>{targetStatus}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please provide admin notes describing the resolution.
          </Typography>

          {resolveDisputeError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resolveDisputeError}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            id="admin_notes"
            label="Admin Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="e.g., Refund processed, Dispute invalid, etc."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseResolutionModal}
            disabled={isResolvingDispute}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitResolution}
            variant="contained"
            color="primary"
            disabled={isResolvingDispute}
            endIcon={
              isResolvingDispute ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            Confirm Resolution
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContractDashboard;
