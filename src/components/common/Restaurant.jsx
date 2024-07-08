import React, { useState, useEffect } from 'react';
import { Avatar, Box, Grid, IconButton, Paper, TextField, Typography, TableContainer, Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material';
import { MoreVert, Search } from '@mui/icons-material';
import RestCard from './RestCard';
import BarCard from './BarCard';
import { CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

function Restaurant() {
    const fname = localStorage.getItem('fname');
    const lname = localStorage.getItem('lname');
    
    const [clubData, setClubData] = useState([]);
    const [restaurantData, setRestaurantData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [topMenuItems, setTopMenuItems] = useState([]);

    const getClubData = async () => {
        try {
            const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/clubOrders');
            return response.data;
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };

    const getRestaurantData = async () => {
        try {
            const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/restaurantOrders');
            return response.data;
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };

    const formatDataForChart = (clubData, restaurantData) => {
        const months = Array.from({ length: 12 }, (v, k) => dayjs().month(k).format('MMMM'));

        const clubSalesData = months.map((month, index) => {
            const monthlyOrders = clubData.filter(order => dayjs(order.date).month() === index);
            return {
                month,
                clubSales: monthlyOrders.length,
                clubRevenue: monthlyOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0),
            };
        });

        const restaurantSalesData = months.map((month, index) => {
            const monthlyOrders = restaurantData.filter(order => dayjs(order.date).month() === index);
            return {
                month,
                restaurantSales: monthlyOrders.length,
                restaurantRevenue: monthlyOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0),
            };
        });

        const combinedData = months.map((month, index) => ({
            month,
            clubSales: clubSalesData[index].clubSales,
            clubRevenue: clubSalesData[index].clubRevenue,
            restaurantSales: restaurantSalesData[index].restaurantSales,
            restaurantRevenue: restaurantSalesData[index].restaurantRevenue,
        }));

        return combinedData;
    };

    const getTopMenuItems = (data) => {
        const menuItemMap = {};

        data.forEach(order => {
            const { menuId, quantity, amount } = order;
            if (menuId && menuId.name) {
                if (menuItemMap[menuId.name]) {
                    menuItemMap[menuId.name].quantity += quantity;
                    menuItemMap[menuId.name].revenue += amount;
                } else {
                    menuItemMap[menuId.name] = {
                        quantity: quantity || 0,
                        revenue: amount || 0,
                        pointOfSale: menuId.point_of_sale || 'Unknown'
                    };
                }
            }
        });

        console.log('Menu Item Map:', menuItemMap); // Log the menu item map for debugging

        const menuItems = Object.keys(menuItemMap).map(name => ({
            name,
            quantity: menuItemMap[name].quantity,
            revenue: menuItemMap[name].revenue,
            pointOfSale: menuItemMap[name].pointOfSale
        }));

        menuItems.sort((a, b) => b.quantity - a.quantity);

        console.log('Top Menu Items:', menuItems); // Log the top menu items

        return menuItems.slice(0, 5);
    };

    useEffect(() => {
        const fetchData = async () => {
            const clubData = await getClubData();
            const restaurantData = await getRestaurantData();
            console.log('Club Data:', clubData); // Log fetched club data
            console.log('Restaurant Data:', restaurantData); // Log fetched restaurant data
            setClubData(clubData || []);
            setRestaurantData(restaurantData || []);
            const formattedData = formatDataForChart(clubData || [], restaurantData || []);
            setChartData(formattedData);
            const allData = [...(clubData || []), ...(restaurantData || [])];
            const topItems = getTopMenuItems(allData);
            console.log('Top Menu Items After Processing:', topItems); // Log top items after processing
            setTopMenuItems(topItems);
        };
        fetchData();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, p: 0 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h4'>Welcome Back {fname} {lname}</Typography>
                    <Box display='flex' alignItems='center'>
                        <Avatar sx={{ ml: 2 }} />
                        <IconButton>
                            <MoreVert />
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='space-between' alignItems='center'>
                    <TextField variant='outlined' placeholder='Search...' InputProps={{ startAdornment: <Search /> }} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <RestCard />
                </Grid>
                <Grid item xs={12} md={4}>
                    <BarCard />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper>
                        <Typography variant='subtitle2'>Sales on Both Bar and Restaurant</Typography>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="clubSales" stroke="#8884d8" name="Club Sales" />
                                <Line type="monotone" dataKey="clubRevenue" stroke="#82ca9d" name="Club Revenue" />
                                <Line type="monotone" dataKey="restaurantSales" stroke="#ffc658" name="Restaurant Sales" />
                                <Line type="monotone" dataKey="restaurantRevenue" stroke="#ff7300" name="Restaurant Revenue" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper>
                        <Typography>Top Menu Items Sold</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Menu Item</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Revenue Generated</TableCell>
                                        <TableCell>Point Of Sale</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topMenuItems.length > 0 ? (
                                        topMenuItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.revenue}</TableCell>
                                                <TableCell>{item.pointOfSale}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>No data available</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Restaurant;
