import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Select, FormControl, InputLabel, CircularProgress, Card, CardContent, Modal
} from '@mui/material';


function Collections() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [newData, setNewData] = useState({
    date: '',
    float: '',
    cash_paid_out: '',
    total_sales: '',
    total_revenue: '',
    shift: ''
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/dailycollections');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditing(false);
    setCurrentId(null);
    setNewData({
      date: '',
      float: '',
      cash_paid_out: '',
      total_sales: '',
      total_revenue: '',
      shift: ''
    });
  };

  const handleChange = (e) => {
    setNewData({
      ...newData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`https://hotel-backend-1-trhj.onrender.com/dailycollections/${currentId}`, newData);
        setData(data.map((item) => (item._id === currentId ? newData : item)));
      } else {
        const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/dailycollections', newData);
        setData([...data, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleEdit = (item) => {
    setNewData({
      date: new Date(item.date).toISOString().slice(0, 10),
      float: item.float,
      cash_paid_out: item.cash_paid_out,
      total_sales: item.total_sales,
      total_revenue: item.total_revenue,
      shift: item.shift
    });
    setCurrentId(item._id);
    setEditing(true);
    setOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Daily Collections</Typography>

      

      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Add New Entry
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="rgba(0, 0, 0, 0.5)">
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {editing ? 'Edit Collection' : 'Add New Collection'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  value={newData.date}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Float"
                  name="float"
                  value={newData.float}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Cash Paid Out"
                  name="cash_paid_out"
                  value={newData.cash_paid_out}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Total Sales"
                  name="total_sales"
                  value={newData.total_sales}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Total Revenue"
                  name="total_revenue"
                  value={newData.total_revenue}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Shift"
                  name="shift"
                  value={newData.shift}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Modal>

      <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
        <Table aria-label="expense table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Float</TableCell>
              <TableCell>Cash Paid Out</TableCell>
              <TableCell>Total Sales</TableCell>
              <TableCell>Total Revenue</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                <TableCell>{row.float}</TableCell>
                <TableCell>{row.cash_paid_out}</TableCell>
                <TableCell>{row.total_sales}</TableCell>
                <TableCell>{row.total_revenue}</TableCell>
                <TableCell>{row.shift}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(row)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Collections;
