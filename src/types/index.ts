// Trading Types
export interface FundingRate {
  symbol: string;
  fundingRate: number;
  fundingTime: number;
  nextFundingTime: number;
}

export interface OrderBook {
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  entryPrice: number;
  leverage: number;
  openTime: number;
  status: 'OPEN' | 'CLOSED' | 'LIQUIDATED';
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: number;
  orderId: string;
  commission: number;
  profitLoss: number;
}

export interface ArbitrageOpportunity {
  symbol: string;
  longFundingRate: number;
  shortFundingRate: number;
  fundingPayoutTime: number;
  estimatedProfit: number;
  confidence: number; // 0-1
}

export interface BotConfig {
  minFundingRate: number;
  maxPositionSize: number;
  leverage: number;
  minProfitPercent: number;
  executionTimeoutMs: number;
  rebalanceIntervalMs: number;
}

export interface PortfolioMetrics {
  totalBalance: number;
  availableBalance: number;
  usedMargin: number;
  marginRatio: number;
  unrealizedPnL: number;
  realizedPnL: number;
  totalPnL: number;
  roi: number; // percentage
  winRate: number; // percentage
  dailyReturn: number;
  monthlyReturn: number;
  yearlyReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface DashboardStats {
  portfolio: PortfolioMetrics;
  activePositions: number;
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  averageTradeDuration: number;
  bestTrade: number;
  worstTrade: number;
  lastUpdate: number;
}
