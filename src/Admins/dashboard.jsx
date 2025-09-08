import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../sidebar/sidenav";
import { useAdminStore } from "../store/useAdminStore";
import AddAdminModal from "./AddAdminModal";
import DeleteAdminDialog from "./DeleteAdminDialog";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const drawerWidth = 260;

const AdminsDashboard = () => {
  const navigate = useNavigate();
  const { 
    admins, 
    fetchAdmins, 
    deleteAdminById,
    isLoadingAdmins, 
    isDeletingAdmin,
    adminsError, 
    clearErrors 
  } = useAdminStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Loading state
  if (isLoadingAdmins && admins.length === 0) {
    return (
      <>
        <SideNav />
        <div style={{ marginLeft: `${drawerWidth}px`, marginTop: "4rem", padding: "20px" }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading admins...</Typography>
          </Box>
        </div>
      </>
    );
  }

  // Error state
  if (adminsError && admins.length === 0) {
    return (
      <>
        <SideNav />
        <div style={{ marginLeft: `${drawerWidth}px`, marginTop: "4rem", padding: "20px" }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={() => { clearErrors(); fetchAdmins(); }}>
                Retry
              </Button>
            }
          >
            Error loading admins: {adminsError}
          </Alert>
        </div>
      </>
    );
  }

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const searchLower = searchTerm.toLowerCase();
    return (
      admin.fullName?.toLowerCase().includes(searchLower) ||
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.id?.toString().includes(searchLower)
    );
  });

  const displayedAdmins = filteredAdmins.slice(0, rowsPerPage);

  const handleAddAdmin = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAdminAdded = () => {
    // Refresh the admins list
    fetchAdmins();
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (adminId) => {
    try {
      const result = await deleteAdminById(adminId);
      if (result.success) {
        setDeleteDialogOpen(false);
        setAdminToDelete(null);
        // No need to refresh - the store already updates the list
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAdminToDelete(null);
  };

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
          style={{ minHeight: "100vh", padding: "20px" }}
        >
          <div className="row" style={{ padding: "20px" }}>
            <div className="col-12">
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "24px",
                    color: "#101219",
                  }}
                >
                  Admins Management
                </h4>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddAdmin}
                  style={{
                    backgroundColor: "#1E9CBC",
                    borderRadius: "8px",
                    color: "white",
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Add Admin
                </Button>
              </div>

              {/* Stats Card */}
              <div
                style={{
                  backgroundColor: "#EEFBFD",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #D1D1DB",
                }}
              >
                <div className="row">
                  <div className="col-md-3">
                    <div style={{ textAlign: "center" }}>
                      <PersonIcon style={{ fontSize: "40px", color: "#1E9CBC", marginBottom: "10px" }} />
                      <Typography variant="h4" style={{ fontWeight: 600, color: "#101219" }}>
                        {admins.length}
                      </Typography>
                      <Typography variant="body1" style={{ color: "#666" }}>
                        Total Admins
                      </Typography>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <Typography variant="h6" style={{ fontWeight: 500, color: "#101219", marginBottom: "10px" }}>
                      Admin Management
                    </Typography>
                    <Typography variant="body2" style={{ color: "#666" }}>
                      Manage system administrators, create new admin accounts, and monitor admin activities.
                      Admins have full access to the platform and can manage users, transactions, and system settings.
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Search and Filter Row */}
              <div className="row align-items-center mb-3">
                <div className="col-md-6">
                  <TextField
                    placeholder="Search by name, email, or ID"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon style={{ color: "#8A8AA3" }} />
                        </InputAdornment>
                      ),
                    }}
                    style={{ width: "300px" }}
                  />
                </div>
                <div className="col-md-6 text-end">
                  <FormControl size="small" style={{ minWidth: "80px" }}>
                    <Select
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(e.target.value)}
                      displayEmpty
                      sx={{
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        },
                        "& .MuiSelect-icon": {
                          marginRight: "4px",
                        },
                      }}
                    >
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={200}>200</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Admins Table */}
              <TableContainer
                component={Paper}
                style={{
                  boxShadow: "none",
                  border: "1px solid #E0E3EB",
                  borderRadius: "8px",
                }}
              >
                <Table style={{ border: "1px solid #e0e0e0" }}>
                  <TableHead sx={{ backgroundColor: "#1E9CBC", height: 32 }}>
                    <TableRow
                      sx={{
                        "& th": {
                          height: "32px",
                          paddingTop: "0px",
                          paddingBottom: "0px",
                          lineHeight: "32px",
                          backgroundColor: "#1E9CBC",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "14px",
                          border: "1px solid #4db6ac",
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            fontWeight: 500,
                            fontSize: "14px",
                            color: "#FFFFFF",
                            alignItems: "center",
                          }}
                        >
                          ID
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            fontWeight: 500,
                            fontSize: "14px",
                            color: "#FFFFFF",
                            alignItems: "center",
                          }}
                        >
                          Admin Details
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            fontWeight: 500,
                            fontSize: "14px",
                            color: "#FFFFFF",
                            alignItems: "center",
                          }}
                        >
                          Email
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            fontWeight: 500,
                            fontSize: "14px",
                            color: "#FFFFFF",
                            alignItems: "center",
                          }}
                        >
                          Created Date
                        </Box>
                      </TableCell>
                                              <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#FFFFFF",
                              alignItems: "center",
                            }}
                          >
                            Status
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "#FFFFFF",
                              alignItems: "center",
                            }}
                          >
                            Actions
                          </Box>
                        </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedAdmins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                          {searchTerm ? 'No admins found matching your search' : 'No admins found'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedAdmins.map((admin) => (
                        <TableRow
                          key={admin.id}
                          style={{ borderBottom: "1px solid #e0e0e0" }}
                        >
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#1E9CBC",
                              }}
                            >
                              #{admin.id}
                            </span>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <Avatar
                                src={admin.image || "/placeholder.svg?height=40&width=40"}
                                style={{ width: 40, height: 40 }}
                              >
                                {admin.fullName?.charAt(0).toUpperCase()}
                              </Avatar>
                              <div>
                                <Typography
                                  variant="body1"
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    color: "#101219",
                                    margin: 0,
                                  }}
                                >
                                  {admin.fullName || "N/A"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  style={{
                                    fontSize: "14px",
                                    color: "#666",
                                    margin: 0,
                                  }}
                                >
                                  Admin
                                </Typography>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "#101219",
                              }}
                            >
                              {admin.email || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "#4D5874",
                              }}
                            >
                              {admin.createdAt 
                                ? new Date(admin.createdAt).toLocaleDateString()
                                : "N/A"
                              }
                            </span>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <Chip
                              label="Active"
                              size="small"
                              style={{
                                backgroundColor: "#EEFBF4",
                                border: "1px solid #B2EECC",
                                color: "#17663A",
                                fontWeight: 500,
                                fontSize: "12px",
                              }}
                            />
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <Tooltip title="Delete Admin">
                              <IconButton
                                onClick={() => handleDeleteClick(admin)}
                                disabled={isDeletingAdmin}
                                size="small"
                                sx={{
                                  color: '#f44336',
                                  '&:hover': {
                                    backgroundColor: '#ffebee',
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Show total count */}
              {admins.length > 0 && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <Typography variant="body2" style={{ color: "#666" }}>
                    Showing {Math.min(displayedAdmins.length, rowsPerPage)} of {filteredAdmins.length} admins
                    {searchTerm && ` (filtered from ${admins.length} total)`}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AddAdminModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdminAdded={handleAdminAdded}
      />

      {/* Delete Admin Dialog */}
      <DeleteAdminDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        admin={adminToDelete}
        isDeleting={isDeletingAdmin}
        error={adminsError}
      />
    </>
  );
};

export default AdminsDashboard;
