import React from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button
} from '@mui/material';


const AddLedger = () => {
  

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
                Add Ledger
            </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
          <TextField
              fullWidth
              type='date'
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Category"
              
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Amount"
              type='number'
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Description"
            
            />
          </Grid>
          
         
          
          <Grid item xs={6}>
            <Button variant="outlined" fullWidth >
              Add Ledger
            </Button>
          </Grid>
          
        </Grid>
      </Box>
    </Container>
  );
};

export default AddLedger;