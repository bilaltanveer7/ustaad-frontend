import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../sidebar/sidenav";
import { useAdminStore } from "../store/useAdminStore";
import profileImg from "../assets/profile.PNG";
import parentprofileImg from "../assets/parent_profile.PNG";
import { formatDate } from "../utils/dateFormatter";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Snackbar,
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
  const [openMessage, setOpenMessage] = useState(false);

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
    if (!userId || !role) return;
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
        return { bg: "#F5F5F5", color: "#666", border: "#E0E3EB" };
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
        return { bg: "#F5F5F5", color: "#666", border: "#E0E3EB" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };


  // const getDefaultAvatar = () => {
  //   if (user?.role === "TUTOR") return profileImg;
  //   if (user?.role === "PARENT") return parentprofileImg;
  //   return parentprofileImg; // fallback safety
  // };

  const handleProfileClick = (user) => {
    if (user.isOnBoard?.toLowerCase() === "required") {
      setOpenMessage(true);
      return;
    }

    handleUserClick(user.profileId, user.role);
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
          style={{
            minHeight: "100vh",
            padding: "20px",
            backgroundColor: "#F9F9FB",
          }}
        >
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
                      <PersonIcon sx={{ color: "#1976D2", fontSize: "40px" }} />
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
                      <PersonIcon sx={{ color: "#7B1FA2", fontSize: "40px" }} />
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
                  sx={{
                    width: "300px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      "& fieldset": {
                        borderRadius: "16px",
                      },
                    },
                  }}
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
                      sx={{
                        borderRadius: "16px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderRadius: "16px",
                        },
                      }}
                    >
                      <MenuItem value="ALL">All Roles</MenuItem>
                      <MenuItem value="PARENT">Parents</MenuItem>
                      <MenuItem value="TUTOR">Tutors</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <FormControl size="small" style={{ minWidth: "80px" }}>
                    <Select
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      displayEmpty
                      sx={{
                        borderRadius: "16px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderRadius: "16px",
                        },
                      }}
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
                // border: "1px solid #E0E3EB",
                // borderRadius: "8px",
                marginTop: 5,
              }}
            >
              <Table>
                <TableHead
                  sx={{
                    backgroundColor: "#FFFFFF",
                    height: 32,
                  }}
                >
                  <TableRow
                    sx={{
                      height: "32px",
                      py: 0,
                      px: 2,
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#4D5874",
                      whiteSpace: "nowrap",
                      verticalAlign: "middle",
                    }}
                  >
                    <TableCell
                      sx={{
                        height: "32px",
                        py: 0,
                        px: 2,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#4D5874",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}
                    >
                      User Details
                    </TableCell>
                    <TableCell
                      sx={{
                        height: "32px",
                        py: 0,
                        px: 2,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#4D5874",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}
                    >
                      Contact Info
                    </TableCell>
                    <TableCell
                      sx={{
                        height: "32px",
                        py: 0,
                        px: 2,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#4D5874",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}
                    >
                      Role
                    </TableCell>
                    <TableCell
                      sx={{
                        height: "32px",
                        py: 0,
                        px: 2,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#4D5874",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}
                    >
                      Verification Status
                    </TableCell>
                    <TableCell
                      sx={{
                        height: "32px",
                        py: 0,
                        px: 2,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#4D5874",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}
                    >
                      Joining Date
                    </TableCell>
                    <TableCell
                      sx={{
                        height: "32px",
                        py: 0,
                        px: 2,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#4D5874",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}
                    >
                      Status
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
                    filteredUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        style={{
                          borderBottom: "1px solid #E0E3EB",
                          // cursor: "pointer",
                        }}
                        sx={{
                          cursor: "pointer",
                          height: "48px",
                          backgroundColor:
                            index % 2 === 0 ? "#F5F5F5" : "#FFFFFF",
                        }}
                      >
                        <TableCell
                          // onClick={() =>
                          //   handleUserClick(user.profileId, user.role)
                          // }
                          onClick={() => handleProfileClick(user)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                            onClick={() =>
                              handleUserClick(user.profileId, user.role)
                            }
                          >
                            <Avatar
                              src={
                                user?.image && user.image.trim() !== ""
                                  ? user.image
                                  : user?.role?.toLowerCase() === "parent"
                                  ? parentprofileImg
                                  : profileImg
                              }
                              sx={{ width: 40, height: 40 }}
                            />
                            <div>
                              <Typography
                                // variant="body1"
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "#000",
                                  margin: 0,
                                  cursor: "pointer",
                                }}
                              >
                                {user.firstName +
                                  " " +
                                  (user.lastName || "N/A")}
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
                        <TableCell style={{ border: "1px solid #E0E3EB" }}>
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
                                style={{ fontSize: "16px", color: "#1E9CBC" }}
                              />
                              <Typography
                                // variant="body2"
                                style={{
                                  fontSize: "14px",
                                  color: "#000",
                                  fontWeight: 400,
                                }}
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
                                style={{ fontSize: "16px", color: "#1E9CBC" }}
                              />
                              <Typography
                                // variant="body2"
                                style={{
                                  fontSize: "14px",
                                  color: "#000",
                                  fontWeight: 400,
                                }}
                              >
                                +{user.phone || "N/A"}
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell style={{ border: "1px solid #E0E3EB" }}>
                          <Chip
                            label={user.role}
                            size="small"
                            style={{
                              backgroundColor: getRoleColor(user.role).bg,
                              border: `1px solid ${
                                getRoleColor(user.role).border
                              }`,
                              color: getRoleColor(user.role).color,
                              fontWeight: 500,
                              fontSize: "12px",
                            }}
                          />
                        </TableCell>
                        <TableCell style={{ border: "1px solid #E0E3EB" }}>
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
                        <TableCell style={{ border: "1px solid #E0E3EB" }}>
                          <Typography
                            // variant="body2"
                            style={{
                              fontSize: "14px",
                              color: "#000",
                              fontWeight: 400,
                            }}
                          >
                            {formatDate(user.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ border: "1px solid #E0E3EB" }}>
                          <Chip
                            label={user.isOnBoard?.toUpperCase() || "PENDING"}
                            size="small"
                            style={{
                              backgroundColor: getStatusColor(
                                user.isOnBoard || "pending"
                              ).bg,
                              border: `1px solid ${
                                getStatusColor(user.isOnBoard || "pending")
                                  .border
                              }`,
                              color: getStatusColor(user.isOnBoard || "pending")
                                .color,
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
            <Snackbar
              open={openMessage}
              autoHideDuration={3000}
              onClose={() => setOpenMessage(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="warning" variant="filled">
                On boarding is required
              </Alert>
            </Snackbar>

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
    </>
  );
};

export default PendingUsersDashboard;
