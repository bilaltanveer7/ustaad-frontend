import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../sidebar/sidenav";
import { useAdminStore } from "../store/useAdminStore";
import AddAdminModal from "./AddAdminModal";
import DeleteAdminDialog from "./DeleteAdminDialog";
import profileImg from "../assets/profile.PNG";
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
  TablePagination,
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
import { formatDate } from "../utils/dateFormatter";

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
    clearErrors,
    pagination,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [page, setPage] = useState(0); // 0-indexed for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateInput, setDateInput] = useState("");
  const datePickerRef = useRef(null);

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins(selectedDate);
  }, [fetchAdmins, selectedDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Loading state
  if (isLoadingAdmins && admins.length === 0) {
    return (
      <>
        <SideNav />
        <div
          style={{
            marginLeft: `${drawerWidth}px`,
            marginTop: "4rem",
            padding: "20px",
            backgroundColor: "#F9F9FB",
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
        <div
          style={{
            marginLeft: `${drawerWidth}px`,
            marginTop: "4rem",
            padding: "20px",
            backgroundColor: "#F9F9FB",
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
                  fetchAdmins();
                }}
              >
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
  const filteredAdmins = admins.filter((admin) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${admin.firstName || ""} ${
      admin.lastName || ""
    }`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
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
      console.error("Error deleting admin:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAdminToDelete(null);
  };
  console.log("pagination++++++++", pagination);

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
          <div>
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
            {/* <div
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
                      <PersonIcon
                        style={{
                          fontSize: "40px",
                          color: "#1E9CBC",
                          marginBottom: "10px",
                        }}
                      />
                      <Typography
                        variant="h4"
                        style={{ fontWeight: 600, color: "#101219" }}
                      >
                        {admins.length}
                      </Typography>
                      <Typography variant="body1" style={{ color: "#666" }}>
                        Total Admins
                      </Typography>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 500,
                        color: "#101219",
                        marginBottom: "10px",
                      }}
                    >
                      Admin Management
                    </Typography>
                    <Typography variant="body2" style={{ color: "#666" }}>
                      Manage system administrators, create new admin accounts,
                      and monitor admin activities. Admins have full access to
                      the platform and can manage users, transactions, and
                      system settings.
                    </Typography>
                  </div>
                </div>
              </div> */}

            {/* Search and Filter Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                {/* <TextField
                  placeholder="Search by name, email, or phone"
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
                /> */}
                <TextField
                  placeholder="Search by name, email, or phone"
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
                        <SearchIcon sx={{ color: "#8A8AA3" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              {/* <div className="col-md-6 text-end">
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
                </div> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  border: "1px solid #ccc",
                  borderRadius: "16px",
                  padding: "4px 10px",
                  backgroundColor: "transparent",
                  marginBottom: "12px",
                }}
              >
                <input
                  ref={datePickerRef}
                  type="date"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                    width: 0,
                    height: 0,
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      const [yyyy, mm, dd] = val.split("-");
                      setDateInput(`${dd}/${mm}/${yyyy}`);
                      setSelectedDate(val);
                    }
                  }}
                />
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={dateInput}
                  maxLength={10}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^\d/]/g, "");
                    if (val.length === 2 && dateInput.length === 1) val += "/";
                    else if (val.length === 5 && dateInput.length === 4)
                      val += "/";
                    setDateInput(val);
                    if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
                      const [dd, mm, yyyy] = val.split("/");
                      setSelectedDate(`${yyyy}-${mm}-${dd}`);
                    } else {
                      setSelectedDate("");
                    }
                  }}
                  style={{
                    fontSize: "14px",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    width: "100px",
                  }}
                />
                <button
                  onClick={() => datePickerRef.current?.showPicker()}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    color: "#888",
                  }}
                  title="Open calendar"
                >
                  📅
                </button>
                {dateInput && (
                  <button
                    onClick={() => {
                      setDateInput("");
                      setSelectedDate("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#aaa",
                      padding: "0",
                      lineHeight: 1,
                    }}
                    title="Clear date"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Admins Table */}
            <TableContainer
              component={Paper}
              style={{
                boxShadow: "none",
                // border: "1px solid #E0E3EB",
                // borderRadius: "8px",
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#FFFFFF", height: 32 }}>
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
                      ID
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
                      Admin Details
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
                      Email
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
                      Created Date
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
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "#666",
                        }}
                      >
                        {searchTerm
                          ? "No admins found matching your search"
                          : "No admins found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedAdmins.map((admin) => (
                      <TableRow
                        key={admin.id}
                        style={{
                          height: "48px",
                          backgroundColor: "transparent",
                        }}
                      >
                        <TableCell
                          style={{
                            fontSize: "16px",
                            color: "#101219",
                            fontWeight: 400,
                            border: "1px solid #E0E3EB",
                            padding: "0 8px",
                            height: "48px",
                            lineHeight: "48px",
                          }}
                        >
                          <Tooltip title={admin.id} arrow>
                            <div
                              style={{
                                fontWeight: 400,
                                fontSize: "16px",
                                color: "#000",
                                // border: "1px solid #E0E3EB",
                                py: 0,
                                // height: 48,
                                cursor: "pointer",
                                maxWidth: "60px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {admin.id}
                            </div>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            color: "#101219",
                            fontWeight: 400,
                            border: "1px solid #E0E3EB",
                            padding: "0 8px",
                            height: "48px",
                            lineHeight: "48px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {/* <Avatar
                                src={
                                  admin.image ? admin.image : profileImg
                                }
                                style={{ width: 25, height: 25 }}
                              >
                                {admin.firstName?.charAt(0).toUpperCase()}
                              </Avatar> */}
                            <div>
                              <Tooltip
                                title={
                                  admin.firstName + " " + admin.lastName ||
                                  "N/A"
                                }
                                arrow
                              >
                                <div
                                  // variant="body1"
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: 400,
                                    color: "#000",
                                    margin: 0,
                                    cursor: "pointer",
                                    maxWidth: "100px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {admin.firstName + " " + admin.lastName ||
                                    "N/A"}
                                </div>
                              </Tooltip>
                              {/* <Typography
                                  variant="body2"
                                  style={{
                                    fontSize: "14px",
                                    color: "#666",
                                    marginTop: -10,
                                  }}
                                >
                                  Admin
                                </Typography> */}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            color: "#101219",
                            fontWeight: 400,
                            border: "1px solid #E0E3EB",
                            padding: "0 8px",
                            height: "48px",
                            lineHeight: "48px",
                          }}
                        >
                          <Tooltip title={admin.email || "N/A"} arrow>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "#000",
                                // cursor: "pointer",
                                maxWidth: "150px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {admin.email || "N/A"}
                            </div>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            color: "#4D5874",
                            fontWeight: 400,
                            border: "1px solid #E0E3EB",
                            padding: "0 8px",
                            height: "48px",
                            lineHeight: "48px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 400,
                              color: "#4D5874",
                            }}
                          >
                            {formatDate(admin.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            color: "#101219",
                            fontWeight: 400,
                            border: "1px solid #E0E3EB",
                            padding: "0 8px",
                            height: "48px",
                            lineHeight: "48px",
                          }}
                        >
                          <Chip
                            label="Active"
                            size="small"
                            style={{
                              backgroundColor: "#EEFBF4",
                              border: "1px solid #B2EECC",
                              color: "#17663A",
                              fontWeight: 400,
                              fontSize: "14px",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "16px",
                            color: "#101219",
                            fontWeight: 400,
                            border: "1px solid #E0E3EB",
                            padding: "0 8px",
                            height: "48px",
                            lineHeight: "48px",
                          }}
                        >
                          <Tooltip title="Delete Admin">
                            <IconButton
                              onClick={() => handleDeleteClick(admin)}
                              disabled={isDeletingAdmin}
                              size="small"
                              sx={{
                                color: "#f44336",
                                "&:hover": {
                                  backgroundColor: "#ffebee",
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
            {admins.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={admins.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  width: "100%",

                  "& .MuiTablePagination-toolbar": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                  },

                  /* LEFT: Rows per page (label + select) */
                  "& .MuiTablePagination-selectLabel": {
                    margin: 0,
                  },

                  /* CENTER: 1–2 of 2 */
                  "& .MuiTablePagination-displayedRows": {
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    margin: 0,
                    whiteSpace: "nowrap",
                  },

                  /* RIGHT: arrows */
                  "& .MuiTablePagination-actions": {
                    marginLeft: "auto",
                  },

                  "& .MuiTablePagination-spacer": {
                    display: "none",
                  },
                }}
              />
            )}

            {/* Show total count */}
            {/* {admins.length > 0 && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <Typography variant="body2" style={{ color: "#666" }}>
                    Showing {Math.min(displayedAdmins.length, rowsPerPage)} of{" "}
                    {filteredAdmins.length} admins
                    {searchTerm && ` (filtered from ${admins.length} total)`}
                  </Typography>
                </div>
              )} */}
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
