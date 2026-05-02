const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Comprehensive security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permissionsPolicy: {
    permissions: {
      geolocation: [],
      microphone: [],
      camera: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-site' },
}));

// CORS - allow same origin only
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://markzap.online');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
  next();
});

// Compression middleware (gzip)
const compression = require('compression');
app.use(compression());

// Serve static files from public directory (for production)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static assets from images folder
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// CSP violation report endpoint (optional logging)
app.post('/csp-violation-report', (req, res) => {
  console.warn('CSP Violation:', req.body);
  res.status(204).end();
});

// Send index.html for all non-API requests (SPA fallback)
app.get('*', (req, res) => {
  // Serve from public if exists, else from root
  const indexPath = path.join(__dirname, 'public', 'index.html');
  const fallbackPath = path.join(__dirname, 'index.html');
  
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.sendFile(fallbackPath);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MarkZap secure server is running on http://localhost:${PORT}`);
  console.log(`🔒 Security headers (Helmet) are active.`);
  console.log(`📁 Serving static files from: ${__dirname}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`✅ Production mode enabled`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
