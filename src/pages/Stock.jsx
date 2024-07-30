import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import dayjs from 'dayjs';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#387908', '#ff0070', '#0000ff'];

const Stock = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStartDate, setFilteredStartDate] = useState('');
  const [filteredEndDate, setFilteredEndDate] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/transfers');
        let data = response.data;

        if (role === 'service') {
          data = data.filter(item => item.group === 'Bar');
        } else if (role === 'front office' || role=== 'admin') {
          data = data.filter(item => item.group === 'Curio');
        } else if (role === 'procurement') {
          data = data.filter(item => item.group === 'House Keeping' || item.group === 'Internal');
        }

        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, [role]);

  const formatDataForCharts = (data) => {
    const months = Array.from({ length: 12 }, (v, k) => dayjs().month(k).format('MMM'));
    const products = Array.from(new Set(data.map(item => item.name)));

    const monthlyData = months.map((month, index) => {
      const monthData = { month };
      products.forEach(product => {
        const productData = data.filter(item => dayjs(item.date).month() === index && item.name === product);
        monthData[product] = productData.reduce((acc, item) => acc + (item.quantity || 0), 0);
      });
      return monthData;
    });

    const productQuantities = products.map(product => ({
      name: product,
      quantity: data.filter(item => item.name === product).reduce((acc, item) => acc + (item.quantity || 0), 0)
    }));

    return { monthlyData, productQuantities, products };
  };

  const handleFilterByDate = () => {
    let filteredData = data;

    if (filteredStartDate && filteredEndDate) {
      filteredData = data.filter(item =>
        dayjs(item.date).isAfter(filteredStartDate) && dayjs(item.date).isBefore(filteredEndDate)
      );
    }

    return filteredData;
  };

  const { monthlyData, productQuantities, products } = formatDataForCharts(data);
  const filteredDataByDate = handleFilterByDate();

  const handleStartDateChange = (e) => {
    setFilteredStartDate(dayjs(e.target.value).startOf('day').toDate()); // Convert dayjs object to Date object
  };

  const handleEndDateChange = (e) => {
    setFilteredEndDate(dayjs(e.target.value).endOf('day').toDate()); // Convert dayjs object to Date object
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDataBySearch = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearchChange}
      />
      <TextField
        label="Start Date"
        type="date"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleStartDateChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="End Date"
        type="date"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleEndDateChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6'>Product Quantities Over Months</Typography>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                {products.map((product, index) => (
                  <Line
                    key={product}
                    type="monotone"
                    dataKey={product}
                    stroke={COLORS[index % COLORS.length]}
                    name={product}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6'>Inventory Overview</Typography>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={productQuantities}
                  dataKey="quantity"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {productQuantities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6'>Stock</Typography>
            <InvoiceTable data={filteredDataBySearch.filter(item => filteredDataByDate.includes(item))} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6'>Product Stock</Typography>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart layout="vertical" data={productQuantities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Line dataKey="quantity" fill="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const InvoiceTable = ({ data }) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Group</TableCell>
          <TableCell>Unit Of Measurement</TableCell>
          <TableCell>Unit Price</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Spoilt</TableCell>
          <TableCell>Value</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.group}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>{row.unit_price ? `Ksh${row.unit_price.toFixed(2)}` : 'N/A'}</TableCell>
            <TableCell>{row.quantity}</TableCell>
            <TableCell>{row.spoilt}</TableCell>
            <TableCell>{row.value}</TableCell>
            <TableCell>{dayjs(row.date).format('MMM DD, YYYY')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default Stock;
