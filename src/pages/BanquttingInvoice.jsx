import React, { useRef } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Box, Typography, TextField, TableCell, TableRow, TableBody, TableHead, Table, TableContainer, Paper } from '@mui/material';
import axios from 'axios';
import InvoicePrint from './InvoicePrint'; // Update the import path as needed

function BanquettingInvoice() {
  const [data, setData] = React.useState([]);
  const [groupedData, setGroupedData] = React.useState([]);
  const [selectedInvoices, setSelectedInvoices] = React.useState([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    booking_no: '',
    discount: '',
    price: '',
    packs: '',
    Totalamount: '',
  });
  const banquettingInvoiceRef = useRef(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/banquettinginvoices');
        setData(response.data);
        groupInvoices(response.data);
      } catch (error) {
        console.error('Error fetching banquetting invoices:', error);
      }
    };
    fetchData();
  }, []);

  const groupInvoices = (invoices) => {
    const grouped = invoices.reduce((acc, invoice) => {
      const name = invoice.banquettingDetails.name;
      if (!acc[name]) {
        acc[name] = {
          name: name,
          totalAmount: 0,
          invoices: [],
        };
      }
      acc[name].totalAmount += invoice.Totalamount;
      acc[name].invoices.push(invoice);
      return acc;
    }, {});

    setGroupedData(Object.values(grouped));
  };

  const handleRowClick = (invoices) => {
    setSelectedInvoices(invoices);
    setDialogOpen(true);
  };

  const handleCreateInvoice = async () => {
    try {
      const preparedFormData = {
        booking_no: formData.booking_no,
        discount: formData.discount.split(',').map(Number),
        price: formData.price.split(',').map(Number),
        packs: formData.packs.split(',').map(Number),
        Totalamount: Number(formData.Totalamount),
      };
      const response = await axios.post('https://hotel-backend-1-trhj.onrender.com/banquettinginvoices', preparedFormData);
      setData([...data, response.data]);
      groupInvoices([...data, response.data]);
      setCreateDialogOpen(false);
      setFormData({
        booking_no: '',
        discount: '',
        price: '',
        packs: '',
        Totalamount: '',
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
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
              <TableCell>Name</TableCell>
              <TableCell>Total Amount (Ksh)</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData.map((group, index) => (
              <TableRow key={index} onClick={() => handleRowClick(group.invoices)}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.totalAmount}</TableCell>
                <TableCell>
                  <Button variant="contained">View Invoices</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Print Invoice Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Banquetting Invoice</DialogTitle>
        <DialogContent dividers>
          {selectedInvoices && (
            <InvoicePrint ref={banquettingInvoiceRef} selectedInvoices={selectedInvoices} fname={fname} lname={lname} />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Invoice</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ padding: 2 }}>
            <TextField
              name="booking_no"
              label="Booking No"
              fullWidth
              margin="normal"
              value={formData.booking_no}
              onChange={handleFormChange}
            />
            <TextField
              name="discount"
              label="Discount (comma-separated)"
              fullWidth
              margin="normal"
              value={formData.discount}
              onChange={handleFormChange}
            />
            <TextField
              name="price"
              label="Price (comma-separated)"
              fullWidth
              margin="normal"
              value={formData.price}
              onChange={handleFormChange}
            />
            <TextField
              name="packs"
              label="Packs (comma-separated)"
              fullWidth
              margin="normal"
              value={formData.packs}
              onChange={handleFormChange}
            />
            <TextField
              name="Totalamount"
              label="Total Amount"
              fullWidth
              margin="normal"
              type="number"
              value={formData.Totalamount}
              onChange={handleFormChange}
            />
          </Box>
        </DialogContent>
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Button variant="contained" onClick={handleCreateInvoice}>Create Invoice</Button>
        </Box>
      </Dialog>
    </TableContainer>
  );
}

export default BanquettingInvoice;
