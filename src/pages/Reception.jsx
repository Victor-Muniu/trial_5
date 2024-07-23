import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { CurrencyExchange, MonetizationOn, MoreHoriz } from '@mui/icons-material';

function Reception() {
  const [data, setData] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [lineChartData, setLineChartData] = useState({ categories: [], series: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch reservation bills data
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/reservation-bills');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with axios', error);
        setError('Failed to fetch reservation bills data');
      }
    };
    getData();
  }, []);

  useEffect(() => {
    // Calculate total revenue
    const calculateRevenue = () => {
      const totalRevenue = data.reduce((acc, bill) => acc + parseFloat(bill.total_amount || 0), 0);
      setRevenue(totalRevenue);
    };
    calculateRevenue();
  }, [data]);

  useEffect(() => {
    // Fetch sales data and prepare data for the line chart
    const getSalesData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/sales');
        const salesData = response.data;
        
        console.log('Sales Data:', salesData); // Log the sales data
        
        if (salesData && salesData.length > 0) {
          // Get the reservationsBillsId from reservation data
          const reservationBillsIds = data.map(bill => bill._id);
          console.log('Reservation Bills IDs:', reservationBillsIds);

          // Initialize monthly sales data
          const monthlySales = new Array(12).fill(0);

          salesData.forEach(item => {
            const date = new Date(item.createdAt);
            const month = date.getMonth();
            const amount = parseFloat(item.amount);

            // Process sales only if reservationsBillsId matches
            if (reservationBillsIds.includes(item.reservationsBillsId)) {
              console.log('Processing item:', { date, month, amount });
              if (!isNaN(month) && month >= 0 && month < 12) {
                monthlySales[month] += amount;
              }
            }
          });

          // Prepare data for the line chart
          const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const series = [{ name: 'Reservation Sales', data: monthlySales }];

          console.log('Monthly Sales Data:', monthlySales); // Log the processed sales data
          setLineChartData({ categories, series });
        } else {
          console.error('No sales data found');
          setError('No sales data found');
        }
      } catch (error) {
        console.error('There was a problem fetching sales data', error);
        setError('Failed to fetch sales data');
      }
    };
    getSalesData();
  }, [data]);

  const lineChartOptions = {
    chart: { type: 'line' },
    xaxis: { categories: lineChartData.categories },
    tooltip: { x: { format: 'MMM' } },
    colors: ['#00E396'],
    stroke: { curve: 'smooth' },
    legend: { position: 'top' }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography marginTop={1} padding={2} variant="h4" fontWeight='bold'>Dashboard</Typography>
      <Box display='flex' width='full' marginTop={1}>
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-around'>
          <Box display='flex' width='full'>
            <Box width='25rem' margin={2} sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}>
              <Typography padding={2} gap={6} sx={{ cursor: 'pointer' }}>Our Sales </Typography>
              <MoreHoriz sx={{ marginLeft: 2 }} />
              <Box padding={2.5} gap={6} display='flex' alignItems='center'>
                <Box display='flex' alignItems='center'>
                    <CurrencyExchange sx={{ marginRight: 1 }} />
                    <Typography variant='h6'>Room Sales</Typography>
                </Box>
                <Typography>{data.length}</Typography>
              </Box>
            </Box>
            <Box width='25rem' margin={2} sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}>
              <Typography padding={2} gap={6} sx={{ cursor: 'pointer' }}>Our Revenue </Typography>
              <MoreHoriz sx={{ marginLeft: 2 }} />
              <Box padding={2.5} gap={6} display='flex' alignItems='center'>
                <Box display='flex' alignItems='center'>
                  <MonetizationOn sx={{ marginRight: 1 }} />
                  <Typography variant="h6">Room Revenue</Typography>
                </Box>
                <Typography>Ksh {revenue}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '100%', marginTop: '20px' }}>
        <Chart
          options={lineChartOptions}
          series={lineChartData.series}
          type="line"
          height={400}
        />
      </Box>
    </Box>
  );
}

export default Reception;
