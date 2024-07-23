import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';

function Ammenities() {
  const [ammenities, setAmmenities] = useState([]);
  const [orderData, setOrderData] = useState({
    ammenities: [],
    staffName: `${localStorage.getItem('fname')} ${localStorage.getItem('lname')}`,
    date: new Date().toISOString().split('T')[0]
  });

  const fetchAmmenities = async () => {
    try {
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/ammenities');
      setAmmenities(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddButtonClick = (ammenity) => {
    const existingAmenity = orderData.ammenities.find((a) => a.ammenitiesName.includes(ammenity.name) && a.age_group.includes(ammenity.age_group));
    
    if (existingAmenity) {
      const updatedAmmenities = orderData.ammenities.map((a) => {
        if (a.ammenitiesName.includes(ammenity.name) && a.age_group.includes(ammenity.age_group)) {
          const updatedQuantity = [...a.quantity];
          const index = a.ammenitiesName.indexOf(ammenity.name);
          updatedQuantity[index] = (updatedQuantity[index] || 0) + 1;
          return { ...a, quantity: updatedQuantity };
        }
        return a;
      });

      setOrderData({
        ...orderData,
        ammenities: updatedAmmenities
      });
    } else {
      setOrderData({
        ...orderData,
        ammenities: [
          ...orderData.ammenities,
          {
            ammenitiesName: [ammenity.name],
            age_group: [ammenity.age_group],
            quantity: [1]
          }
        ]
      });
    }
  };

  const handleMinusButtonClick = (ammenity) => {
    const updatedAmmenities = orderData.ammenities.map((a) => {
      if (a.ammenitiesName.includes(ammenity.name) && a.age_group.includes(ammenity.age_group)) {
        const updatedQuantity = [...a.quantity];
        const index = a.ammenitiesName.indexOf(ammenity.name);
        if (updatedQuantity[index] > 1) {
          updatedQuantity[index] -= 1;
        } else {
          return null; // To remove the item if quantity is 1
        }
        return { ...a, quantity: updatedQuantity };
      }
      return a;
    }).filter(Boolean);

    setOrderData({
      ...orderData,
      ammenities: updatedAmmenities
    });
  };

  const handleSubmitOrder = async () => {
    if (orderData) {
      try {
        const response = await fetch('https://hotel-backend-1-trhj.onrender.com/ammenitiesOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
  
        if (response.ok) {
          alert('Order submitted successfully!');
          setOrderData({
            ammenities: [],
            staffName: `${localStorage.getItem('fname')} ${localStorage.getItem('lname')}`,
            date: new Date().toISOString().split('T')[0]
          });
        } else {
          alert('Failed to submit order. Please try again.');
        }
      } catch (error) {
        alert('Network error occurred. Please try again later.');
      }
    }
  };
  

  useEffect(() => {
    fetchAmmenities();
  }, []);

  return (
    <Box display='flex' width='100%'>
      
      <Box
        display='flex'
        flexDirection='row'
        flexWrap='wrap'
        justifyContent='center'
        width='70%'
        padding={2}
        alignItems='center'
      >
        <Grid container spacing={2}>
          {ammenities.map((item, index) => {
            const existingAmenity = orderData.ammenities.find(a => a.ammenitiesName.includes(item.name) && a.age_group.includes(item.age_group));
            const quantity = existingAmenity ? existingAmenity.quantity[existingAmenity.ammenitiesName.indexOf(item.name)] : 0;

            return (
              <Grid item key={index} xs={12} md={4}>
                <Paper elevation={3} style={{ padding: '1rem', height: '12rem', textAlign: 'center' }}>
                  <Typography variant='h6'>{item.name}</Typography>
                  <Typography variant='body1'>{item.age_group}</Typography>
                  <Typography variant='body2'>Price: Kh{item.price}</Typography>
                  <Typography variant='body2'>Quantity: {quantity}</Typography>

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
            Selected Ammenities
          </Typography>
        </div>

        {orderData.ammenities.map((amenity, index) => (
          <Box key={index} display='flex' flexDirection='row' justifyContent='space-between' sx={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <Typography variant='body1'>{amenity.ammenitiesName.join(', ')}</Typography>
            <Typography variant='body1'>{amenity.age_group.join(', ')}</Typography>
            <Typography variant='body1'>Quantity: {amenity.quantity.join(', ')}</Typography>
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

export default Ammenities;
