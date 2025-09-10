import react, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Typography,
    Box,
    Link,
    Paper
} from '@mui/material';
import Logo from '../assets/logo.png'

const LoginScreen = () => {
    
    // {/*useEffect hook used for tab title in browser*/}
    useEffect(() => {
        document.title = "Admin Login";
    }, []);
    
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!email || !password) {
            // alert("Please enter both email and password");
            return;
        }
        const payload = {
            email: email,
            password: password
        }
        console.log("auth output++++++", payload);

        axios.post("https://api.escuelajs.co/api/v1/auth/login", payload)
            .then((res) => {
                localStorage.setItem("token", JSON.stringify(res.data.access_token))
                console.log("Login Successful", res);
                navigate('/dashboard');
            })
            .catch((err) => {
                console.log("Login Error+++++++++", err);

            })
    }

    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    bgcolor: '#1F9FBE',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2,
                }}
            >
                <Paper
                    elevation={5}
                    sx={{
                        width: '100%',
                        maxWidth: 520,
                        bgcolor: '#fff',
                        px: 4,
                        py: 5,
                        borderRadius: 4,
                        textAlign: 'center',
                    }}
                >
                    <Box mb={2}>
                        <img src={Logo} alt="Logo" style={{ height: 70, width: 70 }} />
                    </Box>
                    <Typography style={{ fontSize: '32px', fontWeight: 500 }}>
                        Admin Login
                    </Typography>
                    <Box component="form" display="flex" flexDirection="column" gap={2}>
                        <TextField
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            label="Email"
                            placeholder="Enter admin email"
                            fullWidth
                        />

                        <TextField
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            fullWidth
                        />

                        <FormControlLabel
                            control={<Checkbox />}
                            label="Remember me"
                            sx={{ textAlign: 'left' }}
                        />

                        <Button
                            onClick={handleSubmit}
                            type="button"
                            fullWidth
                            variant="contained"
                            disabled={!email || !password || loading}
                            sx={{
                                bgcolor: '#1F9FBE',
                                color: '#fff',
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: '#1F9FBE',
                                },
                            }}
                        >
                            {/* Log in */}
                            {loading ? 'Logging in...' : 'Log in'}
                        </Button>
                        <Link
                            underline="hover"
                            sx={{ cursor: 'pointer', fontSize: '0.875rem', mt: 1, display: 'block', textAlign: 'right' }}
                        >
                            Forgot password?
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}

export default LoginScreen