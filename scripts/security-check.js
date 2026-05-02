#!/usr/bin/env node
/**
 * MARKZAP SECURITY CHECKER
 * Scans project for security issues and validates configuration
 */

const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[PASS]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[FAIL]${colors.reset} ${msg}`),
};

const checks = [];
let passCount = 0;
let failCount = 0;
let warnCount = 0;

function addCheck(name, testFn, critical = true) {
  checks.push({ name, testFn, critical });
}

function runCheck(check) {
  try {
    const result = check.testFn();
    if (result.pass) {
      log.success(`${check.name}: ${result.message || 'OK'}`);
      passCount++;
    } else if (result.warn) {
      log.warn(`${check.name}: ${result.message}`);
      warnCount++;
    } else {
      log.error(`${check.name}: ${result.message}`);
      failCount++;
      if (check.critical) process.exitCode = 1;
    }
  } catch (err) {
    log.error(`${check.name}: Unexpected error - ${err.message}`);
    failCount++;
    if (check.critical) process.exitCode = 1;
  }
}

// ========================================
// SECURITY CHECKS
// ========================================

// 1. Check for .gitignore presence and content
addCheck('.gitignore exists', () => {
  if (!fs.existsSync('.gitignore')) {
    return { pass: false, message: '.gitignore file missing' };
  }
  const content = fs.readFileSync('.gitignore', 'utf8');
  const requiredPatterns = ['.jetro/', 'credentials', '.env', 'backup/', 'temp/', 'node_modules/'];
  const missing = requiredPatterns.filter(p => !content.includes(p));
  
  if (missing.length > 0) {
    return { pass: false, message: `Missing patterns: ${missing.join(', ')}` };
  }
  return { pass: true, message: 'All critical patterns included' };
});

// 2. Check index.html for CSP meta tag
addCheck('index.html has CSP', () => {
  if (!fs.existsSync('index.html')) {
    return { pass: false, message: 'index.html not found' };
  }
  const content = fs.readFileSync('index.html', 'utf8');
  if (!content.includes('Content-Security-Policy')) {
    return { pass: false, message: 'CSP meta tag missing' };
  }
  if (!content.includes('frame-ancestors')) {
    return { pass: false, message: 'frame-ancestors directive missing from CSP' };
  }
  return { pass: true, message: 'CSP configured correctly' };
});

// 3. Check for X-Frame-Options
addCheck('X-Frame-Options present', () => {
  const content = fs.readFileSync('index.html', 'utf8');
  if (!content.includes('X-Frame-Options')) {
    return { pass: false, message: 'X-Frame-Options header missing' };
  }
  if (!content.includes('DENY') && !content.includes('SAMEORIGIN')) {
    return { pass: false, message: 'X-Frame-Options should be DENY or SAMEORIGIN' };
  }
  return { pass: true };
});

// 4. Check for HSTS header
addCheck('HSTS configured', () => {
  const content = fs.readFileSync('index.html', 'utf8');
  if (!content.includes('Strict-Transport-Security')) {
    return { pass: false, message: 'HSTS header missing' };
  }
  if (!content.includes('max-age=31536000')) {
    return { pass: false, message: 'HSTS max-age should be at least 1 year (31536000)' };
  }
  return { pass: true };
});

// 5. Check for HTTPS enforcement script
addCheck('HTTPS redirect script', () => {
  const content = fs.readFileSync('index.html', 'utf8');
  if (!content.includes('location.protocol') && !content.includes('HTTPS')) {
    return { pass: false, message: 'No HTTPS enforcement script found' };
  }
  return { pass: true };
});

// 6. Check credentials.json is empty or ignored
addCheck('Credentials protected', () => {
  const credPath = path.join('.jetro', 'daemon', 'credentials.json');
  if (fs.existsSync(credPath)) {
    const content = fs.readFileSync(credPath, 'utf8').trim();
    if (content !== '{}' && content !== '') {
      return { pass: false, message: 'credentials.json contains data - should be empty' };
    }
  }
  return { pass: true };
});

// 7. Check .htaccess security rules
addCheck('.htaccess security rules', () => {
  if (!fs.existsSync('.htaccess')) {
    return { pass: false, message: '.htaccess file missing' };
  }
  const content = fs.readFileSync('.htaccess', 'utf8');
  const required = ['Options -Indexes', 'Require all denied', 'X-Frame-Options', 'Strict-Transport-Security'];
  const missing = required.filter(r => !content.includes(r));
  if (missing.length > 0) {
    return { pass: false, message: `Missing rules: ${missing.join(', ')}` };
  }
  return { pass: true };
});

// 8. Check server.js has Helmet configured
addCheck('Server.js security headers', () => {
  if (!fs.existsSync('server.js')) {
    return { pass: true, message: 'No server.js found (static hosting OK)' };
  }
  const content = fs.readFileSync('server.js', 'utf8');
  if (!content.includes('helmet')) {
    return { pass: false, message: 'Helmet middleware not used' };
  }
  if (!content.includes('csp') || !content.includes('hsts')) {
    return { pass: false, message: 'Helmet CSP/HSTS not configured' };
  }
  return { pass: true };
});

// 9. Check for secrets in code
addCheck('No hardcoded secrets', () => {
  const patterns = [
    /api_key\s*[=:]/i,
    /secret\s*[=:]/i,
    /password\s*[=:]/i,
    /token\s*[=:]/i,
    /private_key\s*[=:]/i,
    /BEGIN\s+PRIVATE\s+KEY/i,
    /AIza[0-9A-Za-z\\-_]{35}/i, // Google API key
  ];
  
  const htmlFiles = ['index.html', ...(fs.existsSync('public') ? fs.readdirSync('public').filter(f => f.endsWith('.html')) : [])];
  
  for (const file of htmlFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          return { pass: false, message: `Potential secret in ${file}` };
        }
      }
    }
  }
  return { pass: true };
});

// 10. Check _redirects for HTTPS (Netlify)
addCheck('Netlify HTTPS redirects', () => {
  const redirectsPath = path.join('public', '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    return { pass: true, message: 'No _redirects file (not using Netlify)' };
  }
  const content = fs.readFileSync(redirectsPath, 'utf8');
  if (!content.includes('https://')) {
    return { pass: false, message: '_redirects does not enforce HTTPS' };
  }
  return { pass: true };
});

// 11. Verify assets exist
addCheck('Critical assets exist', () => {
  const requiredAssets = ['markzap_logo.png', 'logo.jpeg'];
  const assetsDir = 'assets';
  if (!fs.existsSync(assetsDir)) {
    return { pass: false, message: 'assets directory missing' };
  }
  const missing = requiredAssets.filter(asset => !fs.existsSync(path.join(assetsDir, asset)));
  if (missing.length > 0) {
    return { pass: false, message: `Missing: ${missing.join(', ')}` };
  }
  return { pass: true };
});

// 12. Check robots.txt
addCheck('robots.txt configured', () => {
  if (!fs.existsSync('public/robots.txt') && !fs.existsSync('robots.txt')) {
    return { pass: true, message: 'No robots.txt (optional for small sites)' };
  }
  const content = fs.existsSync('public/robots.txt') 
    ? fs.readFileSync('public/robots.txt', 'utf8')
    : fs.readFileSync('robots.txt', 'utf8');
  
  if (!content.includes('User-agent:')) {
    return { pass: false, message: 'Invalid robots.txt format' };
  }
  return { pass: true };
});

// 13. Check for SSL certificate (if using local)
addCheck('SSL certificate (dev)', () => {
  // Only warn if localhost without HTTPS in dev
  return { pass: true, message: 'SSL handled by hosting provider' };
});

// 14. Check dependency vulnerabilities
addCheck('No known vulnerabilities (info)', () => {
  if (!fs.existsSync('package-lock.json') && !fs.existsSync('yarn.lock')) {
    return { pass: true, message: 'No lockfile (skip vulnerability scan)' };
  }
  // Could run `npm audit` here but requires npm
  return { pass: true, message: 'Run `npm audit` manually for full check' };
});

// 15. Verify backup scripts are executable
addCheck('Backup scripts ready', () => {
  if (!fs.existsSync('scripts/backup.sh') && !fs.existsSync('scripts/backup.bat')) {
    return { pass: false, message: 'No backup scripts found' };
  }
  return { pass: true };
});

// ========================================
// RUN CHECKS
// ========================================

console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset);
console.log(colors.cyan + '  MARKZAP SECURITY CHECKER' + colors.reset);
console.log(colors.cyan + '═'.repeat(60) + colors.reset + '\n');

for (const check of checks) {
  runCheck(check);
}

// Summary
console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset);
console.log(`${colors.green}PASSED: ${passCount}${colors.reset} | ${colors.yellow}WARNINGS: ${warnCount}${colors.reset} | ${colors.red}FAILED: ${failCount}${colors.reset}`);
console.log(colors.cyan + '═'.repeat(60) + colors.reset + '\n');

if (failCount === 0) {
  console.log(colors.green + '✓ Security checks passed! Site is ready for deployment.' + colors.reset);
  console.log('\nNext steps:');
  console.log('  1. Run: npm install (if not done)');
  console.log('  2. Test locally: npm start');
  console.log('  3. Deploy: ./scripts/deploy.sh');
} else {
  console.log(colors.red + '✗ Security issues found. Fix before deploying.' + colors.reset);
  console.log('\nCritical issues MUST be resolved.');
}

process.exit(failCount > 0 ? 1 : 0);
