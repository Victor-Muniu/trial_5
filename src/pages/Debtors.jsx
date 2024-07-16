import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';

function Debtors() {
  const [data, setData] = useState([]);
  const [bookingNo, setBookingNo] = useState('');

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

  const handleAddDebtor = async () => {
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/debtors', {
        booking_no: bookingNo
      });
      console.log('Debtor added:', response.data);
      setData([...data, response.data]); 
      setBookingNo(''); 
    } catch (error) {
      console.error('Error adding debtor:', error);
    }
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Debtors</Typography>

      <Box display="flex" alignItems="center" marginBottom={2}>
        <TextField
          label="Booking No"
          variant="outlined"
          value={bookingNo}
          onChange={(e) => setBookingNo(e.target.value)}
          fullWidth
          style={{ marginRight: 16 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddDebtor}>
          Add Debtor
        </Button>
      </Box>

      
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table aria-label="debtors table">
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
