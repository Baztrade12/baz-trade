# BAZ Crypto Tech - Funding Rate Arbitrage Trading Bot

🤖 **High-Frequency Trading Bot** untuk Binance Funding Rate Arbitrage

## 📋 Deskripsi

BAZ Crypto Tech adalah bot trading otomatis yang memanfaatkan funding rate arbitrage di Binance. Bot ini:
- ✅ Mencari token dengan funding rate negatif tinggi (LONG opportunities)
- ✅ Mencari token dengan funding rate positif tinggi (SHORT opportunities)
- ✅ Eksekusi trade di detik-detik akhir funding rate cycle (setiap 8 jam)
- ✅ Scalping strategy dengan profit kecil namun konsisten (di atas fees)
- ✅ Infrastructure cepat untuk eksekusi optimal
- ✅ Dashboard institutional-grade untuk monitoring

## 🏗️ Struktur Project

```
baz-trade/
├── backend/                 # Node.js bot dan API server
│   ├── src/
│   │   ├── bot/            # Core trading bot logic
│   │   ├── services/       # Binance API, DB, Cache
│   │   ├── strategies/     # Trading strategies
│   │   ├── utils/          # Helpers dan utilities
│   │   └── api/            # REST API endpoints
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React dashboard
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Pages
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API clients
│   │   └── utils/          # Helpers
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Binance API Keys (Futures)
- Redis
- PostgreSQL

### Installation

```bash
# Clone repo
git clone https://github.com/baztrade657-arch/baz-trade.git
cd baz-trade

# Setup environment
cp .env.example .env
# Edit .env dengan Binance API keys Anda

# Start dengan Docker Compose
docker-compose up -d

# Dashboard: http://localhost:3000
# Bot API: http://localhost:5000
```

## 📊 Fitur Dashboard

- 🎛️ **Control Panel**: Start/Stop bot dalam satu klik
- 📈 **Real-time Charts**: Price, Funding Rate, Portfolio
- 💼 **Portfolio Tracking**: Position, P&L, Holdings
- 📊 **Performance Analytics**: Daily/Monthly/Yearly stats
- 🔔 **Alerts & Notifications**: Real-time trade updates
- 📱 **Responsive Design**: Mobile-friendly interface
- 🏛️ **Institutional Grade**: Professional UI/UX

## 🤖 Bot Strategy

### Funding Rate Arbitrage

1. **Scan** 24/7: Monitor funding rates semua token
2. **Identify**: Temukan opportunities dengan spread besar
3. **Execute**: Trade di 5-10 menit sebelum funding time
4. **Manage**: Hold hingga funding paid (8 jam)
5. **Close**: Exit dengan profit minimal di atas fees
6. **Repeat**: Cycle setiap 8 jam

### Risk Management

- Position sizing based on account balance
- Max portfolio heat limit
- Stoploss on adverse moves
- Slippage protection
- Rate limiting pada Binance API

## 🔧 API Endpoints

### Bot Control
```
POST   /api/bot/start        - Start trading
POST   /api/bot/stop         - Stop trading
GET    /api/bot/status       - Get bot status
GET    /api/bot/stats        - Get statistics
```

### Trading Data
```
GET    /api/trades           - List all trades
GET    /api/positions        - Current positions
GET    /api/funding-rates    - Monitor funding rates
GET    /api/opportunities    - Active opportunities
```

### Portfolio
```
GET    /api/portfolio        - Portfolio summary
GET    /api/performance      - P&L performance
GET    /api/history          - Trade history
```

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + Redis
- **API Client**: Binance API (ccxt)
- **Task Queue**: Bull
- **Real-time**: Socket.io

### Frontend
- **Framework**: React 18
- **State**: Redux Toolkit
- **Charts**: TradingView Lightweight Charts
- **UI**: Material-UI v5
- **HTTP**: Axios
- **Real-time**: Socket.io-client

## 📝 Environment Variables

```bash
# Binance API
BINANCE_API_KEY=your_key
BINANCE_API_SECRET=your_secret

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/baz_trade
REDIS_URL=redis://localhost:6379

# Bot Config
BOT_INITIAL_BALANCE=1000
BOT_MAX_POSITION_SIZE=100
BOT_LEVERAGE=2
BOT_MIN_PROFIT_PERCENTAGE=0.1

# Server
BACKEND_PORT=5000
FRONTEND_PORT=3000
NODE_ENV=production
```

## ⚠️ Disclaimer

**This is a high-risk trading bot. Use at your own risk.**
- Test thoroughly in testnet first
- Start with small amounts
- Monitor actively
- Never risk capital you can't afford to lose
- Understand funding rate mechanics completely

## 📄 License

MIT License - See LICENSE file

## 🤝 Support

For issues and questions, please create an issue in the repository.
