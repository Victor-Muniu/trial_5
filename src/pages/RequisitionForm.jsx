import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function RequisitionForm() {
  const role = localStorage.getItem('role');
  const defaultRequisitionType = role === 'housekeeping' ? 'housekeeping' : role === 'front office' ? 'front office' : role === 'food production' ? 'food production' : 'restaurant';

  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    description: '',
    date: '',
    department: '',
    status: '',
    requisitionType: defaultRequisitionType
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint;
      switch (formData.requisitionType) {
        case 'restaurant':
          endpoint = 'https://hotel-backend-1-trhj.onrender.com/restaurantRequisitions';
          break;
        case 'housekeeping':
          endpoint = 'https://hotel-backend-1-trhj.onrender.com/houseKeepingRequisitions';
          break;
        case 'front office':
          endpoint = 'https://hotel-backend-1-trhj.onrender.com/frontOfficeRequisitions';
          break;
        case 'food production': 
          endpoint = 'https://hotel-backend-1-trhj.onrender.com/foodProductionRequisitions';
          break;
        default:
          throw new Error('Invalid requisition type');
      }

      const response = await axios.post(endpoint, formData);
      console.log('Requisition created:', response.data);

      setFormData({
        itemName: '',
        quantity: '',
        unit: '',
        description: '',
        date: '',
        department: '',
        status: '',
        requisitionType: defaultRequisitionType // Reset to default
      });
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      requisitionType: defaultRequisitionType
    }));
  }, [defaultRequisitionType]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {defaultRequisitionType === 'restaurant' ? 'Restaurant Requisition Form' :
         defaultRequisitionType === 'housekeeping' ? 'Housekeeping Requisition Form' :
         defaultRequisitionType === 'front office' ? 'Front Office Requisition Form' :
         'Food Production Requisition Form'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Item Name"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Department</InputLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <MenuItem value="Restaurant">Restaurant</MenuItem>
            <MenuItem value="Club">Club</MenuItem>
            <MenuItem value="Front Office">Front Office</MenuItem>
            <MenuItem value="Housekeeping">Housekeeping</MenuItem>
            <MenuItem value="Food Production">Food Production</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default RequisitionForm;
