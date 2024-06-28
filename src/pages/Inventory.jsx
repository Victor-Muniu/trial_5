import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, TextField, Button, MenuItem, Select,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

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
        <Button variant="contained" color="primary">+ Add Product</Button>
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
      
    </Box>
  );
};

export default Inventory;
