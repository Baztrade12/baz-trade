import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchPortfolioSummary, fetchPortfolioPerformance } from '../store/slices/portfolioSlice';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';

const Portfolio: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, performance } = useSelector((state: RootState) => state.portfolio);
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  useEffect(() => {
    dispatch(fetchPortfolioSummary());
    dispatch(fetchPortfolioPerformance(period));
  }, [dispatch, period]);

  const performanceData = Object.entries(performance).map(([date, data]: any) => ({
    date,
    profit: data.profit,
    trades: data.trades,
    wins: data.wins,
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        📊 Portfolio Performance
      </Typography>

      {/* Performance Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1a1f3a' }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Total Profit
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: (summary?.totalProfit || 0) >= 0 ? '#4caf50' : '#f44336',
                  fontWeight: 'bold',
                }}
              >
                ${(summary?.totalProfit || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1a1f3a' }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Total Fees
              </Typography>
              <Typography variant="h5" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                ${(summary?.totalFees || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1a1f3a' }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Win Rate
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: (summary?.winRate || 0) >= 50 ? '#4caf50' : '#ff9800',
                  fontWeight: 'bold',
                }}
              >
                {(summary?.winRate || 0).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1a1f3a' }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Net Profit
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: (summary?.netProfit || 0) >= 0 ? '#4caf50' : '#f44336',
                  fontWeight: 'bold',
                }}
              >
                ${(summary?.netProfit || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Period Toggle */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(event, newPeriod) => {
            if (newPeriod) setPeriod(newPeriod);
          }}
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="yearly">Yearly</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profit Chart
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#4caf50"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trades & Wins
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="trades" fill="#1976d2" />
                  <Bar dataKey="wins" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Portfolio;
