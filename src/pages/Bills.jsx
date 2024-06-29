import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function Bills() {
    const [data, setData] = useState([]);
    const [billType, setBillType] = useState('restaurant'); // Default to restaurant bills
    const fname = localStorage.getItem('fname');

    useEffect(() => {
        const getData = async () => {
            try {
                const endpoint = billType === 'restaurant' 
                    ? `https://hotel-backend-1-trhj.onrender.com/restaurantBills/byStaff/${fname}`
                    : `https://hotel-backend-1-trhj.onrender.com/clubBills/byStaff/${fname}`;
                
                const response = await axios.get(endpoint);
                const bills = response.data;
                console.log(bills);
                // Filter out bills with status "Not cleared"
                const filteredBills = bills.filter(bill => bill.status === 'Not cleared');
                setData(filteredBills);
            } catch (error) {
                console.error('There was a problem with the axios operation:', error);
            }
        };
        getData();
    }, [fname, billType]);

    return (
        <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="bill-type-label">Bill Type</InputLabel>
                <Select
                    labelId="bill-type-label"
                    id="bill-type-select"
                    value={billType}
                    label="Bill Type"
                    onChange={(e) => setBillType(e.target.value)}
                >
                    <MenuItem value="restaurant">Restaurant</MenuItem>
                    <MenuItem value="club">Club</MenuItem>
                </Select>
            </FormControl>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((bill, index) => (
                            <TableRow key={index}>
                                <TableCell>{new Date(bill.date).toLocaleString()}</TableCell>
                                <TableCell>{bill.amount}</TableCell>
                                <TableCell>{bill.menuName}</TableCell>
                                <TableCell>{bill.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Bills;
