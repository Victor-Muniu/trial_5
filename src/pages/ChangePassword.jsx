import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';

function ChangePassword() {
  const [empNo, setEmpNo] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/change-password', {
        emp_no: empNo,
        currentPassword,
        newPassword
      });

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
      <TextField
        label="Employee Number"
        variant="outlined"
        fullWidth
        margin="normal"
        value={empNo}
        onChange={(e) => setEmpNo(e.target.value)}
        required
      />
      <TextField
        label="Current Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <TextField
        label="New Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Change Password
      </Button>
      {message && <Typography color="green" sx={{ mt: 2 }}>{message}</Typography>}
      {error && <Typography color="red" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
}

export default ChangePassword;
