import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Paper, Typography, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Add, Remove, Edit } from '@mui/icons-material';

function Menu() {
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', quantity: '', price: '', point_of_sale: 'Restaurant' });
  const [editMenuItem, setEditMenuItem] = useState({ _id: '', name: '', quantity: '', price: '', point_of_sale: 'Restaurant' });
  const { table_no } = useParams();
  const fname = localStorage.getItem('fname');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/menus');
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
      items: orders.map(order => ({
        menuName: order.name,
        quantity: order.quantity
      })),
      staffName: fname,
      table_no: table_no,
      remarks: remarks || 'none',
      date: new Date().toISOString()
    };

    console.log("Submitting order data:", JSON.stringify(orderData, null, 2)); 

    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/restaurantOrders', orderData);
      console.log("Order submitted successfully", response.data);
      alert('Order submitted successfully');
      setOrders([]); // Clear the current orders after successful submission
    } catch (error) {
      console.error('There was a problem submitting the order:', error);
    }
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem({ ...newMenuItem, [name]: value });
  };

  const handleSubmitMenu = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/menus', newMenuItem);
      setData([...data, response.data]);
      setNewMenuItem({ name: '', quantity: '', price: '', point_of_sale: 'Restaurant' });
      handleCloseAdd();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleOpenEdit = (item) => {
    setEditMenuItem(item);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditMenuItem({ ...editMenuItem, [name]: value });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`https://hotel-backend-1-trhj.onrender.com/menus/${editMenuItem._id}`, editMenuItem);
      const updatedData = data.map(item => (item._id === editMenuItem._id ? response.data : item));
      setData(updatedData);
      handleCloseEdit();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '70%', p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Menu for Table {table_no}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenAdd} sx={{ mb: 4 }}>
          Add Menu
        </Button>
        <Grid container spacing={3}>
          {restaurantItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 2, textAlign: 'center', position: 'relative', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body1">Price: Ksh{item.price}</Typography>
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
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Edit />}
                    sx={{ ml: 1 }}
                    onClick={() => handleOpenEdit(item)}
                  >
                    Edit
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
          {orders.length === 0 ? (
            <Typography variant="body1">No items in the order</Typography>
          ) : (
            orders.map((order, index) => (
              <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body1">{order.name} x {order.quantity}</Typography>
                <Typography variant="body1">Ksh {order.total}</Typography>
              </Box>
            ))
          )}
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" color="primary" onClick={handleSubmitOrder} fullWidth>
            Submit Order
          </Button>
        </Paper>
      </Box>

      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add Menu Item</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={newMenuItem.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="text"
            fullWidth
            name="quantity"
            value={newMenuItem.quantity}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Price"
            type="text"
            fullWidth
            name="price"
            value={newMenuItem.price}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitMenu} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Menu Item</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={editMenuItem.name}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="text"
            fullWidth
            name="quantity"
            value={editMenuItem.quantity}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            label="Price"
            type="text"
            fullWidth
            name="price"
            value={editMenuItem.price}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Menu;
