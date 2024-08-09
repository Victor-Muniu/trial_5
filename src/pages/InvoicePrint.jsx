import React, { useRef } from 'react';
import { Box, Grid, Typography, TableCell, TableRow, TableBody, TableHead, Table, TableContainer } from '@mui/material';

const InvoicePrint = React.forwardRef((props, ref) => {
    const { selectedInvoices, fname, lname } = props;

    const getCurrentDate = () => {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return now.toLocaleDateString(undefined, options);
    };

    const printInvoice = (invoiceId) => {
        const invoiceToPrint = selectedInvoices.find(invoice => invoice.invoiceId === invoiceId);
        if (invoiceToPrint) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Print Invoice</title>');
            printWindow.document.write(`
        <style>
          body { margin: 20px; font-family: Arial, sans-serif; }
          .invoice-table { width: 100%; border-collapse: collapse; }
          .invoice-table th, .invoice-table td { padding: 8px; border: 1px solid #ddd; text-align: right; }
          .invoice-total { font-weight: bold; }
          .header {display: flex; flex-direction: column;  align-items: center; }
          .big {display: flex; flex-direction: row; justify-content: space-between;}
          .small1 {display: flex; flex-direction: column;  align-items: flex-start;}
          .small2 {display: flex; flex-direction: column;  align-items: flex-start;}
        </style>
      `);
            printWindow.document.write('</head><body>');
            printWindow.document.write(document.querySelector(`#invoice-${invoiceId}`).innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    return (
        <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '5px' }}>
            {selectedInvoices.map((invoice) => (
                <Box key={invoice.invoiceId} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <div id={`invoice-${invoice.invoiceId}`}>

                        <Box display='flex' flexDirection='column' alignItems='center' marginBottom={3} width='100%' className='header'>
                            <Typography><strong>EPASHIKINO RESORT & SPA LTD</strong></Typography>
                            <Typography>Dealers in: Hotel Accommodation & Conference Services</Typography>
                            <Typography>PIN No: P051626100V</Typography>
                        </Box>
                        <Grid container spacing={2}>

                            <Box display='flex' flexDirection='row' justifyContent='space-between' className='big'>
                                <Box display='flex' flexDirection='column' className='small1'>
                                    <Typography>P.O BOX 12328-20100
                                        <br />
                                    NAKURU
                                    <br />
                                    ALONG NAKURU-NAIROBI HIGHWAY
                                    </Typography>
                                    <br />
                                    <Typography style={{ marginBottom: '10px' }}>
                                    Client: <strong>{invoice.banquettingDetails.name}</strong>
                                    <br />
                                    Workshop name: {invoice.banquettingDetails.workshopName}
                                </Typography>
                                <Typography>Date: {getCurrentDate()}</Typography>
                                </Box>
                                <Box display='flex' flexDirection='column' marginLeft='3rem' className='small2'>
                                <Typography style={{ marginBottom: '10px' }}>
                                    TEL/FAX: 0705455001, 0788455001
                                    <br />
                                    Email: info@epashikinoresort.com
                                    <br />
                                    Date: {getCurrentDate()}
                                    <br />
                                    Transaction no: {invoice.banquettingDetails.booking_no}
                                </Typography>
                                </Box>
                            </Box>
                            
                            
                            <Grid item xs={12}>
                                <Box style={{ borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd', margin: '20px 0' }}>
                                    <Table className="invoice-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Item Description</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Paxs</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {invoice.price.map((price, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{invoice.banquettingDetails.package}</TableCell>
                                                    <TableCell align="right">{price}</TableCell>
                                                    <TableCell align="right">{invoice.packs[index]}</TableCell>
                                                    <TableCell align="right">{invoice.packs[index] * price}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Typography>
                                        <span className="invoice-total" style={{ fontWeight: 'bold' }}>Total Amount {invoice.Totalamount}</span>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Typography style={{ marginTop: '10px' }}>Prepared by: {fname} {lname}</Typography>
                    </div>
                    <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                        <button onClick={() => printInvoice(invoice.invoiceId)} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>Print Invoice</button>
                    </Box>
                </Box>
            ))}
        </div>
    );
});

export default InvoicePrint;
