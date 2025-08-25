import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Link,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import Logo from "../assets/logo.png";
import { useAuthStore } from "../store/useAuthStore";

const LoginScreen = () => {
  const navigate = useNavigate();
  const { loginUser, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    document.title = "Admin Login";
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear errors when user starts typing
    if (error) clearError();
    if (localError) setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Local validation
    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all required fields");
      return;
    }

    // Clear any previous local error
    setLocalError("");

    try {
      // Call the store login function
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // If login was successful, navigate to dashboard
      if (result.success) {
        navigate("/dashboard");
      }
      // Error handling is managed by the store
    } catch (error) {
      console.error("Unexpected login error:", error);
      setLocalError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          bgcolor: "#1F9FBE",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={5}
          sx={{
            width: "100%",
            maxWidth: 520,
            bgcolor: "#fff",
            px: 4,
            py: 5,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Box mb={2}>
            <img src={Logo} alt="Logo" style={{ height: 70, width: 70 }} />
          </Box>
          <Typography style={{ fontSize: "32px", fontWeight: 500 }}>
            Admin Login
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            {(error || localError) && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error || localError}
              </Alert>
            )}

            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              fullWidth
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              fullWidth
              required
            />

            <FormControlLabel
              control={
                <Checkbox 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              }
              label="Remember me"
              sx={{ textAlign: "left" }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                bgcolor: "#1F9FBE",
                color: "#fff",
                textTransform: "none",
                py: 1.5,
                "&:hover": {
                  bgcolor: "#1F9FBE",
                },
                "&:disabled": {
                  bgcolor: "#cccccc",
                },
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
            
            <Link
              underline="hover"
              sx={{
                cursor: "pointer",
                fontSize: "0.875rem",
                mt: 1,
                display: "block",
                textAlign: "right",
              }}
            >
              Forgot password?
            </Link>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default LoginScreen;
