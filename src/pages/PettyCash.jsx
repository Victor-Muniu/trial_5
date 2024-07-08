import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, CircularProgress, Card, CardContent, Modal
} from '@mui/material';

function PettyCash() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [newData, setNewData] = useState({
    name: '',
    amount: '',
    date: ''
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/petty_cash');
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
      name: '',
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
        await axios.put(`https://hotel-backend-1-trhj.onrender.com/petty_cash/${currentId}`, newData);
        setData(data.map((item) => (item._id === currentId ? { ...item, ...newData } : item)));
      } else {
        const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/petty_cash', newData);
        setData([...data, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleEdit = (item) => {
    setNewData({
      name: item.name,
      amount: item.amount,
      date: new Date(item.date).toISOString().slice(0, 10)
    });
    setCurrentId(item._id);
    setEditing(true);
    setOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Petty Cash</Typography>

      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Add New Entry
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="rgba(0, 0, 0, 0.5)">
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {editing ? 'Edit Petty Cash' : 'Add New Petty Cash'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  name="name"
                  value={newData.name}
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
        <Table aria-label="petty cash table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
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
}

export default PettyCash;
