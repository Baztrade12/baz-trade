import { create } from 'zustand';
import { PortfolioMetrics, Position, Trade, BotStatus } from '../types';

interface DashboardStore {
  // State
  portfolio: PortfolioMetrics | null;
  positions: Position[];
  trades: Trade[];
  botStatus: BotStatus | null;
  isConnected: boolean;
  isLoading: boolean;

  // Actions
  setPortfolio: (portfolio: PortfolioMetrics) => void;
  setPositions: (positions: Position[]) => void;
  setTrades: (trades: Trade[]) => void;
  setBotStatus: (status: BotStatus) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  addTrade: (trade: Trade) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  portfolio: null,
  positions: [],
  trades: [],
  botStatus: null,
  isConnected: false,
  isLoading: true,

  setPortfolio: (portfolio) => set({ portfolio }),
  setPositions: (positions) => set({ positions }),
  setTrades: (trades) => set({ trades }),
  setBotStatus: (status) => set({ botStatus: status }),
  setConnected: (connected) => set({ isConnected: connected }),
  setLoading: (loading) => set({ isLoading: loading }),
  addTrade: (trade) => set((state) => ({
    trades: [trade, ...state.trades],
  })),
}));
