import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, CircularProgress, Card, CardContent, Modal, Checkbox, Grid
} from '@mui/material';
import dayjs from 'dayjs';

const Creditors = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [newData, setNewData] = useState({
    vendor: '',
    amount: '',
    date: ''
  });
  const [paymentVoucher, setPaymentVoucher] = useState({
    creditors: [],
    amount: '',
    emp_no: ''
  });
  const [sideCardOpen, setSideCardOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/creditors');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditing(false);
    setCurrentId(null);
    setNewData({
      vendor: '',
      amount: '',
      date: ''
    });
  };

  const handleChange = (e) => {
    setNewData({
      ...newData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.patch(`https://hotel-backend-1-trhj.onrender.com/creditors/${currentId}`, {
          vendor: newData.vendor,
          amount: parseFloat(newData.amount),
          date: new Date(newData.date)
        });
        setData(data.map((item) => (item._id === currentId ? { ...item, ...newData, amount: parseFloat(newData.amount) } : item)));
      } else {
        const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/creditors', {
          vendor: newData.vendor,
          amount: parseFloat(newData.amount),
          date: new Date(newData.date)
        });
        setData([...data, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleEdit = (item) => {
    let date = '';
    if (item.date) {
      const parsedDate = new Date(item.date);
      if (!isNaN(parsedDate)) {
        date = parsedDate.toISOString().slice(0, 10);
      }
    }

    setNewData({
      vendor: item.vendor,
      amount: item.amount,
      date: date
    });
    setCurrentId(item._id);
    setEditing(true);
    setOpen(true);
  };

  const handleVendorClick = (vendor) => {
    setCurrentVendor(vendor);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentVendor(null);
  };

  const groupByVendor = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const vendor = curr.vendor;
      if (!acc[vendor]) {
        acc[vendor] = {
          vendor: vendor,
          totalAmount: 0,
          details: []
        };
      }
      acc[vendor].totalAmount += curr.amount;
      acc[vendor].details.push(curr);
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const groupedData = groupByVendor(data);

  const isAdminOrAccounting = localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'accounting';

  const handleAddCreditor = (creditor) => {
    if (creditor && creditor._id && creditor.amount) {
      setPaymentVoucher((prev) => {
        const newCreditors = [...prev.creditors];
        if (!newCreditors.includes(creditor._id)) {
          newCreditors.push(creditor._id);
        }
        return {
          ...prev,
          creditors: newCreditors,
          amount: (parseFloat(prev.amount) || 0) + parseFloat(creditor.amount)
        };
      });
    } else {
      console.error('Creditor object is missing properties:', creditor);
    }
  };

  const handleRemoveCreditor = (creditor) => {
    setPaymentVoucher((prev) => {
      const newCreditors = prev.creditors.filter(id => id !== creditor._id);
      return {
        ...prev,
        creditors: newCreditors,
        amount: (parseFloat(prev.amount) || 0) - parseFloat(creditor.amount)
      };
    });
  };

  const handleSideCardSubmit = async (e) => {
    e.preventDefault();
    console.log('Payment Voucher:', paymentVoucher);
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/payment-vouchers', {
        creditorsId: paymentVoucher.creditors,
        amount: parseFloat(paymentVoucher.amount),
        emp_no: paymentVoucher.emp_no
      });
      console.log('Payment Voucher Created:', response.data);
      setSideCardOpen(false);
      setPaymentVoucher({ creditors: [], amount: '', emp_no: '' });
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleCheckboxChange = (detail) => {
    const creditorExists = paymentVoucher.creditors.includes(detail._id);
    if (creditorExists) {
      handleRemoveCreditor(detail);
    } else {
      handleAddCreditor(detail);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3} style={{ backgroundColor: '#f4f6f8' }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: '1rem' }}>Creditors</Typography>

      {isAdminOrAccounting && (
        <Button variant="contained" color="secondary" onClick={handleOpen} style={{ marginBottom: '1rem' }}>
          Add New Entry
        </Button>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="rgba(0, 0, 0, 0.5)">
          <Card style={{ width: '400px' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {editing ? 'Edit Creditor' : 'Add New Creditor'}
              </Typography>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  label="Vendor"
                  name="vendor"
                  value={newData.vendor}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Amount"
                  name="amount"
                  value={newData.amount}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  type="number"
                />
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  value={newData.date}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Modal>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Table aria-label="creditors table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Vendor</TableCell>
                  <TableCell align="right" style={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedData.map((row, index) => (
                  <TableRow key={index} onClick={() => handleVendorClick(row)} style={{ cursor: 'pointer' }}>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell align="right">{row.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Payment Voucher</Typography>
              <form onSubmit={handleSideCardSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  label="Employee No"
                  name="emp_no"
                  value={paymentVoucher.emp_no}
                  onChange={(e) => setPaymentVoucher({ ...paymentVoucher, emp_no: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Total Amount"
                  name="amount"
                  value={paymentVoucher.amount}
                  fullWidth
                  margin="normal"
                  type="number"
                  InputProps={{
                    readOnly: true
                  }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="rgba(0, 0, 0, 0.5)">
          <Card style={{ width: '90%', maxWidth: '800px' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>{currentVendor?.vendor}</Typography>
              <TableContainer component={Paper}>
                <Table aria-label="vendor details table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendor</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Select</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentVendor?.details.map((detail, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{detail.vendor}</TableCell>
                        <TableCell align="right">{detail.amount.toFixed(2)}</TableCell>
                        <TableCell>{dayjs(detail.date).format('YYYY-MM-DD')}</TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={paymentVoucher.creditors.includes(detail._id)}
                            onChange={() => handleCheckboxChange(detail)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
};

export default Creditors;
