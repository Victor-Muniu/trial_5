import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Box,
 r
} from '@mui/material';
import { styled } from '@mui/system';


const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

const GestInfo = ({room_no}) => {
    const [data, setData] = useState([]);
    

    const getData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/individuals/room/${room_no}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData();
            setData(result);
        };
        fetchData();
    }, []);

    console.log(data)
  return (
    <Box width='100%'>
    <Container maxWidth>
      <Typography variant="h4" gutterBottom>
        Gest Info
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                  <Typography variant="body1">{data.fname} {data.lname}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Phone No</Typography>
                  <Typography variant="body1">{data.phoneNo}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{data.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                  <Typography variant="body1">{data.address}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Nationality</Typography>
                  <Typography variant="body1">{data.nationality}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">ID No</Typography>
                  <Typography variant="body1">{data.idNo}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">City</Typography>
                  <Typography variant="body1">{data.city}</Typography>
                </Grid>
                
              </Grid>
            </CardContent>
          </StyledCard>

            <Typography variant="h4" gutterBottom>
                 Package Info
            </Typography>

          <StyledCard>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Room No</Typography>
                  <Typography variant="body1">{data.room_no}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Checkin Date</Typography>
                  <Typography variant="body1">{data.checkin}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Checkout Date</Typography>
                  <Typography variant="body1">{data.checkout}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Plan</Typography>
                  <Typography variant="body1">{data.plan}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Adults</Typography>
                  <Typography variant="body1">{data.adults}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">Kids</Typography>
                  <Typography variant="body1">{data.kids}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>

          
        </Grid>

        
      </Grid>
    </Container>
    </Box>
  );
};

export default GestInfo;





