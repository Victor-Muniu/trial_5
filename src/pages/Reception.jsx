import { CurrencyExchange, MonetizationOn, MoreHoriz } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
function Reception() {
  const [data, setData] = useState([])
  const [revenue, setRevenue] = useState(0)
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/reservation-bills')
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with axios', error)
      }
    }
    getData();
  }, [])

  useEffect(() => {
    const calculateRevenue = () => {
      const totalRevenue = data.reduce((acc, bill) => acc + parseFloat(bill.total_amount || 0), 0);
      setRevenue(totalRevenue);
    };
    calculateRevenue();
  }, [data]);

  


  return (
    <Box >
      <Typography marginTop={1} padding={2} variant="h4" fontWeight='bold'>Dashboard</Typography>
      <Box display='flex' width='full' marginTop={1}>
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-around'>
          <Box display='flex' width='full'>
            <Box width='25rem' margin={2} sx={{
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
            }}>
              <Typography padding={2} gap={6} sx={{ cursor: 'pointer' }}>Our Sales </Typography>

              <MoreHoriz sx={{ marginLeft: 2 }} />
              <Box padding={2.5} gap={6} display='flex' alignItems='center'>
                <Box display='flex' alignItems='center'>
                    <CurrencyExchange sx={{marginRight: 1}}/>
                    <Typography variant='h6'>Room Sales</Typography>
                </Box>
                <Typography>{data.length}</Typography>
              </Box>
            </Box>
            <Box width='25rem' margin={2} sx={{
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
            }}>
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

    </Box>
  )
}

export default Reception