import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Typography,
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Box,
  TableCell,
  TableHead,
  Table,
  TableRow,
  TableBody,
  TextField,
} from '@mui/material';
import ReactToPrint from 'react-to-print';

const invoiceContainerStyle = {
  fontFamily: "'Arial', sans-serif",
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
  border: '1px solid #ddd',
  borderRadius: '5px',
};

const printStyle = {
  '@media print': {
    '@page': {
      size: 'A4',
      margin: '10mm',
    },
    body: {
      margin: '0',
    },
    '#printableArea': {
      margin: '0 auto',
      border: 'none',
    },
    '.MuiDialogContent-root': {
      padding: '0',
    },
    '.MuiDialog-paper': {
      boxShadow: 'none',
      margin: '0',
    },
    '.invoice-table': {
      width: '100%',
      borderCollapse: 'collapse',
    },
    '.invoice-table th, .invoice-table td': {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
    },
    '.invoice-total': {
      float: 'right',
    },
    '.totalStyle': {
      fontWeight: 'bold',
      textAlign: 'right',
      marginTop: '20px',
    },
  },
};

function BanquettingInvoice() {
  const [data, setData] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    booking_no: '',
    discount: '',
    price: '',
    packs: '',
    Totalamount: ''
  });
  const banquettingInvoiceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/banquettinginvoices');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching banquetting invoices:', error);
      }
    };
    fetchData();
  }, []);

  const handleFetchData = async (id) => {
    try {
      const response = await axios.get(`https://hotel-backend-1-trhj.onrender.com/banquettinginvoices/${id}`);
      setInvoiceData(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error fetching invoice data:', error);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const preparedFormData = {
        booking_no: formData.booking_no,
        discount: formData.discount.split(',').map(Number),
        price: formData.price.split(',').map(Number),
        packs: formData.packs.split(',').map(Number),
      };
      if (formData.Totalamount) {
        preparedFormData.Totalamount = Number(formData.Totalamount);
      }
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/banquettinginvoices', preparedFormData);
      setData([...data, response.data]);
      setCreateDialogOpen(false);
      setFormData({
        booking_no: '',
        discount: '',
        price: '',
        packs: '',
        Totalamount: ''
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString(undefined, options);
  };

  const fname = localStorage.getItem('fname');
  const lname = localStorage.getItem('lname');

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <TableContainer sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Banquetting Invoices
      </Typography>
      <Button variant="contained" onClick={() => setCreateDialogOpen(true)}>
        Create Invoice
      </Button>
      <TableContainer component={Paper} sx={{ width: '100%', marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Workshop Name</TableCell>
              <TableCell>Prices</TableCell>
              <TableCell>Packs</TableCell>
              <TableCell>Total Amount (Ksh)</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((invoice) => (
              <TableRow key={invoice.invoiceId}>
                <TableCell>{invoice.banquettingDetails.booking_no}</TableCell>
                <TableCell>{invoice.banquettingDetails.name}</TableCell>
                <TableCell>{invoice.banquettingDetails.workshopName}</TableCell>
                <TableCell>{invoice.price.join(', ')}</TableCell>
                <TableCell>{invoice.packs.join(', ')}</TableCell>
                <TableCell>{invoice.Totalamount}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleFetchData(invoice.invoiceId)}>
                    Print Invoice
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {invoiceData && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogContent>
            <Box id="printableArea" sx={{ ...invoiceContainerStyle, ...printStyle }} ref={banquettingInvoiceRef}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">EPASHIKINO RESORT & SPA</Typography>
                  <Typography>Dealers in: Hotel Accommodation & Conference Services</Typography>
                  <Typography sx={{ marginBottom: '10px' }}>PIN No: P051626100V</Typography>
                  <Typography sx={{ marginBottom: '10px' }}>
                    Client: <strong>{invoiceData.name}</strong>
                    <br />
                    Workshop name: {invoiceData.workshopName}
                  </Typography>
                  <Typography>Date: {getCurrentDate()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                  <Typography sx={{ marginBottom: '10px' }}>
                    TEL/FAX: 0705455001, 0788455001
                    <br />
                    Email: info@epashikinoresort.com
                    <br />
                    Date: {getCurrentDate()}
                    <br />
                    Transaction no: {invoiceData.booking_no}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd', margin: '20px 0' }}>
                    <Table className="invoice-table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item Description</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Paxs</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoiceData.prices.map((price, index) => (
                          <TableRow key={index}>
                            <TableCell>{invoiceData.package}</TableCell>
                            <TableCell align="right">{price}</TableCell>
                            <TableCell align="right">{invoiceData.packs[index]}</TableCell>
                            <TableCell align="right">{invoiceData.packs[index] * price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Typography>
                      <span className="invoice-total">Total Amount {invoiceData.Totalamount}</span>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Sub Total <span className="invoice-total">{invoiceData.Totalamount}</span>
                  </Typography>
                </Grid>
              </Grid>
              <Typography sx={{ marginTop: '10px' }}>Prepared by: {fname} {lname}</Typography>
              <Typography sx={{ marginTop: '10px' }}>
                <strong>Thank you for choosing us. Welcome again</strong>
              </Typography>
            </Box>
            <ReactToPrint
              trigger={() => <Button variant="contained" sx={{ marginTop: '20px' }}>Print</Button>}
              content={() => banquettingInvoiceRef.current}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create Invoice</DialogTitle>
        <DialogContent>
          <TextField
            label="Booking No"
            name="booking_no"
            value={formData.booking_no}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Discount"
            name="discount"
            value={formData.discount}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Packs"
            name="packs"
            value={formData.packs}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Total Amount"
            name="Totalamount"
            value={formData.Totalamount}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleCreateInvoice} sx={{ marginTop: '20px' }}>
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </TableContainer>
  );
}

export default BanquettingInvoice;
