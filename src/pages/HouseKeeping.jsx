import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Paper, TableCell, TableRow, TableBody, TableHead, TableContainer, Checkbox, Button } from '@mui/material';

function HouseKeeping() {
  const [data, setData] = useState([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/houseKeepingRequisitions');
        let filteredData = response.data;
        if (role === 'procurement') {
          filteredData = filteredData.filter(item => item.status === 'Pending');
        }
        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, [role]);

  const handleApprove = async (id, itemData) => {
    try {
      await axios.patch(`https://hotel-backend-1-trhj.onrender.com/houseKeepingRequisitions/${id}`, {
        itemName: itemData.itemName,
        quantity: itemData.quantity,
        unit: itemData.unit,
        description: itemData.description,
        date: itemData.date,
        department: itemData.department,
        status: 'Approved'
      });
      setData(prevData =>
        prevData.map(item =>
          item._id === id ? { ...item, status: 'Approved' } : item
        )
      );
    } catch (error) {
      console.error('Error approving requisition:', error);
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
            <TableCell>Item Name</TableCell>
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
                  {row.status === 'Pending' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleApprove(row._id, row)}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default HouseKeeping;
