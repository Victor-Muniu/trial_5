import React from 'react'
import {
    Container,
    Typography,
    Grid,
    TextField,
    Box,
    Button
} from '@mui/material';

function Laundry() {
  return (
    <Container>
        <Typography variant="h4" gutterBottom>
                Laundry Service
            </Typography>
            <Grid container spacing={2}>
                
                <Grid item xs={6}>
                    <TextField
                        type='date'
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Remarks"
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Rate"
                        fullWidth
                        type='number'
                        required
                    />
                </Grid>

                

            </Grid>
            <Box marginTop={5}>
                <Button variant="contained" color="primary" fullWidth >Submit</Button>
            </Box>
    </Container>
  )
}

export default Laundry