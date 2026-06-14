'use client';

import { useDashboardStore } from '../../store/dashboard.store';
import { formatCurrency, formatPercent } from '../../utils/format';
import { Activity, Trending2, AlertCircle, CheckCircle } from 'lucide-react';

export function PerformanceMetrics() {
  const portfolio = useDashboardStore((state) => state.portfolio);

  if (!portfolio) return null;

  const metrics = [
    {
      label: 'Sharpe Ratio',
      value: portfolio.sharpeRatio.toFixed(2),
      icon: <Trending2 className="w-5 h-5" />,
      color: 'text-blue-500',
    },
    {
      label: 'Max Drawdown',
      value: `${formatPercent(portfolio.maxDrawdown)}`,
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-red-500',
    },
    {
      label: 'Monthly Return',
      value: `${formatPercent(portfolio.monthlyReturn)}`,
      icon: <Activity className="w-5 h-5" />,
      color: portfolio.monthlyReturn >= 0 ? 'text-success' : 'text-danger',
    },
    {
      label: 'Yearly Return',
      value: `${formatPercent(portfolio.yearlyReturn)}`,
      icon: <CheckCircle className="w-5 h-5" />,
      color: portfolio.yearlyReturn >= 0 ? 'text-success' : 'text-danger',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{metric.label}</p>
              <p className={`text-xl font-bold mt-2 ${metric.color}`}>{metric.value}</p>
            </div>
            <div className={metric.color}>{metric.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
