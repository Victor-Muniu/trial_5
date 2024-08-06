import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import dayjs from 'dayjs';

const KOThistory = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/restaurantOrders');
        setData(response.data);
        filterData(response.data, selectedDate, searchTerm);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    fetchData();
  }, [selectedDate, searchTerm]);

  const filterData = (data, date, searchTerm) => {
    const filtered = data.filter(order => {
      const orderDate = dayjs(order.date).format('YYYY-MM-DD');
      return (
        orderDate === date &&
        (order.staffId.fname.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.staffId.lname.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    const categorizedData = filtered.reduce((acc, order) => {
      const staffName = `${order.staffId.fname} ${order.staffId.lname}`;
      if (!acc[staffName]) {
        acc[staffName] = {};
      }
      const day = dayjs(order.date).format('YYYY-MM-DD');
      if (!acc[staffName][day]) {
        acc[staffName][day] = { totalAmount: 0, orders: [] };
      }
      acc[staffName][day].totalAmount += order.totalAmount;
      acc[staffName][day].orders.push(order);
      return acc;
    }, {});

    setFilteredData(categorizedData);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    filterData(data, date, searchTerm);
  };

  const handleSearchChange = (event) => {
    const search = event.target.value;
    setSearchTerm(search);
    filterData(data, selectedDate, search);
  };

  return (
    <Container>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6}>
          <TextField
            type="date"
            label="Select Date"
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={handleDateChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search by Staff Name"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Staff Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Table No</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Order Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(filteredData).map(staffName => (
              Object.keys(filteredData[staffName]).map(date => (
                filteredData[staffName][date].orders.map(order => (
                  <TableRow key={order._id}>
                    {order === filteredData[staffName][date].orders[0] ? (
                      <>
                        <TableCell rowSpan={filteredData[staffName][date].orders.length}>{staffName}</TableCell>
                        <TableCell rowSpan={filteredData[staffName][date].orders.length}>{date}</TableCell>
                      </>
                    ) : null}
                    <TableCell>{order.tableId.table_no}</TableCell>
                    <TableCell>{order.totalAmount}</TableCell>
                    <TableCell>
                      {order.items.map(item => (
                        <div key={item._id}>
                          {item.menuId.name} (x{item.quantity}) - {item.amount}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default KOThistory;
