import React, { useState, useEffect, useRef } from "react";
import SideNav from "../sidebar/sidenav";
import { useNavigate } from "react-router-dom";
import { useTutorStore } from "../store/useTutorStore";
import { formatDate } from "../utils/dateFormatter";
import { CircularProgress, Alert, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import profileImg from "../assets/profile.PNG";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
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

const drawerWidth = 260;

const TutorDashboard = () => {
  const navigate = useNavigate();
  const { tutors, fetchTutors, isLoading, error, pagination } = useTutorStore();
  const [selected, setSelected] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(0); // 0-indexed for MUI
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateInput, setDateInput] = useState("");
  const datePickerRef = useRef(null);
  const isFirstRender = useRef(true);

  // Fetch tutors on component mount and when page changes
  useEffect(() => {
    fetchTutors(page + 1, rowsPerPage, searchValue, selectedDate);
  }, [fetchTutors, page, rowsPerPage, selectedDate]);

  // Debounced search effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setPage(0);
      fetchTutors(1, rowsPerPage, searchValue, selectedDate);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, fetchTutors, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Transform API data to match table format
  const tableData = tutors.map((tutor) => ({
    id: tutor.id,
    userId: tutor?.User?.userId,
    image: tutor.User?.image,
    clientId: tutor.userId.substring(0, 8).toUpperCase(),
    name:
      tutor.User?.firstName && tutor.User?.lastName
        ? `${tutor.User.firstName} ${tutor.User.lastName}`
        : tutor.User?.firstName || tutor.User?.lastName || "N/A",
    email: tutor.User?.email || "N/A",
    phone: tutor.User?.phone || "N/A",
    date: formatDate(tutor.createdAt),
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

  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const convertMMDDYYYYtoISO = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return "";

    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";

    const [month, day, year] = parts;

    if (!month || !day || !year) return "";

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const filteredTableData = tableData;

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                    Tutor
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
                  {/* <Button
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
                  </Button> */}
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
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      border: "1px solid #ccc",
                      borderRadius: "16px",
                      padding: "4px 10px",
                      backgroundColor: "transparent",
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
                        if (val.length === 2 && dateInput.length === 1)
                          val += "/";
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
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="row">
              <div className="col-12">
                <Alert severity="error" sx={{ m: 2 }}>
                  Error loading tutors: {error}
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
                  Loading tutors...
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
                <div>No tutors yet</div>
              </div>
            </div>
          )}

          {/* Table */}
          {!isLoading && !error && tableData && tableData.length > 0 && (
            <div className="row">
              <div className="col-12">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ height: 32, bgcolor: "#FFFFFF" }}>
                        {[
                          { label: "Tutor ID", key: "clientId" },
                          { label: "Tutor Name", key: "name" },
                          { label: "Email", key: "email" },
                          { label: "Phone", key: "phone" },
                          { label: "Joining Date", key: "date" },
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
                      {filteredTableData.map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        return (
                          <TableRow
                            key={row.id}
                            hover
                            onClick={() => handleSelectRow(row.id)}
                            selected={isItemSelected}
                            sx={{
                              height: "48px",
                              backgroundColor:
                                index % 2 === 0 ? "#F9F9FB" : "#FFFFFF",
                              "&:hover": {
                                backgroundColor: "#F1F3F7",
                              },
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
                              <Tooltip title={row.userId} arrow>
                                <div
                                  style={{
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    color: "#4D5874",
                                    // height: 48,
                                    cursor: "pointer",
                                    maxWidth: "80px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                  }}
                                >
                                  {row.userId}
                                </div>
                              </Tooltip>
                            </TableCell>

                            <TableCell
                              style={{
                                padding: "0 8px",
                                height: "48px",
                                lineHeight: "48px",
                                border: "1px solid #E0E3EB",
                              }}
                              onClick={() =>
                                navigate(`/tutor-profile/${row.id}`)
                              }
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                <div
                                  className="d-flex align-items-center"
                                  style={{ marginLeft: "5px" }}
                                  onClick={() =>
                                    navigate(`/tutor-profile/${row.id}`)
                                  }
                                >
                                  <Avatar
                                    src={row.image ? row.image : profileImg}
                                    style={{
                                      width: 25,
                                      height: 25,
                                      marginRight: "10px",
                                    }}
                                  />
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
                                border: "1px solid #E0E3EB",
                                padding: "0 8px",
                                height: "48px",
                                lineHeight: "48px",
                                // height: 48,
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                <span
                                  style={{
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    color: "#101219",
                                    cursor: "pointer",
                                    maxWidth: "140px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                    marginLeft: "5px",
                                  }}
                                >
                                  {row.email}
                                </span>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(row.subjects);
                                  }}
                                  style={{ padding: "2px" }}
                                >
                                  <ContentCopyIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#666",
                                      marginRight: "5px",
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
                                padding: "0 8px",
                                height: "48px",
                                lineHeight: "48px",
                                border: "1px solid #E0E3EB",
                              }}
                            >
                              <div className="d-flex align-items-center justify-content-between">
                                <span
                                  style={{
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    color: "#101219",
                                    cursor: "pointer",
                                    maxWidth: "120px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    marginLeft: "5px",
                                  }}
                                >
                                  {"+" + row.phone}
                                </span>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(row.subjects);
                                  }}
                                  style={{ padding: "2px" }}
                                >
                                  <ContentCopyIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#666",
                                      marginRight: "5px",
                                    }}
                                  />
                                </IconButton>
                              </div>
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
                                // height: 48,
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{ marginLeft: "10px" }}
                              >
                                {row.date}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {pagination && (
                  <TablePagination
                    component="div"
                    count={pagination.total || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[]}
                    labelRowsPerPage=""
                    onRowsPerPageChange={() => {}}
                    sx={{
                      width: "100%",

                      "& .MuiTablePagination-selectLabel": {
                        display: "none",
                      },

                      "& .MuiTablePagination-input": {
                        display: "none",
                      },

                      "& .MuiTablePagination-toolbar": {
                        position: "relative",
                        display: "flex",
                        justifyContent: "flex-end",
                      },

                      "& .MuiTablePagination-displayedRows": {
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        margin: 0,
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
          )}
        </div>
      </div>
    </>
  );
};

export default TutorDashboard;
