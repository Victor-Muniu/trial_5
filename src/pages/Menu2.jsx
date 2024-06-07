import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Add, Remove } from '@mui/icons-material';

function Menu2() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/menus');
        const data = response.data;
        console.log(data);
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const { table_no } = useParams();

  const restaurantItems = data.filter(item => item.point_of_sale === 'Bar');

  return (
    <Box sx={{ display: 'flex', }}>
      
      <Box sx={{ width: '70%', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Menu for Table {table_no}
      </Typography>
        <Grid container spacing={3}>
          {restaurantItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body1">Price: ${item.price}</Typography>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Remove />}
                    sx={{ mr: 1, bgcolor: blue[500], color: 'white' }}
                  >
                    Minus
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    sx={{ bgcolor: blue[500], color: 'white' }}
                  >
                    Plus
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Menu2;
