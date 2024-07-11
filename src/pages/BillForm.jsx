import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';

function BillForm() {
  const [formData, setFormData] = useState({
    room_no: '',
    laundryServices: [{ laundryName: '', quantity: '' }],
    menuItems: [{ name: '', quantity: '' }],
    delivery_fee: 500,
    serviceType: 'laundry' 
  });
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

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

  const addService = (serviceType) => {
    setFormData({
      ...formData,
      [serviceType]: [...formData[serviceType], { name: '', quantity: '' }],
    });
  };

  const removeService = (index, serviceType) => {
    const updatedServices = [...formData[serviceType]];
    updatedServices.splice(index, 1);
    setFormData({ ...formData, [serviceType]: updatedServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'front office') {
      const formattedLaundryServices = formData.laundryServices.map(service => ({
        laundryName: service.laundryName,
        quantity: parseInt(service.quantity, 10)
      }));

      const formattedFormData = {
        room_no: parseInt(formData.room_no, 10),
        laundryServices: formattedLaundryServices
      };

      try {
        const laundryResponse = await axios.post('https://hotel-backend-1-trhj.onrender.com/laundry-service-bills', formattedFormData);
        console.log('Laundry service bill created:', laundryResponse.data);

        setFormData({
          room_no: '',
          laundryServices: [{ laundryName: '', quantity: '' }],
          menuItems: [{ name: '', quantity: '' }],
          delivery_fee: 500,
          serviceType: 'laundry'
        });
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      }
    } else if (role === 'service') {
      const formattedMenuItems = formData.menuItems.map(item => ({
        name: item.name,
        quantity: parseInt(item.quantity, 10)
      }));

      const formattedFormData = {
        room_no: parseInt(formData.room_no, 10),
        menuItems: formattedMenuItems,
        delivery_fee: parseInt(formData.delivery_fee, 10)
      };

      try {
        const roomServiceResponse = await axios.post('https://hotel-backend-1-trhj.onrender.com/room-services', formattedFormData);
        console.log('Room service created:', roomServiceResponse.data);

        setFormData({
          room_no: '',
          laundryServices: [{ laundryName: '', quantity: '' }],
          menuItems: [{ name: '', quantity: '' }],
          delivery_fee: 500,
          serviceType: 'laundry'
        });
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      }
    }
  };

  return (
    <Container maxWidth="sm">
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

        {role === 'front office' && (
          <>
            <Typography variant="h6" gutterBottom>
              Laundry Services
            </Typography>
            {formData.laundryServices.map((service, index) => (
              <Box key={index}>
                <FormControl fullWidth margin="normal">
                  <TextField
                    name="laundryName"
                    label="Laundry Item"
                    value={service.laundryName}
                    onChange={(e) => handleServiceChange(e, index, 'laundryServices')}
                    fullWidth
                    margin="normal"
                    required
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    name="quantity"
                    label="Quantity"
                    type="number"
                    value={service.quantity}
                    onChange={(e) => handleServiceChange(e, index, 'laundryServices')}
                    fullWidth
                    margin="normal"
                    required
                  />
                </FormControl>
                {index > 0 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => removeService(index, 'laundryServices')}
                  >
                    Remove Service
                  </Button>
                )}
              </Box>
            ))}
            <Box mt={2}>
              <Button variant="outlined" color="primary" onClick={() => addService('laundryServices')}>
                Add Another Laundry Service
              </Button>
            </Box>
          </>
        )}

        {role === 'service' && (
          <>
            <Typography variant="h6" gutterBottom>
              Room Services
            </Typography>
            {formData.menuItems.map((item, index) => (
              <Box key={index}>
                <FormControl fullWidth margin="normal">
                  <TextField
                    name="name"
                    label="Menu Item"
                    value={item.name}
                    onChange={(e) => handleServiceChange(e, index, 'menuItems')}
                    fullWidth
                    margin="normal"
                    required
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    name="quantity"
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleServiceChange(e, index, 'menuItems')}
                    fullWidth
                    margin="normal"
                    required
                  />
                </FormControl>
                {index > 0 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => removeService(index, 'menuItems')}
                  >
                    Remove Item
                  </Button>
                )}
              </Box>
            ))}
            <Box mt={2}>
              <Button variant="outlined" color="primary" onClick={() => addService('menuItems')}>
                Add Another Menu Item
              </Button>
            </Box>

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
          </>
        )}

        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default BillForm;
