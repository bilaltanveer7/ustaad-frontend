import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../sidebar/sidenav";
import { useAdminStore } from "../store/useAdminStore";
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
  Pagination,
  Card,
  CardContent,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const drawerWidth = 260;

const PendingUsersDashboard = () => {
  const navigate = useNavigate();
  const {
    pendingUsers,
    pendingUsersPagination,
    fetchPendingUsers,
    isLoadingPendingUsers,
    pendingUsersError,
    clearErrors,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch pending users on component mount
  useEffect(() => {
    fetchPendingUsers(currentPage, rowsPerPage);
  }, [fetchPendingUsers, currentPage, rowsPerPage]);

  // Loading state
  if (isLoadingPendingUsers && pendingUsers.length === 0) {
    return (
      <>
        <SideNav />
        <div
          style={{
            marginLeft: `${drawerWidth}px`,
            marginTop: "4rem",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading pending users...</Typography>
          </Box>
        </div>
      </>
    );
  }

  // Error state
  if (pendingUsersError && pendingUsers.length === 0) {
    return (
      <>
        <SideNav />
        <div
          style={{
            marginLeft: `${drawerWidth}px`,
            marginTop: "4rem",
            padding: "20px",
          }}
        >
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  clearErrors();
                  fetchPendingUsers(currentPage, rowsPerPage);
                }}
              >
                Retry
              </Button>
            }
          >
            Error loading pending users: {pendingUsersError}
          </Alert>
        </div>
      </>
    );
  }

  const handleRefresh = () => {
    fetchPendingUsers(currentPage, rowsPerPage);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleUserClick = (userId, role) => {
    navigate(`/pending-users/${userId}/${role}`);
  };

  // Filter users based on search and role filter
  const filteredUsers = pendingUsers.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.profileId && user.profileId.toString().includes(searchTerm)) ||
      (user.id && user.id.toLowerCase().includes(searchLower));

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  console.log(filteredUsers);

  const getVerificationStatus = (user) => {
    const verifications = [];
    if (user.isEmailVerified) verifications.push("Email");
    if (user.isPhoneVerified) verifications.push("Phone");
    if (user.isAdminVerified) verifications.push("Admin");
    return verifications;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { bg: "#FFF4E6", color: "#E65100", border: "#FFD54F" };
      case "approved":
        return { bg: "#EEFBF4", color: "#17663A", border: "#B2EECC" };
      case "rejected":
        return { bg: "#FEECEC", color: "#F31616", border: "#FFCDD2" };
      default:
        return { bg: "#F5F5F5", color: "#666", border: "#E0E0E0" };
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "PARENT":
        return { bg: "#E3F2FD", color: "#1976D2", border: "#BBDEFB" };
      case "TUTOR":
        return { bg: "#F3E5F5", color: "#7B1FA2", border: "#CE93D8" };
      case "ADMIN":
        return { bg: "#FFF3E0", color: "#F57C00", border: "#FFCC02" };
      default:
        return { bg: "#F5F5F5", color: "#666", border: "#E0E0E0" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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
                  Pending Users
                </h4>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={isLoadingPendingUsers}
                  style={{
                    borderColor: "#1E9CBC",
                    color: "#1E9CBC",
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {isLoadingPendingUsers ? "Refreshing..." : "Refresh"}
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <Card
                    sx={{
                      border: "1px solid #E0E3EB",
                      borderRadius: "12px",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: 600, color: "#101219" }}
                          >
                            {pendingUsersPagination?.totalPending || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Total Pending
                          </Typography>
                        </div>
                        <HourglassEmptyIcon
                          sx={{ color: "#E65100", fontSize: "40px" }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card
                    sx={{
                      border: "1px solid #E0E3EB",
                      borderRadius: "12px",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: 600, color: "#101219" }}
                          >
                            {pendingUsersPagination?.parentCount || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Parents
                          </Typography>
                        </div>
                        <PersonIcon
                          sx={{ color: "#1976D2", fontSize: "40px" }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card
                    sx={{
                      border: "1px solid #E0E3EB",
                      borderRadius: "12px",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: 600, color: "#101219" }}
                          >
                            {pendingUsersPagination?.tutorCount || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Tutors
                          </Typography>
                        </div>
                        <PersonIcon
                          sx={{ color: "#7B1FA2", fontSize: "40px" }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card
                    sx={{
                      border: "1px solid #E0E3EB",
                      borderRadius: "12px",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: 600, color: "#101219" }}
                          >
                            {
                              pendingUsers.filter(
                                (u) => u.isEmailVerified && u.isPhoneVerified
                              ).length
                            }
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Fully Verified
                          </Typography>
                        </div>
                        <CheckCircleIcon
                          sx={{ color: "#17663A", fontSize: "40px" }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Search and Filter Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <TextField
                    placeholder="Search by name, email, phone, or ID"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon style={{ color: "#8A8AA3" }} />
                        </InputAdornment>
                      ),
                    }}
                    style={{ width: "350px" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <div>
                    <FormControl size="small" style={{ minWidth: "120px" }}>
                      <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        displayEmpty
                        startAdornment={
                          <InputAdornment position="start">
                            <FilterListIcon style={{ color: "#8A8AA3" }} />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="ALL">All Roles</MenuItem>
                        <MenuItem value="PARENT">Parents</MenuItem>
                        <MenuItem value="TUTOR">Tutors</MenuItem>
                        <MenuItem value="ADMIN">Admins</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl size="small" style={{ minWidth: "80px" }}>
                      <Select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        displayEmpty
                      >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
              <Typography
                variant="body2"
                sx={{ color: "#999", fontSize: "12px", mt: 1 }}
              >
                Click on any user row to view detailed profile
              </Typography>

              {/* Users Table */}
              <TableContainer
                component={Paper}
                style={{
                  boxShadow: "none",
                  border: "1px solid #E0E3EB",
                  borderRadius: "8px",
                  marginTop: 5,
                }}
              >
                <Table style={{ border: "1px solid #e0e0e0" }}>
                  <TableHead sx={{
                    backgroundColor: "#1E9CBC", height: 32
                  }}>
                    <TableRow
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            // display: "flex",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#FFFFFF",
                            // alignItems: "center",
                          }}
                        >
                          User Details
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            // display: "flex",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#FFFFFF",
                            // alignItems: "center",
                          }}
                        >
                          Contact Info
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            // display: "flex",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#FFFFFF",
                            // alignItems: "center",
                          }}
                        >
                          Role
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            // display: "flex",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#FFFFFF",
                            // alignItems: "center",
                          }}
                        >
                          Verification Status
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            // display: "flex",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#FFFFFF",
                            // alignItems: "center",
                          }}
                        >
                          Registration Date
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            // display: "flex",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "#FFFFFF",
                            // alignItems: "center",
                          }}
                        >
                          Status
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#666",
                          }}
                        >
                          {searchTerm || roleFilter !== "ALL"
                            ? "No users found matching your criteria"
                            : "No pending users found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          onClick={() =>
                            handleUserClick(user.profileId, user.role)
                          }
                          style={{
                            borderBottom: "1px solid #e0e0e0",
                            // cursor: "pointer",
                          }}
                          // sx={{
                          //   "&:hover": {
                          //     backgroundColor: "#f0f8ff",
                          //     transform: "translateY(-1px)",
                          //     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          //   },
                          //   transition: "all 0.2s ease-in-out",
                          // }}
                        >
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Avatar
                                src={
                                  user.image ||
                                  "/placeholder.svg?height=40&width=40"
                                }
                                style={{ width: 40, height: 40 }}
                              >
                                {user.firstName?.charAt(0).toUpperCase()}
                              </Avatar>
                              <div>
                                <Typography
                                  // variant="body1"
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#000",
                                    margin: 0,
                                  }}
                                >
                                  {
                                    (user.firstName,
                                      " ",
                                      user.lastName || "N/A")
                                  }
                                </Typography>
                                <Typography
                                  // variant="body2"
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    margin: 0,
                                    // fontFamily: "monospace",
                                  }}
                                >
                                  ID: {user.id?.substring(0, 8)}...
                                </Typography>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  marginBottom: "4px",
                                }}
                              >
                                <EmailIcon
                                  style={{ fontSize: "16px", color: "#666" }}
                                />
                                <Typography
                                  // variant="body2"
                                  style={{ fontSize: "14px", color: "#000", fontWeight:400 }}
                                >
                                  {user.email}
                                </Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <PhoneIcon
                                  style={{ fontSize: "16px", color: "#666" }}
                                />
                                <Typography
                                  // variant="body2"
                                  style={{ fontSize: "14px", color: "#000", fontWeight:400 }}
                                >
                                  +{user.phone || "N/A"}
                                </Typography>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <Chip
                              label={user.role}
                              size="small"
                              style={{
                                backgroundColor: getRoleColor(user.role).bg,
                                border: `1px solid ${getRoleColor(user.role).border
                                  }`,
                                color: getRoleColor(user.role).color,
                                fontWeight: 500,
                                fontSize: "12px",
                              }}
                            />
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                {user.isEmailVerified ? (
                                  <CheckCircleIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#38BC5C",
                                    }}
                                  />
                                ) : (
                                  <CancelIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#F31616",
                                    }}
                                  />
                                )}
                                <Typography
                                  // variant="body2"
                                  style={{ fontSize: "12px", color: "#000" }}
                                >
                                  Email
                                </Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                {user.isPhoneVerified ? (
                                  <CheckCircleIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#38BC5C",
                                    }}
                                  />
                                ) : (
                                  <CancelIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#F31616",
                                    }}
                                  />
                                )}
                                <Typography
                                  // variant="body2"
                                  style={{ fontSize: "12px", color: "#000" }}
                                >
                                  Phone
                                </Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                {user.isAdminVerified ? (
                                  <CheckCircleIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#38BC5C",
                                    }}
                                  />
                                ) : (
                                  <CancelIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#F31616",
                                    }}
                                  />
                                )}
                                <Typography
                                  // variant="body2"
                                  style={{ fontSize: "12px", color: "#000" }}
                                >
                                  Admin
                                </Typography>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <Typography
                              // variant="body2"
                              style={{
                                fontSize: "14px",
                                color: "#000",
                                fontWeight:400
                              }}
                            >
                              {formatDate(user.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell style={{ border: "1px solid #e0e0e0" }}>
                            <Chip
                              label={user.isOnBoard?.toUpperCase() || "PENDING"}
                              size="small"
                              style={{
                                backgroundColor: getStatusColor(
                                  user.isOnBoard || "pending"
                                ).bg,
                                border: `1px solid ${getStatusColor(user.isOnBoard || "pending")
                                    .border
                                  }`,
                                color: getStatusColor(
                                  user.isOnBoard || "pending"
                                ).color,
                                fontWeight: 500,
                                fontSize: "12px",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pendingUsersPagination &&
                pendingUsersPagination.pagination.totalPages > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    {/* <Typography variant="body2" sx={{ color: "#666" }}>
                      Page {pendingUsersPagination.page} of{" "}
                      {pendingUsersPagination.totalPages} (
                      {pendingUsersPagination.total} total users)
                    </Typography> */}
                    <Pagination
                      count={pendingUsersPagination.pagination.totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      disabled={isLoadingPendingUsers}
                    />
                  </Box>
                )}

              {/* Show total count */}
              {filteredUsers.length > 0 && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <Typography variant="body2" style={{ color: "#666" }}>
                    Showing {filteredUsers.length} of{" "}
                    {pendingUsersPagination?.totalPending || 0} pending users
                    {(searchTerm || roleFilter !== "ALL") && " (filtered)"}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingUsersDashboard;
