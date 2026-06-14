-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "totalBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "availableBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usedMargin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leverage" INTEGER NOT NULL,
    "openTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closeTime" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "unrealizedPnL" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "realizedPnL" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fundingPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "profitLoss" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isFundingTrade" BOOLEAN NOT NULL DEFAULT false,
    "fundingRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioMetrics" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "totalBalance" DOUBLE PRECISION NOT NULL,
    "availableBalance" DOUBLE PRECISION NOT NULL,
    "usedMargin" DOUBLE PRECISION NOT NULL,
    "marginRatio" DOUBLE PRECISION NOT NULL,
    "unrealizedPnL" DOUBLE PRECISION NOT NULL,
    "realizedPnL" DOUBLE PRECISION NOT NULL,
    "totalPnL" DOUBLE PRECISION NOT NULL,
    "roi" DOUBLE PRECISION NOT NULL,
    "winRate" DOUBLE PRECISION NOT NULL,
    "dailyReturn" DOUBLE PRECISION NOT NULL,
    "monthlyReturn" DOUBLE PRECISION NOT NULL,
    "yearlyReturn" DOUBLE PRECISION NOT NULL,
    "sharpeRatio" DOUBLE PRECISION NOT NULL,
    "maxDrawdown" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotState" (
    "id" TEXT NOT NULL,
    "isRunning" BOOLEAN NOT NULL DEFAULT false,
    "uptime" INTEGER NOT NULL DEFAULT 0,
    "totalTrades" INTEGER NOT NULL DEFAULT 0,
    "successfulTrades" INTEGER NOT NULL DEFAULT 0,
    "failedTrades" INTEGER NOT NULL DEFAULT 0,
    "lastStartTime" TIMESTAMP(3),
    "lastStopTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingRateSnapshot" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "fundingRate" DOUBLE PRECISION NOT NULL,
    "fundingTime" TIMESTAMP(3) NOT NULL,
    "nextFundingTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundingRateSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradingLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "symbol" TEXT,
    "details" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradingLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Position_accountId_idx" ON "Position"("accountId");

-- CreateIndex
CREATE INDEX "Position_symbol_idx" ON "Position"("symbol");

-- CreateIndex
CREATE INDEX "Position_status_idx" ON "Position"("status");

-- CreateIndex
CREATE INDEX "Trade_accountId_idx" ON "Trade"("accountId");

-- CreateIndex
CREATE INDEX "Trade_symbol_idx" ON "Trade"("symbol");

-- CreateIndex
CREATE INDEX "Trade_executedAt_idx" ON "Trade"("executedAt");

-- CreateIndex
CREATE INDEX "PortfolioMetrics_accountId_idx" ON "PortfolioMetrics"("accountId");

-- CreateIndex
CREATE INDEX "PortfolioMetrics_timestamp_idx" ON "PortfolioMetrics"("timestamp");

-- CreateIndex
CREATE INDEX "FundingRateSnapshot_symbol_idx" ON "FundingRateSnapshot"("symbol");

-- CreateIndex
CREATE INDEX "FundingRateSnapshot_createdAt_idx" ON "FundingRateSnapshot"("createdAt");

-- CreateIndex
CREATE INDEX "TradingLog_timestamp_idx" ON "TradingLog"("timestamp");

-- CreateIndex
CREATE INDEX "TradingLog_action_idx" ON "TradingLog"("action");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioMetrics" ADD CONSTRAINT "PortfolioMetrics_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
