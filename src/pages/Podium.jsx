import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Avatar } from '@mui/material';
import { styled } from '@mui/system';

// Styled components
const PodiumContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  padding: '20px',
});

const LeaderboardTable = styled(TableContainer)({
  width: '80%',
});

const PodiumItem = styled(TableRow)({
  textAlign: 'center',
  '&:nth-of-type(odd)': {
    backgroundColor: '#f3f3f3',
  },
});

const PodiumAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  marginRight: '10px',
});

function Podium() {
  const [staffSales, setStaffSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const restaurantResponse = await axios.get('https://hotel-backend-zrv3.onrender.com/restaurantOrders');
        const clubResponse = await axios.get('https://hotel-backend-zrv3.onrender.com/clubBills');
        
        const restaurantOrders = restaurantResponse.data;
        const clubOrders = clubResponse.data;

        const salesData = {};

        // Process restaurant orders
        restaurantOrders.forEach(order => {
          const staffName = order.staffName || 'Unknown Staff';
          if (!salesData[staffName]) {
            salesData[staffName] = 0;
          }
          salesData[staffName] += order.total || 0;
        });

        // Process club orders
        clubOrders.forEach(order => {
          const staffName = order.staffName || 'Unknown Staff';
          if (!salesData[staffName]) {
            salesData[staffName] = 0;
          }
          salesData[staffName] += order.amount || 0;
        });

        const sortedSales = Object.entries(salesData)
          .map(([staffName, totalSales]) => ({ staffName, totalSales }))
          .sort((a, b) => b.totalSales - a.totalSales);

        setStaffSales(sortedSales);
        setLoading(false);
      } catch (error) {
        console.error('There was a problem fetching the sales data:', error);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <PodiumContainer>
      <Typography variant="h4" sx={{ mb: 2 }}>Sales Podium</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <LeaderboardTable component={Box} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Total Sales</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffSales.map((staff, index) => (
                <PodiumItem key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PodiumAvatar>{staff.staffName[0]}</PodiumAvatar>
                      {staff.staffName}
                    </Box>
                  </TableCell>
                  <TableCell>Ksh {staff.totalSales.toLocaleString()}</TableCell>
                </PodiumItem>
              ))}
            </TableBody>
          </Table>
        </LeaderboardTable>
      )}
    </PodiumContainer>
  );
}

export default Podium;
