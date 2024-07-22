import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Dialog, DialogContent, DialogTitle, Box } from '@mui/material';
import axios from 'axios';

function Payment_Voucher() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/payment-vouchers');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrintClick = async (voucherId) => {
    try {
      const response = await axios.get(`https://hotel-backend-1-trhj.onrender.com/payment-vouchers/${voucherId}`);
      setSelectedVoucher(response.data);
      setOpen(true);
    } catch (err) {
      setError(err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVoucher(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom align="center">
        Payment Vouchers
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Creditors ID</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Authorized By</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Print</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((voucher) => (
            <TableRow key={voucher._id}>
              <TableCell>{voucher._id}</TableCell>
              <TableCell>{voucher.creditorsId[0]}</TableCell>
              <TableCell>{voucher.amount}</TableCell>
              <TableCell>{voucher.authorizedBy}</TableCell>
              <TableCell>{voucher.status}</TableCell>
              <TableCell>
                {voucher.status === 'Authorized' && (
                  <Button variant="contained" color="primary" onClick={() => handlePrintClick(voucher._id)}>
                    Print
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedVoucher && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogContent style={{ opacity: 0.9 }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Typography variant="h4" gutterBottom>Payment Voucher</Typography>
              <Typography variant="h5" gutterBottom>EPASHIKINO RESORT & SPA LTD</Typography>
              <Typography variant="h6" gutterBottom>Dealers in: Hotel, Accomodation & Confrences Services</Typography>
              <Typography variant="h6" gutterBottom>PIN No: P051626100V</Typography>
            </div>
            <Box display='flex' justifyContent='space-between' >
                <div style={{textAlign: 'left', padding: '20px', display:'flex', flexDirection: 'column'}}>
                <Typography variant='body' gutterBottom>P.O BOX 12328-20100</Typography> 
                <Typography variant='body' gutterBottom>NAKURU</Typography> 
                <Typography variant='body' gutterBottom>ALONG NAKURU-NAIROBI HIGHWAY</Typography>
                <Typography variant='body' gutterBottom>Payment Voucher No: </Typography>

                <br />
                <Typography variant='body' gutterBottom>FUND FROM:  </Typography>
                <Typography>PAID TO: </Typography>
                </div>
                <div style={{textAlign: 'left', padding: '20px', display:'flex', flexDirection: 'column'}}>
                <Typography variant='body' gutterBottom>TEL/FAX : 0705455001, 0788455001</Typography> 
                <Typography variant='body' gutterBottom>Email: info@epashikinoresort.com</Typography> 
                <Typography variant='body' gutterBottom>Date: {new Date(selectedVoucher.authorizationDate).toLocaleDateString()}</Typography>
                
                </div>
            </Box>
            <div style={{ borderTop: '1px solid #ccc', marginTop: '20px', paddingTop: '20px' }}>
              <Typography variant="h6" gutterBottom>Creditors</Typography>
              <ul>
                {selectedVoucher.creditorsId.map(creditorId => (
                  <li key={creditorId}>{creditorId}</li>
                ))}
              </ul>
            </div>
            <div style={{ borderTop: '1px solid #ccc', marginTop: '20px', paddingTop: '20px' }}>
              <Typography variant="h6" gutterBottom>Total Amount</Typography>
              <Typography>KSH {selectedVoucher.amount} </Typography>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </TableContainer>
  );
}

export default Payment_Voucher;
