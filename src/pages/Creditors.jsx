import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, CircularProgress, Card, CardContent, Modal
} from '@mui/material';
import dayjs from 'dayjs';

const Creditors = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [newData, setNewData] = useState({
    vendor: '',
    amount: '',
    date: ''
  });

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
        await axios.patch(`https://hotel-backend-1-trhj.onrender.com/creditors/${currentId}`, newData);
        setData(data.map((item) => (item._id === currentId ? { ...item, ...newData } : item)));
      } else {
        const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/creditors', newData);
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

  const groupByVendorAndMonth = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const vendor = curr.vendor;
      const month = dayjs(curr.date).format('YYYY-MM');
      const key = `${vendor}-${month}`;

      if (!acc[key]) {
        acc[key] = {
          vendor: vendor,
          amount: 0,
          month: month,
        };
      }

      acc[key].amount += curr.amount;
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const groupedData = groupByVendorAndMonth(data);

  const isAdminOrAccounting = localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'accounting';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Creditors</Typography>

      {isAdminOrAccounting && (
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Add New Entry
        </Button>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="rgba(0, 0, 0, 0.5)">
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {editing ? 'Edit Creditor' : 'Add New Creditor'}
              </Typography>
              <form onSubmit={handleSubmit}>
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
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Modal>

      <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
        <Table aria-label="creditors table">
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.vendor}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.month}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(row)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Creditors;