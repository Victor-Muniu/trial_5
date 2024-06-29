import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, TextField, MenuItem } from '@mui/material';

function Expense() {
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [groupBy, setGroupBy] = useState('category');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/expenses');
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
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Expense Report</Typography>
        <Box>
          <Button variant="contained" color="primary" style={{ marginRight: 8 }}>Export to</Button>
          <Button variant="contained" color="primary">Print Report</Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <TextField
            label="Date Range"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: 8 }}
          />
          <Typography style={{ marginRight: 8 }}>to</Typography>
          <TextField
            label="Date Range"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <Typography style={{ marginRight: 8 }}>Group By:</Typography>
          <TextField
            select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            style={{ marginRight: 8 }}
          >
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </TextField>
          <Button variant="contained" color="primary" onClick={() => console.log('Update clicked')}>Update</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Typography variant="h6" gutterBottom margin={5}>
          Expenses by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom margin={5}>
          Between {new Date(startDate).toLocaleDateString()} and {new Date(endDate).toLocaleDateString()}
        </Typography>

        {Object.keys(groupedData).map((category) => (
          <React.Fragment key={category}>
            <Typography variant="h6" gutterBottom margin={5}>
              {category}
            </Typography>
            <Table aria-label="expense table">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedData[category].map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.category || '-'}</TableCell>
                    <TableCell>{row.amount || '-'}</TableCell>
                    <TableCell align="">{new Date(row.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </React.Fragment>
        ))}
      </TableContainer>
    </Box>
  );
}

export default Expense;
