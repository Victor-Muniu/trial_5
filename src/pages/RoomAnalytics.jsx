import React from 'react';
import {  Typography, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Grid, Box, TextField } from '@mui/material';


const RoomAnalytics = () => {
  return (
    <div>
      
      <Grid container spacing={2} style={{ padding: '20px' }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">Yearly Report</Typography>
              <Typography color="textSecondary">All general information appears in this field</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">Monthly Income</Typography>
              <Typography color="textSecondary">$287,000</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">Weekly Report</Typography>
              <Typography color="textSecondary">$67888</Typography>
              
            </CardContent>
          </Card>
        </Grid>
        <Box display="flex" marginTop={5} justifyContent="space-around" width="100%">
            <Box marginRight={2}>
              <TextField 
                label='Search Room No'
                type='number'
              />
            </Box>
            <Box marginRight={2}>
              <TextField 
                type='date'
              />
            </Box>
            <Box>
              <TextField 
                type='date'
              />
            </Box>
          </Box>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room No</TableCell>
                <TableCell align="right">Start Date</TableCell>
                <TableCell align='right'>End Date</TableCell>
                <TableCell align="right">Revenue Generated</TableCell>
                <TableCell align="right">Days Used</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              <TableRow>
                <TableCell component="th" scope="row">101</TableCell>
                <TableCell align="right">Jul 12 2023</TableCell>
                <TableCell align="right">Jul 14, 2023</TableCell>
                <TableCell align="right">$1,200</TableCell>
                <TableCell align="right">4.8</TableCell>
              </TableRow>
              
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </div>
  );
};

export default RoomAnalytics;
