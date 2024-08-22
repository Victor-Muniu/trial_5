import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Paper, TableCell, TableRow, TableBody, TableHead, TableContainer, Checkbox, Button } from '@mui/material';

function FoodRequisitions() {
  const [data, setData] = useState([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/foodProductionRequisitions');
        let data = response.data;
        if (role === 'procurement') {
          data = data.filter(item => item.status === 'Pending');
        }
        setData(data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, [role]);

  const handleApprove = async (row) => {
    const patchData = {
      itemName: row.itemID.name,
      quantity: row.quantity,
      unit: row.unit,
      description: row.description,
      date: row.date,
      department: row.department,
      status: 'Approved',
    };
    try {
      console.log(`Approving requisition with ID: ${row._id}`);
      console.log('Patch data:', patchData);
      
      const response = await axios.patch(`https://hotel-backend-1-trhj.onrender.com/foodProductionRequisitions/${row._id}`, patchData);
      console.log('Response:', response.data);
      setData(data.map(item => item._id === row._id ? { ...item, status: 'Approved' } : item));
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>Product name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Date</TableCell>
            {role === 'procurement' && (
              <TableCell>Action</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>{row.itemName}</TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.unit}</TableCell>
              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              {role === 'procurement' && (
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleApprove(row)}
                    disabled={row.status === 'Approved'}>Approve</Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FoodRequisitions;
