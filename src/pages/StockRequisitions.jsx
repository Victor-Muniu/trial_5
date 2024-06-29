import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,

} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const StockRequisitions = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    supplierName: '',
    quantity: '',
    unit_price: ''
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/requisitions');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data.filter((row) =>
    row.itemId.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://hotel-backend-1-trhj.onrender.com/requisitions', newItem);
      setOpen(false);
      const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/requisitions');
      setData(response.data);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search for..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
            Add Item
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Item ID</TableCell>
                <TableCell>Supplier ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.itemId}</TableCell>
                  <TableCell>{row.supplierId}</TableCell>
                  <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.unit_price}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="itemName"
            label="Item Name"
            type="text"
            fullWidth
            value={newItem.itemName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="supplierName"
            label="Supplier Name"
            type="text"
            fullWidth
            value={newItem.supplierName}
            onChange={handleInputChange}
            
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
           
            value={newItem.quantity}
            onChange={handleInputChange}
          />
            
          
          <TextField
            margin="dense"
            name="unit_price"
            label="Unit Price"
            type="number"
            fullWidth
            value={newItem.unit_price}
            onChange={handleInputChange}
            
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Order</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockRequisitions;
