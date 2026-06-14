/**
 * Multi-Leg Arbitrage Strategy
 * 
 * Simultaneously takes opposite positions on multiple symbols
 * to diversify risk and maximize funding rate collection
 */

import Decimal from 'decimal.js';
import logger from '../utils/logger';

interface Leg {
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entryPrice: number;
  fundingRate: number;
}

interface ArbitragePosition {
  id: string;
  legs: Leg[];
  totalCapital: number;
  expectedProfit: number;
  createdAt: Date;
}

class MultiLegArbitrageStrategy {
  private positions: Map<string, ArbitragePosition> = new Map();

  /**
   * Build multi-leg position from opportunities
   */
  buildMultiLegPosition(
    opportunities: Array<{ symbol: string; direction: 'long' | 'short'; fundingRate: number }>,
    totalCapital: number,
    leverage: number
  ): ArbitragePosition | null {
    if (opportunities.length === 0) {
      logger.warn('No opportunities provided for multi-leg position');
      return null;
    }

    const legs: Leg[] = [];
    const capitalPerLeg = new Decimal(totalCapital).dividedBy(opportunities.length);
    let totalExpectedProfit = new Decimal(0);

    for (const opp of opportunities) {
      // Calculate position size based on leverage
      const notionalValue = capitalPerLeg.times(leverage);
      const quantity = notionalValue.dividedBy(opp.fundingRate); // Approximate

      const leg: Leg = {
        symbol: opp.symbol,
        side: opp.direction,
        quantity: quantity.toNumber(),
        entryPrice: 0, // Will be set during execution
        fundingRate: opp.fundingRate,
      };

      legs.push(leg);

      // Expected profit from this leg = position value * funding rate
      const legProfit = notionalValue.times(Math.abs(opp.fundingRate));
      totalExpectedProfit = totalExpectedProfit.plus(legProfit);
    }

    const positionId = `multi-${Date.now()}`;

    const position: ArbitragePosition = {
      id: positionId,
      legs,
      totalCapital: totalCapital,
      expectedProfit: totalExpectedProfit.toNumber(),
      createdAt: new Date(),
    };

    this.positions.set(positionId, position);

    logger.info(
      `Multi-leg position created: ${positionId} with ${legs.length} legs, expected profit: $${totalExpectedProfit.toFixed(2)}`
    );

    return position;
  }

  /**
   * Calculate portfolio correlation risk
   */
  calculateCorrelationRisk(symbols: string[]): number {
    // Simplified: more symbols = lower risk (better diversification)
    // In production, calculate actual correlation matrix
    if (symbols.length >= 5) return 0.2; // Low correlation risk
    if (symbols.length >= 3) return 0.4; // Medium
    return 0.6; // High
  }

  /**
   * Rebalance positions based on funding rate changes
   */
  rebalancePositions(updatedRates: Record<string, number>): void {
    for (const [positionId, position] of this.positions) {
      const updatedLegs = position.legs.map((leg) => {
        const newRate = updatedRates[leg.symbol];
        if (newRate && newRate !== leg.fundingRate) {
          return { ...leg, fundingRate: newRate };
        }
        return leg;
      });

      position.legs = updatedLegs;
      logger.info(`Rebalanced position ${positionId}`);
    }
  }

  /**
   * Get position by ID
   */
  getPosition(id: string): ArbitragePosition | undefined {
    return this.positions.get(id);
  }

  /**
   * Close position
   */
  closePosition(id: string): ArbitragePosition | null {
    const position = this.positions.get(id);
    if (position) {
      this.positions.delete(id);
      logger.info(`Closed position: ${id}`);
      return position;
    }
    return null;
  }

  /**
   * Get all active positions
   */
  getAllPositions(): ArbitragePosition[] {
    return Array.from(this.positions.values());
  }

  /**
   * Calculate total expected profit across all positions
   */
  getTotalExpectedProfit(): number {
    let total = new Decimal(0);
    for (const position of this.positions.values()) {
      total = total.plus(position.expectedProfit);
    }
    return total.toNumber();
  }
}

export default MultiLegArbitrageStrategy;
