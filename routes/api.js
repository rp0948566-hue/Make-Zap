/**
 * MarkZap API Routes
 * Add your API endpoints here
 */

const express = require('express');
const router = express.Router();

// Health check (also at /health directly)
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Example API endpoint
router.get('/status', (req, res) => {
  res.json({
    service: 'MarkZap API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Future endpoints:
// router.post('/contact', ...);
// router.get('/services', ...);
// router.post('/newsletter', ...);

module.exports = router;
