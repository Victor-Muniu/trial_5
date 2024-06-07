import React, { useEffect, useState } from 'react'
import axios from 'axios';
import dayjs from 'dayjs';
import { Paper, Typography } from '@mui/material';
function RestCard() {
    const [data, setData] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [month, setMonth]=useState()
    const [year, setYear] = useState()

    const getData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/restaurantOrders`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };

    const calculateSalesAndRevenue = (data) => {
        const currentMonth = dayjs().month() + 1; 
        const currentYear = dayjs().year(); 
        console.log("Current month:", currentMonth); 
        console.log("Current year:", currentYear); 
        const currentDate = dayjs();
        setMonth(currentDate.format("MMMM"));
        setYear(currentYear)
        let sales = 0;
        let revenue = 0;
    
        data.forEach(order => {
            const orderDate = dayjs(order.date); 
            console.log("Order date month:", orderDate.month() + 1); 
            console.log("Order date year:", orderDate.year()); 
            if ((orderDate.month() + 1) === currentMonth && orderDate.year() === currentYear) { 
                
                const price = parseFloat(order.amount);
                const quantity = parseFloat(order.quantity);
    
                if (!isNaN(price) && !isNaN(quantity)) {
                    sales =data.length;
                    revenue += price ;
                } else {
                    console.warn("Invalid price or quantity:", order.price, order.quantity);
                }
            }
        });
    
        setTotalSales(sales);
        setTotalRevenue(revenue);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData();
            setData(result);
            calculateSalesAndRevenue(result);
        };
        fetchData();
    }, []);

  return (
    <Paper sx={{ p: 2 }}>
        <Typography variant='subtitle2'>Restaurant Sales and Revenue</Typography>
        <Typography variant='body1'>Total Sales: {totalSales}</Typography>
        <Typography variant='body1'>Total Revenue: {totalRevenue.toFixed(2)}</Typography>
        <Typography variant='caption'>From {month} Year {year}</Typography>
    </Paper>
  )
}

export default RestCard