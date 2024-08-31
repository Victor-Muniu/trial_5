import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText, Autocomplete } from '@mui/material';

function BanquettingRequisitionForm() {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    description: '',
    date: '',
    department: '',
    status: ''
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
      const endpoint = 'https://hotel-backend-1-trhj.onrender.com/banquettingRequisitions';
      const response = await axios.post(endpoint, formData);
      console.log('Banquetting requisition created:', response.data);

      setFormData({
        itemName: '',
        quantity: '',
        unit: '',
        description: '',
        date: '',
        department: '',
        status: ''
      });
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Banquetting Requisition Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Autocomplete
          options={items}
          getOptionLabel={(option) => option.name || ''} 
          value={items.find(item => item.name === formData.itemName) || null}
          onChange={handleItemNameChange}
          isOptionEqualToValue={(option, value) => option.name === value}
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
            <MenuItem value="Food Production">Food Production</MenuItem>
          </Select>
          <FormHelperText>Select the department for the requisition.</FormHelperText>
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
          <FormHelperText>Select the current status of the requisition.</FormHelperText>
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

export default BanquettingRequisitionForm;
