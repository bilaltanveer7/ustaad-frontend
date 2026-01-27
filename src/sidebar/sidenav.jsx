import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material'
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import logo from "../assets/logo.png"
import avatarImg from "../assets/Avatar.png"
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { LiaFileContractSolid } from "react-icons/lia";

const drawerWidth = 260;
const selectedItem = 'Dashboard';

export default function SideNav() {
    const [openMenu, setOpenMenu] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userAnchorEl, setUserAnchorEl] = React.useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);

    const handleAvatarClick = (event) => {
        setUserAnchorEl(event.currentTarget);
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const isNotificationOpen = Boolean(notificationAnchorEl);

    const handleMenuClose = () => {
        setUserAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        handleMenuClose();
    };

    const handleProfile = () => {
        // Navigate to profile page (can be customized based on user role)
        // navigate('/profile');
        handleMenuClose();
    };

    const handleItemClick = (item) => {
        if (item.onClick) {
            item.onClick(); // handleLogout for logout
        } else {
            navigate(item.path); // normal navigation
        }
    };

    const menuSections = [
        {
            title: 'GENERAL',
            items: [
                { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
                { text: 'Parents', icon: <PeopleIcon />, path: '/parent-dashboard' },
                { text: 'Tutors', icon: <SchoolIcon />, path: '/tutor-dashboard' },
                { text: 'Transaction Log', icon: <ReceiptLongIcon />, path: '/transaction-dashboard' },
                { text: 'Admins', icon: <AdminPanelSettingsIcon />, path: '/admins-dashboard' },
                { text: 'Pending Users', icon: <HourglassEmptyIcon />, path: '/pending-users' },
                { text: 'Contracts', icon: <LiaFileContractSolid style={{height:25, width:25}} />, path: '/contracts-dashboard' },
            ],
        },
        {
            title: 'OTHERS',
            items: [
                { text: 'Logout', icon: <LogoutIcon />, path: '/', onClick: handleLogout },
            ],
        },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: "#FFFFFF",
                    boxShadow: 'none',
                    height: '68px',
                    borderBottom: '1px solid #E0E3EB'
                }}>
                <Toolbar sx={{ minHeight: '68px', px: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box component="img" src={logo} alt="Logo" sx={{ height: 42, width: 31 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {user?.name && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#344767',
                                        fontWeight: 500,
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    {user.name}
                                </Typography>
                            )}

                            <IconButton
                                onClick={handleNotificationClick}
                                sx={{
                                    pr: 3, boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: 'none',
                                        backgroundColor: 'transparent'
                                    }
                                }}
                                color="inherit"
                            >
                                <Badge variant="dot" color="success"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: 4,
                                            top: 8,
                                            // minWidth: 10,
                                            // height: 10,
                                            fontSize: '0.75rem'
                                        }
                                    }}>
                                    <NotificationsNoneIcon sx={{ fontSize: 35, color: '#1E9CBC' }} />
                                </Badge>
                            </IconButton>

                            <IconButton
                                onClick={handleAvatarClick}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    src={avatarImg}
                                    alt={user?.name || 'User Avatar'}
                                    sx={{ width: 36, height: 36 }}
                                />
                            </IconButton>

                            <Menu
                                anchorEl={userAnchorEl}
                                open={Boolean(userAnchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                sx={{ mt: 1 }}
                            >
                                <MenuItem onClick={handleProfile} sx={{ py: 1.5, px: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Profile</ListItemText>
                                </MenuItem>

                                <Divider />

                                <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2, color: 'error.main' }}>
                                    <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Logout</ListItemText>
                                </MenuItem>
                            </Menu>

                            <Menu
                                anchorEl={notificationAnchorEl}
                                open={isNotificationOpen}
                                onClose={handleNotificationClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                sx={{ mt: 1 }}
                                PaperProps={{
                                    sx: { width: 320, maxHeight: 400 }
                                }}
                            >
                                <MenuItem
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        borderBottom: '1px solid #e0e0e0',
                                        justifyContent: 'flex-start'
                                    }}
                                    disabled
                                >
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Notifications
                                    </Typography>
                                </MenuItem>

                                {[
                                    "New tutor joined the platform",
                                    "Parent approved your profile",
                                    "Payment received successfully",
                                    "New message from parent"
                                ].map((notification, index) => (
                                    <MenuItem
                                        key={index}
                                        sx={{
                                            py: 1.5,
                                            px: 2,
                                            borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none',
                                            '&:hover': { backgroundColor: '#f5f5f5' }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                backgroundColor: '#4CAF50',
                                                mt: 0.5
                                            }} />
                                            <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.3 }}>
                                                {notification}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#FFFFFF',
                        paddingTop: '16px',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    {/* {menuSections.map((section, sectionIndex) => (
                        <Box key={section.title}>
                            <Typography
                                variant="caption"
                                sx={{
                                    px: 2,
                                    pt: sectionIndex === 0 ? 0 : 2,
                                    pb: 1,
                                    color: '#7B809A',
                                    fontWeight: 500,
                                }}
                            >
                                {section.title}
                            </Typography>
                            <List>
                                {section.items.map(({ text, icon, path }) => {
                                    const isSelected = location.pathname === path;
                                    return (
                                        <ListItem key={text} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                                            <ListItemButton
                                                onClick={() => navigate(path)}
                                                selected={isSelected}
                                                sx={{
                                                    borderRadius: '8px',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    backgroundColor: isSelected ? '#1E9CBC' : 'transparent',
                                                    '&:hover': {
                                                        backgroundColor: '#1E9CBC',
                                                        '& .MuiListItemText-primary': {
                                                            color: '#FFFFFF',
                                                        },
                                                        '& .MuiListItemIcon-root': {
                                                            color: '#FFFFFF',
                                                        },
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#1E9CBC',
                                                        '& .MuiListItemText-primary': {
                                                            color: '#FFFFFF',
                                                        },
                                                        '& .MuiListItemIcon-root': {
                                                            color: '#FFFFFF',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: '#1E9CBC',
                                                        },
                                                    },
                                                }}
                                            >
                                                <ListItemIcon sx={{ color: isSelected ? '#FFFFFF' : '#344767', minWidth: 32 }}>
                                                    {icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={text}
                                                    primaryTypographyProps={{
                                                        fontSize: '0.95rem',
                                                        color: isSelected ? '#FFFFFF' : '#4D5874',
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                            {sectionIndex === 0 && <Divider sx={{ mx: 2, my: 1 }} />}
                        </Box>
                    ))} */}
                    {menuSections.map((section, sectionIndex) => (
                        <Box key={section.title}>
                            <Typography
                                variant="caption"
                                sx={{
                                    px: 2,
                                    pt: sectionIndex === 0 ? 0 : 2,
                                    pb: 1,
                                    color: '#7B809A',
                                    fontWeight: 500,
                                }}
                            >
                                {section.title}
                            </Typography>
                            <List>
                                {section.items.map((item) => {  // ✅ Changed: full item object instead of destructuring
                                    const isSelected = location.pathname === item.path;
                                    return (
                                        <ListItem key={item.text} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                                            <ListItemButton
                                                // ✅ CHANGED: handleItemClick instead of navigate(path)
                                                onClick={() => handleItemClick(item)}
                                                selected={isSelected}
                                                sx={{
                                                    borderRadius: '8px',
                                                    fontWeight: 500,
                                                    fontSize: '14px',
                                                    backgroundColor: isSelected ? '#1E9CBC' : 'transparent',
                                                    '&:hover': {
                                                        backgroundColor: '#1E9CBC',
                                                        '& .MuiListItemText-primary': {
                                                            color: '#FFFFFF',
                                                        },
                                                        '& .MuiListItemIcon-root': {
                                                            color: '#FFFFFF',
                                                        },
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#1E9CBC',
                                                        '& .MuiListItemText-primary': {
                                                            color: '#FFFFFF',
                                                        },
                                                        '& .MuiListItemIcon-root': {
                                                            color: '#FFFFFF',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: '#1E9CBC',
                                                        },
                                                    },
                                                }}
                                            >
                                                <ListItemIcon sx={{ color: isSelected ? '#FFFFFF' : '#344767', minWidth: 32 }}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.text}
                                                    primaryTypographyProps={{
                                                        fontSize: '0.95rem',
                                                        color: isSelected ? '#FFFFFF' : '#4D5874',
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                            {sectionIndex === 0 && <Divider sx={{ mx: 2, my: 1 }} />}
                        </Box>
                    ))}
                </Box>
            </Drawer>
        </Box>
    );
}
