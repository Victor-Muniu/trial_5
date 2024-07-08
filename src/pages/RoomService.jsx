import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, CircularProgress, TextField, Button, Snackbar } from '@mui/material';

function RoomService() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservationID, setReservationID] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/reservations');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/reservation-bills', {
        reservationID,
        package_price: packagePrice.split(',').map(Number), // Convert comma-separated string to array of numbers
      });
      setSnackbarMessage('Reservation bill posted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error posting reservation bill');
      setSnackbarOpen(true);
      console.error('There was a problem with the axios operation:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h6">Reservations</Typography>
      <Grid container spacing={3}>
        {data.map((reservation, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={3} style={{ padding: '20px', borderColor: 'green', borderStyle: 'solid' }}>
            <Typography variant="h6">Reservation No: {reservation._id}</Typography>
              <Typography variant="body2">
                {reservation.type === 'individual'
                  ? `${reservation.individual.fname} ${reservation.individual.lname}`
                  : reservation.group.map((g, i) => (
                      <span key={i}>{`${g.fname} ${g.lname}`}{i < reservation.group.length - 1 ? ', ' : ''}</span>
                    ))}
              </Typography>
              <Typography variant="body2">Room No: {reservation.room_no.join(', ')}</Typography>
              <Typography variant="body2">Check-in Date: {new Date(reservation.checkIndate).toLocaleDateString()}</Typography>
              <Typography variant="body2">Check-out Date: {new Date(reservation.checkOutdate).toLocaleDateString()}</Typography>
              <Typography variant="body2">Package Type: {reservation.package_type.join(', ')}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" style={{ marginTop: '20px' }}>Post Reservation Bill</Typography>
      <TextField
        label="Reservation ID"
        value={reservationID}
        onChange={(e) => setReservationID(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Package Price (comma-separated)"
        value={packagePrice}
        onChange={(e) => setPackagePrice(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '10px' }}>
        Submit
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default RoomService;
