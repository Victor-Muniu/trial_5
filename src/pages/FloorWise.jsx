import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

const scheduleData = [
  { room: '302', schedule: [{ name: 'Ayyaz Baig', start: '2024-05-24', end: '2024-05-25', color: 'red' }, { name: 'Shahzad', start: '2023-07-24', end: '2023-07-24', color: 'green' }] },
  { room: '303', schedule: [{ name: 'Tasawar', start: '2024-05-26', end: '2024-05-27', color: 'blue' }] },
];

const getColor = (color) => {
  switch (color) {
    case 'red':
      return '#ffcccc';
    case 'green':
      return '#ccffcc';
    case 'blue':
      return '#ccccff';
    default:
      return '#ffffff';
  }
};

const FloorWise = () => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 5)); // Adjust this if you want the week to start from a different day
  const daysOfWeek = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return date;
  });

  const formatDate = (date) => date.toISOString().split('T')[0];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rooms</TableCell>
            {daysOfWeek.map((date, index) => (
              <TableCell key={index}>{date.toDateString().split(' ').slice(0, 3).join(', ')}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {scheduleData.map((roomData) => (
            <TableRow key={roomData.room}>
              <TableCell>{roomData.room}</TableCell>
              {daysOfWeek.map((date, index) => {
                const dateString = formatDate(date);
                const schedule = roomData.schedule.find(
                  (s) => s.start <= dateString && s.end >= dateString
                );
                return (
                  <TableCell key={index} style={{ padding: 0 }}>
                    {schedule && (
                      <Box
                        sx={{
                          backgroundColor: getColor(schedule.color),
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {schedule.name}
                      </Box>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FloorWise