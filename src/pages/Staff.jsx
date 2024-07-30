import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  Backdrop,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Staff() {
  const [staffData, setStaffData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [currentStaff, setCurrentStaff] = useState({
    fname: '',
    lname: '',
    email: '',
    role: '',
    password: '',
    emp_no: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/staff');
        setStaffData(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = (type, staff = null) => {
    setDialogType(type);
    setCurrentStaff(staff || {
      fname: '',
      lname: '',
      email: '',
      role: '',
      password: '',
      emp_no: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStaff({
      fname: '',
      lname: '',
      email: '',
      role: '',
      password: '',
      emp_no: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStaff({ ...currentStaff, [name]: value });
  };

  const handleAddStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/staff', currentStaff);
      setStaffData([...staffData, response.data]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`https://hotel-backend-1-trhj.onrender.com/staff/${currentStaff._id}`, currentStaff);
      setStaffData(staffData.map(staff => staff._id === response.data._id ? response.data : staff));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/staff/${id}`);
      setStaffData(staffData.filter(staff => staff._id !== id));
    } catch (error) {
      console.error('Error deleting staff:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Staff Management
      </Typography>
      <Button color="primary" variant="contained" onClick={() => handleOpenDialog('add')}>
        Add Staff
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffData.map((staff) => (
              <TableRow key={staff._id}>
                <TableCell>{staff.fname}</TableCell>
                <TableCell>{staff.lname}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog('edit', staff)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteStaff(staff._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dialogType === 'add' ? 'Add New Staff' : 'Edit Staff'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="fname"
                value={currentStaff.fname}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lname"
                value={currentStaff.lname}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={currentStaff.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Role"
                name="role"
                value={currentStaff.role}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={currentStaff.password}
                onChange={handleInputChange}
                fullWidth
                required={dialogType === 'add'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Employee Number"
                name="emp_no"
                value={currentStaff.emp_no}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={dialogType === 'add' ? handleAddStaff : handleUpdateStaff}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : dialogType === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Staff;
