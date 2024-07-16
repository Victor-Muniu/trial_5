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
  const banquettingInvoiceRef = useRef(null); // Correctly initialize useRef

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

  const getCurrentDate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString(undefined, options);
  };

  const fname = localStorage.getItem('fname');
  const lname = localStorage.getItem('lname');

  return (
    <TableContainer sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Banquetting Invoices
      </Typography>
      <TableContainer component={Paper} sx={{ width: '100%' }}>
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
                    Sub Total <span style={{ float: 'right' }}>{invoiceData.Totalamount}</span>
                  </Typography>
                  <Typography>
                    VAT <span style={{ float: 'right' }}>0.00</span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography className="totalStyle">Total {invoiceData.Totalamount}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ textAlign: 'right' }}>
                    Served by: <strong>{fname} {lname}</strong>
                    <br />
                    Note: PROVISION OF {invoiceData.package} SERVICES
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <ReactToPrint
              trigger={() => <Button variant="contained">Print</Button>}
              content={() => banquettingInvoiceRef.current}
              pageStyle="@media print { body { margin: 0; } }"
            />
          </DialogContent>
        </Dialog>
      )}
    </TableContainer>
  );
}

export default BanquettingInvoice;
