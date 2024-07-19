import React, { useState, useEffect, useRef } from 'react';
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
  Backdrop,
  Box
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';

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
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [currentPayroll, setCurrentPayroll] = useState(null);

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
      setPayrolls([...payrolls, response.data]);
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

  const handleOpenReceiptDialog = async (payrollId) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://hotel-backend-1-trhj.onrender.com/payrolls/${payrollId}`);
      setCurrentPayroll(response.data);
      setOpenReceiptDialog(true);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseReceiptDialog = () => {
    setOpenReceiptDialog(false);
    setCurrentPayroll(null);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString(undefined, options);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () =>  componentRef.current,
  });

  return (
    <div className="payroll-root">
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
              <TableCell>Action</TableCell>
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
                <TableCell>
                  <Button
                    sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}
                    color="primary"
                    onClick={() => handleOpenReceiptDialog(payroll._id)}
                  >
                    Pay Slip
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openReceiptDialog} onClose={handleCloseReceiptDialog} fullWidth maxWidth="sm">
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : currentPayroll ? (
            <Box ref={componentRef} style={{width:'100%', height:window.innerHeight}}>
              
              <Typography variant="h5" align="center" gutterBottom ref={componentRef}>
                PAYSLIP
              </Typography>
              <Typography variant="h5" align="center" gutterBottom>
                EPASHIKINO RESORT & SPA LTD
              </Typography>
              <Typography>Employee Name: {currentPayroll.fname} {currentPayroll.lname}</Typography>
              <Typography>Employee No: {currentPayroll.emp_no}</Typography>
              <Typography>Date: Date: {new Date(currentPayroll.date).toLocaleDateString()}</Typography>
              <hr />
              <Box display="flex" justifyContent="space-between">
                <Typography>Gross Income:</Typography>
                <Typography>KES {currentPayroll.gross_income}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>NHIF Deductions:</Typography>
                <Typography>KES {currentPayroll.nhif_deductions}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>NSSF Deductions:</Typography>
                <Typography>KES {currentPayroll.nssf_deductions}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>PAYE:</Typography>
                <Typography>KES {currentPayroll.paye}</Typography>
              </Box>
              <hr />
              <Box display="flex" justifyContent="space-between">
                <Typography>Net Income:</Typography>
                <Typography>KES {currentPayroll.net_income}</Typography>
              </Box>
              <hr />
              
            </Box>
          ) : (
            'No payroll data available.'
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint} color="primary">
            Print
          </Button>
          <Button onClick={handleCloseReceiptDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Payroll;
