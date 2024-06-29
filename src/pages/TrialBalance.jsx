import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem
} from '@mui/material';

function TrialBalance() {
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [groupBy, setGroupBy] = useState('group_name');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/trial-balances');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const groupedData = data.reduce((acc, item) => {
    const group = acc[item[groupBy]] || [];
    group.push(item);
    acc[item[groupBy]] = group;
    return acc;
  }, {});

  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;
    data.forEach(item => {
      totalDebit += item.Debit;
      totalCredit += item.Credit;
    });
    return { totalDebit, totalCredit };
  };

  const { totalDebit, totalCredit } = calculateTotals();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Trial Balance</Typography>
        <Box>
          <Button variant="contained" color="primary" style={{ marginRight: 8 }}>Export to Excel</Button>
          <Button variant="contained" color="primary">Print</Button>
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
            <MenuItem value="group_name">Group Name</MenuItem>
            <MenuItem value="Date">Date</MenuItem>
          </TextField>
          <Button variant="contained" color="primary" onClick={() => console.log('Update clicked')}>Update</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Typography variant="h6" gutterBottom>
          Trial Balance
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          The Ant Agency
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          For {startDate} - {endDate}
        </Typography>

        <Table aria-label="trial balance table">
          <TableHead>
            <TableRow>
              <TableCell>Account Name & Code</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Credit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(groupedData).map((group) => (
              groupedData[group].map((row, index) => (
                <TableRow key={row._id}>
                  <TableCell>{row.group_name} ({row._id})</TableCell>
                  <TableCell align="right">{row.Debit.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.Credit.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ))}
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell align="right">{totalDebit.toLocaleString()}</TableCell>
              <TableCell align="right">{totalCredit.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TrialBalance;
