import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function GeneralLedger() {
  const [data, setData] = useState([]);
  const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/general-ledger');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  const groupDataByCategory = () => {
    const groupedData = {};
    data.forEach(item => {
      const year = new Date(item.date).getFullYear();
      if (year === displayedYear) {
        if (!groupedData[item.category]) {
          groupedData[item.category] = {
            category: item.category,
            totalAmount: 0
          };
        }
        groupedData[item.category].totalAmount += item.amount;
      }
    });
    return groupedData;
  };

  const groupedData = groupDataByCategory();

  const handleYearChange = (newYear) => {
    setDisplayedYear(newYear);
  };

  const handleCategoryClick = (category) => {
    if (category === 'Creditors') {
      navigate('/creditors');
    } else if (category === 'Some Other Category') {
      navigate('/some-other-page');
    }
    
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom margin={5}>
        General Ledger
      </Typography>

      <Typography variant="h5" gutterBottom margin={5}>
        For Jan 1, {displayedYear} - Dec 31, {displayedYear}
      </Typography>

      <div style={{ marginBottom: '16px' }}>
        <Button variant="contained" onClick={() => handleYearChange(displayedYear - 1)} style={{ marginRight: '8px' }}>
          Previous Year
        </Button>
        <Button variant="contained" onClick={() => handleYearChange(displayedYear + 1)}>
          Next Year
        </Button>
      </div>

      <Table aria-label="simple table" margin={5}>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Total Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(groupedData).map((group, index) => (
            <TableRow key={index} onClick={() => handleCategoryClick(group.category)} style={{ cursor: 'pointer' }}>
              <TableCell component="th" scope="row">
                {group.category}
              </TableCell>
              <TableCell align="right">{group.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GeneralLedger;
