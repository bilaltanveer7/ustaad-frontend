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
import { capitalize } from "../utils/helpers";
import { formatDate } from "../utils/dateFormatter";

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
    isRefundingContract,
    refundContractError,
    refundContract,
  } = useAdminStore();
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const statusOptions = [
    "ALL",
    "ACTIVE",
    "DISPUTE",
    "CANCELLED",
    "COMPLETED",
    "REFUNDED",
  ];
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedContract, setSelectedContract] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState(""); // "active" | "cancelled" | "completed" | "refund"
  const [adminNotes, setAdminNotes] = useState("");
  const [contractToResolve, setContractToResolve] = useState(null);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState("");

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event, row) => {
    console.log("event", event);
    console.log("row", row);
    setSelectedContract(row);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Fetch with pagination
  useEffect(() => {
    const typeParam = selectedStatus === "ALL" ? "all" : selectedStatus;
    const query = `?page=${
      page + 1
    }&limit=${rowsPerPage}&search=${searchValue}&type=${typeParam}&date=${selectedDate}`;
    fetchDisputedContracts(query);
  }, [
    fetchDisputedContracts,
    page,
    rowsPerPage,
    searchValue,
    selectedStatus,
    selectedDate,
  ]);

  const handleRefund = async () => {
    if (!selectedContract) return;

    if (window.confirm("Are you sure you want to refund this contract?")) {
      const result = await refundContract(selectedContract.id);
      if (result.success) {
        alert("Refund processed successfully");
        handleCloseDetailsModal();
        // Refresh the list
        const typeParam = selectedStatus === "ALL" ? "all" : selectedStatus;
        const query = `?page=${
          page + 1
        }&limit=${rowsPerPage}&search=${searchValue}&type=${typeParam}`;
        fetchDisputedContracts(query);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log("disputedContractsPagination", disputedContractsPagination);

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
    // console.log("contract", contract);
    // setSelectedContract(contract);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedContract(null);
  };

  const tableData = disputedContracts || [];

  const dummyTableData = [
    {
      id: 1,
      parent_name: "Ali Khan",
      child_name: "Ayaan Khan",
      tutor_name: "Sara Ahmed",
      budget: "25,000 PKR",
      start_date: "01-02-2025",
      sessions: 20,
      subjects: "Math, Science",
      days: "Mon, Wed, Fri",
      description: "Evening tuition sessions",
      status: "Active",
    },
    {
      id: 2,
      parent_name: "Usman Raza",
      child_name: "Hiba Raza",
      tutor_name: "Adeel Hassan",
      budget: "30,000 PKR",
      start_date: "05-02-2025",
      sessions: 24,
      subjects: "English, History",
      days: "Tue, Thu",
      description: "Weekend focus classes",
      status: "Disputed",
    },
    {
      id: 3,
      parent_name: "Fatima Noor",
      child_name: "Zain Noor",
      tutor_name: "Maryam Iqbal",
      budget: "20,000 PKR",
      start_date: "10-02-2025",
      sessions: 16,
      subjects: "Physics",
      days: "Mon, Thu",
      description: "Concept clearing sessions",
      status: "Cancelled",
    },
    {
      id: 4,
      parent_name: "Ahmed Ali",
      child_name: "Hassan Ali",
      tutor_name: "Bilal Khan",
      budget: "28,000 PKR",
      start_date: "15-02-2025",
      sessions: 18,
      subjects: "Chemistry, Biology",
      days: "Wed, Sat",
      description: "Exam preparation",
      status: "Refund",
    },
  ];

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
                  {/* <IconButton size="small" style={{ marginRight: "10px" }}>
                    <ArrowBackIcon />
                  </IconButton> */}
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
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setPage(0);
                    }}
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
                            onClick={() => {
                              setSearchValue("");
                              setPage(0);
                            }}
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

          <div
            className="row"
            style={{
              backgroundColor: "#F9F9FB",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                {statusOptions.map((status) => (
                  <Chip
                    key={status}
                    label={status}
                    clickable
                    onClick={() => {
                      setSelectedStatus(status);
                      setPage(0);
                    }}
                    sx={{
                      borderRadius: "16px",
                      fontWeight: 500,
                      backgroundColor:
                        selectedStatus === status ? "#1E9CBC" : "#E0E3EB",
                      color: selectedStatus === status ? "#fff" : "#000",
                      "&:hover": {
                        backgroundColor:
                          selectedStatus === status ? "#1E9CBC" : "#CFD8DC",
                      },
                    }}
                  />
                ))}
              </Box>
              <div>
                <input
                  type="date"
                  // placeholder="MM/DD/YYYY"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    borderRadius: "16px",
                    border: "1px solid #ccc",
                    backgroundColor: "transparent",
                    // width:'90%'
                  }}
                />
              </div>
            </div>
            <TableContainer style={{ marginTop: "1rem" }}>
              <Table style={{ boxShadow: "none", overflowX: "auto" }}>
                <TableHead>
                  <TableRow sx={{ height: 32, bgcolor: "#FFFFFF" }}>
                    {[
                      { label: "Parent Name", key: "parent_name" },
                      { label: "Child Name", key: "child_name" },
                      { label: "Tutor Name", key: "" },
                      { label: "Budget", key: "budget" },
                      { label: "Start Date", key: "start_date" },
                      { label: "Total Sessions", key: "total_sessions" },
                      {
                        label: "Completed Sessions",
                        key: "completed_sessions",
                      },
                      { label: "Subjects", key: "sunjects" },
                      { label: "Description", key: "description" },
                      { label: "Status", key: "status" },
                      { label: "Action", key: "action" },
                    ].map(({ label, key }) => (
                      <TableCell
                        key={key}
                        sx={{
                          height: "32px",
                          py: 0,
                          px: 2,
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#4D5874",
                          whiteSpace: "nowrap",
                          // verticalAlign: "middle",
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
                        <Alert severity="error">{disputedContractsError}</Alert>
                      </TableCell>
                    </TableRow>
                  ) : tableData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No disputed contracts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableData.map((row, index) => {
                      return (
                        <TableRow
                          key={row.id}
                          hover
                          // onClick={() => handleViewDetails(row)}
                          sx={{
                            cursor: "pointer",
                            height: "48px",
                            backgroundColor:
                              index % 2 === 0 ? "#F5F5F5" : "#FFFFFF",
                          }}
                        >
                          <TableCell
                            sx={{
                              padding: "0 8px",
                              height: "48px",
                              lineHeight: "48px",
                              border: "1px solid #E0E3EB",
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
                                  fontWeight: 400,
                                  fontSize: "16px",
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
                              border: "1px solid #E0E3EB",
                              padding: "0 8px",
                              height: "48px",
                              lineHeight: "48px",
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
                                      fontSize: "16px",
                                      color: "#000",
                                      cursor: "pointer",
                                      maxWidth: "100px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {row.Offer?.childName}
                                  </div>
                                </Tooltip>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: "0 8px",
                              height: "48px",
                              lineHeight: "48px",
                              border: "1px solid #E0E3EB",
                            }}
                          >
                            <Tooltip
                              title={
                                row.tutor?.firstName + " " + row.tutor?.lastName
                              }
                              arrow
                            >
                              <div
                                style={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  color: "#000",
                                  // height: 48,
                                  cursor: "pointer",
                                  maxWidth: "120px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {row.tutor?.firstName} {row.tutor?.lastName}
                              </div>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "16px",
                              color: "#000",
                              fontWeight: 400,
                              border: "1px solid #E0E3EB",
                              padding: "0 8px",
                              height: "48px",
                              lineHeight: "48px",
                              // height: 48,
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <Tooltip title={row.amount} arrow>
                                <div
                                  style={{
                                    fontWeight: 400,
                                    fontSize: "16px",
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
                              fontSize: "16px",
                              color: "#000",
                              fontWeight: 400,
                              padding: "0 8px",
                              height: "48px",
                              lineHeight: "48px",
                              border: "1px solid #E0E3EB",
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <Tooltip
                                title={
                                  row.startDate
                                    ? formatDate(row.startDate)
                                    : "N/A"
                                }
                                arrow
                              >
                                <div
                                  style={{
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    color: "#4D5874",
                                    cursor: "pointer",
                                    maxWidth: "120px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {formatDate(row.startDate)}
                                </div>
                              </Tooltip>
                            </div>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "16px",
                              color: "#000",
                              fontWeight: 400,
                              border: "1px solid #E0E3EB",
                              padding: "0 8px",
                              height: "48px",
                              lineHeight: "48px",
                              // height: 48,
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              {row?.Offer?.sessions}
                            </div>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "16px",
                              color: "#000",
                              fontWeight: 400,
                              border: "1px solid #E0E3EB",
                              padding: "0 8px",
                              height: "48px",
                              lineHeight: "48px",
                              // height: 48,
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              {row?.completedSessions}
                            </div>
                          </TableCell>
                          <TableCell
                            style={{
                              fontSize: "16px",
                              color: "#000",
                              fontWeight: 400,
                              border: "1px solid #E0E3EB",
                              padding: "0 8px",
                              height: "48px",
                              lineHeight: "48px",
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
                              fontSize: "16px",
                              color: "#000",
                              fontWeight: 400,
                              border: "1px solid #E0E3EB",
                              padding: "0 8px",
                              height: "48px",
                              maxWidth: "220px",
                            }}
                          >
                            <Tooltip
                              title={row?.Offer?.description || ""}
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
                                {row?.Offer?.description || "-"}
                              </div>
                            </Tooltip>
                          </TableCell>

                          <TableCell
                            style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              height: "48px",
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
                              fontSize: "16px",
                              color: "#000",
                              fontWeight: 400,
                              border: "1px solid #E0E3EB",
                              padding: "0 24px",
                              // height: "40px",
                            }}
                          >
                            <Box display="flex" justifyContent="flex-end">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, row)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <Menu
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
                  handleViewDetails(selectedContract);
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
              {selectedContract?.status?.toUpperCase() !== "COMPLETED" &&
                selectedContract?.status?.toUpperCase() !== "CANCELLED" &&
                selectedContract?.status?.toUpperCase() !== "REFUNDED" && (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        handleOpenResolutionModal(selectedContract, "ACTIVE");
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
                          selectedContract,
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
                          selectedContract,
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
                    {/* 
                    {selectedContract?.isRefunded === false && (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          handleOpenResolutionModal(selectedContract, "REFUND");
                        }}
                        sx={{
                          color: "#fff",
                          bgcolor: "#063455",
                          "&:hover": {
                            bgcolor: "#063455",
                          },
                          borderRadius: "4px",
                          mx: 1,
                          my: 0.5,
                        }}
                      >
                        Refund
                      </MenuItem>
                    )}
                  </>
                )}
            </Menu> */}

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
              {/* VIEW - always visible */}
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleViewDetails(selectedContract);
                }}
                sx={{
                  color: "#fff",
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#1565c0" },
                  borderRadius: "4px",
                  mx: 1,
                  my: 0.5,
                }}
              >
                View
              </MenuItem>

              {/* DISPUTE STATUS */}
              {selectedContract?.status?.toUpperCase() === "DISPUTE" && (
                <>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      handleOpenResolutionModal(selectedContract, "ACTIVE");
                    }}
                    sx={{
                      color: "#fff",
                      bgcolor: "#ED6C02",
                      "&:hover": { bgcolor: "#E65100" },
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
                      handleOpenResolutionModal(selectedContract, "CANCELLED");
                    }}
                    sx={{
                      color: "#fff",
                      bgcolor: "#d32f2f",
                      "&:hover": { bgcolor: "#b71c1c" },
                      borderRadius: "4px",
                      mx: 1,
                      my: 0.5,
                    }}
                  >
                    Terminate
                  </MenuItem>
                </>
              )}

              {/* CANCELLED STATUS */}
              {selectedContract?.status?.toUpperCase() === "CANCELLED" && (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleOpenResolutionModal(selectedContract, "REFUND");
                  }}
                  sx={{
                    color: "#fff",
                    bgcolor: "#063455",
                    "&:hover": { bgcolor: "#052c46" },
                    borderRadius: "4px",
                    mx: 1,
                    my: 0.5,
                  }}
                >
                  Refund
                </MenuItem>
              )}
            </Menu>

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
                sx={{
                  width: "100%",
                  "& .MuiTablePagination-toolbar": {
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiTablePagination-spacer": {
                    flex: "0 0 auto",
                  },
                  "& .MuiTablePagination-selectLabel": {
                    margin: 0,
                  },
                  "& .MuiTablePagination-displayedRows": {
                    margin: "0 auto",
                    whiteSpace: "nowrap",
                  },
                  "& .MuiTablePagination-actions": {
                    marginLeft: "auto",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* </div > */}

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
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left */}
          <Typography variant="h6" fontWeight="bold">
            Contract Details
          </Typography>

          {/* Center */}
          {selectedContract?.disputedAt && (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Disputed At: {formatDate(selectedContract.disputedAt)}
            </Typography>
          )}

          {/* Right */}
          {selectedContract?.status && (
            <Chip
              label={selectedContract.status}
              size="small"
              variant="outlined"
              color={
                selectedContract.status?.toUpperCase() === "CANCELLED" ||
                selectedContract.status?.toUpperCase() === "DISPUTE"
                  ? "error"
                  : "success"
              }
            />
          )}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedContract && (
            <Box>
              {/* Dispute Info */}
              {/* <Grid item xs={12}> */}
              {refundContractError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {refundContractError}
                </Alert>
              )}
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                {/* Reason Box */}
                <Box sx={{ width: "40%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Reason
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 1,
                      height: "20vh",
                      overflowY: "auto",
                    }}
                  >
                    <Typography variant="body1">
                      {selectedContract?.disputeReason}
                    </Typography>
                  </Box>
                </Box>

                {/* Parent Details */}
                <Box sx={{ width: "30%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Parent Details
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 1,
                      height: "20vh",
                      overflowY: "auto",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Name:</strong>{" "}
                      {selectedContract?.parent?.firstName}{" "}
                      {selectedContract?.parent?.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedContract?.parent?.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {selectedContract?.parent?.phone}
                    </Typography>
                  </Box>
                </Box>

                {/* Tutor Details */}
                <Box sx={{ width: "30%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Tutor Details
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 1,
                      height: "20vh",
                      overflowY: "auto",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Name:</strong>{" "}
                      {selectedContract?.tutor?.firstName}{" "}
                      {selectedContract?.tutor?.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedContract?.tutor?.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {selectedContract?.tutor?.phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Contract Info */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Contract Specification
                </Typography>

                {/* First Row */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* Box 1 */}
                  <Box
                    sx={{
                      width: "33.33%",
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 1,
                      height: "25vh",
                      overflowY: "auto",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <strong>Child Name:</strong>
                      <span style={{ textTransform: "capitalize" }}>
                        {selectedContract?.Offer?.childName}
                      </span>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <strong>Amount:</strong>
                      <span>
                        {selectedContract?.amount} {selectedContract?.currency}
                      </span>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <strong>Plan Type:</strong>
                      <span style={{ textTransform: "capitalize" }}>
                        {selectedContract?.planType}
                      </span>
                    </Typography>
                  </Box>

                  {/* Box 2 */}
                  <Box
                    sx={{
                      width: "33.33%",
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 1,
                      height: "25vh",
                      overflowY: "auto",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <strong>Start Date:</strong>
                      <span>{formatDate(selectedContract?.startDate)}</span>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <strong>Total Sessions:</strong>
                      <span>{selectedContract?.Offer?.sessions}</span>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <strong>Completed Sessions:</strong>
                      <span>{selectedContract?.completedSessions}</span>
                    </Typography>
                  </Box>

                  {/* Box 3 */}
                  <Box
                    sx={{
                      width: "33.33%",
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 1,
                      height: "25vh",
                      overflowY: "auto",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <strong>Tutoring Days:</strong>
                      <span style={{ textTransform: "capitalize" }}>
                        {selectedContract?.Offer?.daysOfWeek?.join(", ") ||
                          "N/A"}
                      </span>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <strong>Cost Per Session:</strong>
                      <span>{selectedContract?.oneSessionCost}</span>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", gap: 1 }}
                    >
                      <strong>Subjects:</strong>
                      <span style={{ textTransform: "capitalize" }}>
                        {selectedContract?.Offer?.subject?.join(", ")}
                      </span>
                    </Typography>
                  </Box>
                </Box>

                {/* Refund Row */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "#f8f9fa",
                    borderRadius: 1,
                    width: "33.33%",
                  }}
                >
                  <Typography variant="body2" color="#d32f2f" fontWeight="500">
                    Refund Amount
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#d32f2f", fontWeight: "bold" }}
                  >
                    {((selectedContract?.Offer?.sessions || 0) -
                      (selectedContract?.completedSessions || 0)) *
                      (selectedContract?.oneSessionCost || 0)}{" "}
                    {selectedContract?.currency}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Box>
            {(selectedContract?.status === "CANCELLED" ||
              selectedContract?.status === "COMPLETED") &&
              selectedContract?.isRefunded === false && (
                <Button
                  onClick={handleRefund}
                  variant="outlined"
                  color="error"
                  disabled={isRefundingContract}
                  startIcon={
                    isRefundingContract ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {isRefundingContract ? "Refunding..." : "Refund"}
                </Button>
              )}
          </Box>
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
