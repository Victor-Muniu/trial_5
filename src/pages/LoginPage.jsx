import React from 'react'
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Stack, TextField, Typography, colors } from '@mui/material'
import {images} from '../assets'
import {Link, useNavigate} from 'react-router-dom'
import Animate from '../components/common/Animated'
import { useState } from 'react'
function LoginPage() {
    const navigate = useNavigate();

    const [onRequest, setOnRequest] = useState(false);
    const [loginProgress, setLoginProgress] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const onSignin = async (e) => {
        e.preventDefault();
        setOnRequest(true);

        const emp_no = e.target.elements.emp_no.value;
        const password = e.target.elements.password.value;

        try {
            const response = await fetch('https://hotel-backend-zrv3.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emp_no, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                const user = data.user
                localStorage.setItem('token', token);
                localStorage.setItem('role', user.role);
                localStorage.setItem('fname',user.fname)
                localStorage.setItem('lname',user.lname)

                setIsLoggedIn(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3300);
            } else {
                alert('Authentication failed. Please check your emp_no and password.');
                setOnRequest(false);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again later.');
            setOnRequest(false);
        }


       
    };

  return (
    <Box
            position="relative"
            height="100vh"
            sx={{ '::-webkit-scrollbar': { display: 'none' } }}
        >
            <Box sx={{
                position: 'absolute',
                right: 0,
                height: '100%',
                width: '70%',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(${images.loginBg})`
            }} />

            <Box sx={{
                position: 'absolute',
                left: 0,
                height: '100%',
                width: isLoggedIn ? '100%' : { xl: '30%', lg: '40%', md: '50%', xs: '100%' },
                transition: 'all 1s ease-in-out',
                bgcolor: colors.common.white
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isLoggedIn ? 0 : 1,
                    transition: 'all 0.3s ease-in-out',
                    height: '100%',
                    '::-webkit-scrollbar': { display: 'none' }
                }}>
                    <Box sx={{ textAlign: 'center', p: 5 }}>
                        <Animate type="fade" delay={0.5}>
                            <img src={images.logo} alt="logo" height={60}></img>
                        </Animate>
                    </Box>

                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '::-webkit-scrollbar': { display: 'none' }
                    }}>
                        <Animate type="fade" sx={{ maxWidth: 400, width: '100%' }}>
                            <Box component="form" maxWidth={400} width="100%" onSubmit={onSignin}>
                                <Stack spacing={3}>
                                    <TextField name="emp_no" label="Employee Number" fullWidth />
                                    <TextField name="password" label="Password" type="password" fullWidth />
                                    <Button type="submit" size="large" variant="contained" color="success">
                                        Sign In
                                    </Button>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox />} label="Remember me" />
                                        </FormGroup>
                                        <Typography color="error" fontWeight="bold">
                                            <Link to="#">
                                                Forgot password?
                                            </Link>
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Animate>
                    </Box>

                    {onRequest && (
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                height: '100%',
                                width: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bgcolor: colors.common.white,
                                zIndex: 1000
                            }}
                        >
                            <Box position="relative">
                                <CircularProgress
                                    variant="determinate"
                                    sx={{ color: colors.grey[200] }}
                                    size={100}
                                    value={100}
                                />
                                <CircularProgress
                                    variant="determinate"
                                    value={loginProgress}
                                    size={100}
                                    sx={{
                                        '& .MuiCircularProgress-circle': {
                                            strokeLinecap: 'round'
                                        },
                                        position: 'absolute',
                                        left: 0,
                                        color: colors.green[600]
                                    }}
                                />
                            </Box>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
  )
}

export default LoginPage