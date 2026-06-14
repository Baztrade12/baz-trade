import express from 'express';
import BinanceService from '../../services/binanceService';
import logger from '../../utils/logger';

const router = express.Router();
const binanceService = new BinanceService();

// Get funding rate for symbol
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const fundingRate = await binanceService.getFundingRate(symbol);
    
    if (!fundingRate) {
      return res.status(404).json({ error: 'Funding rate not found' });
    }
    
    res.json(fundingRate);
  } catch (error) {
    logger.error(`Error fetching funding rate: ${error}`);
    res.status(500).json({ error: 'Failed to fetch funding rate' });
  }
});

export default router;
