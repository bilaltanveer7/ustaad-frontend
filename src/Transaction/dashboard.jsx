import React, { useState } from 'react'
import SideNav from '../sidebar/sidenav'
import { useNavigate } from 'react-router-dom';
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
} from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
} from "@mui/icons-material"
import "bootstrap/dist/css/bootstrap.min.css"

const drawerWidth = 260;

const TransactionDashboard = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
    const tableData = [
        {
            id: 1,
            type: "Withdraw",
            amount: "Rs 10,000",
            payment_method: "Credit Card",
            status: "Success",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 2,
            type: "Withdraw",
            amount: "Rs 10,000",
            payment_method: "Wire Transfer",
            status: "Failed",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 3,
            type: "Received",
            amount: "Rs 10,000",
            payment_method: "Credit Card",
            status: "Success",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 4,
            type: "Received",
            amount: "Rs 10,000",
            payment_method: "Debit Card",
            status: "Success",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 5,
            type: "Withdraw",
            amount: "Rs 10,000",
            payment_method: "Credit Card",
            status: "Incomplete",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 6,
            type: "Received",
            amount: "Rs 10,000",
            payment_method: "Wire Transfer",
            status: "Success",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 7,
            type: "Withdraw",
            amount: "Rs 10,000",
            payment_method: "Credit Card",
            status: "Failed",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 8,
            type: "Received",
            amount: "Rs 10,000",
            payment_method: "Debit Card",
            status: "Failed",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 9,
            type: "Withdraw",
            amount: "Rs 10,000",
            payment_method: "Credit Card",
            status: "Success",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 10,
            type: "Withdraw",
            amount: "Rs 10,000",
            payment_method: "Paypal",
            status: "Success",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 11,
            type: "Withdraw",
            amount: "Rs 10,000",
            payment_method: "Wire Transfer",
            status: "Incomplete",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
        {
            id: 12,
            type: "Withdraw",
            amount: "Rs 10,000",
            payment_method: "Debit Card",
            status: "Success",
            people: "Rurda Pratap",
            date: "12/03/20247"
        },
    ]

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(tableData.map((row) => row.id))
        } else {
            setSelected([])
        }
    }

    const handleSelectRow = (id) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
        }

        setSelected(newSelected)
    }

    const isSelected = (id) => selected.indexOf(id) !== -1

    const getInitials = (name) => {
        if (!name) return '';
        const words = name.trim().split(' ');
        if (words.length === 1) return words[0][0].toUpperCase();
        return (words[0][0] + words[1][0]).toUpperCase();
    };

    const getAvatarColor = (name) => {
        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];

        if (!name || typeof name !== 'string') {
            return "#ccc";
        }

        const index = name.length % colors.length;
        return colors[index];
    };

    const handleSort = (key) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (columnKey) => {
        if (sortConfig.key === columnKey) {
            return sortConfig.direction === "asc" ? (
                <ArrowUpwardIcon style={{ fontSize: "16px", marginLeft: "4px" }} />
            ) : (
                <ArrowDownwardIcon style={{ fontSize: "16px", marginLeft: "4px" }} />
            )
        }
        return <UnfoldMoreIcon style={{ fontSize: "16px", marginLeft: "4px", color: "#ccc" }} />
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
    }
    return (
        <>
            <SideNav />
            <div
                style={{
                    marginLeft: `${drawerWidth}px`,
                    transition: "margin-left 0.3s ease-in-out",
                    marginTop: '4rem',
                }}>
                <div className="container-fluid" style={{ minHeight: "100vh", paddingTop: "10px" }}>
                    <div className="row"
                        style={{
                            padding: "10px",
                            paddingBottom: '1rem',
                            borderBottom: "1px solid #E0E3EB",
                        }}>
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <IconButton size="small" style={{ marginRight: "10px" }}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <h4 className="mb-0 me-3" style={{ fontWeight: 600, fontSize: "20px", color: '#101219' }}>
                                        Transation
                                    </h4>
                                    <div
                                        className="d-flex align-items-center text-muted"
                                        style={{
                                            fontSize: "14px",
                                            backgroundColor: "#ECEEF3",
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            width: "fit-content"
                                        }}
                                    >
                                        <UpdateIcon style={{ fontSize: "16px", marginRight: "5px" }} />
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
                                                    <SearchIcon style={{ color: "#666", fontSize: "20px" }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: searchValue && (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => setSearchValue("")}>
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
                    <div className="row" style={{ backgroundColor: '#F9F9FB', padding: '1rem' }}>
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <span style={{
                                        fontSize: "14px", color: "#4D5874", marginRight: "20px", border: "1px solid #E0E3EB",
                                        padding: "6px 20px", borderRadius: "4px", backgroundColor: '#FFFFFF'
                                    }}>{selected.length} Selected</span>
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterIcon />}
                                        style={{
                                            textTransform: "none",
                                            fontSize: "14px",
                                            color: "#4D5874",
                                            border: "1px solid #E0E3EB",
                                            backgroundColor: '#FFFFFF',
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
                                    <span style={{ fontWeight: 400, fontSize: "16px", color: "#4D5874" }}>120 Results</span>
                                </div>
                                <Button
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
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <TableContainer
                                component={Paper}>
                                <Table >
                                    <TableHead>
                                        <TableRow sx={{ height: 32 }}>

                                            {[
                                                { label: "Type", key: "type" },
                                                { label: "Amount", key: "amount" },
                                                { label: "Payment Method", key: "payment_method" },
                                                { label: "Status", key: "status" },
                                                { label: "People", key: "people" },
                                                { label: "Date", key: "date" },
                                                { label: "Action", key: "date" },
                                            ].map(({ label, key }) => (
                                                <TableCell
                                                    key={key}
                                                    sx={{
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        color: "#4D5874",
                                                        cursor: "pointer",
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
                                        {tableData.map((row, index) => {
                                            const isItemSelected = isSelected(row.id)
                                            return (
                                                <TableRow
                                                    key={row.id}
                                                    hover
                                                    onClick={() => handleSelectRow(row.id)}
                                                    selected={isItemSelected}
                                                    style={{
                                                        cursor: "pointer",
                                                        backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
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
                                                                    backgroundColor: row.type === "Withdraw" ? "#FEECEC" : "#EEFCF3",
                                                                }}
                                                            >
                                                                {row.type === "Withdraw" ? (
                                                                    <ArrowUpwardIcon
                                                                        style={{ color: "#F31616", fontSize: "16px", fontWeight: "bold" }}
                                                                    />
                                                                ) : (
                                                                    <ArrowDownwardIcon
                                                                        style={{ color: "#38BC5C", fontSize: "16px", fontWeight: "bold" }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <span>{row.type}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{ fontWeight: 400, fontSize: "14px", color: "#101219", border: "1px solid #e0e0e0" }}>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            {row.amount}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{ fontWeight: 400, fontSize: "14px", color: "#101219", border: "1px solid #e0e0e0" }}>
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
                                                            {row.status === "Success" && (
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
                                                                    <CheckCircleIcon style={{ fontSize: "18px", marginRight: 4 }} />
                                                                    Success
                                                                </div>
                                                            )}
                                                            {row.status === "Failed" && (
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
                                                                    <CancelIcon style={{ fontSize: "18px", marginRight: 4 }} />
                                                                    Failed
                                                                </div>
                                                            )}
                                                            {row.status === "Incomplete" && (
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
                                                                    <PauseCircleFilledIcon style={{ fontSize: "18px", marginRight: 4 }} />
                                                                    Incomplete
                                                                </div>
                                                            )}
                                                            {row.status === "Bank Issue" && (
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
                                                                    <InfoIcon style={{ fontSize: "18px", marginRight: 4 }} />
                                                                    Bank Issue
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{ border: "1px solid #e0e0e0" }}>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <Avatar
                                                                    style={{
                                                                        width: "32px",
                                                                        height: "32px",
                                                                        backgroundColor: getAvatarColor(row.name),
                                                                        fontSize: "12px",
                                                                        marginRight: "12px",
                                                                    }}
                                                                >
                                                                    {getInitials(row.name)}
                                                                </Avatar>
                                                                <span style={{ fontWeight: 400, fontSize: "14px", color: "#101219" }}>
                                                                    {row.people}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{
                                                        fontWeight: 400,
                                                        fontSize: "14px",
                                                        color: "#101219", border: "1px solid #e0e0e0"
                                                    }}>
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
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <MoreVertIcon style={{ color: "#4D5874", cursor: "pointer" }} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TransactionDashboard
