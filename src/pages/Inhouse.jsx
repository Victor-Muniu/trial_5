import React, { useEffect, useState } from 'react'
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Typography, TextField, Button, MenuItem, Select,
  } from '@mui/material';
import axios from 'axios'
import { Edit, Delete } from '@mui/icons-material';
function Inhouse() {
    const [data,setData]=useState([])
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStockAlert, setSelectedStockAlert] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(()=> {
        const getData = async () => {
            try {
              const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/individuals');
              const data = response.data;
              setData(data);
            } catch (error) {
              console.error('There was a problem with the axios operation:', error);
            }
          };
          getData();
    },[])
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
      <Typography variant="h4">Inhouse ({data.length})</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search for package"
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
          <MenuItem value="Butchery">Full Board</MenuItem>
          
        </Select>
        <Select
          value={selectedStockAlert}
          onChange={handleStockAlertChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Stock Alert' }}
        >
          <MenuItem value="All">All </MenuItem>
          <MenuItem value="Low Stock">Bed and BreakFast</MenuItem>
         
        </Select>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Package Type</TableCell>
              <TableCell>Adults</TableCell>
              <TableCell>Kids</TableCell>
              <TableCell>Room No</TableCell>
              {role === 'front office' && (
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
                <TableCell>{row.fname} {row.lname}</TableCell>
                
                <TableCell>{row.plan}</TableCell>
                <TableCell>{row.adults}</TableCell>
                <TableCell>{row.kids}</TableCell>
                <TableCell>{row.room_no}</TableCell>
                
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
  )
}

export default Inhouse