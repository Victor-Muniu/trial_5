import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, TextField, Button, MenuItem, Select,
  DialogTitle,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';

const Inventory = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockAlert, setSelectedStockAlert] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    unit_price: '',
    group: '',
    quantity: '',
    spoilt: '',
    date: '',
  });
  const [file, setFile] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/items');
        const data = response.data;
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);
  console.log(data)

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleStockAlertChange = (event) => {
    setSelectedStockAlert(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((item) => {
    return (
      (selectedCategory === 'All' || item.group === selectedCategory) &&
      (selectedStockAlert === 'All' ||
        (selectedStockAlert === 'Low Stock' && item.quantity < 20) ||
        (selectedStockAlert === 'Out Of Stock' && item.quantity === 0)) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const role = localStorage.getItem('role');

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setNewItem({
      name: '',
      description: '',
      unit_price: '',
      group: '',
      quantity: '',
      spoilt: '',
      date: '',
    });
    setFile(null);
  }

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setFile(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const handleSubmit = async () => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post('https://hotel-backend-1-trhj.onrender.com/upload-items', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        handleUploadDialogClose();
      } else if (isEditMode) {
        await axios.patch(`https://hotel-backend-1-trhj.onrender.com/items/${currentItem._id}`, newItem);
      } else {
        await axios.post('https://hotel-backend-1-trhj.onrender.com/items', newItem);
      }
      setOpen(false);
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/items');
      setData(response.data);
      handleClose();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  }

  const handleEdit = (item) => {
    setCurrentItem(item);
    setNewItem(item);
    setIsEditMode(true);
    setOpen(true);
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/items/${id}`);
      
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/items');
      setData(response.data);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
      
    }
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">Inventory ({data.length})</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search for inventory..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Category' }}
        >
          <MenuItem value="All">All Categories</MenuItem>
          <MenuItem value="Butchery">Butchery</MenuItem>
        </Select>
        <Select
          value={selectedStockAlert}
          onChange={handleStockAlertChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Stock Alert' }}
        >
          <MenuItem value="All">All Stock Alerts</MenuItem>
          <MenuItem value="Low Stock">Low Stock</MenuItem>
          <MenuItem value="Out Of Stock">Out Of Stock</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>+ Add Product</Button>
        <Button variant="contained" color="secondary" onClick={handleUploadDialogOpen}>Upload File</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Product name</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Spoilt</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Value</TableCell>
              {role === 'procurement' && (
                <TableCell>Action</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row._id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.spoilt}</TableCell>
                <TableCell>{row.unit_price}</TableCell>
                <TableCell>{row.value}</TableCell>
                {role === 'procurement' && (
                  <TableCell>
                    <Edit style={{ cursor: 'pointer', marginRight: 10 }} onClick={() => handleEdit(row)} />
                    <Delete style={{ cursor: 'pointer' }} onClick={() => handleDelete(row._id)} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Item' : 'Create Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            name='name'
            label='Name'
            type='text'
            fullWidth
            value={newItem.name}
            onChange={handleInputChange} />
          <TextField
            autoFocus
            margin='dense'
            name='description'
            label='Description'
            type='text'
            fullWidth
            value={newItem.description}
            onChange={handleInputChange} />
          <TextField
            autoFocus
            margin='dense'
            name='unit_price'
            label='Unit Price'
            type='number'
            fullWidth
            value={newItem.unit_price}
            onChange={handleInputChange} />
          <TextField
            autoFocus
            margin='dense'
            name='group'
            label='Group'
            type='text'
            fullWidth
            value={newItem.group}
            onChange={handleInputChange} />
          <TextField
            autoFocus
            margin='dense'
            name='quantity'
            label='Quantity'
            type='number'
            fullWidth
            value={newItem.quantity}
            onChange={handleInputChange} />
          <TextField
            autoFocus
            margin='dense'
            name='spoilt'
            label='Spoilt'
            type='number'
            fullWidth
            value={newItem.spoilt}
            onChange={handleInputChange} />
          <TextField
            autoFocus
            margin='dense'
            name='date'
            label='Date'
            type='date'
            fullWidth
            value={newItem.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditMode ? 'Update' : 'Submit'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose} fullWidth>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <input
            type='file'
            onChange={handleFileChange}
            style={{ marginTop: 20 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inventory;
