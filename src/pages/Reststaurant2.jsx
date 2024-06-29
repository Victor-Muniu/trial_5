import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';
import { Circle, Timer } from '@mui/icons-material';
import { green, orange, blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

function Reststaurant2() {
  const [data, setData] = useState([]);
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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {data.map((table, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${getColor(table.status)}` }}>
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

export default Reststaurant2;
