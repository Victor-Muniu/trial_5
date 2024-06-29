import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function GeneralLedger() {
  const [data, setData] = useState([]);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/general-ledger');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const groupedData = data.reduce((acc, item) => {
    const category = acc[item.category] || [];
    category.push(item);
    acc[item.category] = category;
    return acc;
  }, {});

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom margin={5}>
        General Ledger
      </Typography>

      <Typography variant="h5" gutterBottom margin={5}>
        For Jan 1, {currentYear} - Dec 31, {currentYear}
      </Typography>
      

      {Object.keys(groupedData).map((category) => (
        <React.Fragment key={category} >
          <Typography variant="h6" gutterBottom margin={5}>
            {category}
          </Typography>
          <Table aria-label="simple table" margin={5}>
            <TableHead>
              <TableRow>
                <TableCell>Transaction / Reference</TableCell>
                <TableCell>Date / Note</TableCell>
                <TableCell align="right">Amount</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedData[category].map((row) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {row.category}
                  </TableCell>
                  <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </React.Fragment>
      ))}
    </TableContainer>
  );
}

export default GeneralLedger;
