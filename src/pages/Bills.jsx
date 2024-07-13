import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function Bills() {
    const [data, setData] = useState([]);
    const [billType, setBillType] = useState('restaurant'); 
    const [selectedBill, setSelectedBill] = useState(null);
    const [open, setOpen] = useState(false);
    const fname = localStorage.getItem('fname');
    const role = localStorage.getItem('role'); 

    useEffect(() => {
        const getData = async () => {
            try {
                let endpoint = '';
                if (role === 'front office') {
                    endpoint = billType === 'restaurant' 
                        ? 'https://hotel-backend-1-trhj.onrender.com/restaurantBills'
                        : 'https://hotel-backend-1-trhj.onrender.com/clubBills';
                } else {
                    endpoint = billType === 'restaurant' 
                        ? `https://hotel-backend-1-trhj.onrender.com/restaurantBills/byStaff/${fname}`
                        : `https://hotel-backend-1-trhj.onrender.com/clubBills/byStaff/${fname}`;
                }
                
                const response = await axios.get(endpoint);
                const bills = response.data;
                const filteredBills = bills.filter(bill => bill.status === 'Not cleared');
                setData(filteredBills);
            } catch (error) {
                console.error('There was a problem with the axios operation:', error);
            }
        };
        getData();
    }, [fname, billType, role]);

    const handleEditClick = (bill) => {
        setSelectedBill(bill);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBill(null);
    };

    const handleSave = async () => {
        try {
            const endpoint = billType === 'restaurant' 
                ? `https://hotel-backend-1-trhj.onrender.com/restaurantBills/${selectedBill._id}`
                : `https://hotel-backend-1-trhj.onrender.com/clubBills/${selectedBill._id}`;
    
            await axios.patch(endpoint, selectedBill);
            let billsEndpoint = '';
            if (role === 'front office') {
                billsEndpoint = billType === 'restaurant' 
                    ? 'https://hotel-backend-1-trhj.onrender.com/restaurantBills'
                    : 'https://hotel-backend-1-trhj.onrender.com/clubBills';
            } else {
                billsEndpoint = billType === 'restaurant' 
                    ? `https://hotel-backend-1-trhj.onrender.com/restaurantBills/byStaff/${fname}`
                    : `https://hotel-backend-1-trhj.onrender.com/clubBills/byStaff/${fname}`;
            }
    
            const response = await axios.get(billsEndpoint);
            const bills = response.data;
            const filteredBills = bills.filter(bill => bill.status === 'Not cleared');
            setData(filteredBills);
    
            setOpen(false);
            setSelectedBill(null);
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedBill({ ...selectedBill, [name]: value });
    };

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
                            {role === 'front office' && <TableCell>Edit</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((bill, index) => (
                            <TableRow key={index}>
                                <TableCell>{new Date(bill.date).toLocaleString()}</TableCell>
                                <TableCell>{bill.amount}</TableCell>
                                <TableCell>{bill.menuName}</TableCell>
                                <TableCell>{bill.status}</TableCell>
                                {role === 'front office' && (
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleEditClick(bill)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Bill</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please edit the details of the bill.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        value={selectedBill?.amount || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="menuName"
                        label="Item Name"
                        type="text"
                        fullWidth
                        value={selectedBill?.menuName || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="status"
                        label="Status"
                        type="text"
                        fullWidth
                        value={selectedBill?.status || ''}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Bills;
