import React, {useState, useEffect} from 'react'
import {  TableContainer,
    TableHead, TableRow, TableCell, TableBody,
    Paper,  Table } from '@mui/material'

import axios from 'axios';
function LedgerList() {
    const [data, setData] = useState([]);
    

    const getData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/general-ledger`);
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
    <div>
        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row,index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  )
}

export default LedgerList