export interface PortfolioMetrics {
  totalBalance: number;
  availableBalance: number;
  usedMargin: number;
  marginRatio: number;
  unrealizedPnL: number;
  realizedPnL: number;
  totalPnL: number;
  roi: number;
  winRate: number;
  dailyReturn: number;
  monthlyReturn: number;
  yearlyReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
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
  unrealizedPnL?: number;
  unrealizedPnLPercent?: number;
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

export interface BotStatus {
  isRunning: boolean;
  uptime: number;
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
}

export interface DashboardData {
  portfolio: PortfolioMetrics;
  positions: Position[];
  trades: Trade[];
  botStatus: BotStatus;
}
