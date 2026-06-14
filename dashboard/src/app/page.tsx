'use client';

import { PortfolioHeader } from '@/components/portfolio/PortfolioHeader';
import { PerformanceMetrics } from '@/components/portfolio/PerformanceMetrics';
import { PerformanceCharts } from '@/components/charts/PerformanceCharts';
import { ActivePositions } from '@/components/positions/ActivePositions';
import { TradeHistory } from '@/components/trades/TradeHistory';
import { BotControls } from '@/components/bot/BotControls';
import { useDashboardStore } from '@/store/dashboard.store';
import { AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const isConnected = useDashboardStore((state) => state.isConnected);
  const isLoading = useDashboardStore((state) => state.isLoading);

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">BAZ Crypto Tech</h1>
            <p className="text-gray-400 mt-1">High-Frequency Funding Rate Arbitrage Bot</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-success animate-pulse' : 'bg-danger'
              }`}
            />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Connection Alert */}
        {!isConnected && (
          <div className="bg-warning/10 border border-warning text-warning p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>Connection lost. Attempting to reconnect...</p>
          </div>
        )}

        {/* Bot Controls */}
        <BotControls />

        {/* Portfolio Overview */}
        {!isLoading && <PortfolioHeader />}

        {/* Performance Metrics */}
        <PerformanceMetrics />

        {/* Charts */}
        <PerformanceCharts />

        {/* Positions Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Active Positions</h2>
          <div className="card overflow-hidden">
            <ActivePositions />
          </div>
        </div>

        {/* Trade History */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Trades</h2>
          <div className="card overflow-hidden">
            <TradeHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
