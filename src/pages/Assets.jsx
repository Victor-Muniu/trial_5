import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem
} from '@mui/material';

function Assets() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    group: '',
    category: '',
    quantity: 0,
    issued: 0,
    stored: 0,
    spoilt: 0,
    price: 0,
    amount: 0,
    value: 0,
  });
  const [editId, setEditId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/assets');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.patch(`https://hotel-backend-1-trhj.onrender.com/assets/${editId}`, form);
      } else {
        await axios.post('https://hotel-backend-1-trhj.onrender.com/assets', form);
      }
      setForm({
        name: '',
        group: '',
        category: '',
        quantity: 0,
        issued: 0,
        stored: 0,
        spoilt: 0,
        price: 0,
        amount: 0,
        value: 0,
      });
      setEditId(null);
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/assets');
      setData(response.data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/assets/${id}`);
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/assets');
      setData(response.data);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setForm({
      name: '',
      group: '',
      category: '',
      quantity: 0,
      issued: 0,
      stored: 0,
      spoilt: 0,
      price: 0,
      amount: 0,
      value: 0,
    });
    setEditId(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3} style={{ position: 'relative' }}>
      <Typography variant="h4" gutterBottom>Assets</Typography>

      <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginBottom: '1rem' }}>
        Add Asset
      </Button>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editId ? 'Edit' : 'Add'} Asset</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Group" name="group" value={form.group} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Issued" name="issued" type="number" value={form.issued} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Stored" name="stored" type="number" value={form.stored} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Spoilt" name="spoilt" type="number" value={form.spoilt} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Price" name="price" type="number" value={form.price} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Value" name="value" type="number" value={form.value} onChange={handleChange} fullWidth margin="normal" />
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editId ? 'Update' : 'Add'} Asset
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <TableContainer component={Paper}>
        <Table aria-label="assets table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Issued</TableCell>
              <TableCell>Stored</TableCell>
              <TableCell>Spoilt</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.issued}</TableCell>
                <TableCell>{row.stored}</TableCell>
                <TableCell>{row.spoilt}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(row)}>Edit</Button>
                  <Button onClick={() => handleDelete(row._id)} color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Assets;
