import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CustomCalendar.css';
import { Card, CardContent, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/system';

const localizer = momentLocalizer(moment);

const StyledCard = styled(Card)({
  width: '100%',
  margin: 'auto',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
  marginTop: '20px',
});

const Banquetting = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    booking_no: '',
    workshopName: '',
    reservedDates: ['', ''],
    checkout: '',
    packs: '',
    package_type: '',
    status: ''
  });

  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchBanquettingData();
  }, []);

  const fetchBanquettingData = async () => {
    try {
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/banquettings');
      const data = response.data;

      const transformedEvents = data.flatMap((item) => {
        const [start, end] = item.reservedDates;
        return {
          id: item._id,
          title: `${item.name} - ${item.workshopName} | ${item.package_type} | Packs: ${item.packs} | ${item.status}`,
          start: new Date(start),
          end: new Date(end),
          allDay: true,
        };
      });

      setEvents(transformedEvents);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdate && selectedEventId) {
        await axios.patch(`https://hotel-backend-1-trhj.onrender.com/banquettings/${selectedEventId}`, formData);
      } else {
        await axios.post('https://hotel-backend-1-trhj.onrender.com/banquettings', formData);
      }
      fetchBanquettingData();
      resetForm();
      setOpen(false);
      setIsUpdate(false);
      setSelectedEventId(null);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedEventId) {
        await axios.delete(`https://hotel-backend-1-trhj.onrender.com/banquettings/${selectedEventId}`);
        fetchBanquettingData();
        resetForm();
        setOpen(false);
        setIsUpdate(false);
        setSelectedEventId(null);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      booking_no: '',
      workshopName: '',
      reservedDates: ['', ''],
      checkout: '',
      packs: '',
      package_type: '',
      status: ''
    });
  };

  const handleUpdateClick = (event) => {
    setSelectedEventId(event.id);
    const [name, workshopDetails] = event.title.split(' - ');
    const [workshopName, rest] = workshopDetails.split(' | ');
    const [packageType, packs] = rest.split(' Packs: ');

    setFormData({
      name,
      booking_no: '',
      workshopName,
      reservedDates: [moment(event.start).format('YYYY-MM-DD'), moment(event.end).format('YYYY-MM-DD')],
      checkout: '',
      packs,
      package_type: packageType,
      status: ''
    });
    setIsUpdate(true);
    setOpen(true);
  };

  return (
    <StyledCard>
      <Typography variant="h6">Banquetting Schedule</Typography>
      <CardContent>
        {role === 'front office' && (
          <Button variant="contained" color="primary" onClick={() => {
            resetForm();
            setIsUpdate(false);
            setOpen(true);
          }}>
            Add Banquetting
          </Button>
        )}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 900 }}
          selectable
          onSelectEvent={role === 'admin' ? handleUpdateClick : null}
        />
      </CardContent>
      <Dialog open={open} onClose={() => setOpen(false)}>
        {role === 'front ofice' && (
          <DialogTitle>{isUpdate ? 'Update Banquetting' : 'Add Banquetting'}</DialogTitle>
        )}
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Booking No"
              value={formData.booking_no}
              onChange={(e) => setFormData({ ...formData, booking_no: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Workshop Name"
              value={formData.workshopName}
              onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Reserved Dates"
              value={formData.reservedDates.join(', ')}
              onChange={(e) => setFormData({ ...formData, reservedDates: e.target.value.split(', ') })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Checkout"
              type="date"
              value={formData.checkout}
              onChange={(e) => setFormData({ ...formData, checkout: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Packs"
              value={formData.packs}
              onChange={(e) => setFormData({ ...formData, packs: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Package Type"
              value={formData.package_type}
              onChange={(e) => setFormData({ ...formData, package_type: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              {role === 'front office' && isUpdate && (
                <Button onClick={handleDelete} color="error">
                  Delete
                </Button>
              )}
              <Button onClick={() => setOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {isUpdate ? 'Update' : 'Submit'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </StyledCard>
  );
};

export default Banquetting;
