import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Select, FormControl, InputLabel
} from '@mui/material';


function Debtors() {
  const [data, setData] = useState([]);
  
  

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/debtors');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Debtors</Typography>

      

      <TableContainer component={Paper}>
        <Table aria-label="expense table">
          <TableHead>
            <TableRow>
              <TableCell>Group</TableCell>
              <TableCell>Booking No</TableCell>
              <TableCell>Work Name</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.booking_no}</TableCell>
                <TableCell>{row.workshopName}</TableCell>
                <TableCell>{row.Totalamount}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Debtors;
