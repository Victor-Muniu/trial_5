import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

function RequisitionForm() {
  const role = localStorage.getItem('role');
  const defaultRequisitionType = role === 'house keeping' ? 'house keeping' : role === 'front office' ? 'front office' : role === 'food production' ? 'food production' : 'restaurant';

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

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/items');
        setItems(response.data);
      } catch (error) {
        console.error('There was a problem fetching the items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemNameChange = (event, value) => {
    setFormData({ ...formData, itemName: value ? value.name : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint;
      switch (formData.requisitionType) {
        case 'restaurant':
          endpoint = 'https://hotel-backend-1-trhj.onrender.com/restaurantRequisitions';
          break;
        case 'house keeping':
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

      console.log('Posting to endpoint:', endpoint); // Log endpoint for debugging

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

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {defaultRequisitionType === 'restaurant' ? 'Restaurant Requisition Form' :
         defaultRequisitionType === 'house keeping' ? 'Housekeeping Requisition Form' :
         defaultRequisitionType === 'front office' ? 'Front Office Requisition Form' :
         'Food Production Requisition Form'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Autocomplete
          options={items}
          getOptionLabel={(option) => option.name || ''} 
          value={items.find(item => item.name === formData.itemName) || null}
          onChange={handleItemNameChange}
          isOptionEqualToValue={(option, value) => option.name === value.name} // Correct comparison
          renderInput={(params) => (
            <TextField {...params} label="Item Name" margin="normal" fullWidth />
          )}
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
