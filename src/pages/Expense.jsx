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
  MenuItem,
  Modal,
} from '@mui/material';

function Expense() {
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [open, setOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: '',
    category: '',
    amount: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/expenses');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  // Function to group expenses by category and month-year and aggregate amounts
  const groupedData = data.reduce((acc, item) => {
    const date = new Date(item.date);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
    
    if (!acc[item.category]) {
      acc[item.category] = {};
    }

    if (!acc[item.category][monthYear]) {
      acc[item.category][monthYear] = {
        totalAmount: parseFloat(item.amount),
        data: [item]
      };
    } else {
      acc[item.category][monthYear].totalAmount += parseFloat(item.amount);
      // Check if the expense is already included in data array for this monthYear
      const existingIndex = acc[item.category][monthYear].data.findIndex(e => e._id === item._id);
      if (existingIndex === -1) {
        acc[item.category][monthYear].data.push(item);
      }
    }

    return acc;
  }, {});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/expenses', newExpense);
      setData([...data, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error posting expense:', error);
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
        <Typography variant="h4">Expense Report</Typography>
        <Box>
          <Button variant="contained" color="primary" style={{ marginRight: 8 }} onClick={handleOpen}>Add Expense</Button>
          <Button variant="contained" color="primary" component="label" style={{ marginRight: 8 }}>
            Upload Excel
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          <Button variant="contained" color="primary">Print Report</Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <TextField
            label="Date Range"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: 8 }}
          />
          <Typography style={{ marginRight: 8 }}>to</Typography>
          <TextField
            label="Date Range"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Typography variant="h6" gutterBottom margin={5}>
          Expenses by Category and Month-Year
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom margin={5}>
          Between {new Date(startDate).toLocaleDateString()} and {new Date(endDate).toLocaleDateString()}
        </Typography>

        {Object.keys(groupedData).map((category) => (
          <React.Fragment key={category}>
            <Typography variant="h6" gutterBottom margin={5}>
              {category}
            </Typography>
            {Object.keys(groupedData[category]).map((monthYear) => {
              const { totalAmount, data } = groupedData[category][monthYear];
              return (
                <React.Fragment key={monthYear}>
                  <Typography variant="subtitle1" gutterBottom margin={5}>
                    {`${monthYear} - Total Amount: ${totalAmount.toFixed(2)}`}
                  </Typography>
                  <Table aria-label="expense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row) => (
                        <TableRow key={row._id}>
                          <TableCell>{row.category || '-'}</TableCell>
                          <TableCell>{row.amount || '-'}</TableCell>
                          <TableCell align="">{new Date(row.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit} style={{ padding: '20px', margin: '100px auto', maxWidth: '500px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h6" marginBottom={3}>Add New Expense</Typography>
          <TextField
            name="date"
            label="Date"
            type="date"
            value={newExpense.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          <TextField
            name="category"
            label="Category"
            value={newExpense.category}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="amount"
            label="Amount"
            type="number"
            value={newExpense.amount}
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

export default Expense;
