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
} from '@mui/material';

function Expense() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [open, setOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: '',
    category: '',
    sub_category: '',
    amount: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/expenses');
        setData(response.data);
        setFilteredData(response.data); // Initialize filteredData with all data
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    getData();
  }, []);

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
      setFilteredData([...data, response.data]); // Update filteredData with new data
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
      setFilteredData([...data, ...response.data]); // Update filteredData with new data
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSearch = () => {
    const searchTermLowerCase = searchTerm ? searchTerm.toLowerCase() : '';
    const filtered = data.filter(item =>
      (item.category && item.category.toLowerCase().includes(searchTermLowerCase)) ||
      (item.sub_category && item.sub_category.toLowerCase().includes(searchTermLowerCase))
    );
    setFilteredData(filtered);
  };

  // Get unique categories from filteredData
  const categories = [...new Set(filteredData.map(item => item.category))];

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
        <TextField
          label="Search by Category or Sub-Category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          style={{ width: 300 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginLeft: 8 }}>
          Search
        </Button>
      </Box>
      {categories.map((category) => (
        <Box key={category} mb={4}>
          <Typography variant="h6">{category}</Typography>
          <TableContainer component={Paper}>
            <Table aria-label={`${category} expenses table`}>
              <TableHead>
                <TableRow>
                  <TableCell>Sub-Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.filter(item => item.category === category).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.sub_category || '-'}</TableCell>
                    <TableCell>{row.amount || '-'}</TableCell>
                    <TableCell align="">{new Date(row.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
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
            name="sub_category"
            label="Sub-Category"
            value={newExpense.sub_category}
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
