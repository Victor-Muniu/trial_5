import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Paper, Typography, Button, Divider } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Add, Remove } from '@mui/icons-material';

function Menu() {
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const { table_no } = useParams();
  const fname = localStorage.getItem('fname');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-zrv3.onrender.com/menus');
        const data = response.data;
        console.log(data);
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const restaurantItems = data.filter(item => item.point_of_sale === 'Restaurant');

  const handleAdd = (item) => {
    setOrders((prevOrders) => {
      const existingOrder = prevOrders.find(order => order._id === item._id);
      if (existingOrder) {
        return prevOrders.map(order =>
          order._id === item._id ? { ...order, quantity: order.quantity + 1, total: order.total + item.price } : order
        );
      } else {
        return [...prevOrders, { ...item, quantity: 1, total: item.price }];
      }
    });
  };

  const handleRemove = (item) => {
    setOrders((prevOrders) => {
      const existingOrder = prevOrders.find(order => order._id === item._id);
      if (existingOrder) {
        if (existingOrder.quantity > 1) {
          return prevOrders.map(order =>
            order._id === item._id ? { ...order, quantity: order.quantity - 1, total: order.total - item.price } : order
          );
        } else {
          return prevOrders.filter(order => order._id !== item._id);
        }
      }
      return prevOrders;
    });
  };

  const handleSubmitOrder = async (type) => {
    const remarks = prompt('Enter any remarks:');
    if (orders.length === 0) {
      alert('No items in the order');
      return;
    }
    const orderData = {
      menuName: orders[0].name,  // Set menuName to the name of the first item
      staffName: fname,
      date: new Date().toISOString(),
      quantity: orders.reduce((acc, order) => acc + order.quantity, 0),
      table_no: table_no,
      remarks: remarks || 'none'
    };

    console.log("Submitting order data:", JSON.stringify(orderData, null, 2)); // Log the JSON data

    try {
      const response = await axios.post('https://hotel-backend-zrv3.onrender.com/restaurantOrders', orderData);
      console.log("Order submitted successfully", response.data);
      alert('Order submitted successfully');
    } catch (error) {
      console.error('There was a problem submitting the order:', error);
      alert('There was a problem submitting the order');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '70%', p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Menu for Table {table_no}
        </Typography>
        <Grid container spacing={3}>
          {restaurantItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 2, textAlign: 'center', position: 'relative', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body1">Price: ${item.price}</Typography>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Remove />}
                    sx={{ mr: 1, bgcolor: blue[500], color: 'white' }}
                    onClick={() => handleRemove(item)}
                  >
                    Minus
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    sx={{ bgcolor: blue[500], color: 'white' }}
                    onClick={() => handleAdd(item)}
                  >
                    Plus
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ width: '30%', p: 3, borderLeft: '1px solid #e0e0e0' }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant='h6'>Current Orders</Typography>
          <Typography>Table No: {table_no}</Typography>
          <Divider sx={{ my: 2 }} />
          {orders.map((order, index) => (
            <Box key={index} sx={{ mb: 2 }} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant="body1">{order.name}</Typography>
              <Box display='flex' justifyContent='space-around' alignContent='center' px={2}>
                <Typography variant="body2" px={2}>Quantity: {order.quantity}</Typography>
                <Typography variant="body2" px={2}>Total: ksh{order.total}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
          <Box display='flex' justifyContent='center' alignItems='center' sx={{ mb: 2 }}>
            <Button variant='contained' onClick={() => handleSubmitOrder('Dine In')}>Post Bill</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Menu;
