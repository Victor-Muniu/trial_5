import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, TextField, MenuItem, Card, CardContent } from '@mui/material';

function Purchases() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [newPurchase, setNewPurchase] = useState({
    category: '',
    vendor: '',
    quantity: '',
    price: '',
    date: '',
    amount: ''
  });
  const [showPurchaseForm, setShowPurchaseForm] = useState(false); // State for showing/hiding purchase form

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/consolidated-purchases');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/upload-consolidated-purchases', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);
      setData([...data, ...response.data]); 
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase({
      ...newPurchase,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/consolidated-purchases', newPurchase);
      setData([...data, response.data]);
      setNewPurchase({
        category: '',
        vendor: '',
        quantity: '',
        price: '',
        date: '',
        amount: ''
      });
      setShowPurchaseForm(false); // Hide the form after submission
    } catch (error) {
      console.error('Error posting purchase:', error.message);
    }
  };

  // Function to group data by vendor and calculate totals
  const getGroupedData = () => {
    const groupedData = {};
    data.forEach((item) => {
      if (!groupedData[item.vendor]) {
        groupedData[item.vendor] = {
          category: item.category,
          vendor: item.vendor,
          totalQuantity: parseInt(item.quantity),
          totalPrice: parseFloat(item.amount)
        };
      } else {
        groupedData[item.vendor].totalQuantity += parseInt(item.quantity);
        groupedData[item.vendor].totalPrice += parseFloat(item.amount);
      }
    });
    return Object.values(groupedData);
  };

  return (
    <Box padding={3}>
      {/* Overlay for purchase form */}
      {showPurchaseForm && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Purchase
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Category"
                  name="category"
                  value={newPurchase.category}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Vendor"
                  name="vendor"
                  value={newPurchase.vendor}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Quantity"
                  name="quantity"
                  value={newPurchase.quantity}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Price"
                  name="price"
                  value={newPurchase.price}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={newPurchase.date}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Amount"
                  name="amount"
                  value={newPurchase.amount}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 16 }}
                >
                  Add Purchase
                </Button>
                <Button
                  onClick={() => setShowPurchaseForm(false)}
                  color="secondary"
                  style={{ marginTop: 16, marginLeft: 16 }}
                >
                  Cancel
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Purchase Report</Typography>
        <Box>
          <Button variant="contained" color="primary" style={{ marginRight: 8 }}>Export to</Button>
          <Button variant="contained" color="primary">Print Report</Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <TextField
            label="Date Range"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: 8 }}
          />
          <Typography style={{ marginRight: 8 }}>to</Typography>
          <TextField
            label="Date Range"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <Typography style={{ marginRight: 8 }}>Group By:</Typography>
          <TextField
            select
            value="vendor"
            style={{ marginRight: 8 }}
          >
            <MenuItem value="vendor">Vendor</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log('Update button clicked')}
          >
            Update
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx, .xls"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFileUpload}
          disabled={!file}
        >
          Upload File
        </Button>
      </Box>
      {/* Button to show/hide purchase form */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowPurchaseForm(true)}
        style={{ marginBottom: 16 }}
      >
        Add Purchase
      </Button>

      <TableContainer component={Paper} style={{ marginTop: 32 }}>
        <Typography variant="h6" gutterBottom margin={5}>
          Purchase by Vendor
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom margin={5}>
          Between {new Date(startDate).toLocaleDateString()} and {new Date(endDate).toLocaleDateString()}
        </Typography>

        <Table aria-label="expense table">
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Total Quantity</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getGroupedData().map((group, index) => (
              <TableRow key={index}>
                <TableCell>{group.vendor || '-'}</TableCell>
                <TableCell>{group.totalQuantity || '-'}</TableCell>
                <TableCell>{group.totalPrice.toFixed(2) || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Purchases;
