import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Box, CircularProgress, Typography } from '@mui/material';

const PrivateRoute = ({ children, requiredRole = 'SUPER_ADMIN' }) => {
  const { isAuthenticated, isLoading, user, initializeAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Initialize auth state on mount
    initializeAuth();
  }, [initializeAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2, color: '#1F9FBE' }} />
        <Typography color="textSecondary">Loading...</Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to login with the attempted location
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          p: 3,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography color="textSecondary" textAlign="center">
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  // If authenticated and has required role (if any), render the protected component
  return children;
};

export default PrivateRoute;