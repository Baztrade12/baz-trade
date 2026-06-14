import express from 'express';
import { getBotService } from '../../services/botService';
import logger from '../../utils/logger';

const router = express.Router();

// Start bot
router.post('/start', async (req, res) => {
  try {
    const botService = getBotService();
    const result = await botService.start();
    res.json({
      success: result,
      message: result ? 'Bot started successfully' : 'Bot is already running'
    });
  } catch (error) {
    logger.error(`Error starting bot: ${error}`);
    res.status(500).json({ error: 'Failed to start bot' });
  }
});

// Stop bot
router.post('/stop', async (req, res) => {
  try {
    const botService = getBotService();
    const result = await botService.stop();
    res.json({
      success: result,
      message: result ? 'Bot stopped successfully' : 'Bot is not running'
    });
  } catch (error) {
    logger.error(`Error stopping bot: ${error}`);
    res.status(500).json({ error: 'Failed to stop bot' });
  }
});

// Get bot status
router.get('/status', async (req, res) => {
  try {
    const botService = getBotService();
    const status = await botService.getStatus();
    res.json(status);
  } catch (error) {
    logger.error(`Error getting bot status: ${error}`);
    res.status(500).json({ error: 'Failed to get bot status' });
  }
});

export default router;
