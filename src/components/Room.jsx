import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Chip,
  Box,
  Modal,
  Backdrop,
  Fade
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GestInfo from './common/GestInfo';
import Service from './common/Service';

const Room = () => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);  
  const [open2, setOpen2] = useState(false);
  const [selectedRoomNo, setSelectedRoomNo] = useState('');  
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/rooms');
        const data = response.data;
        console.log(data);
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };

    getData();
  }, []);

  const handleReservation = (roomId) => {
    navigate(`/checkin`);
  };

  const handleGlance = (roomNo) => {
    setSelectedRoomNo(roomNo);
    setOpen(true);
  };

  const handleService = (roomNo) => {
    setSelectedRoomNo(roomNo)
    setOpen2(true)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = () =>{
    setOpen2(false)
  }
  const getChipColor = (room) => {
    if (room.clean === 'No' || room.damage_report !== 'None') {
      return 'error'; 
    }
    return room.vacancy === 'Vacant' ? 'success' : 'primary'; 
  };

  const getChipLabel = (room) => {
    if (room.clean === 'No' || room.damage_report !== 'None') {
      return 'Damaged or Dirty';
    }
    return room.vacancy;
  };

  const shouldShowReserveButton = (room) => {
    return room.vacancy === 'Vacant' && room.clean === 'Yes' && room.damage_report === 'None';
  };

  const shouldShowGlanceButton = (room) => {
    return room.vacancy === 'Occupied';
  };

  const shouldShowServiceButton = (room) => {
    return room.vacancy === 'Occupied';
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Room Booking
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Check-In Date"
              value={checkInDate}
              onChange={(newValue) => setCheckInDate(newValue)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Check-Out Date"
              value={checkOutDate}
              onChange={(newValue) => setCheckOutDate(newValue)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Room Type"
            select
            fullWidth
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Studio">Studio</MenuItem>
            <MenuItem value="1 Bedroom">1 Bedroom</MenuItem>
            <MenuItem value="2 Bedrooms">2 Bedrooms</MenuItem>
            <MenuItem value="3 Bedrooms">3 Bedrooms</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth>
            Search
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        All Rooms
      </Typography>
      <Grid container spacing={2}>
        {data.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room._id}>
            <Card>
              <CardHeader title={`E. ${room.room_no}`} />
              <CardContent>
                <Typography variant="body2">
                  Block: {room.block}
                </Typography>
                <Typography variant="body2">
                  Clean: {room.clean}
                </Typography>
                <Typography variant="body2">
                  Damage Report: {room.damage_report}
                </Typography>
              </CardContent>
              <CardActions>
                <Chip label={getChipLabel(room)} color={getChipColor(room)} />
                {shouldShowReserveButton(room) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReservation(room._id)}
                  >
                    Reserve
                  </Button>
                )}
                {shouldShowGlanceButton(room) && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleGlance(room.room_no)}
                  >
                    Glance
                  </Button>
                )}
                {shouldShowServiceButton(room) && (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleService(room.room_no)}
                  >
                    Service
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '80%', 
            bgcolor: 'background.paper', 
            boxShadow: 24, 
            p: 4 ,
            overflowY: 'true'
          }}>
            <GestInfo room_no={selectedRoomNo} />
          </Box>
        </Fade>
      </Modal>


      <Modal
        open={open2}
        onClose={handleClose2}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open2}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '80%', 
            bgcolor: 'background.paper', 
            boxShadow: 24, 
            p: 4 ,
            overflowY: 'true'
          }}>
            <Service room_no={selectedRoomNo}/>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default Room;
