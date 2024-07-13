import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Modal, Backdrop, Fade } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Ammenities = () => {
  // State for Ammenities
  const [ammenities, setAmmenities] = useState([]);
  const [ammenitiesName, setAmmenitiesName] = useState('');
  const [price, setPrice] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [editingAmmenity, setEditingAmmenity] = useState(null);
  const [showAmmenityForm, setShowAmmenityForm] = useState(false); 

  const [orders, setOrders] = useState([]);
  const [staffName, setStaffName] = useState('');
  const [orderAgeGroup, setOrderAgeGroup] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false); 

  useEffect(() => {
    fetchAmmenities();
    fetchOrders();
  }, []);

  // Fetch Ammenities
  const fetchAmmenities = async () => {
    try {
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/ammenities');
      setAmmenities(response.data);
    } catch (error) {
      console.error('Error fetching ammenities:', error);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/ammenitiesOrders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Handle Ammenity Form Submission
  const handleAmmenitySubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingAmmenity) {
        const response = await axios.patch(`https://hotel-backend-1-trhj.onrender.com/ammenities/${editingAmmenity._id}`, { name: ammenitiesName, price, age_group: ageGroup });
        setAmmenities(ammenities.map(a => (a._id === editingAmmenity._id ? response.data : a)));
        setEditingAmmenity(null);
      } else {
        const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/ammenities', { name: ammenitiesName, price, age_group: ageGroup });
        setAmmenities([...ammenities, response.data]);
      }
      setAmmenitiesName('');
      setPrice('');
      setAgeGroup('');
      setShowAmmenityForm(false); // Close the Ammenity form after submission
    } catch (error) {
      console.error('Error saving ammenity:', error);
    }
  };

  // Handle Ammenities Order Form Submission
  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/ammenitiesOrders', {
        ammenitiesName,
        staffName,
        age_group: orderAgeGroup,
        quantity,
        date: new Date().toISOString() // Assuming date is auto-generated on server side
      });
      setOrders([...orders, response.data]);
      setShowOrderForm(false); // Close the Ammenities Order form after submission
      // Clear form fields
      setAmmenitiesName('');
      setStaffName('');
      setOrderAgeGroup('');
      setQuantity(0);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  // Handle Edit Ammenity
  const handleEditAmmenity = (ammenity) => {
    setAmmenitiesName(ammenity.name);
    setPrice(ammenity.price);
    setAgeGroup(ammenity.age_group);
    setEditingAmmenity(ammenity);
    setShowAmmenityForm(true); // Show the Ammenity form for editing
  };

  // Handle Delete Ammenity
  const handleDeleteAmmenity = async (id) => {
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/ammenities/${id}`);
      setAmmenities(ammenities.filter(a => a._id !== id));
    } catch (error) {
      console.error('Error deleting ammenity:', error);
    }
  };

  // Handle Delete Ammenities Order
  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/ammenitiesOrders/${id}`);
      setOrders(orders.filter(order => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Get role from localStorage
  const role = localStorage.getItem('role');

  return (
    <div>
      {/* Add Ammenity Button (Visible for Admin) */}
      {role === 'admin' && (
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '16px', marginRight: '16px' }}
          onClick={() => setShowAmmenityForm(true)}
        >
          Add Ammenity
        </Button>
      )}

      {/* Ammenity Form Modal */}
      <Modal
        open={showAmmenityForm}
        onClose={() => setShowAmmenityForm(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showAmmenityForm}>
          <Paper style={{ padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <form onSubmit={handleAmmenitySubmit}>
              <Box mb={2}>
                <TextField
                  label="Name"
                  value={ammenitiesName}
                  onChange={(e) => setAmmenitiesName(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Age Group"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Button type="submit" variant="contained" color="primary">
                {editingAmmenity ? 'Update Ammenity' : 'Add Ammenity'}
              </Button>
            </form>
          </Paper>
        </Fade>
      </Modal>

      {/* Ammenities Table */}
      <TableContainer component={Paper} style={{ marginTop: '16px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Age Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ammenities.map((ammenity) => (
              <TableRow key={ammenity._id}>
                <TableCell>{ammenity.name}</TableCell>
                <TableCell>{ammenity.price}</TableCell>
                <TableCell>{ammenity.age_group}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditAmmenity(ammenity)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteAmmenity(ammenity._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Ammenities Order Form */}
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '16px', marginLeft: '16px' }}
        onClick={() => setShowOrderForm(true)}
      >
        Post Order
      </Button>

      {/* Ammenities Order Form Modal */}
      <Modal
        open={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showOrderForm}>
          <Paper style={{ padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <form onSubmit={handleOrderSubmit}>
              <Box mb={2}>
                <TextField
                  label="Ammenities Name"
                  value={ammenitiesName}
                  onChange={(e) => setAmmenitiesName(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Staff Name"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Age Group"
                  value={orderAgeGroup}
                  onChange={(e) => setOrderAgeGroup(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
              </Box>
              <Button type="submit" variant="contained" color="primary">
                Place Order
              </Button>
            </form>
          </Paper>
        </Fade>
      </Modal>
      
      {/* Ammenities Orders Table */}
      <TableContainer component={Paper} style={{ marginTop: '16px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ammenities Name</TableCell>
              <TableCell>Staff Name</TableCell>
              <TableCell>Age Group</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.ammenitiesId.name}</TableCell>
                <TableCell>{order.staffId.fname} {order.staffId.lname}</TableCell>
                <TableCell>{order.age_group}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteOrder(order._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Ammenities;
