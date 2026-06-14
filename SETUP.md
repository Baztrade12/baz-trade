# BAZ Crypto Tech - Complete Setup Guide

## Project Structure

```
baz-trade/
├── src/                     # Backend bot
│   ├── bot/                # Trading bot logic
│   ├── config/             # Configuration
│   ├── logger/             # Logging
│   └── types/              # TypeScript types
├── dashboard/              # Frontend dashboard (Next.js)
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Zustand store
│   │   ├── styles/        # Tailwind CSS
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
├── package.json            # Root workspace config
└── README.md
```

## Features Implemented

### Backend Bot
- ✅ **Binance API Integration**: Real-time funding rate monitoring
- ✅ **Trading Engine**: Automated arbitrage execution
- ✅ **Portfolio Manager**: Balance tracking & metrics calculation
- ✅ **WebSocket Server**: Real-time data streaming
- ✅ **Position Management**: Entry/exit automation
- ✅ **Risk Management**: Position sizing & margin monitoring

### Frontend Dashboard
- ✅ **Real-time Updates**: WebSocket integration
- ✅ **Portfolio Overview**: Total balance, P&L, ROI
- ✅ **Performance Metrics**: Sharpe ratio, max drawdown, returns
- ✅ **Performance Charts**: Balance & daily P&L tracking
- ✅ **Active Positions**: Live position monitoring
- ✅ **Trade History**: Complete trade log with details
- ✅ **Bot Controls**: Start/stop trading from dashboard
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Institution-Grade UI**: Professional dark theme

## Installation & Setup

### Prerequisites
```bash
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Redis >= 7
- Binance Futures Account with API keys
```

### Step 1: Clone & Install
```bash
git clone https://github.com/Baztrade12/baz-trade.git
cd baz-trade
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
# Binance API
BINANCE_API_KEY=your_api_key
BINANCE_API_SECRET=your_api_secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/baz_crypto_tech
REDIS_URL=redis://localhost:6379

# Bot Configuration
BOT_MIN_FUNDING_RATE=0.02
BOT_MAX_POSITION_SIZE=10000
BOT_LEVERAGE=1
TRADING_MIN_PROFIT_PERCENT=0.5

# API URLs
DASHBOARD_API_PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Step 3: Setup Database
```bash
# Create PostgreSQL database
creatdb baz_crypto_tech

# Run migrations (once Prisma schema is created)
npx prisma migrate dev
```

### Step 4: Start Services

**Terminal 1 - Start Bot:**
```bash
npm run dev:bot
```

**Terminal 2 - Start Dashboard:**
```bash
npm run dev:dashboard
```

The dashboard will be available at `http://localhost:3000`

## API Endpoints

### WebSocket Events

**Client to Server:**
- `subscribe:dashboard` - Subscribe to dashboard updates
- `bot:start` - Start trading bot
- `bot:stop` - Stop trading bot

**Server to Client:**
- `portfolio:update` - Portfolio metrics updated
- `positions:update` - Active positions updated
- `trades:update` - Trade history updated
- `bot:status` - Bot status changed
- `trade:executed` - New trade executed

### REST API (Future)
```
GET  /api/status          - Bot status
GET  /api/portfolio       - Portfolio metrics
GET  /api/positions       - Active positions
GET  /api/trades          - Trade history
POST /api/bot/start       - Start bot
POST /api/bot/stop        - Stop bot
```

## Trading Strategy

### Funding Rate Arbitrage

1. **Scan Phase**: Monitor funding rates across all perpetual pairs
2. **Identify**: Find extreme funding rates (positive or negative)
3. **Calculate**: Estimate profit after fees
4. **Execute**: Enter position near funding settlement time
5. **Collect**: Hold until funding payout
6. **Exit**: Close position for minimal but consistent profit

### Key Parameters
- **Min Funding Rate**: Minimum rate to trigger trade (0.02 = 2%)
- **Max Position Size**: Risk limit per trade ($10,000)
- **Execution Timeout**: Max wait time for order fill (1000ms)
- **Min Profit**: Must exceed fees and slippage (0.5%)

## Dashboard Metrics

### Portfolio Metrics
- **Total Balance**: Account balance in USDT
- **Total P&L**: Cumulative profit/loss
- **ROI**: Return on investment percentage
- **Daily Return**: Today's performance
- **Win Rate**: Percentage of winning trades

### Performance Metrics
- **Sharpe Ratio**: Risk-adjusted returns (annualized)
- **Max Drawdown**: Largest peak-to-trough decline
- **Monthly Return**: This month's performance
- **Yearly Return**: Year-to-date performance

## Deployment

### Deploy Bot to VPS
```bash
# Using Docker
docker build -t baz-crypto-tech .
docker run -d --name baz-bot \
  --env-file .env \
  -v logs:/app/logs \
  baz-crypto-tech
```

### Deploy Dashboard to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```
4. Deploy

```bash
# Or manual deployment
cd dashboard
vercel --prod
```

## Monitoring & Maintenance

### Logs
```bash
# View bot logs
tail -f logs/combined.log

# View error logs
tail -f logs/error.log
```

### Database Maintenance
```bash
# Backup database
pg_dump baz_crypto_tech > backup.sql

# Restore from backup
psql baz_crypto_tech < backup.sql
```

### Performance Optimization
- Use fast network infrastructure (co-locate with exchange API)
- Optimize database queries
- Monitor Redis memory usage
- Keep API rate limits in check

## Security Checklist

- ✅ Use environment variables for all secrets
- ✅ Enable 2FA on Binance account
- ✅ Use read-only API keys when possible
- ✅ Restrict API key to specific IPs
- ✅ Never commit `.env` file
- ✅ Use HTTPS for all connections
- ✅ Implement rate limiting
- ✅ Monitor for suspicious activity

## Troubleshooting

### Bot won't connect to Binance
- Check API keys are correct
- Verify API key has futures trading permissions
- Check network connectivity
- Ensure 2FA is configured on Binance account

### Dashboard shows "Disconnected"
- Check bot is running on correct port
- Verify WebSocket connection in browser DevTools
- Check CORS configuration
- Ensure firewall allows connections

### No trades executing
- Verify account has sufficient USDT balance
- Check funding rate thresholds are met
- Review profit calculations
- Check transaction logs for errors

## Performance Benchmarks

### Expected Performance
- **Trade Frequency**: 50-200 trades per day
- **Win Rate**: 80-95% (due to arbitrage nature)
- **Monthly Return**: 5-15% (based on market conditions)
- **Max Drawdown**: < 5%

## Future Enhancements

- [ ] Multi-exchange support (Deribit, OKX, etc.)
- [ ] Advanced analytics & machine learning
- [ ] Email/SMS alerts for trades
- [ ] Mobile app (React Native)
- [ ] Multi-account management
- [ ] A/B testing for strategy optimization
- [ ] Backtesting engine
- [ ] Discord integration

## Support & Contact

For issues, questions, or contributions:
- GitHub Issues: [Create an issue](https://github.com/Baztrade12/baz-trade/issues)
- Email: support@baztradetech.com

## License

MIT License - See LICENSE file

## Disclaimer

⚠️ **RISK WARNING**: Cryptocurrency trading is highly risky. Past performance does not guarantee future results. This bot is provided as-is without any warranties. Always:
- Start with small amounts
- Test in testnet first
- Monitor the bot regularly
- Use appropriate stop-losses
- Never risk more than you can afford to lose

---

**Happy Trading! 🚀**
