import React, { useState, useEffect } from "react";
import SideNav from "../sidebar/sidenav";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import TransactionDetailsModal from "./TransactionDetailsModal";
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
    isLoadingPaymentRequests,
    paymentRequestsError,
    isUpdatingPaymentRequest,
  } = useAdminStore();

  const [selected, setSelected] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  // Fetch payment requests on component mount
  useEffect(() => {
    fetchPaymentRequests();
  }, [fetchPaymentRequests]);

  // Transform API data to match table format
  const tableData = paymentRequests.map((request) => ({
    id: request.id,
    type: "Payment Request", // All are payment requests from tutors
    amount: `$${request.amount || 0}`,
    payment_method: "Bank Transfer", // Default payment method
    status: request.status,
    tutorId: request.tutorId,
    subscriptionId: request.subscriptionId,
    date: new Date(request.createdAt).toLocaleDateString() || "N/A",
    updatedAt: new Date(request.updatedAt).toLocaleDateString() || "N/A",
  }));

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
                    Transaction
                  </h4>
                  <div
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
                  </div>
                </div>
                <div style={{ width: "300px" }}>
                  <TextField
                    size="small"
                    placeholder="Search"
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
          <div
            className="row"
            style={{ backgroundColor: "#F9F9FB", padding: "1rem" }}
          >
            <div className="col-12">
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
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    style={{
                      textTransform: "none",
                      fontSize: "14px",
                      color: "#4D5874",
                      border: "1px solid #E0E3EB",
                      backgroundColor: "#FFFFFF",
                      marginRight: "20px",
                    }}
                  >
                    Filter
                    <Chip
                      label="4"
                      size="small"
                      style={{
                        marginLeft: "8px",
                        backgroundColor: "#FEECEC",
                        color: "#F31616",
                        fontSize: "12px",
                        height: "20px",
                      }}
                    />
                  </Button>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "16px",
                      color: "#4D5874",
                    }}
                  >
                    {tableData.length} Results
                  </span>
                  {/* <span
                     style={{
                       fontWeight: 400,
                       fontSize: "12px",
                       color: "#999",
                       marginLeft: "10px",
                     }}
                   >
                     Click "View" to see transaction details
                   </span> */}
                </div>
                {/* <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  style={{
                    backgroundColor: "#1E9CBC",
                    color: "white",
                    textTransform: "none",
                    fontSize: "14px",
                    borderRadius: "6px",
                    padding: "8px 16px",
                  }}
                >
                  Add New
                </Button> */}
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
                      <TableRow sx={{ height: 32, bgcolor: "#1E9CBC" }}>
                        {[
                          { label: "Type", key: "type" },
                          { label: "Amount", key: "amount" },
                          { label: "Payment Method", key: "payment_method" },
                          { label: "Status", key: "status" },
                          { label: "Tutor ID", key: "tutorId" },
                          { label: "Date", key: "date" },
                          { label: "Actions", key: "actions" },
                        ].map(({ label, key }) => (
                          <TableCell
                            key={key}
                            sx={{
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#FFFFFF",
                              // cursor: "pointer",
                              py: 0,
                              height: 32,
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
                      {tableData?.length > 0 ? (
                        tableData.map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          return (
                            <TableRow
                              key={row.id}
                              selected={isItemSelected}
                              sx={{
                                backgroundColor:
                                  index % 2 === 0 ? "white" : "#fafafa",
                                borderBottom: "1px solid #e0e0e0",
                              }}
                            >
                              <TableCell
                                style={{
                                  fontWeight: 500,
                                  fontSize: "14px",
                                  color: "#101219",
                                  border: "1px solid #e0e0e0",
                                  cursor: "pointer",
                                  py: 0,
                                }}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <div
                                    style={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor:
                                        row.type === "Withdraw"
                                          ? "#FEECEC"
                                          : "#EEFCF3",
                                    }}
                                  >
                                    {row.type === "Withdraw" ? (
                                      <ArrowUpwardIcon
                                        style={{
                                          color: "#F31616",
                                          fontSize: "16px",
                                          fontWeight: "bold",
                                        }}
                                      />
                                    ) : (
                                      <ArrowDownwardIcon
                                        style={{
                                          color: "#38BC5C",
                                          fontSize: "16px",
                                          fontWeight: "bold",
                                        }}
                                      />
                                    )}
                                  </div>
                                  <span>{row.type}</span>
                                </div>
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "14px",
                                  color: "#101219",
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  {row.amount}
                                </div>
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "14px",
                                  color: "#101219",
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  {row.payment_method}
                                </div>
                              </TableCell>

                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  color: "#101219",
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-start gap-2">
                                  {/* Render status based on value */}
                                  {row.status === "PAID" && (
                                    <div
                                      style={{
                                        backgroundColor: "#EEFCF3",
                                        color: "#38BC5C",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px 8px",
                                        borderRadius: "6px",
                                        fontWeight: 500,
                                        fontSize: "14px",
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
                                        backgroundColor: "#FEECEC",
                                        color: "#F31616",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px 8px",
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
                                        backgroundColor: "#F0F2F5",
                                        color: "#7D879C",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px 8px",
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
                                        backgroundColor: "#EEF3FF",
                                        color: "#235DFF",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "4px 8px",
                                        borderRadius: "6px",
                                        fontWeight: 500,
                                        fontSize: "14px",
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
                                style={{ border: "1px solid #e0e0e0" }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  <span
                                    style={{
                                      fontWeight: 400,
                                      fontSize: "14px",
                                      color: "#101219",
                                      fontFamily: "monospace",
                                      backgroundColor: "#f5f5f5",
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    {row.tutorId?.substring(0, 8) || "N/A"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: 400,
                                  fontSize: "14px",
                                  color: "#101219",
                                  border: "1px solid #e0e0e0",
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
                                  color: "#4D5874",
                                  border: "1px solid #e0e0e0",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleViewTransaction(row.id)}
                                  sx={{
                                    textTransform: "none",
                                    fontSize: "12px",
                                    minWidth: "80px",
                                    borderColor: "#1976D2",
                                    color: "#1976D2",
                                    "&:hover": {
                                      borderColor: "#1565C0",
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
