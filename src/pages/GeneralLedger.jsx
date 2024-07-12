import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

function GeneralLedger() {
  const [data, setData] = useState([]);
  const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());

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

  const groupDataByCategoryAndMonthYear = () => {
    const groupedData = {};
    data.forEach(item => {
      const date = new Date(item.date);
      const month = date.getMonth() + 1; // Get the month (1-12)
      const year = date.getFullYear(); // Get the year

      if (!groupedData[item.category]) {
        groupedData[item.category] = {};
      }

      if (!groupedData[item.category][year]) {
        groupedData[item.category][year] = {};
      }

      if (!groupedData[item.category][year][month]) {
        groupedData[item.category][year][month] = {
          category: item.category,
          month,
          year,
          totalAmount: 0
        };
      }
      groupedData[item.category][year][month].totalAmount += item.amount;
    });
    return groupedData;
  };

  const groupedData = groupDataByCategoryAndMonthYear();

  const handleYearChange = (newYear) => {
    setDisplayedYear(newYear);
  };

  const displayedData = Object.keys(groupedData).reduce((acc, category) => {
    if (groupedData[category][displayedYear]) {
      acc[category] = groupedData[category][displayedYear];
    }
    return acc;
  }, {});

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

      {Object.keys(displayedData).map(category => (
        <React.Fragment key={category}>
          <Typography variant="h6" gutterBottom margin={5}>
            {category}
          </Typography>
          <Table aria-label="simple table" margin={5}>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Month</TableCell>
                <TableCell align="right">Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(displayedData[category]).map((group, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {group.category}
                  </TableCell>
                  <TableCell>{new Date(group.year, group.month - 1).toLocaleString('default', { month: 'long' })} {group.year}</TableCell>
                  <TableCell align="right">{group.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </React.Fragment>
      ))}
    </TableContainer>
  );
}

export default GeneralLedger;
