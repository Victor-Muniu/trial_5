import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

function LaundryService() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({ name: '', price: '', _id: '' });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/laundry-services');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setCurrentItem({ name: '', price: '', _id: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.patch(`https://hotel-backend-1-trhj.onrender.com/laundry-services/${currentItem._id}`, currentItem);
      } else {
        await axios.post('https://hotel-backend-1-trhj.onrender.com/laundry-services', currentItem);
      }
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/laundry-services');
      setData(response.data);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    } finally {
      handleClose();
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    handleOpen();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/laundry-services/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
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
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Laundry Service</Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>Add Item</Button>
      <TableContainer component={Paper}>
        <Table aria-label="laundry service table">
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item._id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Item Name"
            type="text"
            fullWidth
            value={currentItem.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={currentItem.price}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{isEditing ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LaundryService;
