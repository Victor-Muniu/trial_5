import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Button, TextField, MenuItem, Modal, Fade, Backdrop, Card 
} from '@mui/material';

function Purchases() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [showAddForm, setShowAddForm] = useState(false); // State for showing the add form/card
  const [newPurchase, setNewPurchase] = useState({
    category: '',
    vendor: '',
    quantity: '',
    price: '',
    date: '',
    amount: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/consolidated-purchases');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
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

      const fetchData = async () => {
        try {
          const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/consolidated-purchases');
          setData(response.data);
        } catch (error) {
          console.error('Error fetching updated data:', error);
        }
      };
      fetchData();

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleAddPurchases = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
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
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/consolidated-purchases', {
        category: newPurchase.category,
        vendor: newPurchase.vendor,
        quantity: parseInt(newPurchase.quantity),
        price: parseFloat(newPurchase.price),
        date: newPurchase.date,
        amount: parseFloat(newPurchase.amount)
      });

      console.log('Purchase added successfully:', response.data);

      const fetchData = async () => {
        try {
          const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/consolidated-purchases');
          setData(response.data);
        } catch (error) {
          console.error('Error fetching updated data:', error);
        }
      };
      fetchData();

      setNewPurchase({
        category: '',
        vendor: '',
        quantity: '',
        price: '',
        date: '',
        amount: ''
      });

      setShowAddForm(false); // Close the form after successful submission
    } catch (error) {
      console.error('Error adding purchase:', error.message);
      // Handle specific errors here if needed
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
      }
    }
  };

  // Function to group purchases by month and year with vendor details
  const groupPurchasesByMonthYear = () => {
    const groupedData = {};
    data.forEach(row => {
      const date = new Date(row.date);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Example format: "7-2024"
      const key = `${monthYear}_${row.vendor}`; // Unique key combining monthYear and vendor
      if (!groupedData[key]) {
        groupedData[key] = {
          monthYear,
          vendor: row.vendor,
          totalAmount: 0
        };
      }
      groupedData[key].totalAmount += row.amount;
    });
    return Object.values(groupedData);
  };

  // Grouped data by month and year with vendor
  const groupedPurchases = groupPurchasesByMonthYear();

  return (
    <Box padding={3}>
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
            value="category"
            style={{ marginRight: 8 }}
          >
            <MenuItem value="category">Category</MenuItem>
          </TextField>
          <Button variant="contained" color="primary">Update</Button>
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
      <Box mb={3}>
        <Button variant="contained" color="primary" onClick={handleAddPurchases}>
          Add Purchases
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Typography variant="h6" gutterBottom margin={5}>
          Purchase by Category
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom margin={5}>
          Between {new Date(startDate).toLocaleDateString()} and {new Date(endDate).toLocaleDateString()}
        </Typography>

        <Table aria-label="expense table">
          <TableHead>
            <TableRow>
              <TableCell>Month-Year</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedPurchases.map((group) => (
              <TableRow key={`${group.monthYear}_${group.vendor}`}>
                <TableCell>{group.monthYear}</TableCell>
                <TableCell>{group.vendor}</TableCell>
                <TableCell>{group.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Add Purchases Form */}
      <Modal
        open={showAddForm}
        onClose={handleCloseAddForm}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showAddForm}>
          <Card style={{ padding: 20, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Typography variant="h5" gutterBottom>Add Purchases</Typography>
            <TextField label="Category" name="category" value={newPurchase.category} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Vendor" name="vendor" value={newPurchase.vendor} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Quantity" name="quantity" type="number" value={newPurchase.quantity} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Price" name="price" type="number" value={newPurchase.price} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Date" name="date" type="date" value={newPurchase.date} onChange={handleInputChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Amount" name="amount" type="number" value={newPurchase.amount} onChange={handleInputChange} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          </Card>
        </Fade>
      </Modal>
    </Box>
  );
}

export default Purchases;
