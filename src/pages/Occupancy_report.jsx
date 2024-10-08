import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import './styles.css';

function OccupancyReport() {
  const [data, setData] = useState([]);
  const [roomServiceData, setRoomServiceData] = useState([]);
  const [laundryServiceData, setLaundryServiceData] = useState([]);
  const [reservationBillsData, setReservationBillsData] = useState([]);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const roomServiceRef = useRef();
  const laundryServiceRef = useRef();
  const reservationBillsRef = useRef();

  const fname = localStorage.getItem('fname');
  const lname = localStorage.getItem('lname');
  const role = localStorage.getItem('role')

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/reservations');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const handleOpenReceipt = async (room_no) => {
    const roomNumber = Array.isArray(room_no) ? room_no[0] : room_no;
    try {
      const roomServiceResponse = await axios.get(`https://hotel-backend-1-trhj.onrender.com/room-services/room/${roomNumber}`);
      const laundryServiceResponse = await axios.get(`https://hotel-backend-1-trhj.onrender.com/laundry-service-bills/room/${roomNumber}`);
      const reservationBillsResponse = await axios.get(`https://hotel-backend-1-trhj.onrender.com/reservation-bills/room/${roomNumber}`);
      setRoomServiceData(roomServiceResponse.data || []);
      setLaundryServiceData(laundryServiceResponse.data || []);
      setReservationBillsData(reservationBillsResponse.data || []);
      setReceiptOpen(true);
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleCloseReceipt = () => {
    setReceiptOpen(false);
    setRoomServiceData([]);
    setLaundryServiceData([]);
    setReservationBillsData([]);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString(undefined, options);
    const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  };

  const handlePrint = (section) => {
    const printContent = section === 'roomService' ? roomServiceRef.current : section === 'laundryService' ? laundryServiceRef.current : reservationBillsRef.current;
    const WinPrint = window.open('', '', 'width=900,height=300');
    WinPrint.document.write(printContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };


  const handleCheckout = async (id) => {
    try {
      await axios.delete(`https://hotel-backend-1-trhj.onrender.com/reservations/${id}`);
      setData(data.filter(room => room._id !== id));
    } catch (error) {
      console.error('There was a problem with the delete operation:', error);
    }
  };


  return (
    <Container>
      {role === 'front office' && (
      <Typography variant="h6">Room Bills</Typography>
      )}
      {role === 'house keeping' && (
        <Typography variant="h6">Occupancy report</Typography>
      )}
      <Grid container spacing={3}>
        {data.map((room, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={3} style={{ padding: '20px', borderColor: 'green', borderStyle: 'solid' }}>
              <Typography variant="h6">{room.room_no.join(', ')}</Typography>
              <Typography variant="body2">
                {room.individual ? (
                  `${room.individual.fname} ${room.individual.lname}`
                ) : (
                  room.group.map((g, i) => (
                    <span key={i}>{`${g.fname} ${g.lname}`}{i < room.group.length - 1 ? ', ' : ''}</span>
                  ))
                )}
              </Typography>

              {role === 'front office' && (
                <Box display='flex' justifyContent='space-between' ><Button variant="contained" color="primary" onClick={() => handleOpenReceipt(room.room_no)}>
                  Show Receipts
                </Button>
                  <Button variant="contained" color="primary" onClick={() => handleCheckout(room._id)} >
                    CheckOut
                  </Button>
                </Box>
              )}


            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={receiptOpen} onClose={handleCloseReceipt} maxWidth="sm" fullWidth>
        <DialogTitle>Receipts</DialogTitle>
        <DialogContent>
          <div ref={roomServiceRef}>
            <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '10px' }}>Room Service Bill</Typography>
            {roomServiceData.length > 0 ? (
              roomServiceData.map((data, index) => (
                <Paper key={index} elevation={1} style={{ padding: '10px', marginBottom: '10px' }}>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>Epashikino Resort & Spa</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>P.O Box : 12328-20100</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>OPP LAKE ELEMENTAITA</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>TEL : 0705455001,0788455001</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>PIN : P051626100V</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>info@epashikino.com</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>www.epashikinoresort.com</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>Date: {getCurrentDate()}</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>MPESA PAYBILL NO. 794921</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>ACCOUNT NO. 123</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}> Room No : {data.room_no} </Typography>
                  <Typography variant="body1" style={{ textAlign: 'center', marginBottom: '-3px' }}>Items:</Typography>
                  {data.menuId.map((item, i) => (
                    <Typography key={i} variant="body2" style={{ textAlign: 'center', fontSize: '12px' }}>
                      {item.name}  Ksh {item.price}
                    </Typography>
                  ))}
                  <Typography variant="body2" style={{ textAlign: 'center', fontSize: '12px' }}>
                    Delivery fee    Ksh{data.delivery_fee}
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: 'center', marginTop: '-3px', fontSize: '12px' }}>
                    <strong>Total:</strong> Ksh {data.total}
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-3px', fontSize: '12px' }}>Served by: {fname} {lname} </Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-3px', fontSize: '12px' }}>Thank you for your business</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-3px', fontSize: '12px' }}>Your Ultimate Joyous Experience</Typography>
                </Paper>
              ))
            ) : (
              <Typography>No room service data available.</Typography>
            )}
          </div>
          <div ref={laundryServiceRef}>
            <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '10px' }}>Laundry Service Bill</Typography>
            {laundryServiceData.length > 0 ? (
              laundryServiceData.map((data, index) => (
                <Paper key={index} elevation={1} style={{ padding: '10px', marginBottom: '10px' }}>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>Epashikino Resort & Spa</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>P.O Box : 12328-20100</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>OPP LAKE ELEMENTAITA</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>TEL : 0705455001,0788455001</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>PIN : P051626100V</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>info@epashikino.com</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>www.epashikinoresort.com</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>Date: {getCurrentDate()}</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>MPESA PAYBILL NO. 794921</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>ACCOUNT NO. 123</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}> Room No : {data.room_no} </Typography>
                  <Typography variant="body1" style={{ textAlign: 'center', marginBottom: '-3px' }}>Items:</Typography>
                  {data.laundryServices.map((item, i) => (
                    <Typography key={i} variant="body2" style={{ textAlign: 'center', fontSize: '12px' }}>
                      {item.laundryID.name} x {item.quantity}  Ksh {item.laundryID.price}
                    </Typography>
                  ))}
                  <Typography variant="body1" style={{ textAlign: 'center', marginTop: '-3px', fontSize: '12px' }}>
                    <strong>Total:</strong> Ksh {data.total}
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-3px', fontSize: '12px' }}>Served by: {fname} {lname} </Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-3px', fontSize: '12px' }}>Thank you for your business</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-3px', fontSize: '12px' }}>Your Ultimate Joyous Experience</Typography>
                </Paper>
              ))
            ) : (
              <Typography>No laundry service data available.</Typography>
            )}
          </div>
          <div ref={reservationBillsRef}>
            <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '10px' }}>Reservation Bill</Typography>
            {reservationBillsData.length > 0 ? (
              reservationBillsData.map((data, index) => (
                <Paper key={index} elevation={1} style={{ padding: '10px', marginBottom: '10px' }}>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>Epashikino Resort & Spa</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>P.O Box : 12328-20100</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>OPP LAKE ELEMENTAITA</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>TEL : 0705455001,0788455001</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>PIN : P051626100V</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>info@epashikino.com</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>www.epashikinoresort.com</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>Date: {getCurrentDate()}</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>MPESA PAYBILL NO. 794921</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}>ACCOUNT NO. 123</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-2px', fontSize: '12px' }}> Room No : {data.room_no} </Typography>
                  <Typography variant="body1" style={{ textAlign: 'center', marginBottom: '-3px' }}>Items:</Typography>
                  <Typography variant="body2" style={{ textAlign: 'center', fontSize: '12px' }}>
                    Ksh {data.package_price}
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: 'center', marginTop: '-3px', fontSize: '12px' }}>
                    <strong>Total:</strong> Ksh {data.total_amount}
                  </Typography>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '-3px', fontSize: '12px' }}>Served by: {fname} {lname} </Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-3px', fontSize: '12px' }}>Thank you for your business</Typography>
                  <Typography variant="body1" style={{ fontWeight: 'semibold', textAlign: 'center', marginBottom: '-3px', fontSize: '12px' }}>Your Ultimate Joyous Experience</Typography>
                </Paper>
              ))
            ) : (
              <Typography>No reservation bill data available.</Typography>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReceipt} color="primary">Close</Button>
          <Button onClick={() => handlePrint('roomService')} color="primary">Print Room Service Bill</Button>
          <Button onClick={() => handlePrint('laundryService')} color="primary">Print Laundry Service Bill</Button>
          <Button onClick={() => handlePrint('reservationBills')} color="primary">Print Reservation Bill</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OccupancyReport;
