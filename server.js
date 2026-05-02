const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file (development only)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed or .env not present - that's OK for production
}

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'production';

// Development logging
if (NODE_ENV === 'development') {
  console.log('🔧 Development mode enabled');
  console.log('   Port:', PORT);
  console.log('   Host:', HOST);
}

// Comprehensive security headers with Helmet
const securityConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // For development - remove in strict production
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // For development
        "https://fonts.googleapis.com"
      ],
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
};

// In development, relax some policies for easier debugging
if (NODE_ENV === 'development') {
  securityConfig.contentSecurityPolicy.directives.scriptSrc.push("'unsafe-eval'");
  securityConfig.contentSecurityPolicy.directives.connectSrc.push('http://localhost:*');
}

app.use(helmet(securityConfig));

// Host redirect - redirect non-www to www
app.use((req, res, next) => {
  const host = req.headers.host;
  if (host && host.startsWith('markzap.online') && !host.startsWith('www.')) {
    return res.redirect(301, `https://www.markzap.online${req.url}`);
  }
  next();
});

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'development' ? '*' : 'https://markzap.online',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: NODE_ENV === 'development' ? false : true,
  maxAge: 86400, // 24 hours
};

if (NODE_ENV === 'development') {
  // In development, allow all origins for easier testing
  app.use(cors());
} else {
  app.use(cors(corsOptions));
}

// Compression middleware (gzip)
app.use(compression());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory (production build)
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath, {
    maxAge: NODE_ENV === 'production' ? '1y' : 0,
    etag: true,
    lastModified: true,
  }));
  console.log(`📁 Serving static files from: ${publicPath}`);
}

// Serve assets and images directories
['assets', 'images'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    app.use(`/${dir}/`, express.static(dirPath, {
      maxAge: NODE_ENV === 'production' ? '1y' : 0,
      etag: true,
      lastModified: true,
    }));
    if (NODE_ENV === 'development') {
      console.log(`📁 Serving ${dir}/ directory`);
    }
  }
});

// Development: watch for file changes and log
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
    version: require('./package.json').version,
  };
  res.status(200).json(health);
});

// Metrics endpoint (for monitoring)
if (process.env.ENABLE_METRICS === 'true' || NODE_ENV === 'development') {
  app.get('/metrics', (req, res) => {
    res.json({
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    });
  });
}

// API routes
app.use('/api', require('./routes/api'));

// Send index.html for all non-API requests (SPA fallback)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const indexPath = path.join(__dirname, 'public', 'index.html');
  const fallbackPath = path.join(__dirname, 'index.html');

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath, {
      headers: {
        'Cache-Control': NODE_ENV === 'production'
          ? 'public, max-age=3600, must-revalidate'
          : 'no-cache, no-store, must-revalidate',
      },
    });
  } else if (fs.existsSync(fallbackPath)) {
    res.sendFile(fallbackPath);
  } else {
    res.status(404).send('Site not found - run npm run build first');
  }
});

// Error handlers
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong',
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// ========================================
// START SERVER (only in development or non-serverless)
// ========================================

const isProduction = NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1' || process.env.NOW_REGION;

// Only start HTTP server if NOT on Vercel (Vercel uses serverless)
if (!isVercel) {
  const server = app.listen(PORT, HOST, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log(`║  🚀 MarkZap server running              ║`);
    console.log(`║  ${NODE_ENV.padEnd(36)}║`);
    console.log(`║  URL: http://${HOST}:${PORT.toString().padEnd(30)}║`);
    console.log(`║  Health: http://${HOST}:${PORT}/health ║`);
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
    console.log('📋 Available commands:');
    console.log('   npm run dev       - Start development server (with hot reload)');
    console.log('   npm start         - Start production server');
    console.log('   npm run build     - Build production assets');
    console.log('   npm test          - Run all checks');
    console.log('   npm run backup    - Create backup');
    console.log('');
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal} - shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => {
      console.log('⚠️  Force closing...');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
} else {
  console.log('🌶️  Running on Vercel (serverless mode)');
  console.log('   Exporting app as module...');
}

// Export for Vercel / testing
module.exports = app;

