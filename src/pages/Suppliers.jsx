import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button,
  Modal, Box, TextField
} from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  opacity: 0.9,
};

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
    email: '',
    telephone_no: ''
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/suppliers');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/suppliers', supplier);
      setData([...data, response.data]);
      handleClose();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Supplier
      </Button>
      <TableContainer component={Paper}>
        <Typography variant="h6" component="div" gutterBottom>
          Suppliers
        </Typography>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((supplier) => (
              <TableRow key={supplier._id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.Kra_pin}</TableCell>
                <TableCell>{supplier.Vat_no}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>{supplier.zip_code}</TableCell>
                <TableCell>{supplier.contact_person}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.telephone_no}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Add Supplier
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={supplier.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="Kra_pin"
              label="KRA Pin"
              name="Kra_pin"
              autoComplete="Kra_pin"
              value={supplier.Kra_pin}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="Vat_no"
              label="VAT No"
              name="Vat_no"
              autoComplete="Vat_no"
              value={supplier.Vat_no}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              value={supplier.address}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="zip_code"
              label="Zip Code"
              name="zip_code"
              autoComplete="zip_code"
              value={supplier.zip_code}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="contact_person"
              label="Contact Person"
              name="contact_person"
              autoComplete="contact_person"
              value={supplier.contact_person}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={supplier.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="telephone_no"
              label="Telephone No"
              name="telephone_no"
              autoComplete="telephone_no"
              value={supplier.telephone_no}
              onChange={handleChange}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
              Add Supplier
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default Suppliers;
