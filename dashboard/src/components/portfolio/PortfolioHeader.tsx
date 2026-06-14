'use client';

import { useDashboardStore } from '../../store/dashboard.store';
import { formatCurrency, formatPercent } from '../../utils/format';
import { TrendingUp, TrendingDown, Zap, DollarSign } from 'lucide-react';

export function PortfolioHeader() {
  const portfolio = useDashboardStore((state) => state.portfolio);

  if (!portfolio) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card h-24 animate-pulse bg-gray-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Balance */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Balance</p>
            <p className="text-2xl font-bold mt-2">{formatCurrency(portfolio.totalBalance)}</p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      {/* Total P&L */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total P&L</p>
            <p className={`text-2xl font-bold mt-2 ${portfolio.totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(portfolio.totalPnL)}
            </p>
            <p className={`text-xs mt-1 ${portfolio.roi >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatPercent(portfolio.roi)}
            </p>
          </div>
          {portfolio.totalPnL >= 0 ? (
            <TrendingUp className="w-8 h-8 text-success" />
          ) : (
            <TrendingDown className="w-8 h-8 text-danger" />
          )}
        </div>
      </div>

      {/* Daily Return */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Daily Return</p>
            <p className={`text-2xl font-bold mt-2 ${portfolio.dailyReturn >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatPercent(portfolio.dailyReturn)}
            </p>
          </div>
          <Zap className="w-8 h-8 text-warning" />
        </div>
      </div>

      {/* Win Rate */}
      <div className="card">
        <div>
          <p className="text-gray-400 text-sm">Win Rate</p>
          <p className="text-2xl font-bold mt-2">{formatPercent(portfolio.winRate)}</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
            <div
              className="bg-gradient-to-r from-success to-accent h-2 rounded-full"
              style={{ width: `${Math.min(portfolio.winRate, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
