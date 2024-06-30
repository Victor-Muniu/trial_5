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
  Box,
  Button,
  TextField,
  Modal,
  Input
} from '@mui/material';

function BankStatement() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    particulars: '',
    moneyOut: '',
    moneyIn: '',
    balance: ''
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/transactions');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    filterData();
  }, [startDate, endDate, data]);

  const filterData = () => {
    const filtered = data.filter((transaction) => {
      const [day, month, year] = transaction.date.split('-');
      const transactionDate = new Date(year, month - 1, day);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
    setFilteredData(filtered);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/transactions', newTransaction);
      setData([...data, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error posting transaction:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setData([...data, ...response.data]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" margin={5}>Bank Statement</Typography>
        <Box>
          <Button variant="contained" color="primary" style={{ marginRight: 8 }} onClick={handleOpen}>Add Transaction</Button>
          <Button variant="contained" color="primary" component="label" style={{ marginRight: 8 }}>
            Upload Excel
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          <Button variant="contained" color="primary">Print</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Typography variant="h6" gutterBottom margin={5}>
          Bank Statement
        </Typography>
        <Box display="flex" alignItems="center" mb={3} ml={5}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: 8 }}
          />
          <Typography style={{ marginRight: 8 }}>to</Typography>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Table aria-label="bank statement table" margin={5}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell align="right">Money Out</TableCell>
              <TableCell align="right">Money In</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.particulars}</TableCell>
                <TableCell align="right">{row.moneyOut ? row.moneyOut.toLocaleString() : '-'}</TableCell>
                <TableCell align="right">{row.moneyIn ? row.moneyIn.toLocaleString() : '-'}</TableCell>
                <TableCell align="right">{row.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit} style={{ padding: '20px', margin: '100px auto', maxWidth: '500px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h6" marginBottom={3}>Add New Transaction</Typography>
          <TextField
            name="date"
            label="Date"
            type="date"
            value={newTransaction.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            name="particulars"
            label="Particulars"
            value={newTransaction.particulars}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="moneyOut"
            label="Money Out"
            type="number"
            value={newTransaction.moneyOut}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="moneyIn"
            label="Money In"
            type="number"
            value={newTransaction.moneyIn}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="balance"
            label="Balance"
            type="number"
            value={newTransaction.balance}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default BankStatement;
