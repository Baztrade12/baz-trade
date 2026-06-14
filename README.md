# BAZ Crypto Tech - Funding Rate Arbitrage Bot

Bot trading otomatis yang memanfaatkan funding rate arbitrage di Binance dengan high-frequency trading.

## 🎯 Fitur Utama

- **Funding Rate Arbitrage**: Deteksi token dengan funding rate ekstrem (long/short)
- **High-Frequency Execution**: Eksekusi cepat di detik akhir periode funding
- **Smart Entry/Exit**: Entry di peak funding rate, exit saat profit
- **Institutional Dashboard**: Real-time monitoring dan analytics
- **Performance Tracking**: Daily, monthly, yearly analytics
- **Portfolio Management**: Diversifikasi risiko otomatis
- **Telegram Alerts**: Notifikasi trade real-time

## 📁 Struktur Proyek

```
baz-trade/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── services/       # Business logic
│   │   ├── controllers/    # API handlers
│   │   ├── models/         # Database schemas
│   │   ├── utils/          # Helper functions
│   │   └── config/         # Configuration
│   └── package.json
├── bot/                    # Trading bot (separate service)
│   ├── src/
│   │   ├── strategies/     # Trading strategies
│   │   ├── services/       # Bot services
│   │   └── config/         # Bot configuration
│   └── package.json
├── dashboard/              # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Helper utilities
│   └── package.json
└── docker-compose.yml      # Local development
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- Binance API Keys

### Installation

1. Clone repository
```bash
git clone https://github.com/baztrade657-arch/baz-trade.git
cd baz-trade
```

2. Setup environment
```bash
cp .env.example .env
# Edit .env dengan API keys Anda
```

3. Install dependencies
```bash
# Backend
cd backend && npm install
cd ../

# Bot
cd bot && npm install
cd ../

# Dashboard
cd dashboard && npm install
cd ../
```

4. Run services
```bash
docker-compose up -d
npm run dev
```

## 📊 Dashboard Features

- Real-time trading metrics
- Portfolio performance analytics
- Funding rate charts
- Trade history & profitability
- Risk management controls
- Start/Stop bot controls

## ⚙️ Configuration

Edit file konfigurasi sesuai kebutuhan:
- `backend/.env` - API dan database config
- `bot/.env` - Bot trading parameters
- `dashboard/.env` - Frontend API endpoint

## 📈 Performance Metrics

- Win Rate Tracking
- ROI Calculation
- Drawdown Analysis
- Risk/Reward Ratio
- Daily/Monthly/Yearly Statistics

## ⚠️ Risk Disclaimer

Cryptocurrency trading melibatkan risiko tinggi. Mulai dengan modal kecil untuk testing.
