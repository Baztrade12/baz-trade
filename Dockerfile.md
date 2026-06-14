# Docker Configuration

## Building the Bot Image

```bash
docker build -t baz-crypto-tech:latest .
```

## Running the Container

```bash
docker run -d \
  --name baz-bot \
  --env-file .env \
  -v logs:/app/logs \
  -p 3001:3001 \
  -p 3002:3002 \
  baz-crypto-tech:latest
```

## Docker Compose

```yaml
version: '3.8'

services:
  bot:
    build: .
    container_name: baz-crypto-tech
    env_file: .env
    ports:
      - "3001:3001"
      - "3002:3002"
    volumes:
      - ./logs:/app/logs
      - ./data:/app/data
    restart: unless-stopped
    networks:
      - baz-network

  postgres:
    image: postgres:15-alpine
    container_name: baz-postgres
    environment:
      POSTGRES_DB: baz_crypto_tech
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - baz-network

  redis:
    image: redis:7-alpine
    container_name: baz-redis
    ports:
      - "6379:6379"
    networks:
      - baz-network

volumes:
  postgres_data:

networks:
  baz-network:
```

## Environment File

Create `.env` in root directory:

```env
# Binance API
BINANCE_API_KEY=your_key
BINANCE_API_SECRET=your_secret

# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/baz_crypto_tech
REDIS_URL=redis://redis:6379

# Bot Configuration
BOT_MIN_FUNDING_RATE=0.02
BOT_MAX_POSITION_SIZE=10000
BOT_LEVERAGE=1

# Ports
BOT_PORT=3001
DASHBOARD_API_PORT=3002
NODE_ENV=production
```

## Starting with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f bot

# Stop services
docker-compose down
```

## Useful Commands

```bash
# Check container status
docker ps

# View container logs
docker logs -f baz-bot

# Access container shell
docker exec -it baz-bot sh

# Stop container
docker stop baz-bot

# Remove container
docker rm baz-bot
```
