import React from 'react';
import { Box, Container, Typography, Grid, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const productSalesData = [
  { name: 'Banquetting', sales: 4000 },
  { name: 'House Keeping', sales: 3000 },
  { name: 'Accomodation', sales: 5000 },
  { name: 'Bar', sales: 4000 },
  { name: 'Restaurant', sales: 6000 },
  { name: 'Health Club', sales: 7000 },
];




const visitorsData = [
  { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 300, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 200, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 278, pv: 3908, amt: 2000 },
  { name: 'May', uv: 189, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 239, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 349, pv: 4300, amt: 2100 },
  { name: 'Aug', uv: 200, pv: 9800, amt: 2290 },
  { name: 'Sep', uv: 278, pv: 3908, amt: 2000 },
  { name: 'Oct', uv: 189, pv: 4800, amt: 2181 },
  { name: 'Nov', uv: 239, pv: 3800, amt: 2500 },
  { name: 'Dec', uv: 349, pv: 4300, amt: 2100 },
];

const Home = () => {
  return (
    <Box width='100%'>
    <Container>
      <Grid marginTop={3} spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Business Sale Ratio</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        
        <Grid marginTop={3} item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Sales Analysis Report</Typography>
            <Typography variant="h4" color="primary">
              78,96,54,123
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Sales increased by 2,12,121 vs last month
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-period-label">Period</InputLabel>
              <Select labelId="select-period-label" label="Period" defaultValue="Monthly">
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Quarterly">Quarterly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        <Grid marginTop={3} item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Visitors Insights</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container></Box>
  );
};

export default Home;