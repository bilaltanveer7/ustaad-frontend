import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SideNav from "../sidebar/sidenav";
import DocumentModal from "../components/DocumentModal";
import { useAdminStore } from "../store/useAdminStore";
import { useTutorStore } from "../store/useTutorStore";
import config from "../utils/config";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Description as DocumentIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Star as StarIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const drawerWidth = 260;

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    tutorDetails,
    fetchTutorDetails,
    isLoading: isLoadingTutor,
    error: tutorError,
    clearSelectedTutor,
  } = useTutorStore();

  const { approveUser, isApprovingUser, approveUserError, clearErrors } =
    useAdminStore();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch tutor details if user is a tutor
  useEffect(() => {
    if (userId) {
      fetchTutorDetails(userId);
    }
  }, [userId, fetchTutorDetails]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDocumentView = (document) => {
    setSelectedDocument(document.url);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(false);
  };

  const handleApproveUser = async () => {
    if (!userId) return;

    const result = await approveUser(userId);
    if (result.success) {
      setShowSuccessMessage(true);
      // Optionally refresh the tutor details to show updated status
      setTimeout(() => {
        fetchTutorDetails(userId);
      }, 1000);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  // Loading state - show loading if either user details or tutor details are loading
  const isLoading = isLoadingTutor;

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
  const currentError = tutorError;

  if (currentError) {
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
                  clearSelectedTutor();
                  fetchTutorDetails(userId);
                  if (tutorDetails?.role === "TUTOR") {
                    fetchTutorDetails(userId);
                  }
                }}
              >
                Retry
              </Button>
            }
          >
            Error loading{" "}
            {tutorDetails?.role === "TUTOR" && tutorError ? "tutor" : "user"}{" "}
            details: {currentError}
          </Alert>
        </div>
      </>
    );
  }

  // No user found
  if (!tutorDetails) {
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
            User not found or no longer exists.
            <Button
              onClick={() => navigate("/pending-users")}
              sx={{ ml: 2 }}
              variant="outlined"
              size="small"
            >
              Back to Pending Users
            </Button>
          </Alert>
        </div>
      </>
    );
  }

  const user = tutorDetails?.tutor?.User;
  const tutorProfile = tutorDetails?.tutor;

  // Get documents from tutor details
  const getDocuments = () => {
    if (tutorDetails?.documents) {
      const docs = [];
      const documents = tutorDetails.documents;

      if (documents.idFront) {
        const extension = documents.idFront.split(".").pop().toLowerCase();
        docs.push({
          id: "id-front",
          name: "ID Front",
          type: extension === "pdf" ? "application/pdf" : "image/png",
          url: `${config.tutorDocumentUrl}${documents.idFront}`,
          uploadedAt: tutorProfile?.createdAt,
          category: "Identity",
        });
      }

      if (documents.idBack) {
        const extension = documents.idBack.split(".").pop().toLowerCase();
        docs.push({
          id: "id-back",
          name: "ID Back",
          type: extension === "pdf" ? "application/pdf" : "image/png",
          url: `${config.tutorDocumentUrl}${documents.idBack}`,
          uploadedAt: tutorProfile?.createdAt,
          category: "Identity",
        });
      }

      if (documents.resume) {
        const extension = documents.resume.split(".").pop().toLowerCase();
        docs.push({
          id: "resume",
          name: "Resume/CV",
          type: extension === "pdf" ? "application/pdf" : "image/png",
          url: `${config.tutorDocumentUrl}${documents.resume}`,
          uploadedAt: tutorProfile?.createdAt,
          category: "Education",
        });
      }

      return docs;
    }
    return [];
  };

  const documents = getDocuments();

  console.log("documents", documents);

  const renderBasicInfo = () => (
    <Card sx={{ mb: 3, bgcolor:'#EEFBFD', border: "1px solid #D1D1DB", }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Basic Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                src={user?.image}
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              >
                {user?.firstName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.firstName || user?.lastName || "N/A"}
              </Typography>
              <Chip
                label="TUTOR"
                size="medium"
                sx={{
                  backgroundColor: getRoleColor("TUTOR").bg,
                  border: `1px solid ${getRoleColor("TUTOR").border}`,
                  color: getRoleColor("TUTOR").color,
                  fontWeight: 500,
                  fontSize: "14px",
                  mb: 1,
                }}
              />
              <br />
              <Chip
                label={user?.isOnBoard?.toUpperCase() || "PENDING"}
                size="medium"
                sx={{
                  backgroundColor: getStatusColor(user?.isOnBoard || "pending")
                    .bg,
                  border: `1px solid ${
                    getStatusColor(user?.isOnBoard || "pending").border
                  }`,
                  color: getStatusColor(user?.isOnBoard || "pending").color,
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="User ID"
                  secondary={
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "monospace",
                        backgroundColor: "#f5f5f5",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {user?.id}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {user?.email}
                      {user?.isEmailVerified ? (
                        <CheckCircleIcon
                          sx={{ color: "#38BC5C", fontSize: 16 }}
                        />
                      ) : (
                        <CancelIcon sx={{ color: "#F31616", fontSize: 16 }} />
                      )}
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {user?.phone || "N/A"}
                      {user?.isPhoneVerified ? (
                        <CheckCircleIcon
                          sx={{ color: "#38BC5C", fontSize: 16 }}
                        />
                      ) : (
                        <CancelIcon sx={{ color: "#F31616", fontSize: 16 }} />
                      )}
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Registration Date"
                  secondary={formatDate(user?.createdAt)}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Last Updated"
                  secondary={formatDateTime(user?.updatedAt)}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderVerificationStatus = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Verification Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                border: "1px solid #E0E3EB",
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: user?.isEmailVerified ? "#EEFBF4" : "#FEECEC",
              }}
            >
              {user?.isEmailVerified ? (
                <CheckCircleIcon
                  sx={{ color: "#38BC5C", fontSize: 40, mb: 1 }}
                />
              ) : (
                <CancelIcon sx={{ color: "#F31616", fontSize: 40, mb: 1 }} />
              )}
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Email Verification
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {user?.isEmailVerified ? "Verified" : "Not Verified"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                border: "1px solid #E0E3EB",
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: user?.isPhoneVerified ? "#EEFBF4" : "#FEECEC",
              }}
            >
              {user?.isPhoneVerified ? (
                <CheckCircleIcon
                  sx={{ color: "#38BC5C", fontSize: 40, mb: 1 }}
                />
              ) : (
                <CancelIcon sx={{ color: "#F31616", fontSize: 40, mb: 1 }} />
              )}
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Phone Verification
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {user?.isPhoneVerified ? "Verified" : "Not Verified"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                border: "1px solid #E0E3EB",
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: user?.isAdminVerified ? "#EEFBF4" : "#FEECEC",
              }}
            >
              {user?.isAdminVerified ? (
                <VerifiedIcon sx={{ color: "#38BC5C", fontSize: 40, mb: 1 }} />
              ) : (
                <WarningIcon sx={{ color: "#F31616", fontSize: 40, mb: 1 }} />
              )}
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Admin Verification
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {user?.isAdminVerified ? "Verified" : "Pending Review"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderTutorInfo = () => {
    if (!tutorDetails) return null;

    const education = tutorDetails.education || [];
    const experience = tutorDetails.experience || [];
    const totalExperience = tutorDetails.totalExperience || 0;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Tutor Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Education"
                    secondary={
                      education
                        .map((edu) => `${edu.description} at ${edu.institute}`)
                        .join(", ") || "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Experience"
                    secondary={
                      totalExperience > 0
                        ? `${Math.round(totalExperience)} years`
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BankIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Bank Details"
                    secondary={`${tutorProfile?.bankName || "N/A"} - ${
                      tutorProfile?.accountNumber || "N/A"
                    }`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Grade Level"
                    secondary={tutorProfile?.grade || "N/A"}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Work Experience"
                    secondary={
                      experience.length > 0
                        ? experience
                            .map(
                              (exp) => `${exp.description} at ${exp.company}`
                            )
                            .join(", ")
                        : "N/A"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Profile Created"
                    secondary={formatDate(tutorProfile?.createdAt)}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                Subjects:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {(tutorProfile?.subjects || ["N/A"]).map((subject, index) => (
                  <Chip
                    key={index}
                    label={subject}
                    size="small"
                    sx={{
                      backgroundColor: "#EEF3FF",
                      color: "#235DFF",
                      border: "1px solid #BBDEFB",
                    }}
                  />
                ))}
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                About:
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {tutorProfile?.about || "No description available."}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderDocuments = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Documents ({documents.length})
        </Typography>
        {documents.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "#666",
            }}
          >
            <DocumentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography>No documents uploaded yet</Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ border: "1px solid #E0E3EB" }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#F5F5F5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Document Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Uploaded</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DocumentIcon sx={{ color: "#666", fontSize: 20 }} />
                        {doc.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doc.category}
                        size="small"
                        sx={{
                          backgroundColor: "#F0F2F5",
                          color: "#7D879C",
                          fontSize: "12px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {doc.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {formatDate(doc.uploadedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Document">
                          <IconButton
                            size="small"
                            onClick={() => handleDocumentView(doc)}
                            sx={{ color: "#1976D2" }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = doc.url;
                              link.download = doc.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            sx={{ color: "#17663A" }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

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
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={() => navigate("/pending-users")}
                sx={{ color: "#1976D2" }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "#101219" }}
              >
                User Details
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<InfoIcon />}
                sx={{
                  borderColor: "#1E9CBC",
                  color: "#1E9CBC",
                  textTransform: "none",
                }}
              >
                Send Message
              </Button>

              <Button
                variant="contained"
                startIcon={
                  user?.isOnBoard === "approved" ? (
                    <VerifiedIcon />
                  ) : isApprovingUser ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <VerifiedIcon />
                  )
                }
                onClick={handleApproveUser}
                disabled={isApprovingUser || user?.isOnBoard === "approved"}
                sx={{
                  backgroundColor:
                    user?.isOnBoard === "approved" ? "#4CAF50" : "#17663A",
                  color: "white !important", // Force white text
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor:
                      user?.isOnBoard === "approved" ? "#45a049" : "#0F4A29",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#4CAF50",
                    color: "white !important", // Force white on disabled too
                    opacity: 0.7,
                  },
                  // Override MUI's disabled opacity for approved state
                  "&.Mui-disabled.MuiButton-contained": {
                    color: "white !important",
                    opacity: 1,
                  },
                }}
              >
                {user?.isOnBoard === "approved"
                  ? "Approved"
                  : isApprovingUser
                  ? "Approving..."
                  : "Approve User"}
              </Button>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Overview" />
              <Tab label="Documents" />
              <Tab label="Tutor Profile" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Box>
              {renderBasicInfo()}
              {renderVerificationStatus()}
            </Box>
          )}

          {activeTab === 1 && <Box>{renderDocuments()}</Box>}

          {activeTab === 2 && <Box>{renderTutorInfo()}</Box>}

          {/* Error Display for Approve User */}
          {approveUserError && (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
              onClose={() => clearErrors()}
            >
              Error approving user: {approveUserError}
            </Alert>
          )}

          {/* Document Modal */}
          <DocumentModal
            open={isModalOpen}
            onClose={handleCloseModal}
            document={selectedDocument}
          />

          {/* Success Message */}
          <Snackbar
            open={showSuccessMessage}
            autoHideDuration={4000}
            onClose={handleCloseSuccessMessage}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSuccessMessage}
              severity="success"
              sx={{ width: "100%" }}
            >
              User has been successfully approved for onboarding!
            </Alert>
          </Snackbar>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
