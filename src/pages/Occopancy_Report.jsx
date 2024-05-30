import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';

const Occupancy_Report = () => {
  
  const bookings = [
    {
      bookingReference: 'DMR1234123112',
      serviceLevel: 'Liner',
      shipmentType: 'Full Cargo',
      origin: 'ODUNPAZARI / ESKİŞEHİR',
      destination: 'ZONGULDAK',
      quantity: '1 BI-KAP / 1.0',
      agentBookedAt: '01.12.2023',
      status: 'In Transit', 
    },
    
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room No</TableCell>
            <TableCell>Check In Date</TableCell>
            <TableCell>Check Out Date</TableCell>
            <TableCell>Room Type</TableCell>
            <TableCell>Checked in By</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.bookingReference}>
              <TableCell>{booking.bookingReference}</TableCell>
              <TableCell>{booking.serviceLevel}</TableCell>
              <TableCell>{booking.shipmentType}</TableCell>
              <TableCell>{booking.origin}</TableCell>
              <TableCell>{booking.destination}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Add filtering and add booking buttons here */}
      <Button variant="contained" color="primary" style={{ float: 'right', margin: '16px' }}>
        Add Booking
      </Button>
      {/* You can add filter options as well */}
    </TableContainer>
  );
};

export default Occupancy_Report;
