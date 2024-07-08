import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Paper } from '@mui/material';

const RoomAnalysis = () => {
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentWeek, setCurrentWeek] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const reservationsResponse = await axios.get('https://hotel-backend-1-trhj.onrender.com/reservations');
        setData(reservationsResponse.data);

        const roomsResponse = await axios.get('https://hotel-backend-1-trhj.onrender.com/rooms');
        setRooms(roomsResponse.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getCurrentWeek = () => {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      const week = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date.toISOString().split('T')[0];
      });

      setCurrentWeek(week);
    };
    getCurrentWeek();
  }, []);

  const renderReservations = (roomNo, date) => {
    const reservations = data.filter(res => 
      res.room_no.includes(roomNo) && res.checkIndate <= date && res.checkOutdate >= date
    );
    return reservations.map((res, index) => (
      <Paper key={index} style={{ padding: '4px', margin: '2px', backgroundColor: 'lightblue' }}>
        {res.individual ? `${res.individual.fname} ${res.individual.lname}` : res.group.map(g => `${g.fname} ${g.lname}`).join(', ')}
      </Paper>
    ));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Room Analysis</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Typography variant="h6">Rooms</Typography>
            </Grid>
            {currentWeek.map((date, index) => (
              <Grid item xs key={index}>
                <Typography variant="h6">{new Date(date).toDateString()}</Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {rooms.map((room, roomIndex) => (
          <Grid item xs={12} key={roomIndex}>
            <Paper style={{ padding: '10px' }}>
              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <Typography variant="h6">{`Room No: ${room.room_no}`}</Typography>
                </Grid>
                {currentWeek.map((date, dateIndex) => (
                  <Grid item xs key={dateIndex}>
                    {renderReservations(room.room_no, date)}
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RoomAnalysis;
