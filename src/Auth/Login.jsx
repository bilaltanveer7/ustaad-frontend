import react, { useEffect } from 'react'
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
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Admin Login";
    }, []);

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
                            label="Email"
                            placeholder="Enter admin email"
                            fullWidth
                        />

                        <TextField
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
                        onClick={()=> navigate('/dashboard')}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: '#1F9FBE',
                                color: '#fff',
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: '#1F9FBE',
                                },
                            }}
                        >
                            Log in
                        </Button>
                        <Link
                            underline="hover"
                            sx={{ cursor:'pointer', fontSize: '0.875rem', mt: 1, display: 'block', textAlign: 'right' }}
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