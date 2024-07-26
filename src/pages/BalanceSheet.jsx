import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';

function BalanceSheet() {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [open, setOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    name: '',
    category: '',
    amount: '',
    date: '',
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/balancesheet');
        const data = response.data;
        const years = [...new Set(data.map(item => new Date(item.date).getFullYear()))].sort((a, b) => b - a);

        const latestYears = years.slice(0, 5);

        setYears(latestYears);
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://hotel-backend-1-trhj.onrender.com/balancesheet', newRecord);
      setOpen(false);
      setNewRecord({
        name: '',
        category: '',
        amount: '',
        date: '',
      });
      
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/balancesheet');
      setData(response.data);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const groupedData = data.reduce((acc, item) => {
    const { category, name, amount, date } = item;
    const year = new Date(date).getFullYear();

    if (!acc[category]) {
      acc[category] = {};
    }
    if (!acc[category][name]) {
      acc[category][name] = {};
    }
    acc[category][name][year] = amount;
    return acc;
  }, {});

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" align="center" gutterBottom>
        EPASHIKINO RESORT & SPA
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Balance Sheet
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add New Record
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Balance Sheet Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new balance sheet record, please enter the details here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newRecord.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            value={newRecord.category}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            value={newRecord.amount}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={newRecord.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {years.map(year => (
              <TableCell align="right" key={year}>{year}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groupedData).map(([category, items]) => (
            <React.Fragment key={category}>
              <TableRow>
                <TableCell colSpan={years.length + 1}>
                  <Typography variant="subtitle1" gutterBottom>
                    {category}
                  </Typography>
                  <Divider />
                </TableCell>
              </TableRow>
              {Object.entries(items).map(([name, amounts]) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  {years.map(year => (
                    <TableCell align="right" key={year}>{amounts[year] || 0}</TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={years.length + 1}>
                  <Divider />
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BalanceSheet;
