import React from 'react';
import {  TableContainer,
         TableHead, TableRow, TableCell, TableBody,
         Paper,  Table } from '@mui/material';

const CollectionReport = () => {
  
  const receivables = [
    { vendor: 'Legon corp - Access Bank', amount: 256.2, date: 'July 22, 2022' },
    { vendor: 'Amanda Stone', amount: 1358.495, date: 'July 22, 2022' },
    
  ];

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Cashier</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receivables.map((row) => (
              <TableRow key={row.vendor}>
                <TableCell>{row.vendor}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>Mpesa</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
    </div>
  );
};

export default CollectionReport;
