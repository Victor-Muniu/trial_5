import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Grid, Paper, Typography, Select, MenuItem, TextField, Button, FormControl, InputLabel, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

function Rooms() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState({
    room_no: '',
    block: '',
    vacancy: '',
    clean: '',
    damage_report: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/rooms');
        setData(response.data);
        setFilteredData(response.data); // Set filtered data initially to all rooms
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const getColor = (room) => {
    if (room.vacancy === 'Vacant' && room.clean === 'Yes' && room.damage_report === 'None') {
      return 'green';
    } else if (room.vacancy === 'Occupied' && room.clean === 'Yes' && room.damage_report === 'None') {
      return 'blue';
    } else if (room.damage_report !== 'None') {
      return 'red';
    } else if (room.vacancy === 'Occupied' && room.clean === 'No' && room.damage_report === 'None') {
      return 'yellow';
    }
    return 'default';
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/rooms/${id}`);
      setData(data.filter(room => room._id !== id));
      setFilteredData(filteredData.filter(room => room._id !== id)); // Update filtered data as well
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedRoom._id) {
        await axios.patch(`https://hotel-backend-1-trhj.onrender.com/rooms/${selectedRoom._id}`, selectedRoom);
        setData(data.map(room => (room._id === selectedRoom._id ? selectedRoom : room)));
        setFilteredData(filteredData.map(room => (room._id === selectedRoom._id ? selectedRoom : room))); // Update filtered data as well
      } else {
        const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/rooms', selectedRoom);
        setData([...data, response.data]);
        setFilteredData([...filteredData, response.data]); // Update filtered data as well
      }
      setOpen(false);
      setSelectedRoom({
        room_no: '',
        block: '',
        vacancy: '',
        clean: '',
        damage_report: ''
      });
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedRoom({ ...selectedRoom, [name]: value });
  };

  const handleAddNewRoom = () => {
    setSelectedRoom({
      room_no: '',
      block: '',
      vacancy: '',
      clean: '',
      damage_report: ''
    });
    setOpen(true);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredData(data.filter(room => room.room_no.toString().includes(query)));
  };

  const renderRoomsByBlock = (block) => {
    return filteredData.filter(room => room.block === block).map((room) => (
      <Grid item xs={12} md={4} key={room._id}>
        <Paper elevation={3} style={{ padding: '20px', borderColor: getColor(room), borderStyle: 'solid' }}>
          <Typography variant="h6">No. {room.room_no}</Typography>
          <Typography variant="h6">Block. {room.block}</Typography>
          <Typography variant="body2">Vacant: {room.vacancy}</Typography>
          <Typography variant="body1">Clean: {room.clean}</Typography>
          <Typography variant="body2">Damage: {room.damage_report}</Typography>
          {(role === 'admin' || role === 'housekeeping' || role === 'super admin') && (
            <>
              <IconButton color="primary" onClick={() => handleEdit(room)}>
                <Edit />
              </IconButton>
              <IconButton color="secondary" onClick={() => handleDelete(room._id)}>
                <Delete />
              </IconButton>
            </>
          )}
        </Paper>
      </Grid>
    ));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Room Status
      </Typography>
      {(role === 'admin' || role === 'housekeeping') && (
        <Button variant="contained" color="primary" onClick={handleAddNewRoom}>Add New Room</Button>
      )}

      <TextField
        label="Search Rooms"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <Typography variant="h5" style={{ marginTop: '20px' }}>Block A</Typography>
      <Grid container spacing={3} style={{ marginTop: '10px' }}>
        {renderRoomsByBlock('A')}
      </Grid>

      <Typography variant="h5" style={{ marginTop: '20px' }}>Block B</Typography>
      <Grid container spacing={3} style={{ marginTop: '10px' }}>
        {renderRoomsByBlock('B')}
      </Grid>

      <Typography variant="h5" style={{ marginTop: '20px' }}>Block C</Typography>
      <Grid container spacing={3} style={{ marginTop: '10px' }}>
        {renderRoomsByBlock('C')}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{selectedRoom._id ? 'Edit Room' : 'Add New Room'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the room details.
          </DialogContentText>
          <TextField
            margin="dense"
            name="room_no"
            label="Room Number"
            type="number"
            fullWidth
            value={selectedRoom.room_no}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="block"
            label="Block"
            type="text"
            fullWidth
            value={selectedRoom.block}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Vacancy</InputLabel>
            <Select
              name="vacancy"
              value={selectedRoom.vacancy}
              onChange={handleChange}
            >
              <MenuItem value="Vacant">Vacant</MenuItem>
              <MenuItem value="Occupied">Occupied</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Clean</InputLabel>
            <Select
              name="clean"
              value={selectedRoom.clean}
              onChange={handleChange}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="damage_report"
            label="Damage Report"
            type="text"
            fullWidth
            value={selectedRoom.damage_report}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Rooms;
