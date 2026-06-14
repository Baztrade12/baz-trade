'use client';

import { useDashboardStore } from '../../store/dashboard.store';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useMemo } from 'react';

const mockChartData = [
  { date: '1 Jan', balance: 10000, pnl: 0 },
  { date: '2 Jan', balance: 10150, pnl: 150 },
  { date: '3 Jan', balance: 10320, pnl: 320 },
  { date: '4 Jan', balance: 10450, pnl: 450 },
  { date: '5 Jan', balance: 10680, pnl: 680 },
  { date: '6 Jan', balance: 10920, pnl: 920 },
  { date: '7 Jan', balance: 11200, pnl: 1200 },
];

export function PerformanceCharts() {
  const trades = useDashboardStore((state) => state.trades);

  const tradesByDay = useMemo(() => {
    const grouped: Record<string, number> = {};
    trades.forEach((trade) => {
      const date = new Date(trade.timestamp).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + trade.profitLoss;
    });
    return Object.entries(grouped).map(([date, pnl]) => ({ date, pnl }));
  }, [trades]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Balance Chart */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Portfolio Balance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockChartData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #4B5563',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily P&L Chart */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Daily P&L</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tradesByDay.length > 0 ? tradesByDay : mockChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #4B5563',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="pnl" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
