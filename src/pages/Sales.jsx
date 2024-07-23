import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Chart from 'react-apexcharts';
import axios from 'axios';

function Sales() {
  const [chartsData, setChartsData] = useState([]);
  const [areaChartData, setAreaChartData] = useState({ categories: [], series: [] });
  const [categoryTotals, setCategoryTotals] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://hotel-backend-1-trhj.onrender.com/sales')
      .then(response => {
        if (response.data) {
          const categories = {
            amenities: new Array(12).fill(0),
            restaurant: new Array(12).fill(0),
            roomService: new Array(12).fill(0),
            bar: new Array(12).fill(0),
            curio: new Array(12).fill(0),
            laundry: new Array(12).fill(0)
          };

          const totals = {
            amenities: 0,
            restaurant: 0,
            roomService: 0,
            bar: 0,
            curio: 0,
            laundry: 0
          };

          response.data.forEach(item => {
            const date = new Date(item.createdAt);
            const month = date.getMonth();
            const amount = item.amount;

            let category = 'restaurant'; // Default to restaurant if no other category

            if (item.ammenitiesId) {
              category = 'amenities';
            } else if (item.restaurantOrderId) {
              category = 'restaurant';
            } else if (item.roomServiceId) {
              category = 'roomService';
            } else if (item.clubOrderId) {
              category = 'bar';
            } else if (item.curioId) {
              category = 'curio'
            } else if (item.laundryServiceId) {
              category = 'laundry'
            }

            if (categories[category] && !isNaN(month) && month >= 0 && month < 12) {
              categories[category][month] += amount;
              totals[category] += amount; // Update totals
            }
          });

          // Prepare data for donut charts
          const donutChartsData = Object.keys(categories).map(category => ({
            name: category,
            data: categories[category]
          }));
          
          setChartsData(donutChartsData);

          // Prepare data for area chart
          const combinedData = {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: Object.keys(categories).map(category => ({
              name: category.charAt(0).toUpperCase() + category.slice(1) + ' Sales',
              data: categories[category]
            }))
          };

          setAreaChartData(combinedData);
          setCategoryTotals(totals); // Set category totals
        } else {
          console.error('No data found in response');
          setError('No data found in response');
        }
      })
      .catch(error => {
        console.error('Error fetching sales data:', error);
        setError('Error fetching sales data');
      });
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const areaChartOptions = {
    chart: { type: 'area' },
    xaxis: { categories: areaChartData.categories },
    tooltip: { x: { format: 'MMM' } },
    colors: ['#00E396', '#FF4560', '#008FFB', '#ffA500', '#743089', '#C19A6B'], 
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
    stroke: { curve: 'smooth' },
    legend: { position: 'top' }
  };

  return (
    <Box display='flex' flexDirection='column' flexWrap='wrap' alignItems='center'>
      
      <Box 
        display='flex' 
        flexDirection='row' 
        flexWrap='wrap' 
        justifyContent='center' 
        sx={{ gap: 2, marginBottom: '20px' }} 
      >
        {chartsData.length > 0 ? (
          chartsData.map((chart, index) => (
            <Box 
              key={index} 
              display='flex' 
              flexDirection='column' 
              alignItems='center' 
              sx={{ 
                width: '18rem', 
                margin: '10px', 
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', 
                padding: 1, 
                backgroundColor: 'white'
              }}
            >
              <Chart
                options={{
                  chart: { type: 'donut' },
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  responsive: [{ breakpoint: 480, options: { chart: { width: 100 }, legend: { position: 'bottom' } } }]
                }}
                series={chart.data}
                type="donut"
              />
              <Typography variant='body2' sx={{ marginTop: '10px' }}>
                {`Total ${chart.name.charAt(0).toUpperCase() + chart.name.slice(1)} Sales`}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No data available for donut charts.</Typography>
        )}
      </Box>

      {/* Table with Category Totals */}
      <Box sx={{ width: '100%', marginTop: '20px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">Category</Typography></TableCell>
                <TableCell align="right"><Typography variant="h6">Total Amount</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(categoryTotals).map((category) => (
                <TableRow key={category}>
                  <TableCell>{category.charAt(0).toUpperCase() + category.slice(1)}</TableCell>
                  <TableCell align="right">{categoryTotals[category].toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Single Area Chart */}
      <Box sx={{ width: '100%', marginTop: '20px' }}>
        <Chart
          options={areaChartOptions}
          series={areaChartData.series}
          type="area"
          height={300} 
        />
      </Box>
    </Box>
  );
}

export default Sales;
