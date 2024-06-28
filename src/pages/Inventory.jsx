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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-zrv3.onrender.com/items');
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
  const role = localStorage.getItem('role')

  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description:'',
    unit_price: '',
    group: '',
    quantity: '',
    spoilt: '',
    date: '',
  })

  const handleClickOpen = () =>{
    setOpen(true);
  }

  const handleClose = () =>{
    setOpen(false)
  }

  const handleInputChange = (event) =>{
    const {name, value} = event.target;
    setNewItem({...newItem, [name]: value})
  }
  const handleSubmit = async () =>{
    try{
      await axios.post('https://hotel-backend-zrv3.onrender.com/items',newItem);
      setOpen(false);
      const response = await axios.get ('https://hotel-backend-zrv3.onrender.com/items');
      setData(response.data)
    }catch (error){
      console.error('There was a problem with the axios operation :', error)
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
          {/* Add more categories as needed */}
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
                {role === 'procurement' &&(
                   <TableCell>
                        <Edit style={{ cursor: 'pointer', marginRight: 10 }} />
                        <Delete style={{ cursor: 'pointer' }} />
                    </TableCell>
                
                )}
                </TableRow> 
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Create Order</DialogTitle>
        <DialogContent>
          <TextField 
          autoFocus
          margin='dense'
          name='name'
          label='Name'
          type='text'
          fullWidth
          value={newItem.name}
          onChange={handleInputChange}/>

        <TextField 
          autoFocus
          margin='dense'
          name='description'
          label='Description'
          type='text'
          fullWidth
          value={newItem.description}
          onChange={handleInputChange}/>

        <TextField 
          autoFocus
          margin='dense'
          name='unit_price'
          label='Unit Price'
          type='number'
          fullWidth
          value={newItem.unit_price}
          onChange={handleInputChange}/> 

          <TextField 
          autoFocus
          margin='dense'
          name='group'
          label='Group'
          type='text'
          fullWidth
          value={newItem.group}
          onChange={handleInputChange}/> 

        <TextField 
          autoFocus
          margin='dense'
          name='quantity'
          label='Quantity'
          type='number'
          fullWidth
          value={newItem.quantity}
          onChange={handleInputChange}/> 

        <TextField 
          autoFocus
          margin='dense'
          name='spoilt'
          label='Spoilt'
          type='number'
          fullWidth
          value={newItem.spoilt}
          onChange={handleInputChange}/> 

        <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={newItem.date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Item</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
