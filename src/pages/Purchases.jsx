import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, TextField, MenuItem, Modal, Fade, Backdrop, Card } from '@mui/material';

function Purchases() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [showAddForm, setShowAddForm] = useState(false); // State for showing the add form/card

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

      const getData = async () => {
        try {
          const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/consolidated-purchases');
          setData(response.data);
        } catch (error) {
          console.error('There was a problem with fetching updated data:', error);
        }
      };
      getData();
  
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };
  

  const handleAddPurchases = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
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
            <TextField label="Category" fullWidth margin="normal" />
            <TextField label="Quantity" type="number" fullWidth margin="normal" />
            <TextField label="Price" type="number" fullWidth margin="normal" />
            <TextField label="Date" type="date" defaultValue={new Date().toISOString().substr(0, 10)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Vendor" fullWidth margin="normal" />
            <Button variant="contained" color="primary">Submit</Button>
          </Card>
        </Fade>
      </Modal>
    </Box>
  );
}

export default Purchases;
