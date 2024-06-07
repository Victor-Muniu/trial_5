import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

function Bills() {
    const [data, setData] = useState([]);
    const fname = localStorage.getItem('fname');

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/restaurantBills/byStaff/${fname}`);
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
    }, [fname]);

    return (
        <Box>
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
                        {data.map((bill,index) => (
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
