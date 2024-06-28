import React, {useEffect, useState} from 'react'
import axios from 'axios';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, TextField, Button, MenuItem, Select,
  } from '@mui/material';
  import { Edit, Delete } from '@mui/icons-material';
  
function CheffsLadder() {
    const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockAlert, setSelectedStockAlert] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-zrv3.onrender.com/cheffsLadder');
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
      (selectedCategory === 'All' || item.group === selectedCategory) 
    );
  });
  const role = localStorage.getItem('role')
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">Cheffs Ladder ({data.length})</Typography>
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
                <TableCell>Unit</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>O.S</TableCell>
                <TableCell>Issue</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>R.T</TableCell>
                <TableCell>Sold</TableCell>
                <TableCell>C.S</TableCell>
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
                <TableCell>{row.sold}</TableCell>
                <TableCell>{row.RT}</TableCell>
                <TableCell>{row.closing_stock}</TableCell>
                <TableCell>{row.remarks}</TableCell>
                <TableCell>{row.shift}</TableCell>
               
                   <TableCell>
                        <Edit style={{ cursor: 'pointer', marginRight: 10 }} />
                        <Delete style={{ cursor: 'pointer' }} />
                    </TableCell>
                
                
                </TableRow> 
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default CheffsLadder