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
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Backdrop
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [newPayroll, setNewPayroll] = useState({
    date: '',
    gross_income: 0,
    nhif_deductions: 0,
    nssf_deductions: 0,
    paye: 0,
    emp_no: ''
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/payrolls');
        setPayrolls(response.data);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      }
    };

    fetchPayrolls();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayroll({ ...newPayroll, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/payrolls', newPayroll);
      console.log('New payroll added:', response.data);
      // Update local state with the new payroll data
      setPayrolls([...payrolls, response.data]);
      // Reset form fields
      setNewPayroll({
        date: '',
        gross_income: 0,
        nhif_deductions: 0,
        nssf_deductions: 0,
        paye: 0,
        emp_no: ''
      });
      setOpenAddDialog(false);
    } catch (error) {
      console.error('Error adding new payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Payroll
      </Typography>

      <Button sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }} color="primary" onClick={handleOpenAddDialog}>
        Add Payroll
      </Button>

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add New Payroll</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                name="date"
                value={newPayroll.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Gross Income"
                type="number"
                name="gross_income"
                value={newPayroll.gross_income}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="NHIF Deductions"
                type="number"
                name="nhif_deductions"
                value={newPayroll.nhif_deductions}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="NSSF Deductions"
                type="number"
                name="nssf_deductions"
                value={newPayroll.nssf_deductions}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="PAYE"
                type="number"
                name="paye"
                value={newPayroll.paye}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Employee Number"
                type="text"
                name="emp_no"
                value={newPayroll.emp_no}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Gross Income</TableCell>
              <TableCell>NHIF Deductions</TableCell>
              <TableCell>NSSF Deductions</TableCell>
              <TableCell>PAYE</TableCell>
              <TableCell>Net Income</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll._id}>
                <TableCell>{new Date(payroll.date).toLocaleDateString()}</TableCell>
                <TableCell>{payroll.gross_income}</TableCell>
                <TableCell>{payroll.nhif_deductions}</TableCell>
                <TableCell>{payroll.nssf_deductions}</TableCell>
                <TableCell>{payroll.paye}</TableCell>
                <TableCell>{payroll.net_income}</TableCell>
                <TableCell>{payroll.fname}</TableCell>
                <TableCell>{payroll.lname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff', opacity: 0.5 }} open={openAddDialog} />

    </div>
  );
}

export default Payroll;
