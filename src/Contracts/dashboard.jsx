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
    Menu,
    MenuItem,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";

const drawerWidth = 260;

const ContractDashboard = () => {
    const [searchValue, setSearchValue] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };



    const tableData = [
        {
            id: 1,
            parent_name: "Ahmed Khan",
            child_name: "Ali Khan",
            budget: "Rs 25,000",
            start_date: "10-01-2026",
            sessions: 12,
            subjects: "Math, Physics",
            days: "Mon, Wed, Fri",
            description: "Home tuition for grade 8",
            action: "View",
        },
        {
            id: 2,
            parent_name: "Sara Malik",
            child_name: "Ayesha Malik",
            budget: "Rs 18,000",
            start_date: "15-01-2026",
            sessions: 8,
            subjects: "English, Urdu",
            days: "Tue, Thu",
            description: "School syllabus support, School syllabus supportSchool syllabus supportSchool syllabus support",
            action: "View",
        },
        {
            id: 3,
            parent_name: "Usman Ali",
            child_name: "Hassan Ali",
            budget: "Rs 30,000",
            start_date: "20-01-2026",
            sessions: 15,
            subjects: "Chemistry, Biology",
            days: "Mon–Fri",
            description: "Pre-medical preparation",
            action: "View",
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
                                        Contracts
                                    </h4>
                                </div>
                                <div style={{ width: "300px" }}>
                                    <TextField
                                        size="small"
                                        placeholder="Search..."
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

                    {/* Table */}

                    <div className="row">
                        <div className="col-12">
                            <TableContainer style={{ marginTop: '1rem' }}>
                                <Table style={{ boxShadow: 'none', overflowX: 'auto' }}>
                                    <TableHead>
                                        <TableRow sx={{ height: 32, bgcolor: "#1E9CBC" }}>
                                            {[
                                                { label: "Parent Name", key: "parent_name" },
                                                { label: "Child Name", key: "child_name" },
                                                { label: "Budget", key: "budget" },
                                                { label: "Start Date", key: "start_date" },
                                                { label: "Sessions", key: "sessions" },
                                                { label: "Subjects", key: "sunjects" },
                                                { label: "Days", key: "days" },
                                                { label: "Description", key: "description" },
                                                { label: "Status", key: "status" },
                                                { label: "Action", key: "action" },
                                            ].map(({ label, key }) => (
                                                <TableCell
                                                    key={key}
                                                    sx={{
                                                        fontSize: "16px",
                                                        fontWeight: 600,
                                                        color: "#FFFFFF",
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableData.map((row) => {
                                            return (
                                                <TableRow
                                                    key={row.id}
                                                    hover
                                                    sx={{
                                                        // cursor: "pointer",
                                                        height: '40px',
                                                        backgroundColor: 'transparent'
                                                    }}
                                                >
                                                    <TableCell sx={{
                                                        padding: '0 8px',
                                                        height: '40px',
                                                        lineHeight: '40px',
                                                        border: "1px solid #e0e0e0",
                                                    }}
                                                    >
                                                        <Tooltip title={row.parent_name} arrow>
                                                            <div
                                                                style={{
                                                                    fontWeight: 600,
                                                                    fontSize: "14px",
                                                                    color: "#000",
                                                                    // height: 48,
                                                                    cursor: "pointer",
                                                                    maxWidth: "120px",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {row.parent_name}
                                                            </div>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell
                                                        style={{
                                                            border: "1px solid #e0e0e0",
                                                            padding: '0 8px',
                                                            height: '40px',
                                                            lineHeight: '40px',
                                                            // height: 48,
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <Tooltip title={row.child_name} arrow>
                                                                    <div
                                                                        style={{
                                                                            fontWeight: 400,
                                                                            fontSize: "14px",
                                                                            color: "#000",
                                                                            cursor: "pointer",
                                                                            maxWidth: "100px",
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            whiteSpace: "nowrap",
                                                                        }}
                                                                    >
                                                                        {row.child_name}
                                                                    </div>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#000",
                                                            fontWeight: 400,
                                                            border: "1px solid #e0e0e0",
                                                            padding: '0 8px',
                                                            height: '40px',
                                                            lineHeight: '40px',
                                                            // height: 48,
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <Tooltip title={row.budget} arrow>
                                                                <div
                                                                    style={{
                                                                        fontWeight: 400,
                                                                        fontSize: "14px",
                                                                        color: "#000",
                                                                        cursor: "pointer",
                                                                        maxWidth: "140px",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    {row.budget}
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#000",
                                                            fontWeight: 400,
                                                            padding: '0 8px',
                                                            height: '40px',
                                                            lineHeight: '40px',
                                                            border: "1px solid #e0e0e0",
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <Tooltip title={row.start_date || "N/A"} arrow>
                                                                <div
                                                                    style={{
                                                                        fontWeight: 400,
                                                                        fontSize: "14px",
                                                                        color: "#000",
                                                                        cursor: "pointer",
                                                                        maxWidth: "120px",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    {row.start_date || "N/A"}
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#000",
                                                            fontWeight: 400,
                                                            border: "1px solid #e0e0e0",
                                                            padding: '0 8px',
                                                            height: '40px',
                                                            lineHeight: '40px',
                                                            // height: 48,
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            {row.sessions}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#000",
                                                            fontWeight: 400,
                                                            border: "1px solid #e0e0e0",
                                                            padding: '0 8px',
                                                            height: '40px',
                                                            lineHeight: '40px',
                                                            maxWidth: '220px'
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title={row.subjects || ""}
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
                                                                {row.subjects || "-"}
                                                            </div>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#000",
                                                            fontWeight: 400,
                                                            border: "1px solid #e0e0e0",
                                                            padding: '0 8px',
                                                            height: '40px',
                                                            lineHeight: '40px',
                                                            maxWidth: "220px",
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title={row.days || ""}
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
                                                                {row.days || "-"}
                                                            </div>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#000",
                                                            fontWeight: 400,
                                                            border: "1px solid #e0e0e0",
                                                            padding: "0 8px",
                                                            height: "40px",
                                                            maxWidth: "220px",
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title={row.description || ""}
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
                                                                {row.description || "-"}
                                                            </div>
                                                        </Tooltip>
                                                    </TableCell>

                                                    <TableCell
                                                        style={{
                                                            fontSize: "14px",
                                                            fontWeight: 600,
                                                            height: "40px",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <span style={{
                                                            color: "#2e7d32",
                                                            border: "1px solid #2e7d32",
                                                            padding:'2px 8px'
                                                        }}>
                                                            Active
                                                        </span>
                                                    </TableCell>


                                                    <TableCell
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#000",
                                                            fontWeight: 400,
                                                            border: "1px solid #e0e0e0",
                                                            padding: "0 24px",
                                                            // height: "40px",
                                                        }}
                                                    >
                                                        <Box display="flex" justifyContent="flex-end">
                                                            <IconButton size="small" onClick={handleMenuOpen}>
                                                                <MoreVertIcon />
                                                            </IconButton>

                                                            <Menu
                                                                anchorEl={anchorEl}
                                                                open={open}
                                                                onClose={handleMenuClose}
                                                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                                transformOrigin={{ vertical: "top", horizontal: "right" }}
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
                                                                        // handleTerminate(row.id);
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
                                                                        // handleComplete(row.id);
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
                                                            </Menu>
                                                        </Box>
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContractDashboard;
