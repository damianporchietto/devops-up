const express = require('express');
const router = express.Router();
const pkg = require('../package.json');

/**
 * @swagger
 * /status/page:
 *   get:
 *     summary: Get HTML status page
 *     description: Returns a user-friendly HTML page showing application status
 *     responses:
 *       200:
 *         description: HTML status page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', (req, res) => {
  const status = {
    status: 'ok',
    version: pkg.version,
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  };
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Application Status</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; }
      .status-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; max-width: 600px; }
      .status-ok { color: green; }
      .status-item { margin-bottom: 10px; }
      h1 { color: #333; }
    </style>
  </head>
  <body>
    <div class="status-card">
      <h1>Application Status</h1>
      <div class="status-item">Status: <span class="status-ok">${status.status}</span></div>
      <div class="status-item">Version: ${status.version}</div>
      <div class="status-item">Uptime: ${status.uptime} seconds</div>
      <div class="status-item">Environment: ${status.environment}</div>
      <div class="status-item">Last Updated: ${status.timestamp}</div>
    </div>
  </body>
  </html>
  `;
  
  res.send(html);
});

module.exports = router; 