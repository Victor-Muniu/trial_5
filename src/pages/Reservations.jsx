import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Select, MenuItem, Button, Typography, FormControl, InputLabel, Grid, Box } from '@mui/material';

const Reservations = () => {
   const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    fname: '',
    lname: '',
    national_id: '',
    contact: '',
    email: '',
    checkIndate: '',
    checkOutdate: '',
    package_type: '',
    group_name: '',
    adults: '',
    kids: '',
    room_no: '',
    group: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/rooms');
        setRooms(response.data);
        setFilteredRooms(filterRooms(response.data, searchQuery));
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, [searchQuery]);

  const filterRooms = (rooms, query) => {
    return rooms.filter(room => 
      room.room_no.toString().includes(query) &&
      room.vacancy === 'Available' &&
      room.clean === 'None' &&
      room.damage_report === 'None'
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGroupChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGroup = formData.group.map((member, i) => (
      i === index ? { ...member, [name]: value } : member
    ));
    setFormData({
      ...formData,
      group: updatedGroup,
    });
  };

  const addGroupMember = () => {
    setFormData({
      ...formData,
      group: [...formData.group, { fname: '', lname: '', national_id: '', contact: '', email: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload;
    if (formData.type === 'individual') {
      payload = {
        type: formData.type,
        individual: {
          fname: formData.fname,
          lname: formData.lname,
          national_id: formData.national_id,
          contact: formData.contact,
          email: formData.email
        },
        checkIndate: formData.checkIndate,
        checkOutdate: formData.checkOutdate,
        package_type: formData.package_type,
        group_name: formData.group_name,
        adults: parseInt(formData.adults, 10),
        kids: parseInt(formData.kids, 10),
        room_no: formData.room_no.split(',').map(num => parseInt(num, 10))
      };
    } else {
      payload = {
        type: formData.type,
        group: formData.group.map(member => ({
          fname: member.fname,
          lname: member.lname,
          national_id: member.national_id,
          contact: member.contact,
          email: member.email
        })),
        checkIndate: formData.checkIndate,
        checkOutdate: formData.checkOutdate,
        package_type: formData.package_type,
        group_name: formData.group_name,
        adults: parseInt(formData.adults, 10),
        kids: parseInt(formData.kids, 10),
        room_no: formData.room_no.split(',').map(num => parseInt(num, 10))
      };
    }

    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/reservations', payload);
      console.log('Reservation created:', response.data);
      setFormData({
        type: '',
        fname: '',
        lname: '',
        national_id: '',
        contact: '',
        email: '',
        checkIndate: '',
        checkOutdate: '',
        package_type: '',
        group_name: '',
        adults: '',
        kids: '',
        room_no: '',
        group: []
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <Container maxWidth="100%">
      <Box display="flex" mt={4} p={4} border={1} borderColor="grey.400" borderRadius={4} boxShadow={3}>
        <Box flex={1.5} p={2} border={1} borderColor="grey.300" borderRadius={4} mr={2}>
          <Typography variant="h5" gutterBottom>
            Available Rooms
          </Typography>
          <TextField
            fullWidth
            label="Search Room Number"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Grid container spacing={2}>
            {rooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room._id}>
                <Box p={2} border={1} borderColor="grey.300" borderRadius={4}>
                  <Typography variant="body1">Room No: {room.room_no}</Typography>
                  <Typography variant="body2">Type: {room.block}</Typography>
                  <Typography variant="body2">Status: {room.vacancy}</Typography>
                  <Typography variant="body2">Status: {room.vacancy}</Typography>
                  <Typography variant="body2">Status: {room.clean}</Typography>
                  <Typography variant="body2">Damage: {room.damage_report}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box flex={0.5} p={2} border={1} borderColor="grey.300" borderRadius={4}>
          <Typography variant="h5" gutterBottom>
            Create Reservation
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="individual">Individual</MenuItem>
                    <MenuItem value="group">Group</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="National ID"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              {formData.type === 'group' && formData.group.map((member, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Group Member First Name"
                      name="fname"
                      value={member.fname}
                      onChange={(e) => handleGroupChange(index, e)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Group Member Last Name"
                      name="lname"
                      value={member.lname}
                      onChange={(e) => handleGroupChange(index, e)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Group Member National ID"
                      name="national_id"
                      value={member.national_id}
                      onChange={(e) => handleGroupChange(index, e)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Group Member Contact"
                      name="contact"
                      value={member.contact}
                      onChange={(e) => handleGroupChange(index, e)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Group Member Email"
                      name="email"
                      value={member.email}
                      onChange={(e) => handleGroupChange(index, e)}
                      variant="outlined"
                    />
                  </Grid>
                </React.Fragment>
              ))}
              {formData.type === 'group' && (
                <Grid item xs={12}>
                  <Button variant="contained" color="secondary" onClick={addGroupMember}>
                    Add Group Member
                  </Button>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Check-In Date"
                  type="date"
                  name="checkIndate"
                  value={formData.checkIndate}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Check-Out Date"
                  type="date"
                  name="checkOutdate"
                  value={formData.checkOutdate}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Package Type"
                  name="package_type"
                  value={formData.package_type}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Group Name"
                  name="group_name"
                  value={formData.group_name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adults"
                  type="number"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Kids"
                  type="number"
                  name="kids"
                  value={formData.kids}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Room Numbers (comma-separated)"
                  name="room_no"
                  value={formData.room_no}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default Reservations;
