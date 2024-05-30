import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Box,
    Button
} from '@mui/material';
import MUIDataTable from 'mui-datatables';

const ReservationForm = () => {

    const [travelingForWork, setTravelingForWork] = useState('no')
    const renderTableSection = () => {
        if (travelingForWork === 'no') {
            return (
                <Box display='flex' justifyContent='space-around' marginTop={5}>
                    <div style={{ flex: 1, marginRight: '1rem' }}>
                        <MUIDataTable
                            title='Available rooms'
                            columns={columns}
                            data={data.map((item) => [
                                item.room_no,
                                item.block
                            ])}
                            options={options}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <MUIDataTable
                            title='Assigned Rooms'
                            columns={column2}
                        />
                    </div>
                </Box>
            );
        }
        return null; 
    };


    const columns = ["Room No", "Type"]
    const options = {
        filterType: 'checkbox',
        rowsPerPage: 5
    }
    const column2= ["Room No", "Type", "Gest Name"]

    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/rooms');
            const data = response.data;
            console.log(data);
            setData(data);
          } catch (error) {
            console.error('There was a problem with the axios operation:', error);
          }
        };
    
        getData();
      }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Enter your details
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Booking Type</FormLabel>
                        <RadioGroup row value={travelingForWork} onChange={(e) => setTravelingForWork(e.target.value)}>
                            <FormControlLabel value="yes" control={<Radio />} label="Individual" />
                            <FormControlLabel value="no" control={<Radio />} label="Group" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="First Name"
                        fullWidth

                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Last Name"
                        fullWidth

                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="E-mail address"
                        fullWidth

                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="City"
                        fullWidth

                        required
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Address"
                        fullWidth

                        required
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Phone Number"
                        fullWidth

                        required
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Nationality"
                        fullWidth

                        required
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="ID No:"
                        fullWidth

                        required
                    />
                </Grid>

            </Grid>

            <Typography variant="h4" gutterBottom marginTop={2}>
                Checkin Info
            </Typography>



            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        type='date'

                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        type='date'

                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="How did you find us"
                        fullWidth

                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Basis plan"
                        fullWidth

                        required
                    />
                </Grid>

            </Grid>



            <Typography variant="h4" gutterBottom marginTop={2}>
                Room Occupancy
            </Typography>



            <Grid container spacing={2}>



                <Grid item xs={6}>
                    <TextField
                        label="No of Adults "
                        type='number'
                        fullWidth

                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="No of kids"
                        type='number'
                        fullWidth

                        required
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        label="Total Turrif"
                        type='number'
                        fullWidth

                        required
                    />
                </Grid>

            </Grid>


            {renderTableSection()}


            <Box marginTop={5}>
                <Button variant="contained" color="primary" fullWidth >Submit</Button>
            </Box>


            



        </Container>
    );
};

export default ReservationForm;
