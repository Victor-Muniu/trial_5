import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, FormControl, Grid, Paper } from '@mui/material';

function BillForm() {
  const [formData, setFormData] = useState({
    room_no: '',
    laundryServices: [{ laundryName: '', quantity: '' }],
    menuItems: [{ name: '', quantity: '' }],
    delivery_fee: 0,
    serviceType: 'laundry'
  });
  const [role, setRole] = useState('');
  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    if (userRole === 'front office') {
      fetchAvailableItems('https://hotel-backend-1-trhj.onrender.com/laundry-services');
    } else if (userRole === 'service') {
      fetchAvailableItems('https://hotel-backend-1-trhj.onrender.com/menus');
    }
  }, [role]);

  const fetchAvailableItems = async (url) => {
    try {
      const response = await axios.get(url);
      setAvailableItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (e, index, serviceType) => {
    const { name, value } = e.target;
    const updatedServices = [...formData[serviceType]];
    updatedServices[index] = { ...updatedServices[index], [name]: value };
    setFormData({ ...formData, [serviceType]: updatedServices });
  };

  const addService = (item) => {
    if (role === 'front office') {
      setFormData({
        ...formData,
        laundryServices: [...formData.laundryServices, { laundryName: item.name, quantity: 1 }]
      });
    } else if (role === 'service') {
      setFormData({
        ...formData,
        menuItems: [...formData.menuItems, { name: item.name, quantity: 1 }]
      });
    }
  };

  const removeService = (index, serviceType) => {
    const updatedServices = [...formData[serviceType]];
    updatedServices.splice(index, 1);
    setFormData({ ...formData, [serviceType]: updatedServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formattedFormData;

    if (role === 'front office') {
      const formattedLaundryServices = formData.laundryServices
        .filter(service => 
          service.laundryName && service.laundryName.trim() !== '' &&
          !isNaN(parseInt(service.quantity, 10))
        )
        .map(service => ({
          laundryName: service.laundryName.trim(),
          quantity: parseInt(service.quantity, 10)
        }));

      if (formattedLaundryServices.length === 0) {
        console.error('Invalid laundry services data');
        return;
      }

      formattedFormData = {
        room_no: formData.room_no.trim(),
        laundryServices: formattedLaundryServices
      };

      console.log('Posting Laundry Service Data:', JSON.stringify(formattedFormData, null, 2));

      try {
        const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/laundry-service-bills', formattedFormData);
        console.log('Laundry service bill created:', response.data);
        setFormData({
          room_no: '',
          laundryServices: [{ laundryName: '', quantity: '' }],
          menuItems: [{ name: '', quantity: '' }],
          delivery_fee: 0,
          serviceType: 'laundry'
        });
      } catch (error) {
        console.error('Error with axios operation:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      }

    } else if (role === 'service') {
      const formattedMenuItems = formData.menuItems
        .filter(item => 
          item.name && item.name.trim() !== '' &&
          !isNaN(parseInt(item.quantity, 10))
        )
        .map(item => ({
          name: item.name.trim(),
          quantity: parseInt(item.quantity, 10)
        }));

      if (formattedMenuItems.length === 0) {
        console.error('Invalid menu items data');
        return;
      }

      formattedFormData = {
        room_no: formData.room_no.trim(),
        menuItems: formattedMenuItems,
        delivery_fee: parseInt(formData.delivery_fee, 10)
      };

      console.log('Posting Room Service Data:', JSON.stringify(formattedFormData, null, 2));

      try {
        const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/room-services', formattedFormData);
        console.log('Room service created:', response.data);
        setFormData({
          room_no: '',
          laundryServices: [{ laundryName: '', quantity: '' }],
          menuItems: [{ name: '', quantity: '' }],
          delivery_fee: 0,
          serviceType: 'laundry'
        });
      } catch (error) {
        console.error('Error with axios operation:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Service Bill Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            name="room_no"
            label="Room No"
            value={formData.room_no}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </FormControl>

        <Box display="flex" width="100%" marginBottom={2}>
          <Box
            flex={2}
            padding={2}
            marginRight={2}
            boxShadow={3}
            borderRadius={2}
            sx={{ backgroundColor: '#fff' }}
          >
            <Typography variant="h6" gutterBottom>
              {role === 'front office' ? 'Available Laundry Services' : 'Available Menu Items'}
            </Typography>
            <Grid container spacing={2}>
              {availableItems.map((item, index) => (
                <Grid item key={index} xs={12} md={6}>
                  <Paper elevation={3} style={{ padding: '1rem' }}>
                    <Typography variant='h6'>{item.name}</Typography>
                    <Typography variant='body2'>Price: Kh{item.price}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addService(item)}
                    >
                      Add
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            flex={1}
            padding={2}
            boxShadow={3}
            borderRadius={2}
            sx={{ backgroundColor: '#f7f7f7' }}
          >
            <Typography variant="h6" gutterBottom>
              Selected Items
            </Typography>
            {role === 'front office' && formData.laundryServices.map((service, index) => (
              <Box key={index} display="flex" justifyContent="space-between" marginBottom={1}>
                <Typography variant='body1'>{service.laundryName || 'N/A'}</Typography>
                <Typography variant='body1'>Quantity: {service.quantity || 'N/A'}</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => removeService(index, 'laundryServices')}
                >
                  Remove
                </Button>
              </Box>
            ))}

            {role === 'service' && formData.menuItems.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" marginBottom={1}>
                <Typography variant='body1'>{item.name || 'N/A'}</Typography>
                <Typography variant='body1'>Quantity: {item.quantity || 'N/A'}</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => removeService(index, 'menuItems')}
                >
                  Remove
                </Button>
              </Box>
            ))}

            {role === 'service' && (
              <FormControl fullWidth margin="normal">
                <TextField
                  name="delivery_fee"
                  label="Delivery Fee"
                  type="number"
                  value={formData.delivery_fee}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
              </FormControl>
            )}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </Container>
  );
}

export default BillForm;
