import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Modal,
  Box,
  TextField
} from '@mui/material';

function Suppliers() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState({
    name: '',
    Kra_pin: '',
    Vat_no: '',
    address: '',
    zip_code: '',
    contact_person: '',
    credit_limit: '',
    email: '',
    telephone_no: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Retrieve user role from localStorage
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/suppliers');
        const data = response.data;
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier({
      ...supplier,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://hotel-backend-1-trhj.onrender.com/suppliers', supplier);
      setData([...data, supplier]);
      handleClose();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSuppliers = data.filter((supplier) => {
    // Ensure supplier.name exists and convert both to lowercase before comparing
    return supplier.name && supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" gutterBottom>
        Suppliers
      </Typography>
      {(userRole === 'admin' || userRole === 'accounting' || userRole === 'procurement') && (
        <Button variant="contained" onClick={handleOpen}>
          Add Supplier
        </Button>
      )}

      <TextField
        label="Search by Supplier Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>KRA Pin</TableCell>
            <TableCell>VAT No</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Zip Code</TableCell>
            <TableCell>Contact Person</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Credit Limit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSuppliers.map((supplier, index) => (
            <TableRow key={index}>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.Kra_pin}</TableCell>
              <TableCell>{supplier.Vat_no}</TableCell>
              <TableCell>{supplier.address}</TableCell>
              <TableCell>{supplier.zip_code}</TableCell>
              <TableCell>{supplier.contact_person}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.telephone_no}</TableCell>
              <TableCell>{supplier.credit_limit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            opacity: 0.9
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Supplier
          </Typography>
          <TextField label="Name" name="name" value={supplier.name} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="KRA Pin" name="Kra_pin" value={supplier.Kra_pin} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="VAT No" name="Vat_no" value={supplier.Vat_no} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Address" name="address" value={supplier.address} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Zip Code" name="zip_code" value={supplier.zip_code} onChange={handleChange} fullWidth margin="normal" />
          <TextField
            label="Contact Person"
            name="contact_person"
            value={supplier.contact_person}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Credit Limit"
            name="credit_limit"
            value={supplier.credit_limit}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField label="Email" name="email" value={supplier.email} onChange={handleChange} fullWidth margin="normal" />
          <TextField
            label="Telephone No"
            name="telephone_no"
            value={supplier.telephone_no}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {userRole === 'admin' && (
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
              Submit
            </Button>
          )}
        </Box>
      </Modal>
    </TableContainer>
  );
}

export default Suppliers;
