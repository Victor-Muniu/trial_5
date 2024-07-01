import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Grid, Paper, Typography, CircularProgress
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Accounts() {
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [profitLoss, setProfitLoss] = useState([]);
  const [loading, setLoading] = useState(true);

  const endpoints = {
    transactions: 'https://hotel-backend-1-trhj.onrender.com/transactions',
    expenses: 'https://hotel-backend-1-trhj.onrender.com/expenses',
    purchases: 'https://hotel-backend-1-trhj.onrender.com/consolidated-purchases',
    profitLoss: 'https://hotel-backend-1-trhj.onrender.com/profitloss',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, expensesRes, purchasesRes, profitLossRes] = await Promise.all([
          axios.get(endpoints.transactions),
          axios.get(endpoints.expenses),
          axios.get(endpoints.purchases),
          axios.get(endpoints.profitLoss),
        ]);

        setTransactions(transactionsRes.data);
        setExpenses(expensesRes.data);
        setPurchases(purchasesRes.data);
        setProfitLoss(profitLossRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDataForChart = (data, key, transactionType = 'all') => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));
    const result = Array(12).fill(0);

    data.forEach(item => {
      const month = new Date(item.date || item.Date).getMonth();
      if (transactionType === 'all' || item.type === transactionType) {
        result[month] += item[key];
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          data: result,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>Accounting Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>Money In Over the Year</Typography>
            <Line data={formatDataForChart(transactions, 'amount', 'credit')} options={{ maintainAspectRatio: true }} height={50} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>Money Out Over the Year</Typography>
            <Line data={formatDataForChart(transactions, 'amount', 'debit')} options={{ maintainAspectRatio: true }} height={50} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>Expenses Over the Year</Typography>
            <Line data={formatDataForChart(expenses, 'amount')} options={{ maintainAspectRatio: true }} height={50} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>Purchases Over the Year</Typography>
            <Line data={formatDataForChart(purchases, 'amount')} options={{ maintainAspectRatio: true }} height={50} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>Profit & Loss Over the Year</Typography>
            <Line data={formatDataForChart(profitLoss, 'Debit')} options={{ maintainAspectRatio: true }} height={50} />
            <Line data={formatDataForChart(profitLoss, 'Credit')} options={{ maintainAspectRatio: true }} height={50} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Accounts;
