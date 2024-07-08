import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography
} from '@mui/material';

function RoomReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/reservations');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const processData = (data) => {
    const today = new Date();
    const todayDate = today.toLocaleDateString();

    return data
      .filter((item) => new Date(item.date).toLocaleDateString() === todayDate)
      .map((item) => ({
        customerName: item.type === 'individual' ? `${item.individual.fname} ${item.individual.lname}` : `${item.group[0].fname} ${item.group[0].lname}`,
        roomNumbers: item.room_no.join(', '),
        date: new Date(item.date).toLocaleDateString(),
      }));
  };

  const processedData = processData(data);

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Booking List</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="booking table">
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Room Numbers</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.roomNumbers}</TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default RoomReport;
