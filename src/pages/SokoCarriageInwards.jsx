import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import dayjs from 'dayjs';

const SokoCarriageInwards = () => {
  const [openModal, setOpenModal] = useState(false);
  const [carrageInwards, setCarrageInwards] = useState([]);
  const [filteredCarrageInwards, setFilteredCarrageInwards] = useState([]);
  const [expenseFormData, setExpenseFormData] = useState({
    name: '',
    date: '',
    amount: ''
  });
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchCarrageInwards();
  }, []);

  useEffect(() => {
    filterCarrageInwardsByDate();
  }, [filterDate, carrageInwards]);

  const fetchCarrageInwards = async () => {
    try {
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/carrage-inwards');
      setCarrageInwards(response.data);
      setFilteredCarrageInwards(response.data); // Initialize filtered data with all data
    } catch (error) {
      console.error('Error fetching carrage inwards:', error);
    }
  };

  const filterCarrageInwardsByDate = () => {
    if (!filterDate) {
      setFilteredCarrageInwards(carrageInwards); // Show all data when filter is empty
      return;
    }

    const filteredData = carrageInwards.filter(item => {
      const itemDate = dayjs(item.date, 'YYYY-MM-DD');
      const filterDay = dayjs(filterDate, 'YYYY-MM-DD');
      return itemDate.isSame(filterDay, 'day');
    });

    setFilteredCarrageInwards(filteredData);
  };

  const handleAddExpenseClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseFormData({
      ...expenseFormData,
      [name]: value
    });
  };

  const handleAddExpense = async () => {
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/carrage-inwards', {
        name: expenseFormData.name,
        date: expenseFormData.date,
        amount: expenseFormData.amount
      });
      console.log('Expense added:', response.data);
      setOpenModal(false);
      fetchCarrageInwards(); // Refresh the data after adding expense
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDateInputChange = (e) => {
    setFilterDate(e.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="contained" onClick={handleAddExpenseClick} startIcon={<AddCircleIcon />}>
        Add Expense
      </Button>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={expenseFormData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            value={expenseFormData.date}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={expenseFormData.amount}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddExpense} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Carrage Inwards</Typography>

            <TextField
              margin="dense"
              name="filterDate"
              label="Filter by Date (YYYY-MM-DD)"
              type="text"
              fullWidth
              value={filterDate}
              onChange={handleDateInputChange}
            />

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCarrageInwards.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SokoCarriageInwards;
