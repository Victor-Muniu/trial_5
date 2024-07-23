import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid, Button, TextField } from '@mui/material';

function CurioPos() {
  const [items, setItems] = useState([]);
  const [orderData, setOrderData] = useState({
    drinksNames: [],
    quantity: [],
    price: [],
    staffName: `${localStorage.getItem('fname')} ${localStorage.getItem('lname')}`,
    date: new Date().toISOString()
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/transfers');
      console.log('Fetched items:', response.data);
      if (response.data.length > 0) {
        console.log('Sample item structure:', response.data[0]);
      }
      const curioItems = response.data.filter(item => item.group === 'Curio');
      console.log('Filtered curio items:', curioItems);
      setItems(curioItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddButtonClick = (item) => {
    const existingItemIndex = orderData.drinksNames.indexOf(item.name);

    if (existingItemIndex > -1) {
      const updatedQuantity = [...orderData.quantity];
      updatedQuantity[existingItemIndex] += 1;

      setOrderData({
        ...orderData,
        quantity: updatedQuantity
      });
    } else {
      // Item does not exist, add new entry
      setOrderData({
        ...orderData,
        drinksNames: [...orderData.drinksNames, item.name],
        quantity: [...orderData.quantity, 1],
        price: [...orderData.price, item.unit_price]
      });
    }
  };

  const handleMinusButtonClick = (item) => {
    const existingItemIndex = orderData.drinksNames.indexOf(item.name);

    if (existingItemIndex > -1) {
      // Item exists, update quantity and price
      const updatedQuantity = [...orderData.quantity];
      const updatedPrice = [...orderData.price];

      if (updatedQuantity[existingItemIndex] > 1) {
        updatedQuantity[existingItemIndex] -= 1;
        updatedPrice[existingItemIndex] = item.unit_price * updatedQuantity[existingItemIndex];

        setOrderData({
          ...orderData,
          quantity: updatedQuantity,
          price: updatedPrice
        });
      } else {
        // Remove item if quantity is 0
        const newDrinksNames = [...orderData.drinksNames];
        const newQuantity = [...orderData.quantity];
        const newPrice = [...orderData.price];

        newDrinksNames.splice(existingItemIndex, 1);
        newQuantity.splice(existingItemIndex, 1);
        newPrice.splice(existingItemIndex, 1);

        setOrderData({
          ...orderData,
          drinksNames: newDrinksNames,
          quantity: newQuantity,
          price: newPrice
        });
      }
    }
  };

  const handleSubmitOrder = async () => {
    const transformedOrderData = {
      drinksNames: orderData.drinksNames,
      quantity: orderData.quantity,
      price: orderData.price,
      staffName: orderData.staffName,
      date: orderData.date
    };

    console.log('Transformed Order Data:', transformedOrderData);

    try {
      const response = await fetch('https://hotel-backend-1-trhj.onrender.com/curioPOS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transformedOrderData)
      });

      if (response.ok) {
        alert('Order submitted successfully!');
        setOrderData({
          drinksNames: [],
          quantity: [],
          price: [],
          staffName: `${localStorage.getItem('fname')} ${localStorage.getItem('lname')}`,
          date: new Date().toISOString()
        });
      } else {
        const errorText = await response.text();
        alert(`Failed to submit order: ${errorText}`);
      }
    } catch (error) {
      alert('Network error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box display='flex' width='100%'>
      {/* Big Box for Cards */}
      <Box
        display='flex'
        flexDirection='column'
        width='70%'
        padding={2}
      >
        <TextField
          label="Search Items"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Grid container spacing={2}>
          {filteredItems.map((item, index) => {
            const existingItemIndex = orderData.drinksNames.indexOf(item.name);
            const quantity = existingItemIndex > -1 ? orderData.quantity[existingItemIndex] : 0;

            return (
              <Grid item key={index} xs={12} md={4}>
                <Paper elevation={3} style={{ padding: '1rem', height: '10rem', textAlign: 'center' }}>
                  <Typography variant='h6'>{item.name}</Typography>
                  <Typography variant='body2'>Price: Kh{item.unit_price}</Typography>
                  <Typography variant='body2'>Quantity: {item.quantity}</Typography>

                  <br />
                  <Box display='flex' justifyContent='space-evenly'>
                    <Button variant="contained" color="primary" onClick={() => handleAddButtonClick(item)}>ADD</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleMinusButtonClick(item)}>MINUS</Button>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Small Box */}
      <Box
        width='30%'
        padding={2}
        boxShadow={3}
        display='flex'
        flexDirection='column'
        sx={{
          backgroundColor: '#f7f7f7',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
          padding: '20px',
          margin: '20px'
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Typography variant='h5' sx={{ fontSize: '18px', fontWeight: 'bold' }}>
            Selected Items
          </Typography>
        </div>

        {orderData.drinksNames.map((name, index) => (
          <Box key={index} display='flex' flexDirection='row' justifyContent='space-between' sx={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <Typography variant='body1'>{name}</Typography>
            <Typography variant='body1'>Quantity: {orderData.quantity[index]}</Typography>
          </Box>
        ))}
        <Typography variant='body1' sx={{ padding: '10px' }}>
          Staff: {orderData.staffName}
        </Typography>
        <Typography variant='body1' sx={{ padding: '10px' }}>
          Date: {orderData.date}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitOrder}
          sx={{
            margin: '10px',
            padding: '10px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Submit Order
        </Button>
      </Box>
    </Box>
  );
}

export default CurioPos;
