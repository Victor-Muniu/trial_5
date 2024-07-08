import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const AgentsAnalytics = () => {
  const [data, setData] = useState([]);
  const [groupCounts, setGroupCounts] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/reservations');
        const responseData = response.data;
        setData(responseData);

        const counts = responseData.reduce((acc, reservation) => {
          acc[reservation.group_name] = (acc[reservation.group_name] || 0) + 1;
          return acc;
        }, {});

        setGroupCounts(counts);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <Typography variant="h6" gutterBottom>Agents Analytics</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Group Name</TableCell>
              <TableCell align="right">Number of Jobs Brought</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupCounts).map(([groupName, count]) => (
              <TableRow key={groupName}>
                <TableCell component="th" scope="row">{groupName}</TableCell>
                <TableCell align="right">{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AgentsAnalytics;
