# Setup Instructions

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Binance Futures Account
- Binance API Keys (with futures trading enabled)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/baztrade657-arch/baz-trade.git
cd baz-trade
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Binance API
BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_api_secret
BINANCE_TEST_MODE=false  # Set true for testnet

# Database
DATABASE_URL=postgresql://baz_user:baz_password@postgres:5432/baz_trade_db
REDIS_URL=redis://redis:6379

# Bot Settings
BOT_INITIAL_BALANCE=1000
BOT_MAX_POSITION_SIZE=100
BOT_LEVERAGE=2
BOT_MIN_PROFIT_PERCENTAGE=0.1

# Server
BACKEND_PORT=5000
FRONTEND_PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=your_secure_jwt_secret_key
```

### 3. Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### 4. Initialize Database

```bash
# Run migrations
docker-compose exec backend npm run migrate

# Seed data (optional)
docker-compose exec backend npm run seed
```

## Access Dashboard

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/docs

## Local Development (Without Docker)

### Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### Frontend

```bash
cd frontend
npm install

# Start development server
npm run dev
```

## Project Structure

```
baz-trade/
├── backend/
│   ├── src/
│   │   ├── api/              # REST API routes
│   │   ├── bot/              # Bot logic
│   │   ├── services/         # External services
│   │   ├── strategies/       # Trading strategies
│   │   ├── utils/            # Utilities
│   │   └── index.ts          # Entry point
│   ├── prisma/               # Database schema
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store
│   │   ├── services/         # API clients
│   │   └── App.tsx           # Entry point
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Features

### 🤖 Trading Bot
- Real-time funding rate monitoring
- Automated arbitrage execution
- Risk management (position sizing, stop-loss)
- High-frequency trading support
- Portfolio heat management

### 📊 Dashboard
- Live bot control (Start/Stop)
- Real-time performance tracking
- Trade history
- Portfolio analytics
- Daily/Monthly/Yearly performance charts
- Institutional-grade UI

### 🔧 Infrastructure
- PostgreSQL for data persistence
- Redis for caching & real-time updates
- WebSocket for live updates
- Docker containerization
- Ready for Vercel deployment

## API Endpoints

### Bot Control
```
POST   /api/bot/start        - Start trading bot
POST   /api/bot/stop         - Stop trading bot
GET    /api/bot/status       - Get bot status
GET    /api/bot/stats        - Get bot statistics
```

### Trading
```
GET    /api/trades           - List all trades
GET    /api/trades/:id       - Get trade details
GET    /api/positions        - Current positions
GET    /api/funding-rates/:symbol  - Funding rate for symbol
```

### Portfolio
```
GET    /api/portfolio/summary      - Portfolio summary
GET    /api/portfolio/performance  - Performance analytics
```

## Deployment

### Deploy to Vercel (Frontend)

```bash
# Connect your GitHub repo to Vercel
# Vercel will automatically detect Next.js/React apps
# Set environment variables in Vercel dashboard
# Deploy
```

### Deploy Backend (Heroku/Railway/EC2)

```bash
# Using Railway
railway login
railway init
railway up

# Or using Heroku
heroku login
heroku create baz-trading-bot
git push heroku main
```

## Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Testnet Trading

Set `BINANCE_TEST_MODE=true` in `.env` to use Binance testnet.

## Troubleshooting

### Bot not starting
- Check Binance API keys
- Verify database connection
- Check logs: `docker-compose logs backend`

### Dashboard not connecting
- Verify backend is running on port 5000
- Check WebSocket connection
- Browser console for errors

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Run migrations: `npm run migrate`

## Security

⚠️ **Important**:
- Never commit `.env` file
- Use environment variables for secrets
- Enable IP whitelisting on Binance API
- Use read-only API keys for monitoring
- Keep API keys secure

## Disclaimer

**This is a high-risk trading bot. Use at your own risk.**

- Test thoroughly in testnet first
- Start with small amounts
- Monitor actively
- Never risk capital you can't afford to lose
- Understand funding rate mechanics completely
- Market conditions can change rapidly

## Support & Contributing

For issues, questions, or contributions:
1. Create an issue on GitHub
2. Submit a pull request
3. Contact: baztrade657@gmail.com

## License

MIT License - See LICENSE file

## Roadmap

- [ ] Advanced charting with TradingView
- [ ] Machine learning predictions
- [ ] Multi-account management
- [ ] Mobile app
- [ ] Telegram bot notifications
- [ ] Advanced risk management
- [ ] Backtesting engine
- [ ] Paper trading mode

---

**Made with ❤️ by BAZ Team**
