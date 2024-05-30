import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  TextField,
  Typography,
  Button,
  Tooltip,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CreditorsList = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Function to fetch general data
    const fetchGeneralData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/creditors');
            const data = response.data;
            setData(data);
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };

    // Function to fetch filtered data based on search query
    const fetchFilteredData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/creditors/by-supplier/${searchQuery}`);
            const data = response.data;
            setData(data);
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchGeneralData();
    }, []); // Fetch general data on component mount

    // Fetch data when search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            fetchGeneralData(); // If search query is empty, fetch general data
        } else {
            fetchFilteredData(); // If search query is not empty, fetch filtered data
        }
    }, [searchQuery]);

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle" component="div">
            Creditors
          </Typography>
          <Tooltip title="Search Supplier">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search for Supplier..."
              InputProps={{
                startAdornment: (
                  <SearchIcon position="start" />
                ),
              }}
              style={{ marginLeft: 16 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Tooltip>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                  />
                </TableCell>
                <TableCell>Supplier Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Requisition Id</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.requisitionID}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CreditorsList;
