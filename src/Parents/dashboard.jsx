import React, { useState, useEffect, useRef } from "react";
import SideNav from "../sidebar/sidenav";
import { useNavigate } from "react-router-dom";
import { useParentStore } from "../store/useParentStore";
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
  Paper,
  Checkbox,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
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

const drawerWidth = 260;

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { parents, fetchParents, isLoading, error, pagination } =
    useParentStore();

  const [selected, setSelected] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstRender = useRef(true);

  // Fetch parents on component mount and when page changes
  useEffect(() => {
    fetchParents(currentPage, 20, searchValue);
  }, [fetchParents, currentPage]);

  // Debounced search effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchParents(1, 20, searchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, fetchParents]);

  // Transform API data to match table format
  const tableData = parents.map((parent) => ({
    id: parent.id,
    image: parent.User?.image,
    clientId: parent.userId.substring(0, 8).toUpperCase(),
    name:
      parent.User?.firstName && parent.User?.lastName
        ? `${parent.User.firstName} ${parent.User.lastName}`
        : parent.User?.firstName || parent.User?.lastName || "N/A",
    email: parent.User?.email || "N/A",
    phone: parent.User?.phone || "N/A",
    address: "N/A", // Address not provided in API response
    date: new Date(parent.createdAt).toLocaleDateString() || "N/A",
    customerId: parent.customerId,
  }));

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(tableData.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

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
                    Parents
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
                    placeholder="Search by id, name, email or phone"
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

          {/* Controls */}
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
                    {pagination?.total || tableData.length} Results
                  </span>
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
          {error && (
            <div className="row">
              <div className="col-12">
                <Alert severity="error" sx={{ m: 2 }}>
                  Error loading parents: {error}
                </Alert>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="row">
              <div
                className="col-12"
                style={{ textAlign: "center", padding: "2rem" }}
              >
                <CircularProgress />
                <div style={{ marginTop: "1rem", color: "#666" }}>
                  Loading parents...
                </div>
              </div>
            </div>
          )}
          {!isLoading && !error && (!tableData || tableData.length === 0) && (
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
                <PersonIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
                <div>No Parents yet</div>
              </div>
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && tableData && tableData.length > 0 && (
            <div className="row">
              <div className="col-12">
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ height: 32, bgcolor: "#1E9CBC" }}>
                        {/* <TableCell padding="checkbox" sx={{ py: 0, height: 32 }}>
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < tableData.length
                          }
                          checked={
                            tableData.length > 0 &&
                            selected.length === tableData.length
                          }
                          onChange={handleSelectAll}
                          size="small"
                          sx={{ p: 0.5 }}
                        />
                      </TableCell> */}

                        {[
                          { label: "Client ID", key: "clientId" },
                          { label: "Parent Name", key: "name" },
                          { label: "Email", key: "email" },
                          { label: "Phone", key: "phone" },
                          { label: "Joining Date", key: "date" },
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
                              hover
                              onClick={() => handleSelectRow(row.id)}
                              selected={isItemSelected}
                              style={{
                                cursor: "pointer",
                                height: 48,
                                backgroundColor:
                                  index % 2 === 0 ? "white" : "#fafafa",
                                borderBottom: "1px solid #e0e0e0",
                              }}
                            >
                              {/* <TableCell
                            padding="checkbox"
                            style={{
                              border: "1px solid #e0e0e0",
                              py: 0,
                              height: 48,
                            }}
                          >
                            <Checkbox checked={isItemSelected} size="small" />
                          </TableCell> */}
                              <TableCell
                                onClick={() =>
                                  navigate(`/parent-profile/${row.id}`)
                                }
                              >
                                <Tooltip title={row.clientId} arrow>
                                  <div
                                    style={{
                                      fontWeight: 400,
                                      fontSize: "16px",
                                      color: "#4D5874",
                                      // border: "1px solid #e0e0e0",
                                      py: 0,
                                      // height: 48,
                                      cursor: "pointer",
                                      maxWidth: "60px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {row.clientId}
                                  </div>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "1px solid #e0e0e0",
                                  py: 0,
                                  height: 48,
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <Avatar
                                      src={
                                        row.image
                                          ? row.image
                                          : getInitials(row.name)
                                      }
                                      style={{
                                        width: 40,
                                        height: 40,
                                        marginRight: "10px",
                                      }}
                                    ></Avatar>
                                    <Tooltip title={row.name} arrow>
                                      <div
                                        style={{
                                          fontWeight: 400,
                                          fontSize: "16px",
                                          color: "#101219",
                                          cursor: "pointer",
                                          maxWidth: "100px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {row.name}
                                      </div>
                                    </Tooltip>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "16px",
                                  color: "#101219",
                                  fontWeight: 400,
                                  border: "1px solid #e0e0e0",
                                  py: 0,
                                  height: 48,
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  <Tooltip title={row.email} arrow>
                                    <div
                                      style={{
                                        fontWeight: 400,
                                        fontSize: "16px",
                                        color: "#101219",
                                        cursor: "pointer",
                                        maxWidth: "140px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {row.email}
                                    </div>
                                  </Tooltip>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(row.email);
                                    }}
                                    style={{ padding: "2px" }}
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
                                  fontSize: "16px",
                                  color: "#101219",
                                  fontWeight: 400,
                                  border: "1px solid #e0e0e0",
                                  py: 0,
                                  height: 48,
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  <Tooltip title={row.phone || "N/A"} arrow>
                                    <div
                                      style={{
                                        fontWeight: 400,
                                        fontSize: "16px",
                                        color: "#101219",
                                        cursor: "pointer",
                                        maxWidth: "120px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      +{row.phone || "N/A"}
                                    </div>
                                  </Tooltip>
                                  {row.phone && (
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(row.phone);
                                      }}
                                      style={{ padding: "2px" }}
                                    >
                                      <ContentCopyIcon
                                        style={{
                                          fontSize: "14px",
                                          color: "#666",
                                        }}
                                      />
                                    </IconButton>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell
                                style={{
                                  fontSize: "16px",
                                  color: "#4D5874",
                                  fontWeight: 400,
                                  border: "1px solid #e0e0e0",
                                  py: 0,
                                  height: 48,
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  {row.date}
                                </div>
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
                              No Parents Found
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
    </>
  );
};

export default ParentDashboard;
