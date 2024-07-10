import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField } from '@mui/material';
import axios from 'axios';
import { Circle, Timer } from '@mui/icons-material';
import { green, orange, blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

function Restaurant2() {
  const [data, setData] = useState([]);
  const [newTable, setNewTable] = useState({ table_no: '', status: '', restaurant: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/tables');
        const data = response.data;
        console.log(data);
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const getColor = (status) => {
    switch (status) {
      case 'Available':
        return green[500];
      case 'Occupied':
        return orange[500];
      default:
        return blue[500];
    }
  };

  const handleAssign = (table_no) => {
    navigate(`/menu/${table_no}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTable({ ...newTable, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/tables', newTable);
      setData([...data, response.data]);
      setNewTable({ table_no: '', status: '', restaurant: '' });
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  // Function to check if user is admin
  const isAdmin = () => {
    const role = localStorage.getItem('role');
    return role === 'admin';
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {isAdmin() && (
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Table Number"
              name="table_no"
              value={newTable.table_no}
              onChange={handleChange}
              required
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Status"
              name="status"
              value={newTable.status}
              onChange={handleChange}
              required
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Restaurant Name"
              name="restaurant"
              value={newTable.restaurant}
              onChange={handleChange}
              required
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Table
            </Button>
          </Box>
        </form>
      )}
      <Grid container spacing={3}>
        {data.map((table, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                borderTop: `4px solid ${getColor(table.status)}`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Typography variant="h6">Table: {table.table_no}</Typography>
              <Typography variant="body1">Restaurant Name: {table.restaurant}</Typography>
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ my: 1 }}>
                <Timer sx={{ mr: 1 }} />
                <Typography variant="body2">{table.time || '00m00s'}</Typography>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                <Circle sx={{ color: getColor(table.status), mr: 1 }} />
                <Typography variant="body2" sx={{ color: getColor(table.status) }}>
                  {table.status}
                </Typography>
              </Box>
              {table.status === 'Available' && (
                <Button variant="contained" color="success" onClick={() => handleAssign(table.table_no)}>
                  Assign
                </Button>
              )}
              {table.status === 'Occupied' && (
                <>
                  <Button variant="contained" color="warning" sx={{ mt: 1, mb: 1 }}>
                    Generate Bill
                  </Button>
                  <Button variant="contained" color="primary">
                    Produce KOT
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Restaurant2;
