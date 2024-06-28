import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#387908', '#ff0070', '#0000ff'];

const FoodProduction = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-zrv3.onrender.com/cheffsLadder');
        const data = response.data;
        console.log(data);
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const formatLineChartData = () => {
    // Placeholder for line chart data
    return data.map((item, index) => ({
      name: item.name,
      currentWeek: item.closing_stock,
      previousWeek: item.opening_stock,
    }));
  };

  const formatPieChartData = () => {
    // Placeholder for pie chart data
    return data.map((item, index) => ({
      name: item.name,
      value: item.closing_stock,
    }));
  };

  const formatBarChartData = () => {
    // Placeholder for bar chart data
    return data.map((item, index) => ({
      name: item.name,
      direct: item.closing_stock,
    }));
  };

  const lineChartData = formatLineChartData();
  const pieChartData = formatPieChartData();
  const barChartData = formatBarChartData();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Stock Movement</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="currentWeek" stroke="#8884d8" name="Current Week" />
                <Line type="monotone" dataKey="previousWeek" stroke="#82ca9d" name="Previous Week" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Pie Chart</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Bar Graph</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="direct" fill="#8884d8" name="Direct" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Stock</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Unit</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>O.S</TableCell>
                    <TableCell>Issue</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>R.T</TableCell>
                    <TableCell>Sold</TableCell>
                    <TableCell>C.S</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Shift</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>{row.unit}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.opening_stock}</TableCell>
                      <TableCell>{row.issue}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell>{row.sold}</TableCell>
                      <TableCell>{row.RT}</TableCell>
                      <TableCell>{row.closing_stock}</TableCell>
                      <TableCell>{row.remarks}</TableCell>
                      <TableCell>{row.shift}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FoodProduction;
