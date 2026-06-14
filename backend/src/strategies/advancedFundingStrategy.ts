/**
 * Advanced Funding Rate Arbitrage Strategy
 * 
 * This strategy identifies high-value funding rate opportunities and executes trades
 * with optimal entry/exit points. It focuses on:
 * 
 * 1. Extreme funding rate detection (threshold: ±0.05% per 8h)
 * 2. Market liquidity analysis
 * 3. Portfolio heat management
 * 4. Risk-adjusted position sizing
 * 5. Profit-taking near funding settlement
 */

import Decimal from 'decimal.js';
import BinanceService from '../services/binanceService';
import logger from '../utils/logger';

interface OpportunityScore {
  symbol: string;
  fundingRate: number;
  direction: 'long' | 'short';
  score: number; // 0-100, higher = better
  marketCondition: 'strong' | 'moderate' | 'weak';
  estimatedProfit: number;
  riskLevel: 'low' | 'medium' | 'high';
}

class AdvancedFundingStrategy {
  private binanceService: BinanceService;
  private config = {
    minFundingThreshold: 0.05, // 0.05% = 0.0005 in decimal
    scoreWeights: {
      fundingRate: 0.40, // 40%
      liquidity: 0.25,   // 25%
      volatility: 0.15,  // 15%
      riskReward: 0.20,  // 20%
    },
    profitTargets: {
      low: 0.15,    // 0.15% for low risk
      medium: 0.20, // 0.20% for medium risk
      high: 0.30,   // 0.30% for high risk
    },
  };

  constructor(binanceService: BinanceService) {
    this.binanceService = binanceService;
  }

  /**
   * Analyze funding rates and identify opportunities
   */
  async identifyOpportunities(
    symbols: string[],
    portfolioHeat: number,
    maxHeat: number
  ): Promise<OpportunityScore[]> {
    const opportunities: OpportunityScore[] = [];
    const heatRemaining = maxHeat - portfolioHeat;

    logger.info(`Analyzing ${symbols.length} symbols. Heat remaining: ${heatRemaining}`);

    for (const symbol of symbols) {
      try {
        const fundingData = await this.binanceService.getFundingRate(symbol);
        if (!fundingData) continue;

        const { fundingRate } = fundingData;

        // Check if funding rate is extreme enough
        if (Math.abs(fundingRate) < this.config.minFundingThreshold / 100) {
          continue;
        }

        // Get market metrics
        const metrics = await this.getMarketMetrics(symbol);
        if (!metrics) continue;

        // Score the opportunity
        const score = this.scoreOpportunity({
          symbol,
          fundingRate,
          metrics,
          heatRemaining,
        });

        if (score && score.score > 50) {
          opportunities.push(score);
          logger.info(
            `Opportunity found: ${symbol} (${score.direction}) - Score: ${score.score.toFixed(1)}`
          );
        }
      } catch (error) {
        logger.warn(`Error analyzing ${symbol}: ${error}`);
      }
    }

    // Sort by score (highest first)
    return opportunities.sort((a, b) => b.score - a.score);
  }

  /**
   * Get market metrics for a symbol
   */
  private async getMarketMetrics(symbol: string) {
    try {
      const ticker = await (this.binanceService as any).exchange.fetchTicker(symbol);

      return {
        bid: ticker.bid || 0,
        ask: ticker.ask || 0,
        spread: ticker.ask && ticker.bid ? ((ticker.ask - ticker.bid) / ticker.bid) * 100 : 0,
        volume24h: ticker.quoteVolume || 0,
        high24h: ticker.high || 0,
        low24h: ticker.low || 0,
        volatility: this.calculateVolatility(ticker),
      };
    } catch (error) {
      logger.warn(`Failed to get metrics for ${symbol}: ${error}`);
      return null;
    }
  }

  /**
   * Calculate volatility (high/low ratio)
   */
  private calculateVolatility(ticker: any): number {
    if (!ticker.high || !ticker.low) return 0;
    return ((ticker.high - ticker.low) / ticker.low) * 100;
  }

  /**
   * Score opportunity on multiple factors
   */
  private scoreOpportunity(params: {
    symbol: string;
    fundingRate: number;
    metrics: any;
    heatRemaining: number;
  }): OpportunityScore | null {
    const { symbol, fundingRate, metrics, heatRemaining } = params;

    // Direction based on funding rate sign
    const direction: 'long' | 'short' = fundingRate < 0 ? 'long' : 'short';
    const absFundingRate = Math.abs(fundingRate);

    // Score components (0-100)
    const fundingScore = Math.min((absFundingRate * 100 / 1) * 0.4, 40); // Up to 40 points
    const liquidityScore = this.calculateLiquidityScore(metrics) * 0.25; // Up to 25 points
    const volatilityScore = this.calculateVolatilityScore(metrics) * 0.15; // Up to 15 points
    const riskRewardScore = this.calculateRiskRewardScore(metrics, absFundingRate) * 0.2; // Up to 20 points

    const totalScore = fundingScore + liquidityScore + volatilityScore + riskRewardScore;

    // Estimate potential profit
    const profitPercent = this.estimateProfit(absFundingRate, metrics);

    // Determine risk level
    const riskLevel: 'low' | 'medium' | 'high' =
      metrics.spread > 0.1 ? 'high' : metrics.spread > 0.05 ? 'medium' : 'low';

    // Determine market condition
    const marketCondition: 'strong' | 'moderate' | 'weak' =
      absFundingRate > 0.1 ? 'strong' : absFundingRate > 0.05 ? 'moderate' : 'weak';

    return {
      symbol,
      fundingRate,
      direction,
      score: totalScore,
      marketCondition,
      estimatedProfit: profitPercent,
      riskLevel,
    };
  }

  /**
   * Score based on 24h trading volume
   */
  private calculateLiquidityScore(metrics: any): number {
    // High volume = higher score
    if (metrics.volume24h > 10000000) return 25; // Max score
    if (metrics.volume24h > 1000000) return 20;
    if (metrics.volume24h > 100000) return 15;
    if (metrics.volume24h > 10000) return 10;
    return 5;
  }

  /**
   * Score based on volatility (lower volatility = better for funding rate trades)
   */
  private calculateVolatilityScore(metrics: any): number {
    const vol = metrics.volatility;
    if (vol < 2) return 15; // Max score - very stable
    if (vol < 5) return 12;
    if (vol < 10) return 10;
    if (vol < 15) return 5;
    return 0; // Too volatile
  }

  /**
   * Score based on risk/reward ratio
   */
  private calculateRiskRewardScore(metrics: any, fundingRate: number): number {
    // Spread is the cost of entry/exit
    const spreadCost = metrics.spread * 0.5; // Half for entry, half for exit (rough estimate)

    // Funding rate is the profit
    const fundingProfit = Math.abs(fundingRate);

    // Risk/reward ratio
    const ratio = fundingProfit / (spreadCost + 0.001); // Avoid division by zero

    if (ratio > 10) return 20;
    if (ratio > 5) return 15;
    if (ratio > 2) return 10;
    if (ratio > 1) return 5;
    return 0;
  }

  /**
   * Estimate potential profit percentage
   */
  private estimateProfit(fundingRate: number, metrics: any): number {
    const spreadCost = metrics.spread;
    const fundingProfit = Math.abs(fundingRate);

    // Net profit = funding profit - spread cost
    const netProfit = fundingProfit - spreadCost / 100;

    return Math.max(netProfit, 0);
  }

  /**
   * Calculate optimal position size based on risk
   */
  calculatePositionSize(
    opportunity: OpportunityScore,
    accountBalance: number,
    leverage: number,
    maxHeat: number,
    currentHeat: number
  ): number {
    const heatAvailable = maxHeat - currentHeat;

    // Base position sizing: 2% of account per trade
    let baseSize = new Decimal(accountBalance).times(0.02);

    // Adjust for score confidence
    const scoreMultiplier = opportunity.score / 100;
    baseSize = baseSize.times(scoreMultiplier);

    // Adjust for risk level
    const riskMultiplier =
      opportunity.riskLevel === 'low' ? 1.5 : opportunity.riskLevel === 'medium' ? 1.0 : 0.5;
    baseSize = baseSize.times(riskMultiplier);

    // Ensure doesn't exceed available heat
    const maxByHeat = new Decimal(heatAvailable).dividedBy(leverage);
    baseSize = Decimal.min(baseSize, maxByHeat);

    return baseSize.toNumber();
  }
}

export default AdvancedFundingStrategy;
