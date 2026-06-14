import { Router } from 'express';
import logger from '../../logger';

const router = Router();

// Bot control endpoints
router.post('/start', (req, res) => {
  try {
    logger.info('Bot start requested');
    res.json({ success: true, message: 'Bot start signal sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start bot' });
  }
});

router.post('/stop', (req, res) => {
  try {
    logger.info('Bot stop requested');
    res.json({ success: true, message: 'Bot stop signal sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop bot' });
  }
});

export default router;
