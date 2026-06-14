# BAZ Crypto Tech - High-Frequency Funding Rate Arbitrage Bot

## Overview

BAZ Crypto Tech adalah bot trading otomatis yang memanfaatkan strategi **Funding Rate Arbitrage** di Binance Futures. Bot ini dirancang untuk eksekusi cepat dan mencari peluang arbitrase dengan funding rate ekstrem.

### Strategi Utama

1. **Identifikasi Peluang**: Scan semua trading pairs untuk menemukan funding rate negatif (LONG) atau positif (SHORT) yang signifikan
2. **Timing Sempurna**: Masuk posisi pada detik-detik terakhir sebelum funding rate settlement
3. **Eksekusi Cepat**: Gunakan infrastruktur cepat untuk entry/exit dengan latency minimal
4. **Profit Maksimal**: Ambil profit setelah payout funding rate, meskipun profit kecil asalkan melebihi fee

## Fitur

- ✅ Real-time funding rate monitoring
- ✅ Automatic arbitrage execution
- ✅ High-frequency trade execution
- ✅ Institution-grade dashboard
- ✅ Portfolio metrics & performance tracking
- ✅ WebSocket real-time updates
- ✅ Risk management & position sizing

## Tech Stack

### Backend
- **Node.js** + **TypeScript**
- **Express.js** for REST API
- **Socket.IO** for real-time updates
- **Binance API** integration
- **PostgreSQL** for data persistence
- **Redis** for caching & queues

### Frontend (Dashboard)
- **React 18** with TypeScript
- **Next.js** for SSR/SSG
- **Tailwind CSS** for styling
- **Chart.js / Recharts** for analytics
- **Socket.IO Client** for real-time updates
- **Deployment on Vercel**

## Installation

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 7
- Binance Futures Account with API keys

### Setup

1. Clone repository
```bash
git clone https://github.com/Baztrade12/baz-trade.git
cd baz-trade
```

2. Install dependencies
```bash
npm install
```

3. Configure environment
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4. Setup database
```bash
npx prisma migrate dev
```

5. Start bot
```bash
npm run dev
```

6. Start dashboard (in separate terminal)
```bash
npm run dashboard-dev
```

## Configuration

Edit `.env` file untuk mengkonfigurasi:

```env
# Binance API
BINANCE_API_KEY=your_key
BINANCE_API_SECRET=your_secret

# Bot Settings
BOT_MIN_FUNDING_RATE=0.02      # Minimum funding rate to trigger trade
BOT_MAX_POSITION_SIZE=10000    # Maximum position size in USDT
BOT_LEVERAGE=1                 # Leverage multiplier
TRADING_MIN_PROFIT_PERCENT=0.5 # Minimum profit percentage to execute
```

## API Endpoints

### GET /api/status
Get current bot status

### GET /api/portfolio
Get portfolio metrics

### GET /api/positions
Get active positions

### GET /api/trades
Get trade history

### POST /api/bot/start
Start trading bot

### POST /api/bot/stop
Stop trading bot

## Dashboard Features

### Real-time Monitoring
- Live portfolio balance
- Active positions
- Pending trades

### Performance Analytics
- Daily/Monthly/Yearly returns
- Win rate & Sharpe ratio
- Max drawdown
- ROI tracking

### Trade History
- Complete trade log
- Entry/exit prices
- Profit/loss per trade
- Funding fees earned

### Risk Management
- Margin ratio monitoring
- Position size tracking
- Liquidation alerts

## Performance Metrics

Dashboard menampilkan metrik level institusi:

- **Total Balance**: Total akun balance
- **ROI**: Return on Investment
- **Win Rate**: Percentage of winning trades
- **Sharpe Ratio**: Risk-adjusted returns
- **Max Drawdown**: Largest peak-to-trough decline
- **Daily/Monthly/Yearly Returns**: Performance tracking

## Risk Management

- Maximum position size enforcement
- Automatic position closing at funding time
- Margin monitoring & alerts
- Liquidation prevention
- Fee consideration in profit calculation

## Logging

Bot logs disimpan di `logs/` directory:
- `combined.log`: Semua logs
- `error.log`: Error logs only

## Deployment

### Docker
```bash
docker build -t baz-crypto-tech .
docker run -d --env-file .env baz-crypto-tech
```

### Vercel (Dashboard)
```bash
cd dashboard
npm install -g vercel
vercel
```

## Security

- ⚠️ Never commit `.env` file
- ⚠️ Use read-only Binance API keys if possible
- ⚠️ Enable 2FA on Binance account
- ⚠️ Use environment variables for all secrets

## Troubleshooting

### Bot not connecting to Binance
- Check API keys in `.env`
- Verify Binance API key permissions
- Check network connectivity

### Trades not executing
- Verify account has sufficient balance
- Check minimum position size
- Review funding rate threshold settings

### Dashboard not updating
- Check WebSocket connection (browser DevTools)
- Verify API server is running on correct port
- Check CORS settings

## Contributing

Contributions welcome! Please create feature branches and submit PRs.

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open GitHub issues.

## Disclaimer

⚠️ **RISK WARNING**: Crypto trading involves substantial risk. Past performance does not guarantee future results. Always trade responsibly and never risk more than you can afford to lose.
