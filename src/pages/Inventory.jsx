import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, TextField, Button, MenuItem, Select,
  DialogTitle, Dialog, DialogContent, DialogActions
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Inventory = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockAlert, setSelectedStockAlert] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleStockAlertChange = (event) => {
    setSelectedStockAlert(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filteredData = data.filter((item) => {
    const isInSelectedCategory = selectedCategory === 'All' || item.group === selectedCategory;
    const isInSelectedStockAlert =
      selectedStockAlert === 'All' ||
      (selectedStockAlert === 'Low Stock' && item.quantity < 20) ||
      (selectedStockAlert === 'Out Of Stock' && item.quantity === 0);
    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDateRange = true;
    if (startDate && endDate) {
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchesDateRange = itemDate >= start && itemDate <= end;
    }

    return isInSelectedCategory && isInSelectedStockAlert && matchesSearchTerm && matchesDateRange;
  });

  const role = localStorage.getItem('role');

  const handleClickOpen = () => {
    setOpen(true);
  };

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
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setFile(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: name === 'quantity' || name === 'unit_price' || name === 'spoilt' ? Number(value) : value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

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
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setNewItem(item);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/items/${id}`);
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/items');
      setData(response.data);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

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
          <MenuItem value="Produce">Produce</MenuItem>
          <MenuItem value="Dairy">Dairy</MenuItem>
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
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        {(role === 'admin' || role === 'procurement') && (
          <>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>+ Add Product</Button>
            <Button variant="contained" color="secondary" onClick={handleUploadDialogOpen}>Upload File</Button>
          </>
        )}
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
              <TableCell>Unit of Measurement</TableCell>
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
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.spoilt}</TableCell>
                <TableCell>{row.unit_price}</TableCell>
                <TableCell>{(row.quantity - row.spoilt) * row.unit_price}</TableCell>
                {role === 'procurement' && (
                  <TableCell>
                    <Button onClick={() => handleEdit(row)}>
                      <Edit />
                    </Button>
                    <Button onClick={() => handleDelete(row._id)}>
                      <Delete />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Unit Of Measurement"
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Unit Price"
            name="unit_price"
            value={newItem.unit_price}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
          <TextField
            margin="dense"
            label="Group"
            name="group"
            value={newItem.group}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Quantity"
            name="quantity"
            value={newItem.quantity}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
          <TextField
            margin="dense"
            label="Spoilt"
            name="spoilt"
            value={newItem.spoilt}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
          <TextField
            margin="dense"
            label="Date"
            name="date"
            value={newItem.date}
            onChange={handleInputChange}
            fullWidth
            type="date"
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
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
