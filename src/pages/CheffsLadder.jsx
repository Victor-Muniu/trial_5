import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, TextField, Button, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function CheffsLadder() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockAlert, setSelectedStockAlert] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newStock, setNewStock] = useState({
    unit: '',
    name: '',
    date: new Date().toISOString().split('T')[0],
    opening_stock: '',
    issued: '',
    RT: '',
    sold: '',
    shift: '',
    remarks: ''
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-zrv3.onrender.com/cheffsLadder');
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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`https://hotel-backend-1-trhj.onrender.com/cheffsLadder/${editId}`, newStock);
      } else {
        await axios.post('https://hotel-backend-1-trhj.onrender.com/cheffsLadder', newStock);
      }
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/cheffsLadder');
      setData(response.data);
      handleClose();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleEdit = (row) => {
    setEditId(row._id);
    setIsEditMode(true);
    setNewStock(row);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/cheffsLadder/${id}`);
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/cheffsLadder');
      setData(response.data);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const filteredData = data.filter((item) => {
    return (
      (selectedCategory === 'All' || item.group === selectedCategory) &&
      (selectedDate === '' || new Date(item.date).toISOString().split('T')[0] === selectedDate) &&
      (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const role = localStorage.getItem('role');

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">Cheffs Ladder ({filteredData.length})</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search for inventory..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <TextField
          label="Select Date"
          type="date"
          variant="outlined"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
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
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>O.S</TableCell>
              <TableCell>Issue</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>R.T</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>C.S</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row._id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.opening_stock}</TableCell>
                <TableCell>{row.issue}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>{row.RT}</TableCell>
                <TableCell>{row.sold}</TableCell>
                <TableCell>{row.closing_stock}</TableCell>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell>{row.remarks}</TableCell>
                <TableCell>{row.shift}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(row)}>
                    <Edit style={{ cursor: 'pointer', marginRight: 10 }} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row._id)}>
                    <Delete style={{ cursor: 'pointer' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{isEditMode ? "Edit Stock" : "Add New Stock"}</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus
            margin='dense'
            name='unit'
            label='Unit'
            type='text'
            fullWidth
            value={newStock.unit}
            onChange={handleInputChange}
          />
          <TextField 
            margin='dense'
            name='name'
            label='Name'
            type='text'
            fullWidth
            value={newStock.name}
            onChange={handleInputChange}
          />
          <TextField 
            margin='dense'
            name='opening_stock'
            label='Opening Stock'
            type='number'
            fullWidth
            value={newStock.opening_stock}
            onChange={handleInputChange}
          />
          <TextField 
            margin='dense'
            name='issued'
            label='Issued'
            type='number'
            fullWidth
            value={newStock.issued}
            onChange={handleInputChange}
          />
          <TextField 
            margin='dense'
            name='RT'
            label='RT'
            type='number'
            fullWidth
            value={newStock.RT}
            onChange={handleInputChange}
          />
          <TextField 
            margin='dense'
            name='sold'
            label='Sold'
            type='number'
            fullWidth
            value={newStock.sold}
            onChange={handleInputChange}
          />
          <TextField 
            margin='dense'
            name='shift'
            label='Shift'
            type='text'
            fullWidth
            value={newStock.shift}
            onChange={handleInputChange}
          />
          <TextField 
            margin='dense'
            name='remarks'
            label='Remarks'
            type='text'
            fullWidth
            value={newStock.remarks}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditMode ? "Save Changes" : "Add Product"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CheffsLadder;
