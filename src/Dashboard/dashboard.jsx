import React, { useState, useEffect } from 'react'
import axios from 'axios';
import SideNav from '../sidebar/sidenav'
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Select,
    MenuItem,
    FormControl,
    LinearProgress,
    InputAdornment,
    Chip,
    Divider,
    Paper,
    TextField,
    TableContainer,
    TableCell,
    Checkbox,
    TableHead,
    TableRow,
    TableBody,
    Table,
    Avatar,
    IconButton
} from "@mui/material"
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
import fileicon from "../assets/file.png";
import editicon from "../assets/edit.png";
import DateRangeIcon from '@mui/icons-material/DateRange';
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { TrendingUp, TrendingDown, FileDownload, Visibility, Edit, Search, KeyboardArrowDown, Add, Person, School, PersonOff, Group, } from "@mui/icons-material"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const drawerWidth = 260;
const performanceData = [
    { name: "Jan", value: 65 },
    { name: "Feb", value: 75 },
    { name: "Mar", value: 85 },
    { name: "Apr", value: 70 },
    { name: "May", value: 90 },
    { name: "Jun", value: 80 },
    { name: "Jul", value: 85 },
    { name: "Aug", value: 75 },
    { name: "Sep", value: 70 },
    { name: "Oct", value: 60 },
    { name: "Nov", value: 55 },
    { name: "Dec", value: 45 },
]

// Sample data for the pie chart
const jobData = [
    { name: "Active", value: 15, color: "#00bcd4" },
    { name: "Completed", value: 20, color: "#4caf50" },
    { name: "Remaining", value: 738, color: "#e0e0e0" },
]

const Dashboard = () => {
    const [selected, setSelected] = useState([])
    const [timeFilter, setTimeFilter] = useState("Last 7 Days")
    const [weekFilter, setWeekFilter] = useState("Week")
    const [searchQuery, setSearchQuery] = useState("")
    const [jobTitleFilter, setJobTitleFilter] = useState("All Job Titles")
    const [statusFilter, setStatusFilter] = useState("All Status")
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("https://api.escuelajs.co/api/v1/users");
                console.log("users data fetched++++++", res.data);
                setUsers(res.data);
            } catch (err) {
                console.log("Error fetching users--------", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const MetricCard = ({ title, value, change, changeType, icon: Icon }) => {
        const isUp = changeType === "up";
        const changeColor = isUp ? "#38BC5C" : "#F31616";

        return (
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #E0E3EB",
                    borderRadius: "12px",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    height: "100%",
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Icon fontSize="small" color="action" />
                    <Typography sx={{ fontWeight: 500, fontSize: '14px', color: '#101219' }}>
                        {title}
                    </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{
                    mt: 2
                }}>
                    {/* Left: Value */}
                    <Typography sx={{ fontWeight: 600, fontSize: '24px', color: '#101219' }}>
                        {value.toLocaleString()}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        {isUp ? (
                            <ArrowDropUpIcon sx={{ color: changeColor, fontSize: 20 }} />
                        ) : (
                            <ArrowDropDownIcon sx={{ color: changeColor, fontSize: 20 }} />
                        )}
                        <Typography sx={{ color: changeColor, fontSize: 14 }}>{change}</Typography>
                        <Typography sx={{
                            color: '#4D5874',
                            fontWeight: 400,
                            fontSize: 14
                        }}>
                            Last year
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        );
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(users.map((user) => user.id))
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
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const getAvatarColor = (name) => {
        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"]
        const index = name.length % colors.length
        return colors[index]
    }

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

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <>
            <SideNav />
            <div
                style={{
                    marginLeft: `${drawerWidth}px`,
                    transition: "margin-left 0.3s ease-in-out",
                    marginTop: '4rem',
                }}>
                <Box sx={{ flexGrow: 1, py: 2, bgcolor: "#FFFFFF" }}>
                    {/* Header */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, mb: 1.5 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>
                                Overview
                            </Typography>
                            <Chip label="Updated" size="medium" sx={{ cursor: 'pointer', borderRadius: '8px', bgcolor: "#FFFFFF", color: "#4D5874", border: '1px solid #E0E3EB' }} />
                        </Box>
                        <Divider sx={{ mb: 2, color: "#F3F5F7" }} />
                        <Box sx={{ px: 3, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid #E0E3EB",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                }}
                            >

                                <Box sx={{ px: 2, py: 0.8 }}>
                                    <Typography sx={{ fontWeight: 500, fontSize: '14px', color: '#4D5874' }}>
                                        Today
                                    </Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: "#E0E3EB" }} />
                                <DateRangeIcon style={{
                                    width: 20,
                                    height: 20,
                                    color: '#A6ADBF',
                                    marginLeft: 5
                                }} />
                                <FormControl size="small" sx={{ px: 0.7 }}>
                                    <Select
                                        value={timeFilter}
                                        onChange={(e) => setTimeFilter(e.target.value)}
                                        disableUnderline
                                        variant="standard"
                                        sx={{
                                            minWidth: 120,
                                            '& .MuiSelect-select': {
                                                padding: 0,
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: '#4D5874',
                                            },
                                        }}
                                    >
                                        <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                                        <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                                        <MenuItem value="Last 90 Days">Last 90 Days</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Right Side: Add New Button */}
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                sx={{
                                    width: 118,
                                    height: 36,
                                    borderRadius: '8px',
                                    bgcolor: "#1E9CBC",
                                    "&:hover": { bgcolor: "#1E9CBC" },
                                    textTransform: "none",
                                }}
                            >
                                Add New
                            </Button>
                        </Box>
                    </Box>

                    {/* Metrics Cards */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            px: 3,
                            mb: 3,
                        }}
                    >
                        <Box sx={{ width: 250 }}>
                            <MetricCard title="Total Users" value={3540} change="+13%" changeType="up" icon={Group} />
                        </Box>
                        <Box sx={{ width: 250 }}>
                            <MetricCard title="Parents" value={874} change="+12%" changeType="up" icon={Person} />
                        </Box>
                        <Box sx={{ width: 250 }}>
                            <MetricCard title="Tutors" value={874} change="-12%" changeType="down" icon={School} />
                        </Box>
                        <Box sx={{ width: 250 }}>
                            <MetricCard title="Terminated Users" value={29} change="+132%" changeType="up" icon={PersonOff} />
                        </Box>
                    </Box>

                    {/* Charts Section */}
                    <Box sx={{
                        width: '100%',
                        px: 3
                    }}>
                        <Grid container spacing={2}>
                            {/* Performance Team Chart */}
                            <Grid item xs={12} md={9}
                                sx={{
                                    width: '65%',
                                }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: 400,
                                        width: '100%',
                                        border: '1px solid #E0E3EB',
                                        borderRadius: '12px',
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#101219' }}>
                                                Performance Team
                                            </Typography>
                                            <FormControl
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            border: '1px solid #D4D8E2',
                                                        },
                                                        '&:hover fieldset': {
                                                            border: '1px solid #D4D8E2',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            border: '1px solid #D4D8E2',
                                                        },
                                                    },
                                                }}
                                            >
                                                <Select
                                                    value={weekFilter}
                                                    onChange={(e) => setWeekFilter(e.target.value)}
                                                >
                                                    <MenuItem value="Week">Week</MenuItem>
                                                    <MenuItem value="Month">Month</MenuItem>
                                                    <MenuItem value="Year">Year</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={performanceData}>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#4caf50"
                                                    strokeWidth={2}
                                                    fill="#4caf50"
                                                    fillOpacity={0.1}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Right Side Cards */}
                            <Grid item xs={12} md={3} sx={{
                                width: '33.1%'
                            }}>
                                <Grid item xs={12}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: 180,
                                            width: '100%',
                                            border: '1px solid #E0E3EB',
                                            borderRadius: '12px',
                                            p: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                mb: 2,
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#101219' }}>
                                                Total Users
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TrendingUp sx={{ fontSize: 16, color: '#38BC5C' }} />
                                                <Typography sx={{ color: '#38BC5C', fontWeight: 400, fontSize: '14px' }}>
                                                    +12%
                                                </Typography>
                                                <Typography sx={{ color: '#4D5874', fontWeight: 400, fontSize: '14px' }}>
                                                    Last month
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 1.5,
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 600, fontSize: 20, color: '#101219' }}>
                                                80%
                                            </Typography>
                                            <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#101219' }}>
                                                2310
                                            </Typography>
                                        </Box>

                                        {/* Combined Progress Bar */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                height: 20,
                                                width: '100%',
                                                overflow: 'hidden',
                                                borderRadius: 1,
                                                mb: 1.5,
                                            }}
                                        >
                                            <Box sx={{ width: '40%', backgroundColor: '#25A798' }} />
                                            <Box sx={{ width: '40%', backgroundColor: '#1E9CBC' }} />
                                            <Box sx={{ width: '20%', backgroundColor: '#C8CDDA' }} />
                                        </Box>

                                        {/* Legend */}
                                        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#25A798' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    Tutors
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1E9CBC' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    Parents
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#C8CDDA' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    Offloaded
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>

                                {/* Job Summary */}
                                <Grid item xs={12} sx={{ mt: 2.3 }}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: 200,
                                            width: '100%',
                                            border: '1px solid #E0E3EB',
                                            borderRadius: '12px',
                                            p: 2
                                        }}
                                    >
                                        <CardContent sx={{ p: 0 }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                                <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#101219' }}>
                                                    Job Summary
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                    <TrendingUp sx={{ fontSize: 16, color: "#4caf50", mr: 0.5 }} />
                                                    <Typography sx={{ color: '#38BC5C', fontWeight: 400, fontSize: '14px' }}>
                                                        +5.5%
                                                    </Typography>
                                                    <Typography sx={{ color: '#4D5874', fontWeight: 400, fontSize: '14px' }}>
                                                        Last month
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <Box sx={{ position: "relative", width: 120, height: 80 }}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={jobData}
                                                                cx="50%"
                                                                cy="100%"
                                                                innerRadius={30}
                                                                outerRadius={50}
                                                                startAngle={180}
                                                                endAngle={0}
                                                                dataKey="value"
                                                            >
                                                                {jobData.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                ))}
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: "60%",
                                                            left: "50%",
                                                            transform: "translate(-50%, -50%)",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                                                            773
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Total
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                        <Box sx={{ width: 8, height: 8, bgcolor: "#00bcd4", borderRadius: "50%", mr: 1 }} />
                                                        <Typography sx={{
                                                            fontWeight: 400, fontSize: 12, color: '#4D5874'
                                                        }}>Active</Typography>
                                                        <Typography sx={{ ml: 2, fontWeight: 500, fontSize: 12, color: '#101219' }}>
                                                            15
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Box sx={{ width: 8, height: 8, bgcolor: "#4caf50", borderRadius: "50%", mr: 1 }} />
                                                        <Typography sx={{
                                                            fontWeight: 400, fontSize: 12, color: '#4D5874'
                                                        }}>Completed</Typography>
                                                        <Typography sx={{ ml: 2, fontWeight: 500, fontSize: 12, color: '#101219' }}>
                                                            20
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                {/* </Grid> */}
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ mx: 3, p: 3, mt: 2, border: "1px solid #E0E3EB", borderRadius: '12px' }}>
                        {/* Header */}
                        <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#101219', minWidth: 100 }}>
                                    Employee
                                </Typography>

                                {/* Controls */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                    {/* Search */}
                                    <TextField
                                        placeholder="Search"
                                        size="small"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        sx={{
                                            minWidth: 200,
                                            '& .MuiOutlinedInput-root': {
                                                height: 32,
                                                fontSize: 14,
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                padding: '2px 2px',
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search sx={{ color: "#999", fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    {/* Job Title Filter */}
                                    <FormControl
                                        size="small"
                                        sx={{
                                            minWidth: 140,
                                            '& .MuiOutlinedInput-root': {
                                                height: 32,
                                                fontSize: 14,
                                                color: '#4D5874'
                                            },
                                            '& .MuiSelect-select': {
                                                display: 'flex',
                                                alignItems: 'center',
                                            },
                                        }}
                                    >
                                        <Select
                                            value={jobTitleFilter}
                                            onChange={(e) => setJobTitleFilter(e.target.value)}
                                            displayEmpty
                                            IconComponent={KeyboardArrowDown}
                                        >
                                            <MenuItem value="All Job Titles">All Job Titles</MenuItem>
                                            <MenuItem value="UX/UI Designer">UX/UI Designer</MenuItem>
                                            <MenuItem value="Graphic Designer">Graphic Designer</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {/* Status Filter */}
                                    <FormControl size="small" sx={{
                                        minWidth: 120,
                                        '& .MuiOutlinedInput-root': {
                                            height: 32,
                                            fontSize: 14,
                                            color: '#4D5874'
                                        },
                                        '& .MuiSelect-select': {
                                            display: 'flex',
                                            alignItems: 'center',
                                        },
                                    }}>
                                        <Select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            displayEmpty
                                            IconComponent={KeyboardArrowDown}
                                            sx={{
                                                "& .MuiSelect-select": {
                                                    display: "flex",
                                                    alignItems: "center",
                                                },
                                            }}
                                        >
                                            <MenuItem value="All Status">All Status</MenuItem>
                                            <MenuItem value="ACTIVE">Active</MenuItem>
                                            <MenuItem value="PROBATION">Probation</MenuItem>
                                            <MenuItem value="ON BOARDING">On Boarding</MenuItem>
                                            <MenuItem value="PENDING">Pending</MenuItem>
                                            <MenuItem value="RESIGN">Resign</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Button
                                        variant="outlined"
                                        startIcon={<FileDownload />}
                                        sx={{
                                            height: 32,
                                            borderRadius: 1,
                                            px: 2,
                                            borderColor: "#ddd",
                                            color: "#4D5874",
                                            textTransform: "none",
                                            fontSize: 14,
                                            "&:hover": {
                                                borderColor: "#ccc",
                                                bgcolor: "#f5f5f5",
                                            },
                                        }}
                                    >
                                        Export
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Table */}
                        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ height: 32, backgroundColor: "#F9F9FB" }}>
                                        <TableCell padding="checkbox" sx={{ py: 0, height: 32 }}>
                                            <Checkbox
                                                indeterminate={selected.length > 0 && selected.length < users.length}
                                                checked={users.length > 0 && selected.length === users.length}
                                                onChange={handleSelectAll}
                                                size="small"
                                                sx={{ p: 0.5 }}
                                            />
                                        </TableCell>

                                        {[
                                            { label: "People", key: "clientId" },
                                            { label: "Email ID", key: "name" },
                                            { label: "Password", key: "price" },
                                            { label: "Role", key: "address" },
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
                                    {users.map((user, index) => {
                                        const isItemSelected = isSelected(user.id)
                                        return (
                                            <TableRow
                                                key={user.id}
                                                hover
                                                onClick={() => handleSelectRow(user.id)}
                                                selected={isItemSelected}
                                                style={{
                                                    cursor: "pointer",
                                                    height: 48,
                                                    backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
                                                    borderBottom: "1px solid #e0e0e0",
                                                }}
                                            >
                                                <TableCell padding="checkbox"
                                                    style={{
                                                        borderTop: "none",
                                                        borderLeft: "none",
                                                        borderRight: "none",
                                                        borderBottom: "1px solid #e0e0e0",
                                                        py: 0,
                                                        height: 48,
                                                    }}>
                                                    <Checkbox checked={isItemSelected} size="small" />
                                                </TableCell>
                                                <TableCell style={{
                                                    borderTop: "none",
                                                    borderLeft: "none",
                                                    borderRight: "none",
                                                    borderBottom: "1px solid #e0e0e0", py: 0,
                                                    height: 48,
                                                }}>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <Avatar
                                                                style={{
                                                                    width: "32px",
                                                                    height: "32px",
                                                                    backgroundColor: getAvatarColor(user.name),
                                                                    fontSize: "12px",
                                                                    marginRight: "12px",
                                                                }}
                                                            >
                                                                {getInitials(user.avatar)}
                                                            </Avatar>
                                                            <span style={{ fontWeight: 400, fontSize: "16px", color: "#101219" }}>{user.name}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{
                                                    fontSize: "16px", color: "#101219", fontWeight: 400, borderTop: "none",
                                                    borderLeft: "none",
                                                    borderRight: "none",
                                                    borderBottom: "1px solid #e0e0e0", py: 0,
                                                    height: 48,
                                                }}>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        {user.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{
                                                    fontSize: "16px", color: "#101219", fontWeight: 400, borderTop: "none",
                                                    borderLeft: "none",
                                                    borderRight: "none",
                                                    borderBottom: "1px solid #e0e0e0", py: 0,
                                                    height: 48,
                                                }}>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        {user.password}
                                                    </div>
                                                </TableCell>

                                                <TableCell
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: 400,
                                                        borderTop: "none",
                                                        borderLeft: "none",
                                                        borderRight: "none",
                                                        borderBottom: "1px solid #e0e0e0",
                                                        height: 48,
                                                        paddingTop: 0,
                                                        paddingBottom: 0,
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div
                                                            className="d-flex align-items-center px-2 py-1"
                                                            style={{
                                                                border: "1px solid",
                                                                borderRadius: "999px",
                                                                fontSize: "12px",
                                                                fontWeight: 600,
                                                                textTransform: "uppercase",
                                                                width: "fit-content",
                                                                gap: "6px",
                                                                color: user.role?.toUpperCase() === "CUSTOMER" ? "#38BC5C" : "#F31616",
                                                                borderColor: user.role?.toUpperCase() === "CUSTOMER" ? "#38BC5C" : "#F31616",
                                                                backgroundColor: "#fff",
                                                            }}
                                                        >
                                                            {user.role}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    style={{
                                                        fontSize: "16px",
                                                        color: "#101219",
                                                        fontWeight: 400,
                                                        borderTop: "none",
                                                        borderLeft: "none",
                                                        borderRight: "none",
                                                        borderBottom: "1px solid #e0e0e0",
                                                        height: 48,
                                                        paddingTop: 0,
                                                        paddingBottom: 0,
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        {user.address}
                                                        <div className="d-flex align-items-center gap-3">
                                                            <img
                                                                src={fileicon}
                                                                alt="file"
                                                                style={{ width: 20, height: 20, cursor: "pointer" }}
                                                            />
                                                            <img
                                                                src={editicon}
                                                                alt="edit"
                                                                style={{ width: 20, height: 20, cursor: "pointer" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "20px",
                    }}
                >
                    <Button
                        variant="outlined"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outlined"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Dashboard
