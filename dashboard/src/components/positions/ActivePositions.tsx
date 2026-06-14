'use client';

import { useDashboardStore } from '../../store/dashboard.store';
import { formatCurrency, formatPercent } from '../../utils/format';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

export function ActivePositions() {
  const positions = useDashboardStore((state) => state.positions);

  if (positions.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-400">No active positions</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400">Symbol</th>
            <th className="text-left py-3 px-4 text-gray-400">Side</th>
            <th className="text-right py-3 px-4 text-gray-400">Quantity</th>
            <th className="text-right py-3 px-4 text-gray-400">Entry Price</th>
            <th className="text-right py-3 px-4 text-gray-400">Unrealized P&L</th>
            <th className="text-right py-3 px-4 text-gray-400">Return %</th>
            <th className="text-center py-3 px-4 text-gray-400">Action</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
              <td className="py-3 px-4 font-semibold">{position.symbol}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    position.side === 'LONG'
                      ? 'bg-success/20 text-success'
                      : 'bg-danger/20 text-danger'
                  }`}
                >
                  {position.side}
                </span>
              </td>
              <td className="py-3 px-4 text-right">{position.quantity.toFixed(4)}</td>
              <td className="py-3 px-4 text-right">{formatCurrency(position.entryPrice)}</td>
              <td
                className={`py-3 px-4 text-right font-semibold ${
                  (position.unrealizedPnL || 0) >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {formatCurrency(position.unrealizedPnL || 0)}
              </td>
              <td
                className={`py-3 px-4 text-right flex items-center justify-end gap-1 ${
                  (position.unrealizedPnLPercent || 0) >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {(position.unrealizedPnLPercent || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {formatPercent(position.unrealizedPnLPercent || 0)}
              </td>
              <td className="py-3 px-4 text-center">
                <button className="p-2 hover:bg-red-500/20 rounded transition text-red-500 hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
