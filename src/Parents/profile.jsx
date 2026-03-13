import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "../sidebar/sidenav";
import parentprofileImg from "../assets/parent_profile.PNG";
import profileImg from "../assets/profile.PNG";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
  Close as CloseIcon,
} from "@mui/icons-material";
import { useParentStore } from "../store/useParentStore";
import { useAdminStore } from "../store/useAdminStore";
import { formatDate } from "../utils/dateFormatter";
import DocumentModal from "../components/DocumentModal";
import DeleteUserDialog from "../components/DeleteUserDialog";
import config from "../utils/config";
import "bootstrap/dist/css/bootstrap.min.css";

const drawerWidth = 260;

const ParentsProfile = () => {
  const { id: parentId } = useParams();
  const navigate = useNavigate();
  const { parentDetails, fetchParentDetails, isLoading, error, clearError } =
    useParentStore();

  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { deleteUserById, isDeletingUser, deleteUserError } = useAdminStore();

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
      const totalAmount =
        transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

      setProfileData({
        noOfHires: subscriptions?.length?.toString() || "0",
        joiningDate: parent?.createdAt ? formatDate(parent.createdAt) : "",
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
                  clearError();
                  fetchParentDetails(parentId);
                }}
              >
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
        <div
          style={{
            marginLeft: `${drawerWidth}px`,
            marginTop: "4rem",
            padding: "20px",
          }}
        >
          <Alert severity="warning">
            Parent not found. Please check the ID and try again.
          </Alert>
        </div>
      </>
    );
  }

  const {
    parent,
    children = [],
    subscriptions = [],
    transactions = [],
    childNotes = [],
  } = parentDetails || {};

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleCopy = async (text) => {
    if (text === undefined || text === null) return;
    const value = String(text);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
      }
    } catch (err) {
      // Fall back to legacy copy approach below
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
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

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const result = await deleteUserById(parentId);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      navigate("/admin/parents"); // Redirect to parents list after deletion
    }
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
  const transactionsData = transactions
    .filter((tx) => {
      if (activeTab !== 0 || !searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        (tx.tutor?.name && tx.tutor.name.toLowerCase().includes(term)) ||
        (tx.invoiceId && tx.invoiceId.toLowerCase().includes(term)) ||
        (tx.amount && tx.amount.toString().includes(term))
      );
    })
    .map((tx) => ({
      id: tx.id,
      payment: {
        recipient:
          tx.childName ||
          (parent?.User?.firstName && parent?.User?.lastName
            ? `${parent.User.firstName} ${parent.User.lastName}`
            : parent?.User?.firstName || parent?.User?.lastName || "N/A"),
        cost: `${tx.amount?.toFixed(2) || "0.00"}`,
      },
      tutorName: tx.tutor.name || "N/A",
      child: {
        name: tx.childName || "N/A",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      invoiceId: tx.invoiceId || "N/A",
      paymentMethod: {
        type: "stripe",
        accountNumber: tx.invoiceId || "N/A",
      },
      transactionDate: tx.createdAt ? formatDate(tx.createdAt) : "N/A",
      status: tx.status || "unknown",
    }));

  // console.log("transactionsData", children);

  const childrenData = children
    .filter((child) => {
      if (activeTab !== 1 || !searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const childName = (child.firstName + " " + child.lastName).toLowerCase();
      return (
        childName.includes(term) ||
        (child.grade && child.grade.toLowerCase().includes(term)) ||
        (child.curriculum && child.curriculum.toLowerCase().includes(term)) ||
        (child.gender && child.gender.toLowerCase().includes(term))
      );
    })
    .map((child) => {
      const subscriptionSessionInfo = child.subscriptions?.length
        ? child.subscriptions
            .map(
              (sub) =>
                `${sub.Offer?.sessions || 0} / ${
                  sub.tutorSessionsDetailCount || 0
                }`
            )
            .join(", ")
        : null;

      return {
        id: child.id,
        childName: child.firstName + " " + child.lastName || "N/A",
        grade: child.grade || "N/A",
        age: child.age || "N/A",
        gender: child.gender || "N/A",
        curriculum: child.curriculum || "N/A",
        subjects: child.subscriptions?.length
          ? [
              ...new Set(
                child.subscriptions.flatMap((sub) => sub.Offer?.subject || [])
              ),
            ].join(", ") || "N/A"
          : child.subjects?.join(", ") || "N/A",
        tutorHired:
          subscriptionSessionInfo ||
          (subscriptions.some((sub) => sub.status === "active") ? "Yes" : "No"),
        currentTutors:
          subscriptions
            .filter((sub) => sub.status === "active")
            .map((sub) => sub.tutor?.name || "Unknown")
            .join(", ") || "-",
      };
    });

  // Map childNotes to the structure expected by the table
  const notesByTutorsData =
    childNotes?.map((note) => ({
      id: note.id,
      note: (
        <>
          <strong>{note.headline}</strong>
          {note.description ? `: ${note.description}` : ""}
        </>
      ),
      fromTutor: {
        name: note.User
          ? `${note.User.firstName} ${note.User.lastName}`
          : "Unknown",
        avatar: note.User?.image || "/placeholder.svg?height=32&width=32",
      },
      toChild: {
        name: note.childName || "Unknown",
        avatar: "/placeholder.svg?height=32&width=32", // Child avatar not in provided data
      },
      date: note.createdAt ? formatDate(note.createdAt) : "N/A",
    })) || [];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchTerm("");
  };

  const renderTableContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <TableContainer
            style={{
              boxShadow: "none",
              border: "1px solid #E0E3EB",
              borderRadius: "8px",
            }}
          >
            <Table style={{ border: "1px solid #E0E3EB" }}>
              <TableHead
                sx={{
                  backgroundColor: "#1E9CBC",
                  "& .MuiTableCell-root": {
                    height: 32,
                    py: 0,
                    px: 2,
                    color: "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    borderBottom: "none",
                  },
                }}
              >
                <TableRow sx={{ height: 32 }}>
                  <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                    >
                      Payment To
                      {getSortIcon("name")}
                    </Box>
                  </TableCell>

                  <TableCell onClick={() => handleSort("cost")}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                    >
                      Budget
                      {getSortIcon("cost")}
                    </Box>
                  </TableCell>

                  <TableCell onClick={() => handleSort("invoiceId")}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                    >
                      Invoice ID
                      {getSortIcon("invoiceId")}
                    </Box>
                  </TableCell>

                  <TableCell onClick={() => handleSort("transactionDate")}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "100%",
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
                    <TableCell
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#666",
                      }}
                    >
                      No transactions found for this parent
                    </TableCell>
                  </TableRow>
                ) : (
                  transactionsData.map((row) => (
                    <TableRow
                      key={row.id}
                      style={{ borderBottom: "1px solid #E0E3EB" }}
                    >
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          paddingLeft: "15px",
                        }}
                      >
                        <img
                          src={profileImg}
                          alt="Teacher"
                          style={{ width: 25, height: 25, borderRadius: "50%" }}
                        />
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: "16px",
                            color: "#101219",
                            marginLeft: "10px",
                          }}
                        >
                          {row.tutorName}
                        </span>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          paddingLeft: "15px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          {row.payment.cost}
                        </span>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          paddingLeft: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {row.invoiceId}
                          <Tooltip title="Copy Account Number">
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(row.invoiceId)}
                              style={{ padding: "1px", width: 20, height: 20 }}
                            >
                              <ContentCopyIcon
                                style={{ color: "#A6ADBF", fontSize: "16px" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: 400,
                          fontSize: "16px",
                          color: "#4D5874",
                          padding: "0 8px",
                          height: "30px",
                          lineHeight: "30px",
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          paddingLeft: "15px",
                        }}
                      >
                        {row.transactionDate}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 1: // Children
        return (
          <TableContainer
            style={{
              boxShadow: "none",
              border: "1px solid #E0E3EB",
              borderRadius: "8px",
            }}
          >
            <Table style={{ border: "1px solid #E0E3EB" }}>
              <TableHead
                sx={{
                  backgroundColor: "#1E9CBC",
                  "& .MuiTableCell-root": {
                    height: 32,
                    py: 0,
                    px: 2,
                    color: "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    borderBottom: "none",
                  },
                }}
              >
                <TableRow
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#FFFFFF",
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
                      Curriculum
                      {getSortIcon("curriculum")}
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
                      Gender
                      {getSortIcon("gender")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {childrenData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#666",
                      }}
                    >
                      No children found for this parent
                    </TableCell>
                  </TableRow>
                ) : (
                  childrenData.map((row) => (
                    <TableRow
                      key={row.id}
                      style={{ borderBottom: "1px solid #E0E3EB" }}
                    >
                      <TableCell
                        style={{
                          fontSize: "14px",
                          color: "#000",
                          fontWeight: 400,
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "30px",
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          textTransform: "capitalize",
                          paddingLeft: "15px",
                        }}
                      >
                        {row.childName}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          color: "#000",
                          fontWeight: 400,
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "30px",
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          paddingLeft: "15px",
                        }}
                      >
                        {row.age}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          color: "#000",
                          fontWeight: 400,
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "30px",
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          paddingLeft: "15px",
                        }}
                      >
                        {row.grade}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          color: "#000",
                          fontWeight: 400,
                          padding: "0 8px",
                          // height: "30px",
                          lineHeight: "30px",
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          paddingLeft: "15px",
                        }}
                      >
                        {row.curriculum}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#000",
                          fontWeight: 400,
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          // color:
                          // row.tutorHired === "Yes" ? "#4caf50" : "#f44336",
                          // fontWeight: "500",
                          textTransform: "capitalize",
                          paddingLeft: "15px",
                        }}
                      >
                        {row.gender}
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
            <Table style={{ border: "1px solid #E0E3EB" }}>
              <TableHead
                sx={{
                  backgroundColor: "#1E9CBC",
                  "& .MuiTableCell-root": {
                    height: 32,
                    py: 0,
                    px: 2,
                    color: "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    borderBottom: "none",
                  },
                }}
              >
                <TableRow
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#FFFFFF",
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
                      Tutor Name
                      {getSortIcon("note")}
                    </Box>
                  </TableCell>
                  {/* <TableCell onClick={() => handleSort("name")}>
                    <Box
                      sx={{
                        display: "flex",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#FFFFFF",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Tutor Name
                      {getSortIcon("fromTutor")}
                    </Box>
                  </TableCell> */}
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
                      {getSortIcon("toChild")}
                    </Box>
                  </TableCell>

                  {/* <TableCell onClick={() => handleSort("name")}>
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
                      Session Number
                      {getSortIcon("session-number")}
                    </Box>
                  </TableCell> */}
                  <TableCell>
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
                      Notes
                      {getSortIcon("notes")}
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
                {notesByTutorsData && notesByTutorsData.length > 0 ? (
                  notesByTutorsData.map((row) => (
                    <TableRow
                      key={row.id}
                      style={{ borderBottom: "1px solid #E0E3EB" }}
                    >
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          border: "1px solid #E0E3EB",
                          paddingLeft: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Avatar
                            src={row?.fromTutor?.avatar || profileImg}
                            sx={{ width: 24, height: 24 }}
                            imgProps={{
                              onError: (e) => {
                                e.target.src = parentprofileImg;
                              },
                            }}
                          />
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 400,
                              color: "#101219",
                            }}
                          >
                            {row.fromTutor.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          border: "1px solid #E0E3EB",
                          paddingLeft: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Avatar
                            src={row.toChild.avatar || { profileImg }}
                            style={{ width: 24, height: 24 }}
                          />
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 400,
                              color: "#101219",
                              textTransform: "capitalize",
                            }}
                          >
                            {row.toChild.name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          border: "1px solid #E0E3EB",
                          paddingLeft: "15px",
                        }}
                      >
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
                              backgroundColor: "#1E9CBC",
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
                          <Tooltip title={row.note} arrow>
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "#101219",
                                maxWidth: "200px",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row.note}
                            </span>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#4D5874",
                          fontWeight: 400,
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          border: "1px solid #E0E3EB",
                        }}
                      >
                        {row.date}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{
                        py: 3,
                        fontSize: "14px",
                        color: "#7D879C",
                        fontWeight: 500,
                      }}
                    >
                      No notes by tutor yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 3: // Documents
        const docs = [];
        if (parent) {
          if (parent.idFrontUrl) {
            const extension = parent.idFrontUrl.split(".").pop().toLowerCase();
            docs.push({
              id: "id-front",
              name: "ID Front",
              type: extension === "pdf" ? "PDF" : "Image",
              url: `${config.parentDocumentUrl}${parent.idFrontUrl}`,
              status: "Uploaded",
            });
          }
          if (parent.idBackUrl) {
            const extension = parent.idBackUrl.split(".").pop().toLowerCase();
            docs.push({
              id: "id-back",
              name: "ID Back",
              type: extension === "pdf" ? "PDF" : "Image",
              url: `${config.parentDocumentUrl}${parent.idBackUrl}`,
              status: "Uploaded",
            });
          }
        }

        return (
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "none",
              border: "1px solid #E0E3EB",
              borderRadius: "8px",
            }}
          >
            <Table style={{ border: "1px solid #E0E3EB" }}>
              <TableHead
                sx={{
                  backgroundColor: "#1E9CBC",
                  "& .MuiTableCell-root": {
                    height: 32,
                    py: 0,
                    px: 2,
                    color: "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    borderBottom: "none",
                  },
                }}
              >
                <TableRow
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#FFFFFF",
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
                {docs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      style={{
                        fontSize: "16px",
                        color: "#101219",
                        fontWeight: 400,
                        border: "1px solid #E0E3EB",
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      No documents available
                    </TableCell>
                  </TableRow>
                ) : (
                  docs.map((doc) => (
                    <TableRow
                      key={doc.id}
                      style={{ borderBottom: "1px solid #E0E3EB" }}
                    >
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          border: "1px solid #E0E3EB",
                        }}
                      >
                        {doc.name}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                        }}
                      >
                        {doc.type}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #E0E3EB",
                          padding: "0 8px",
                          height: "42px",
                          lineHeight: "42px",
                        }}
                      >
                        <Chip
                          label={doc.status}
                          size="small"
                          style={{
                            backgroundColor:
                              doc.status === "Available"
                                ? "#EEFBF4"
                                : "#EEFBF4",
                            border:
                              doc.status === "Available"
                                ? "1px solid #B2EECC"
                                : "1px solid #B2EECC",
                            color:
                              doc.status === "Available"
                                ? "#17663A"
                                : "#17663A",
                            fontWeight: 500,
                            fontSize: "12px",
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
                          height: "42px",
                          lineHeight: "42px",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleDocumentView(doc)}
                          sx={{ color: "#1E9CBC" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
                  onClick={() => navigate("/parent-dashboard")}
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
                  {parent?.User?.userId}
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
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      {/* Profile Picture and Name */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          marginTop: "-15px",
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          {/* <Avatar
                          src={
                            parent?.User?.image || profileImg
                          }
                          style={{ width: 60, height: 60 }}
                        /> */}
                          <Avatar
                            src={
                              parent?.User?.image
                                ? parent.User.image
                                : parentprofileImg
                            }
                            sx={{ width: 60, height: 60 }}
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
                              paddingTop: 20,
                              fontWeight: 500,
                              color: "#121217",
                              fontSize: "24px",
                            }}
                          >
                            {parent?.User?.firstName +
                              " " +
                              parent?.User?.lastName || "N/A"}
                          </h5>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Email: {parent?.User?.email || "No email"}
                          </Typography>
                          {parent?.User?.phone && (
                            <Typography variant="body2" sx={{ color: "#666" }}>
                              Contact: +{parent?.User?.phone}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      <Chip
                        label="Verified"
                        size="small"
                        style={{
                          backgroundColor: "#EEFBF4",
                          border: "1px solid #17663A",
                          color: "#17663A",
                          fontWeight: 400,
                          fontSize: "14px",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          height: 35,
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleDeleteClick}
                        style={{
                          backgroundColor: "#f44336",
                          borderRadius: "8px",
                          color: "white",
                          textTransform: "none",
                          fontSize: "14px",
                          height: 35,
                        }}
                      >
                        Delete User
                      </Button>
                    </div>
                    <Chip
                      label="Verified"
                      size="small"
                      style={{
                        backgroundColor: "#EEFBF4",
                        border: "1px solid #17663A",
                        color: "#17663A",
                        fontWeight: 400,
                        fontSize: "14px",
                        padding: "4px 8px",
                        borderRadius: "8px",
                      }}
                    />
                  </div>

                  {/* Right Column - Edit Button */}
                  {/* <div className="col-md-4 d-flex justify-content-end align-items-start">
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
                  </div> */}
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
                        // onChange={(e) =>
                        //   handleInputChange("noOfHires", e.target.value)
                        // }
                        variant="outlined"
                        size="small"
                        fullWidth
                        // style={{ width: "100%" }}
                        inputProps={{
                          readOnly: true,
                        }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                            cursor: "default",
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
                        // onChange={(e) =>
                        //   handleInputChange("joiningDate", e.target.value)
                        // }
                        variant="outlined"
                        size="small"
                        // style={{ width: "100%" }}
                        inputProps={{
                          readOnly: true,
                        }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                            cursor: "default",
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
                        // onChange={(e) =>
                        //   handleInputChange("children", e.target.value)
                        // }
                        variant="outlined"
                        size="small"
                        // style={{ width: "100%" }}
                        inputProps={{
                          readOnly: true,
                        }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                            cursor: "default",
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
                        // onChange={(e) =>
                        //   handleInputChange("amountSpent", e.target.value)
                        // }
                        variant="outlined"
                        size="small"
                        // style={{ width: "100%" }}
                        inputProps={{
                          readOnly: true,
                        }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                            cursor: "default",
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
                    // onChange={(e) =>
                    //   handleInputChange("description", e.target.value)
                    // }
                    variant="outlined"
                    multiline
                    rows={4}
                    style={{ width: "100%" }}
                    inputProps={{
                      readOnly: true,
                    }}
                    InputProps={{
                      style: {
                        // width:'100%',
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#80878A",
                        borderRadius: "8px",
                        backgroundColor: "#FFFFFF",
                        lineHeight: "1.5",
                        cursor: "default",
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
                  Contract Details
                </h6>

                {/* Tabs */}
                <Box
                  sx={{
                    border: "1px solid #D1D1DB",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    width: "100%",
                    maxWidth: "545px",
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
                    <Tab label={`Notes by Tutors (${childNotes.length})`} />
                    <Tab
                      label={`Documents (${
                        (parent?.idFrontUrl ? 1 : 0) +
                        (parent?.idBackUrl ? 1 : 0)
                      })`}
                    />
                  </Tabs>
                </Box>

                {/* Search and Filter Row */}
                <div className="row align-items-center mb-3">
                  <div className="col-md-6">
                    {/* <TextField
                      placeholder="Search by Name"
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
                    /> */}
                    <TextField
                      size="small"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon
                              style={{ color: "#666", fontSize: "20px" }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchTerm("")}
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
                      medium
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
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={
          parent?.User?.firstName + " " + parent?.User?.lastName || "N/A"
        }
        userId={parent?.User?.userId}
        isDeleting={isDeletingUser}
        error={deleteUserError}
      />
    </>
  );
};

export default ParentsProfile;
