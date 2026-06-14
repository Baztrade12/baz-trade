'use client';

import { useDashboardStore } from '../../store/dashboard.store';
import { formatCurrency, formatPercent, formatTime } from '../../utils/format';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function TradeHistory() {
  const trades = useDashboardStore((state) => state.trades);

  if (trades.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-400">No trades yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400">Time</th>
            <th className="text-left py-3 px-4 text-gray-400">Symbol</th>
            <th className="text-left py-3 px-4 text-gray-400">Side</th>
            <th className="text-right py-3 px-4 text-gray-400">Quantity</th>
            <th className="text-right py-3 px-4 text-gray-400">Price</th>
            <th className="text-right py-3 px-4 text-gray-400">Commission</th>
            <th className="text-right py-3 px-4 text-gray-400">P&L</th>
          </tr>
        </thead>
        <tbody>
          {trades.slice(0, 20).map((trade) => (
            <tr key={trade.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
              <td className="py-3 px-4 text-gray-400">{formatTime(trade.timestamp)}</td>
              <td className="py-3 px-4 font-semibold">{trade.symbol}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    trade.side === 'BUY'
                      ? 'bg-success/20 text-success'
                      : 'bg-danger/20 text-danger'
                  }`}
                >
                  {trade.side}
                </span>
              </td>
              <td className="py-3 px-4 text-right">{trade.quantity.toFixed(4)}</td>
              <td className="py-3 px-4 text-right">{formatCurrency(trade.price)}</td>
              <td className="py-3 px-4 text-right text-gray-400">{formatCurrency(trade.commission)}</td>
              <td
                className={`py-3 px-4 text-right font-semibold flex items-center justify-end gap-1 ${
                  trade.profitLoss >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {trade.profitLoss >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {formatCurrency(trade.profitLoss)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
