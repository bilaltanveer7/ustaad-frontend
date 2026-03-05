import React, { useState, useEffect } from "react";
import SideNav from "../sidebar/sidenav";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import TransactionDetailsModal from "./TransactionDetailsModal";
import profileImg from "../assets/profile.PNG"
import {
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  TablePagination,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const drawerWidth = 260;

const TransactionDashboard = () => {
  const navigate = useNavigate();
  const {
    paymentRequests,
    fetchPaymentRequests,
    updatePaymentStatus,
    paymentRequestsPagination,
    isLoadingPaymentRequests,
    paymentRequestsError,
    isUpdatingPaymentRequest,
  } = useAdminStore();

  console.log("paymentRequestsPagination", paymentRequestsPagination);

  const [selected, setSelected] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const statusOptions = [
    "ALL",
    "PENDING",
    "REQUESTED",
    "PAID",
    "IN_REVIEW",
    "REJECTED",
  ];
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch payment requests on component mount or when filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const statusParam = selectedStatus === "ALL" ? "" : selectedStatus;
      // API expects 1-based index for page
      fetchPaymentRequests(searchValue, statusParam, page + 1, rowsPerPage, selectedDate);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchPaymentRequests, searchValue, selectedStatus, page, rowsPerPage, selectedDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Transform API data to match table format
  const tableData = paymentRequests.map((request) => ({
    id: request.id,
    type: "Payment Request",
    amount: `${request.amount || 0}`,
    status: request.status,
    tutorName: request.User
      ? `${request.User.firstName} ${request.User.lastName}`
      : "Unknown",
    email: request.User?.email || "N/A",
    phone: request.User?.phone || "N/A",
    date: new Date(request.createdAt).toLocaleDateString() || "N/A",
    updatedAt: new Date(request.updatedAt).toLocaleDateString() || "N/A",
  }));

  // console.log("PAYMENT+++++REQUEST^^^$$$$$$$$$", paymentRequests);
  

  const handleCopy = async (text) => {
    if (text === undefined || text === null || text === "N/A") return;
    const value = String(text);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
      }
    } catch (err) {
      // Fallback
    }
    // Fallback logic
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <ArrowUpwardIcon style={{ fontSize: "16px", marginLeft: "4px" }} />
      ) : (
        <ArrowDownwardIcon style={{ fontSize: "16px", marginLeft: "4px" }} />
      );
    }
    return (
      <UnfoldMoreIcon
        style={{ fontSize: "16px", marginLeft: "4px", color: "#ccc" }}
      />
    );
  };

  const handleViewTransaction = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransactionId(null);
    // Refresh the payment requests list to get updated data
    fetchPaymentRequests();
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
          style={{ minHeight: "100vh", paddingTop: "10px" }}
        >
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
                    Transaction
                  </h4>
                  {/* <div
                    className="d-flex align-items-center text-muted"
                    style={{
                      fontSize: "14px",
                      backgroundColor: "#ECEEF3",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      width: "fit-content",
                    }}
                  >
                    <UpdateIcon
                      style={{ fontSize: "16px", marginRight: "5px" }}
                    />
                    Updated Now
                  </div> */}
                </div>
                <div style={{ width: "300px" }}>
                  <TextField
                    size="small"
                    placeholder="Search by Name"
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
          <div
            className="row"
            style={{ backgroundColor: "#F9F9FB", padding: "1rem" }}
          >
            <div className="col-12">
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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
                        selectedStatus === status ? "#1E9CBC" : "#FFFFFF",
                      color: selectedStatus === status ? "#fff" : "#000",
                      border: "1px solid #E0E3EB",
                      "&:hover": {
                        backgroundColor:
                          selectedStatus === status ? "#1E9CBC" : "#F5F5F5",
                      },
                    }}
                  />
                ))}
              </Box>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#4D5874",
                      marginRight: "20px",
                      border: "1px solid #E0E3EB",
                      padding: "6px 20px",
                      borderRadius: "4px",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {selected.length} Selected
                  </span>

                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "16px",
                      color: "#4D5874",
                    }}
                  >
                    {tableData.length} Results
                  </span>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <input
                    type="date"
                    placeholder="dd/mm/yyyy"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      fontSize: "14px",
                      borderRadius: "16px",
                      border: "1px solid #ccc",
                      backgroundColor: 'transparent'

                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Error Display */}
          {paymentRequestsError && (
            <div className="row">
              <div className="col-12">
                <Alert severity="error" sx={{ m: 2 }}>
                  Error loading payment requests: {paymentRequestsError}
                </Alert>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingPaymentRequests && (
            <div className="row">
              <div
                className="col-12"
                style={{ textAlign: "center", padding: "2rem" }}
              >
                <CircularProgress />
                <div style={{ marginTop: "1rem", color: "#666" }}>
                  Loading payment requests...
                </div>
              </div>
            </div>
          )}

          {!isLoadingPaymentRequests &&
            (!tableData || tableData.length === 0) && (
              <div className="row">
                <div
                  className="col-12"
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    color: "#666",
                    fontSize: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "64px",
                      marginBottom: "1rem",
                      opacity: 0.3,
                    }}
                  >
                    📋
                  </div>
                  <div>No transactions yet</div>
                </div>
              </div>
            )}
          {!isLoadingPaymentRequests && tableData && tableData.length > 0 && (
            <div className="row">
              <div className="col-12">
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ height: 32, bgcolor: "#FFFFFF" }}>
                        {[
                          { label: "Tutor Name", key: "tutorName" },
                          { label: "Email", key: "email" },
                          { label: "Phone", key: "phone" },
                          { label: "Amount", key: "amount" },
                          { label: "Status", key: "status" },
                          { label: "Date", key: "date" },
                          { label: "Actions", key: "actions" },
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
                              verticalAlign: "middle",
                            }}
                            onClick={() => handleSort(key)}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <span>{label}</span>
                              {getSortIcon(key)}
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.length > 0 ? (
                        tableData.map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          return (
                            <TableRow
                              key={row.id}
                              selected={isItemSelected}
                              sx={{
                                height: "48px",
                                backgroundColor: index % 2 === 0 ? "#F9F9FB" : "#FFFFFF",
                                "&:hover": {
                                  backgroundColor: "#F1F3F7",
                                },
                              }}
                            >
                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  color: "#000",
                                  padding: "0 8px",
                                  height: "48px",
                                  lineHeight: "48px",
                                  border: "1px solid #E0E3EB",
                                }}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  {/* <Avatar
                                    src="/placeholder.svg"
                                    sx={{ width: 24, height: 24 }}
                                  /> */}
                                  <Avatar
                                    src={profileImg || "/placeholder.svg"}
                                    sx={{ width: 24, height: 24 }}
                                  />
                                  <span>{row.tutorName}</span>
                                </div>
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  color: "#000",
                                  padding: "0 8px",
                                  height: "48px",
                                  lineHeight: "48px",
                                  border: "1px solid #E0E3EB",
                                }}
                              >
                                {row.email}
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  color: "#000",
                                  padding: "0 8px",
                                  height: "48px",
                                  lineHeight: "48px",
                                  border: "1px solid #E0E3EB",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  <span>+{row.phone}</span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleCopy(row.phone)}
                                  >
                                    <ContentCopyIcon
                                      style={{
                                        fontSize: "14px",
                                        color: "#666",
                                      }}
                                    />
                                  </IconButton>
                                </div>
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  color: "#000",
                                  padding: "0 8px",
                                  height: "48px",
                                  lineHeight: "48px",
                                  border: "1px solid #E0E3EB",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  {row.amount}
                                </div>
                              </TableCell>

                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  color: "#000",
                                  padding: "0 8px",
                                  height: "48px",
                                  lineHeight: "48px",
                                  border: "1px solid #E0E3EB",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-start gap-2">
                                  {/* Render status based on value */}
                                  {row.status === "PAID" && (
                                    <div
                                      style={{
                                        // backgroundColor: "#EEFCF3",
                                        color: "#38BC5C",
                                        // border:'1px solid #38BC5C',
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0px 4px",
                                        borderRadius: "6px",
                                        fontWeight: 500,
                                        fontSize: "12px",
                                        // textTransform: "capitalize",
                                      }}
                                    >
                                      <CheckCircleIcon
                                        style={{
                                          fontSize: "18px",
                                          marginRight: 4,
                                        }}
                                      />
                                      PAID
                                    </div>
                                  )}
                                  {row.status === "REJECTED" && (
                                    <div
                                      style={{
                                        // backgroundColor: "#FEECEC",
                                        color: "#F31616",
                                        // border:'1px solid #F31616',
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0px 4px",
                                        borderRadius: "6px",
                                        fontWeight: 500,
                                        fontSize: "14px",
                                      }}
                                    >
                                      <CancelIcon
                                        style={{
                                          fontSize: "18px",
                                          marginRight: 4,
                                        }}
                                      />
                                      REJECTED
                                    </div>
                                  )}
                                  {row.status === "PENDING" && (
                                    <div
                                      style={{
                                        // backgroundColor: "#F0F2F5",
                                        color: "#7D879C",
                                        // border:'1px solid #7D879C',
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0px 4px",
                                        borderRadius: "6px",
                                        fontWeight: 500,
                                        fontSize: "14px",
                                      }}
                                    >
                                      <PauseCircleFilledIcon
                                        style={{
                                          fontSize: "18px",
                                          marginRight: 4,
                                        }}
                                      />
                                      PENDING
                                    </div>
                                  )}
                                  {(row.status === "IN_REVIEW" ||
                                    row.status === "REQUESTED") && (
                                      <div
                                        style={{
                                          // backgroundColor: "#EEF3FF",
                                          color: "#235DFF",
                                          // border:'1px solid #235DFF',
                                          display: "flex",
                                          alignItems: "center",
                                          padding: "0px 4px",
                                          borderRadius: "6px",
                                          fontWeight: 500,
                                          fontSize: "14px",
                                          // textTransform:''
                                        }}
                                      >
                                        <InfoIcon
                                          style={{
                                            fontSize: "18px",
                                            marginRight: 4,
                                          }}
                                        />
                                        {row.status}
                                      </div>
                                    )}
                                </div>
                              </TableCell>

                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  color: "#4D5874",
                                  padding: "0 8px",
                                  height: "48px",
                                  lineHeight: "48px",
                                  border: "1px solid #E0E3EB",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  {row.date}
                                </div>
                              </TableCell>

                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  color: "#101219",
                                  padding: "0 8px",
                                  height: "48px",
                                  lineHeight: "48px",
                                  border: "1px solid #E0E3EB",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={
                                    <VisibilityIcon sx={{ color: "#1E9CBC" }} />
                                  }
                                  onClick={() => handleViewTransaction(row.id)}
                                  sx={{
                                    textTransform: "none",
                                    fontSize: "12px",
                                    minWidth: "80px",
                                    borderColor: "#1E9CBC",
                                    color: "#1E9CBC2",
                                    "&:hover": {
                                      borderColor: "#1E9CBC",
                                      backgroundColor: "#E3F2FD",
                                    },
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow style={{ height: 100 }}>
                          <TableCell
                            colSpan={5}
                            align="center"
                            style={{ color: "#4D5874" }}
                          >
                            <div style={{ padding: "20px", fontSize: "16px" }}>
                              No Transactions Found
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {paymentRequestsPagination && (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={paymentRequestsPagination.total || 0}
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

                      /* Remove spacer completely */
                      "& .MuiTablePagination-spacer": {
                        flex: "0 0 auto",
                      },

                      /* Left side */
                      "& .MuiTablePagination-selectLabel": {
                        margin: 0,
                      },

                      /* Center properly using flex grow */
                      "& .MuiTablePagination-displayedRows": {
                        margin: "0 auto",
                        whiteSpace: "nowrap",
                      },

                      /* Right side arrows */
                      "& .MuiTablePagination-actions": {
                        marginLeft: "auto",
                      },
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        transactionId={selectedTransactionId}
      />
    </>
  );
};

export default TransactionDashboard;
