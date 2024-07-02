import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CustomCalendar.css'; // Custom CSS file for additional styling
import { Card, CardContent, Typography } from '@mui/material';
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

  useEffect(() => {
    const fetchBanquettingData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/banquettings');
        const data = response.data;

        const transformedEvents = data.flatMap((item) => {
          const [start, end] = item.reservedDates;
          return {
            title: `${item.name} - ${item.workshopName} | ${item.package_type} | Packs: ${item.packs}`,
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

    fetchBanquettingData();
  }, []);

  return (
    <StyledCard>
      <Typography variant="h6">Banquetting Schedule</Typography>
      <CardContent>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 900 }}
        />
      </CardContent>
    </StyledCard>
  );
};

export default Banquetting;
