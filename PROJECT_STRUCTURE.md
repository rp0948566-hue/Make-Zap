# MarkZap Project - File and Folder Organization
# ================================================

## Project Structure Overview

This is a MarkZap Digital Agency website project deployed at https://markzap.online

## Directory Layout

```
webside/
├── index.html              # Main production HTML file (PRIMARY)
├── assets/                 # Production assets (images, logos)
│   ├── markzap-logo.png
│   ├── markzap-card.png
│   └── ...
├── public/                 # Deployable public files (symlinked/copied)
│   ├── index.html
│   └── assets/
├── config/                 # Configuration files
│   ├── security.json
│   ├── deployment.json
│   └── backup-config.json
├── scripts/                # Build, deploy, and backup scripts
│   ├── build.sh
│   ├── deploy.sh
│   ├── backup.sh
│   └── security-check.sh
├── backup/                # Automated backups (gitignored)
│   ├── full_backups/
│   ├── incremental/
│   └── manifest.json
├── temp/                  # Temporary files (gitignored)
├── tests/                 # Test files (Playwright)
│   └── .playwright-mcp/
├── development/           # Development versions (archived)
│   └── new/project/       # Old versions - safe to archive
├── .gitignore             # Git ignore rules (CRITICAL)
├── SECURITY.md            # Security policy and procedures
├── DEPLOYMENT.md          # Deployment guide
├── BACKUP.md              # Backup procedures
├── README.md              # Project documentation
└── kilo.json              # Kilo CLI configuration

## Key Files and Their Purposes

### Production Files
- **index.html** - Main website landing page with full SEO, security headers, optimized
- **assets/** - Images, logos, icons used in production

### Security-Critical Files (PROTECTED)
- **.jetro/daemon/credentials.json** - API keys and service credentials (NEVER commit)
- **.env** (if created) - Environment variables (NEVER commit)
- **config/security.json** - Security headers and CSP configuration

### Development/Testing Files (ARCHIVED)
- **new/project/** - Old HTML variations (archive for reference only)
- **.playwright-mcp/** - Playwright test automation files
- **markzap-standalone-*.html** - Alternative layouts (archived)

## Security Zones

### 🔴 RED ZONE - Never Commit
```
.jetro/
credentials.json
.env
*.key
*.pem
backup/
temp/
node_modules/
.DS_Store
*.log
```

### 🟡 YELLOW ZONE - Internal Only
```
config/security.json (contains header configs, not secrets)
tests/
.playwright-mcp/
```

### 🟢 GREEN ZONE - Production Ready
```
index.html (with security headers)
assets/ (optimized)
scripts/deploy.sh (production deploy)
public/ (final deploy package)
```

## File Naming Conventions

- HTML files: kebab-case (index.html, pricing.html)
- CSS classes: kebab-case (.hero-section, .cta-button)
- JS files: camelCase (analytics.js, main.js)
- Images: descriptive-kebab (markzap-logo.png, hero-background.jpg)
- Backup files: timestamped (backup_2026-05-02_0644.tar.gz)

## Backup Strategy

1. **Daily Incremental** - Changed files only
2. **Weekly Full** - Complete project snapshot
3. **Pre-deployment** - Backup before any production change
4. **Post-deployment** - Snapshot after successful deploy

All backups stored in: backup/full_backups/ and backup/incremental/

## Deployment Checklist

- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] All credentials in environment variables only
- [ ] assets/ optimized (images compressed)
- [ ] index.html validated (W3C validator)
- [ ] robots.txt present
- [ ] sitemap.xml generated
- [ ] .htaccess or netlify.toml configured for redirects
- [ ] HTTPS enforced (no HTTP fallback)
- [ ] All temporary files removed
- [ ] Clean git status (no unintended files staged)

## Contact & Support

Security issues: Report immediately to security@markzap.online
Deployment issues: Check DEPLOYMENT.md
General questions: hello@markzap.online
