import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "../sidebar/sidenav";
import {
  Avatar,
  Button,
  Chip,
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
  Tab,
  Tabs,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  ContentCopy as ContentCopyIcon,
  CalendarToday as CalendarTodayIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { useParentStore } from "../store/useParentStore";
import DocumentModal from "../components/DocumentModal";
import "bootstrap/dist/css/bootstrap.min.css";

const drawerWidth = 260;

const ParentsProfile = () => {
  const { id: parentId } = useParams();
  const navigate = useNavigate();
  const { parentDetails, fetchParentDetails, isLoading, error, clearError } = useParentStore();
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for editable fields - will be populated from API
  const [profileData, setProfileData] = useState({
    noOfHires: "0",
    joiningDate: "",
    children: "0", 
    amountSpent: "0.00",
    description: "",
  });

  // Fetch parent details on component mount
  useEffect(() => {
    if (parentId) {
      fetchParentDetails(parentId);
    }
  }, [parentId, fetchParentDetails]);

  // Update profile data when parent details are loaded
  useEffect(() => {
    if (parentDetails) {
      const { parent, children, transactions, subscriptions } = parentDetails;
      const totalAmount = transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
      
      setProfileData({
        noOfHires: subscriptions?.length?.toString() || "0",
        joiningDate: parent?.createdAt ? new Date(parent.createdAt).toLocaleDateString() : "",
        children: children?.length?.toString() || "0",
        amountSpent: `${totalAmount.toFixed(2)}`,
        description: parent?.description || "No description available",
      });
    }
  }, [parentDetails]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <SideNav />
        <div style={{ marginLeft: `${drawerWidth}px`, marginTop: "4rem", padding: "20px" }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading parent details...</Typography>
          </Box>
        </div>
      </>
    );
  }

  // Error state
  if (error && !parentDetails) {
    return (
      <>
        <SideNav />
        <div style={{ marginLeft: `${drawerWidth}px`, marginTop: "4rem", padding: "20px" }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={() => { clearError(); fetchParentDetails(parentId); }}>
                Retry
              </Button>
            }
          >
            Error loading parent details: {error}
          </Alert>
        </div>
      </>
    );
  }

  // If no parent details and not loading, show not found
  if (!parentDetails && !isLoading) {
    return (
      <>
        <SideNav />
        <div style={{ marginLeft: `${drawerWidth}px`, marginTop: "4rem", padding: "20px" }}>
          <Alert severity="warning">
            Parent not found. Please check the ID and try again.
          </Alert>
        </div>
      </>
    );
  }

  const { parent, children = [], subscriptions = [], transactions = [] } = parentDetails || {};

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentView = (document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "4px",
          }}
        >
          <ArrowUpwardIcon
            style={{ fontSize: "12px", color: "#FFFFFF", marginBottom: "-2px" }}
          />
          <ArrowDownwardIcon style={{ fontSize: "12px", color: "#FFFFFF" }} />
        </div>
      );
    }

    if (sortConfig.direction === "asc") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "4px",
          }}
        >
          <ArrowUpwardIcon
            style={{ fontSize: "12px", color: "#FFFFFF", marginBottom: "-2px" }}
          />
          <ArrowDownwardIcon style={{ fontSize: "12px", color: "#FFFFFF" }} />
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "4px",
          }}
        >
          <ArrowUpwardIcon
            style={{ fontSize: "12px", color: "#FFFFFF", marginBottom: "-2px" }}
          />
          <ArrowDownwardIcon style={{ fontSize: "12px", color: "#FFFFFF" }} />
        </div>
      );
    }
  };

  // Transform API data for display
  const transactionsData = transactions.map(tx => ({
    id: tx.id,
    payment: { 
      name: tx.childName || parent?.User?.fullName || "N/A", 
      cost: `$${tx.amount?.toFixed(2) || "0.00"}` 
    },
    child: {
      name: tx.childName || "N/A",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    paymentMethod: { 
      type: "stripe", 
      accountNumber: tx.invoiceId || "N/A" 
    },
    transactionDate: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A",
    status: tx.status || "unknown"
  }));

  const childrenData = children.map(child => ({
    id: child.id,
    childName: child.fullName || "N/A",
    grade: child.grade || "N/A",
    age: child.age || "N/A", 
    subjects: child.subjects?.join(", ") || "N/A",
    tutorHired: subscriptions.some(sub => sub.status === 'active') ? "Yes" : "No",
    currentTutors: subscriptions
      .filter(sub => sub.status === 'active')
      .map(sub => sub.tutor?.name || "Unknown")
      .join(", ") || "-",
  }));

  // For now, we don't have notes data from the API, so we'll show a placeholder
  const notesByTutorsData = [];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTableContent = () => {
    switch (activeTab) {
      case 0:
        return (
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
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Payment To
                      {getSortIcon("name")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Cost
                      {getSortIcon("cost")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Payment Method
                      {getSortIcon("paymentMethod")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Transaction Date
                      {getSortIcon("transactionDate")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionsData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      No transactions found for this parent
                    </TableCell>
                  </TableRow>
                ) : (
                  transactionsData.map((row) => (
                  <TableRow
                    key={row.id}
                    style={{ borderBottom: "1px solid #e0e0e0" }}
                  >
                    <TableCell style={{ border: "1px solid #e0e0e0" }}>
                      <img
                        src="https://png.pngtree.com/png-clipart/20220821/ourmid/pngtree-male-profile-picture-icon-and-png-image-png-image_6118773.png"
                        alt="Teacher"
                        style={{ width: 32, height: 32, borderRadius: "50%" }}
                      />
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#101219",
                          marginLeft: "5px",
                        }}
                      >
                        {row.payment.name}
                      </span>
                    </TableCell>
                    <TableCell style={{ border: "1px solid #e0e0e0" }}>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: 400,
                          color: "#101219",
                        }}
                      >
                        {row.payment.cost}
                      </span>
                    </TableCell>
                    <TableCell style={{ border: "1px solid #e0e0e0" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <img
                            src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/e2/75/5f/e2755f3b-22fc-2929-4619-2fe03c47e635/AppIcon-1x_U007emarketing-0-6-0-sRGB-85-220-0.png/256x256bb.jpg"
                            alt="Meezan Bank"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 400,
                              color: "#101219",
                            }}
                          >
                            ****{row.paymentMethod.accountNumber.slice(-4)}
                          </span>
                        </div>
                        <Tooltip title="Copy Account Number">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleCopy(row.paymentMethod.accountNumber)
                            }
                            style={{ padding: "1px", width: 20, height: 20 }}
                          >
                            <ContentCopyIcon style={{ color: "#A6ADBF" }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#4D5874",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      {row.transactionDate}
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 1: // Children
        return (
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
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Child Name
                      {getSortIcon("childName")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Age
                      {getSortIcon("age")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Grade
                      {getSortIcon("grade")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Subjects
                      {getSortIcon("subjects")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Tutor Hired?
                      {getSortIcon("tutorHired")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {childrenData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      No children found for this parent
                    </TableCell>
                  </TableRow>
                ) : (
                  childrenData.map((row) => (
                  <TableRow
                    key={row.id}
                    style={{ borderBottom: "1px solid #e0e0e0" }}
                  >
                    <TableCell
                      style={{
                        fontSize: "16px",
                        color: "#101219",
                        fontWeight: 400,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      {row.childName}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        color: "#101219",
                        fontWeight: 400,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      {row.age}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        color: "#101219",
                        fontWeight: 400,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      {row.grade}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        color: "#101219",
                        fontWeight: 400,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Tooltip title={row.subjects}>
                        <span style={{ 
                          display: 'block',
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap' 
                        }}>
                          {row.subjects}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        border: "1px solid #e0e0e0",
                        color: row.tutorHired === "Yes" ? "#4caf50" : "#f44336",
                        fontWeight: "400",
                      }}
                    >
                      {row.tutorHired}
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 2: // Notes by Tutors
        return (
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "none",
              border: "1px solid #E0E3EB",
              borderRadius: "8px",
            }}
          >
            <Table style={{ border: "1px solid #e0e0e0" }}>
              <TableHead style={{ backgroundColor: "#1E9CBC" }}>
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
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Note
                      {getSortIcon("note")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      From Tutor
                      {getSortIcon("fromTutor")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      To Child
                      {getSortIcon("toChild")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Date
                      {getSortIcon("date")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notesByTutorsData.map((row) => (
                  <TableRow
                    key={row.id}
                    style={{ borderBottom: "1px solid #e0e0e0" }}
                  >
                    <TableCell style={{ border: "1px solid #e0e0e0" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#3f51b5",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            N
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 400,
                            color: "#101219",
                          }}
                        >
                          {row.note}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell style={{ border: "1px solid #e0e0e0" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Avatar
                          src={row.fromTutor.avatar}
                          style={{ width: 24, height: 24 }}
                        />
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 400,
                            color: "#4D5874",
                          }}
                        >
                          {row.fromTutor.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell style={{ border: "1px solid #e0e0e0" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Avatar
                          src={row.toChild.avatar}
                          style={{ width: 24, height: 24 }}
                        />
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 400,
                            color: "#4D5874",
                          }}
                        >
                          {row.toChild.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "#4D5874",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      {row.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 3: // Documents
        return (
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "none",
              border: "1px solid #E0E3EB",
              borderRadius: "8px",
            }}
          >
            <Table style={{ border: "1px solid #e0e0e0" }}>
              <TableHead style={{ backgroundColor: "#1E9CBC" }}>
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
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Document Name
                      {getSortIcon("name")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("type")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Type
                      {getSortIcon("type")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("status")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Status
                      {getSortIcon("status")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("actions")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Actions
                      {getSortIcon("actions")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell
                    style={{
                      fontSize: "16px",
                      color: "#101219",
                      fontWeight: 400,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    No documents available
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "16px",
                      color: "#101219",
                      fontWeight: 400,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    -
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "16px",
                      color: "#101219",
                      fontWeight: "400",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    -
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "16px",
                      color: "#101219",
                      fontWeight: 400,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    -
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );

      default:
        return null;
    }
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
                  marginBottom: "20px",
                }}
              >
                <IconButton
                  onClick={() => navigate(-1)}
                  style={{
                    marginRight: "10px",
                    color: "#A6ADBF",
                    padding: "4px",
                  }}
                >
                  <ArrowBackIcon style={{ width: 20, height: 20 }} />
                </IconButton>
                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "20px",
                    color: "#101219",
                  }}
                >
                  {parent?.id || parentId}
                </h4>
              </div>

              {/* Profile Card */}
              <div
                style={{
                  backgroundColor: "#EEFBFD",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #D1D1DB",
                }}
              >
                <div className="row align-items-start">
                  {/* Left Column */}
                  <div className="col-md-8">
                    {/* Profile Picture and Name */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <Avatar
                          src={parent?.User?.image || "/placeholder.svg?height=60&width=60"}
                          style={{ width: 60, height: 60 }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "-2px",
                            right: "-2px",
                            width: "20px",
                            height: "20px",
                            backgroundColor: "#4caf50",
                            borderRadius: "50%",
                            border: "2px solid white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ color: "white", fontSize: "12px" }}>
                            ✓
                          </span>
                        </div>
                      </div>
                      <div>
                        <h5
                          style={{
                            margin: 0,
                            fontWeight: 500,
                            color: "#121217",
                            fontSize: "24px",
                          }}
                        >
                          {parent?.User?.fullName || "N/A"}
                        </h5>
                        <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                          {parent?.User?.email || "No email"}
                        </Typography>
                        {parent?.User?.phone && (
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            {parent?.User?.phone}
                          </Typography>
                        )}
                      </div>
                    </div>

                    {/* Status Below */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                        marginTop: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: 500,
                          color: "#121217",
                        }}
                      >
                        Tutor Status
                      </span>
                      <Chip
                        label="Verified"
                        size="small"
                        style={{
                          backgroundColor: "#EEFBF4",
                          border: "1px solid #B2EECC",
                          color: "#17663A",
                          fontWeight: 400,
                          fontSize: "14px",
                          padding: "4px 8px",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column - Edit Button */}
                  <div className="col-md-4 d-flex justify-content-end align-items-start">
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      style={{
                        backgroundColor: "#1E9CBC",
                        borderRadius: "8px",
                        color: "white",
                        textTransform: "none",
                        fontSize: "14px",
                      }}
                    >
                      Edit Details
                    </Button>
                  </div>
                </div>

                {/* Stats Row with Input Fields */}
                <div className="row mt-5">
                  <div className="col-3">
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#80878A",
                          marginBottom: "5px",
                        }}
                      >
                        No. of Hires
                      </div>
                      <TextField
                        value={profileData.noOfHires}
                        onChange={(e) =>
                          handleInputChange("noOfHires", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#80878A",
                          marginBottom: "5px",
                        }}
                      >
                        Joining Date
                      </div>
                      <TextField
                        value={profileData.joiningDate}
                        onChange={(e) =>
                          handleInputChange("joiningDate", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarTodayIcon
                                style={{
                                  fontSize: "14px",
                                  color: "#80878A",
                                  backgroundColor: "#F7FDFE",
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#80878A",
                          marginBottom: "5px",
                        }}
                      >
                        Children
                      </div>
                      <TextField
                        value={profileData.children}
                        onChange={(e) =>
                          handleInputChange("children", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#80878A",
                          marginBottom: "5px",
                        }}
                      >
                        Amount Spent All Time
                      </div>
                      <TextField
                        value={profileData.amountSpent}
                        onChange={(e) =>
                          handleInputChange("amountSpent", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description with Textarea */}
                <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                  <h6
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#121217",
                      marginBottom: "10px",
                    }}
                  >
                    Description
                  </h6>
                  <TextField
                    value={profileData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    variant="outlined"
                    multiline
                    rows={4}
                    style={{ width: "100%" }}
                    InputProps={{
                      style: {
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#30417D",
                        borderRadius: "8px",
                        backgroundColor: "#FFFFFF",
                        lineHeight: "1.5",
                      },
                    }}
                  />
                </div>
              </div>

              {/* Project Details */}
              <div style={{ paddingTop: "10px" }}>
                <h6
                  style={{
                    fontWeight: 500,
                    color: "#121217",
                    fontSize: "20px",
                    marginBottom: "20px",
                  }}
                >
                  Project Details
                </h6>

                {/* Tabs */}
                <Box
                  sx={{
                    border: "1px solid #D1D1DB",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    width: "40%",
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                      "& .MuiTab-root": {
                        textTransform: "none",
                        fontSize: "14px",
                        fontWeight: "normal",
                        color: "#666",
                        minHeight: "40px",
                        borderRight: "1px solid #D1D1DB", // border between tabs
                        paddingX: 2, // optional spacing
                        "&:last-of-type": {
                          borderRight: "none", // remove right border from last tab
                        },
                      },
                      "& .Mui-selected": {
                        color: "#1E9CBC !important",
                        fontWeight: 500,
                        fontSize: 14,
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#1E9CBC",
                      },
                    }}
                  >
                    <Tab label={`Transactions (${transactions.length})`} />
                    <Tab label={`Children (${children.length})`} />
                    <Tab label={`Notes by Tutors (0)`} />
                    <Tab label="Documents (0)" />
                  </Tabs>
                </Box>

                {/* Search and Filter Row */}
                <div className="row align-items-center mb-3">
                  <div className="col-md-6">
                    <TextField
                      placeholder="Search"
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
                      style={{ width: "230px" }}
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
                            gap: "8px", // space between text and icon
                          },
                          "& .MuiSelect-icon": {
                            marginRight: "4px", // optional: adjust icon alignment
                          },
                        }}
                      >
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={200}>200</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                {/* Table Content */}
                {renderTableContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      <DocumentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        document={selectedDocument}
      />
    </>
  );
};

export default ParentsProfile;
