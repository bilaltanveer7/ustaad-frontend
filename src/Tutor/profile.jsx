import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "../sidebar/sidenav";
import { useTutorStore } from "../store/useTutorStore";
import DocumentModal from "../components/DocumentModal";
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
  Visibility as ViewIcon,
} from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { CiWallet } from "react-icons/ci";
import config from "../utils/config";

const drawerWidth = 260;

const TutorsProfile = () => {
  const { id: tutorId } = useParams();
  const navigate = useNavigate();
  const { tutorDetails, fetchTutorDetails, isLoading, error, clearError } =
    useTutorStore();

  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for editable fields
  const [profileData, setProfileData] = useState({
    noOfHires: "12",
    joiningDate: "12/03/24",
    experienceYears: "2",
    subjects: "Mathematics, Physics",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
  });

  // Fetch tutor details on component mount
  useEffect(() => {
    if (tutorId) {
      fetchTutorDetails(tutorId);
    }
  }, [tutorId, fetchTutorDetails]);

  // Update profile data when tutor details are loaded
  useEffect(() => {
    if (tutorDetails) {
      const { tutor, totalExperience, timesHired } = tutorDetails;

      setProfileData((prev) => ({
        ...prev,
        noOfHires:
          typeof timesHired === "number"
            ? timesHired.toString()
            : prev.noOfHires,
        joiningDate: tutor?.createdAt
          ? new Date(tutor.createdAt).toLocaleDateString()
          : "N/A",
        experienceYears: totalExperience
          ? Math.round(totalExperience).toString()
          : "0",
        subjects: tutor?.subjects?.join(", ") || "N/A",
        description: tutor?.about || "No description available",
      }));
    }
  }, [tutorDetails]);

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
            <Typography sx={{ ml: 2 }}>Loading tutor details...</Typography>
          </Box>
        </div>
      </>
    );
  }

  // Error state
  if (error && !tutorDetails) {
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
                  fetchTutorDetails(tutorId);
                }}
              >
                Retry
              </Button>
            }
          >
            Error loading tutor details: {error}
          </Alert>
        </div>
      </>
    );
  }

  // If no tutor details and not loading, show not found
  if (!tutorDetails && !isLoading) {
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
            Tutor not found. Please check the ID and try again.
          </Alert>
        </div>
      </>
    );
  }

  const {
    tutor,
    education = [],
    experience = [],
    totalExperience,
    transactions,
    documents,
  } = tutorDetails || {};

  // Transform API data for display
  const experienceData =
    experience?.length > 0
      ? experience?.map((exp) => ({
        id: exp.id,
        company: exp.company || "N/A",
        title: exp.description || "N/A", // API uses 'description' for job title/role
        startYear: exp.startDate
          ? new Date(exp.startDate).getFullYear().toString()
          : "N/A",
        endYear: exp.endDate
          ? new Date(exp.endDate).getFullYear().toString()
          : "Present",
      }))
      : [];

  const educationData =
    education?.length > 0
      ? education?.map((edu) => ({
        id: edu.id,
        institution: edu.institute || "N/A", // API uses 'institute' not 'institutionName'
        degree: edu.description || "N/A", // API uses 'description' for degree info
        startYear: edu.startDate
          ? new Date(edu.startDate).getFullYear().toString()
          : "N/A",
        endYear: edu.endDate
          ? new Date(edu.endDate).getFullYear().toString()
          : "Present",
      }))
      : [];

  // Transform API transactions data for display
  const transactionsData = transactions
    ? // Handle both single object and array cases
    (Array.isArray(transactions) ? transactions : [transactions]).map(
      (tx) => ({
        id: tx.id,
        payment: {
          name: tutor?.User?.fullName || "Unknown",
          cost: `Rs. ${tx.amount?.toLocaleString() || "0"}`,
        },
        child: {
          name: "Student", // API doesn't provide child info, using placeholder
          avatar: "/placeholder.svg?height=32&width=32",
        },
        pay: tx.amount || 0,
        paymentMethod: {
          type: "bank",
          accountNumber: tutor?.accountNumber || "N/A",
        },
        transactionDate: tx.createdAt
          ? new Date(tx.createdAt).toLocaleDateString()
          : "N/A",
        status: tx.status || "UNKNOWN",
      })
    )
    : [];

  // Transform API documents data for display
  const documentsData = documents
    ? [
      {
        id: 1,
        name: "Resume",
        type: documents.resume
          ? documents.resume.toLowerCase().endsWith(".pdf")
            ? "PDF"
            : "Image"
          : "N/A",
        url: `${config.tutorDocumentUrl}${documents.resume}`,
        uploadDate: "N/A", // Upload date not available in API
        status: documents.resume ? "Available" : "Missing",
      },
      {
        id: 2,
        name: "ID Front",
        type: documents.idFront
          ? documents.idFront.toLowerCase().endsWith(".pdf")
            ? "PDF"
            : "Image"
          : "N/A",
        url: `${config.tutorDocumentUrl}${documents.idFront}`,
        uploadDate: "N/A", // Upload date not available in API
        status: documents.idFront ? "Available" : "Missing",
      },
      {
        id: 3,
        name: "ID Back",
        type: documents.idBack
          ? documents.idBack.toLowerCase().endsWith(".pdf")
            ? "PDF"
            : "Image"
          : "N/A",
        url: `${config.tutorDocumentUrl}${documents.idBack}`,
        uploadDate: "N/A", // Upload date not available in API
        status: documents.idBack ? "Available" : "Missing",
      },
    ].filter((doc) => doc.url)
    : [];

  const childrenData = [
    {
      id: 1,
      childName: "Ali Hassan",
      grade: "7th Grade",
      tutorHired: "Yes",
      currentTutors: "Amir Ali",
    },
    {
      id: 2,
      childName: "Sara Ahmed",
      grade: "5th Grade",
      tutorHired: "No",
      currentTutors: "-",
    },
    {
      id: 3,
      childName: "Ahmed Khan",
      grade: "8th Grade",
      tutorHired: "Yes",
      currentTutors: "Maria Khan, John Smith",
    },
    {
      id: 4,
      childName: "Fatima Ali",
      grade: "6th Grade",
      tutorHired: "Yes",
      currentTutors: "Sarah Johnson",
    },
  ];

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
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  <TableCell onClick={() => handleSort("name")}>
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
                      Payment To
                      {getSortIcon("name")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
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
                      Payment
                      {getSortIcon("payment")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
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
                      Payment Method
                      {getSortIcon("paymentMethod")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
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
                      Transaction Date
                      {getSortIcon("transactionDate")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
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
                      Status
                      {getSortIcon("status")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionsData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#666",
                      }}
                    >
                      No transactions found for this tutor
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
                            color: row.id % 2 !== 0 ? "#38BC5C" : "#F31616", // Green for odd IDs, red for even
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {row.id % 2 !== 0 ? (
                            <ArrowDropUpIcon style={{ fontSize: "18px" }} />
                          ) : (
                            <ArrowDropDownIcon style={{ fontSize: "18px" }} />
                          )}
                          {row.pay}
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
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                        }}
                      >
                        <Chip
                          label={row.status}
                          size="small"
                          style={{
                            backgroundColor:
                              row.status === "COMPLETED"
                                ? "#EEFBF4"
                                : row.status === "IN_REVIEW"
                                  ? "#FFF4E6"
                                  : row.status === "FAILED"
                                    ? "#FFEBEE"
                                    : "#F5F5F5",
                            border:
                              row.status === "COMPLETED"
                                ? "1px solid #B2EECC"
                                : row.status === "IN_REVIEW"
                                  ? "1px solid #FFD54F"
                                  : row.status === "FAILED"
                                    ? "1px solid #FFCDD2"
                                    : "1px solid #E0E0E0",
                            color:
                              row.status === "COMPLETED"
                                ? "#17663A"
                                : row.status === "IN_REVIEW"
                                  ? "#E65100"
                                  : row.status === "FAILED"
                                    ? "#C62828"
                                    : "#424242",
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
        );

      case 1:
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
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  <TableCell onClick={() => handleSort("name")}>
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
                      Received From
                      {getSortIcon("childName")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
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
                      Payment
                      {getSortIcon("grade")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
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
                      From Year
                      {getSortIcon("tutorHired")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("name")}>
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
                      To Year
                      {getSortIcon("currentTutors")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {experienceData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#666",
                      }}
                    >
                      No experience records found for this tutor
                    </TableCell>
                  </TableRow>
                ) : (
                  experienceData.map((row) => (
                    <TableRow
                      key={row.id}
                      style={{ borderBottom: "1px solid #e0e0e0" }}
                    >
                      <TableCell style={{ border: "1px solid #e0e0e0" }}>
                        <img
                          src="https://png.pngtree.com/png-clipart/20220821/ourmid/pngtree-male-profile-picture-icon-and-png-image-png-image_6118773.png"
                          alt="Company"
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
                          {row.company}
                        </span>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {row.title}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {row.startYear}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {row.endYear}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 2: // Documents
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
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  <TableCell onClick={() => handleSort("name")}>
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
                      Document Name
                      {getSortIcon("name")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("type")}>
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
                      Type
                      {getSortIcon("type")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("status")}>
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
                      Status
                      {getSortIcon("status")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("actions")}>
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
                      Actions
                      {getSortIcon("actions")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documentsData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#666",
                      }}
                    >
                      No documents found for this tutor
                    </TableCell>
                  </TableRow>
                ) : (
                  documentsData.map((row) => (
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
                        {row.name}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {row.type}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          border: "1px solid #e0e0e0",
                          padding: "8px",
                        }}
                      >
                        <Chip
                          label={row.status}
                          size="small"
                          style={{
                            backgroundColor:
                              row.status === "Available"
                                ? "#EEFBF4"
                                : "#FFEBEE",
                            border:
                              row.status === "Available"
                                ? "1px solid #B2EECC"
                                : "1px solid #FFCDD2",
                            color:
                              row.status === "Available"
                                ? "#17663A"
                                : "#C62828",
                            fontWeight: 500,
                            fontSize: "12px",
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ border: "1px solid #e0e0e0" }}>
                        {row.url && (
                          // <Button
                          //   variant="outlined"
                          //   size="small"
                          //   onClick={() => handleDocumentView(row.url)}
                          //   style={{
                          //     textTransform: "none",
                          //     fontSize: "12px",
                          //     borderColor: "#1E9CBC",
                          //     color: "#1E9CBC",
                          //   }}
                          // >
                          //   View
                          // </Button>
                          <Tooltip title="View Document">
                            <IconButton
                              size="small"
                              onClick={() => handleDocumentView(row.url)}
                              sx={{ color: "#1E9CBC" }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 3: // Education
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
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  <TableCell onClick={() => handleSort("institution")}>
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
                      Institution
                      {getSortIcon("institution")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("degree")}>
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
                      Degree
                      {getSortIcon("degree")}
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleSort("years")}>
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
                      Years
                      {getSortIcon("years")}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {educationData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#666",
                      }}
                    >
                      No education records found for this tutor
                    </TableCell>
                  </TableRow>
                ) : (
                  educationData.map((row) => (
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
                        {row.institution}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {row.degree}
                      </TableCell>

                      <TableCell
                        style={{
                          fontSize: "16px",
                          color: "#101219",
                          fontWeight: 400,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {row.startYear} - {row.endYear}
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
                  {tutor?.id || tutorId}
                </h4>
              </div>

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
                  <div className="col-md-8">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <Avatar
                          src={
                            tutor?.User?.image ||
                            "/placeholder.svg?height=60&width=60"
                          }
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
                          {tutor?.User?.firstName && tutor?.User?.lastName
                            ? `${tutor.User.firstName} ${tutor.User.lastName}`
                            : tutor?.User?.firstName ||
                            tutor?.User?.lastName ||
                            "N/A"}
                        </h5>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mt: 1 }}
                        >
                          {tutor?.User?.email || "No email"}
                        </Typography>
                        {tutor?.User?.phone && (
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            {tutor?.User?.phone}
                          </Typography>
                        )}
                        {tutor?.subjects && (
                          <Typography
                            variant="body2"
                            sx={{ color: "#666", mt: 0.5 }}
                          >
                            Subjects: {tutor.subjects.join(", ")}
                          </Typography>
                        )}
                      </div>
                    </div>
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
                  <div className="col-md-4 d-flex justify-content-end align-items-start">
                    {activeTab === 0 && (
                      <Button
                        variant="contained"
                        startIcon={
                          <CiWallet
                            style={{
                              color: "white",
                              fontWeight: 900,
                              fontSize: "20px",
                            }}
                          />
                        }
                        style={{
                          marginRight: "2rem",
                          backgroundColor: "#121217",
                          borderRadius: "8px",
                          color: "white",
                          textTransform: "none",
                          fontSize: "14px",
                        }}
                      >
                        Rs {tutor?.balance?.toFixed(2) || "0.00"}
                      </Button>
                    )}
                    {/* <Button
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
                    </Button> */}
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
                        // onChange={(e) =>
                        //   handleInputChange("noOfHires", e.target.value)
                        // }
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                            cursor: 'default'
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
                        style={{ width: "100%" }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                            cursor: 'default'
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
                        Experience (Years)
                      </div>
                      <TextField
                        value={profileData.experienceYears}
                        // onChange={(e) =>
                        //   handleInputChange("experienceYears", e.target.value)
                        // }
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                            cursor: 'default'
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
                        Subjects
                      </div>
                      <TextField
                        value={profileData.subjects}
                        // onChange={(e) =>
                        //   handleInputChange("subjects", e.target.value)
                        // }
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        InputProps={{
                          style: {
                            fontSize: "14px",
                            color: "#80878A",
                            backgroundColor: "#F7FDFE",
                            cursor: 'default'
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
                    InputProps={{
                      style: {
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#30417D",
                        borderRadius: "8px",
                        backgroundColor: "#FFFFFF",
                        lineHeight: "1.5",
                        cursor: 'default'
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
                    width: "52%",
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
                    <Tab label={`Transactions (${transactionsData.length})`} />
                    <Tab label={`Experience (${experienceData.length})`} />
                    <Tab label={`Documents (${documentsData.length})`} />
                    <Tab label={`Education (${educationData.length})`} />
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

export default TutorsProfile;
