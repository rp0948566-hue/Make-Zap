/**
 * MARKZAP BUILD SCRIPT
 * Prepares production build with optimization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = __dirname;
const BUILD_DIR = path.join(PROJECT_ROOT, 'public');
const SOURCE_HTML = path.join(PROJECT_ROOT, 'index.html');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'assets');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'images');

console.log('🔨 Building MarkZap production assets...\n');

// 1. Clean previous build
console.log('[1/6] Cleaning previous build...');
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
}
fs.mkdirSync(BUILD_DIR, { recursive: true });

// 2. Copy and optimize index.html
console.log('[2/6] Processing index.html...');
if (!fs.existsSync(SOURCE_HTML)) {
  console.error('❌ index.html not found!');
  process.exit(1);
}

let html = fs.readFileSync(SOURCE_HTML, 'utf8');

// Minify HTML (basic)
html = html
  .replace(/\s+/g, ' ')           // Collapse whitespace
  .replace(/\s*>\s*/g, '>')       // Remove spaces around tags
  .replace(/\s*<\s*/g, '<')
  .trim();

// Add production build timestamp
html = html.replace(
  '<!-- Build Timestamp -->',
  `<!-- Built: ${new Date().toISOString()} -->`
);

fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), html);
console.log('   ✅ index.html processed');

// 3. Copy assets
console.log('[3/6] Copying assets...');
if (fs.existsSync(ASSETS_DIR)) {
  fs.cpSync(ASSETS_DIR, path.join(BUILD_DIR, 'assets'), { recursive: true });
  console.log('   ✅ assets/ copied');
}

if (fs.existsSync(IMAGES_DIR)) {
  fs.cpSync(IMAGES_DIR, path.join(BUILD_DIR, 'images'), { recursive: true });
  console.log('   ✅ images/ copied');
}

// 4. Copy configuration files
console.log('[4/6] Copying configuration...');
const configFiles = ['.htaccess', '_redirects', 'robots.txt', 'sitemap.xml', 'manifest.json'];
configFiles.forEach(file => {
  const src = path.join(PROJECT_ROOT, file);
  const dest = path.join(BUILD_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`   ✅ ${file} copied`);
  }
});

// 5. Generate sitemap.xml if not exists
if (!fs.existsSync(path.join(PROJECT_ROOT, 'sitemap.xml'))) {
  console.log('[5/6] Generating sitemap.xml...');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://markzap.online/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://markzap.online/#services</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://markzap.online/#showcase</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://markzap.online/#about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://markzap.online/#pricing</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://markzap.online/#contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
  fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap);
  console.log('   ✅ sitemap.xml generated');
}

// 6. Generate robots.txt
console.log('[6/6] Generating robots.txt...');
const robots = `User-agent: *
Allow: /
Disallow: /backup/
Disallow: /config/
Disallow: /scripts/
Disallow: /temp/
Disallow: /node_modules/
Disallow: /.git/

Sitemap: https://markzap.online/sitemap.xml`;
fs.writeFileSync(path.join(BUILD_DIR, 'robots.txt'), robots);
console.log('   ✅ robots.txt generated');

// 7. Verify build
console.log('\n✅ Build complete!');
console.log(`📁 Output: ${BUILD_DIR}`);
console.log('\nFiles created:');
const files = fs.readdirSync(BUILD_DIR);
files.forEach(f => {
  const stats = fs.statSync(path.join(BUILD_DIR, f));
  const size = (stats.size / 1024).toFixed(1);
  console.log(`   ${f} (${size} KB)`);
});

// 8. Security check on build
console.log('\n🔍 Running post-build security check...');
const buildHtml = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');

const securityIssues = [];

// Check for required security headers
const requiredHeaders = [
  'Content-Security-Policy',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Strict-Transport-Security',
  'Referrer-Policy'
];

requiredHeaders.forEach(header => {
  if (!buildHtml.includes(header)) {
    securityIssues.push(`Missing security header: ${header}`);
  }
});

if (securityIssues.length > 0) {
  console.log('⚠️  Security warnings:');
  securityIssues.forEach(issue => console.log(`   - ${issue}`));
} else {
  console.log('✅ All security headers present');
}

console.log('\n🎉 Build successful! Ready for deployment.');
console.log('\nNext steps:');
console.log('   1. Test locally: npm start');
console.log('   2. Deploy: vercel --prod (or netlify deploy --prod)');
console.log('   3. Verify: https://markzap.online');

process.exit(0);
