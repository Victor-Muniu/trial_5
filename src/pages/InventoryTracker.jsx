import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import dayjs from 'dayjs';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#387908', '#ff0070', '#0000ff'];

const InventoryTracker = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/stockMovements');
        const data = response.data;
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const calculateSummary = (data) => {
    const totalIncome = data.reduce((acc, item) => acc + (item.quantity * item.unit_price || 0), 0);
    const totalSales = data.length;
    const totalExpenses = data.reduce((acc, item) => acc + (item.quantity * item.unit_price * (item.movementType === 'purchase' ? 1 : 0) || 0), 0);
    return { totalIncome, totalSales, totalExpenses };
  };

  const formatDataForCharts = (data) => {
    const months = Array.from({ length: 12 }, (v, k) => dayjs().month(k).format('MMM'));

    const monthlyData = months.map((month, index) => {
      const monthData = { month };
      monthData['purchases'] = data.filter(item => dayjs(item.date).month() === index && item.movementType === 'purchase').length;
      monthData['transfers'] = data.filter(item => dayjs(item.date).month() === index && item.movementType === 'transfer').length;
      return monthData;
    });

    return monthlyData;
  };

  const { totalIncome, totalSales, totalExpenses } = calculateSummary(data);
  const monthlyData = formatDataForCharts(data);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6'>Stock Movement</Typography>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  stroke={COLORS[0]}
                  name="Purchases"
                />
                <Line
                  type="monotone"
                  dataKey="transfers"
                  stroke={COLORS[1]}
                  name="Transfers"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6'>Invoices</Typography>
            <InvoiceTable data={data} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const InvoiceTable = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Movement Type</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              
              <TableCell>{row.itemId.name}</TableCell>
              <TableCell>{dayjs(row.date).format('MMM DD, YYYY')}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.movementType}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTracker;
