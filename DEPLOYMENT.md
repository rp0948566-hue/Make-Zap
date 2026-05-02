# 🚀 MARKZAP DEPLOYMENT GUIDE

## Quick Start

### Prerequisites
- Git installed
- Access to hosting platform (Netlify, Vercel, cPanel, etc.)
- Domain configured (markzap.online)
- SSL certificate (auto-provisioned by most platforms)

### One-Command Deploy (Netlify)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy (first time - will prompt for site creation)
netlify deploy --prod --dir=public

# Subsequent deploys
netlify deploy --prod
```

### Manual FTP/SFTP Upload

1. Run the deploy script:
   ```bash
   ./scripts/deploy.sh
   ```

2. Upload contents of `public/` folder to your web server's document root via:
   - FileZilla (FTP/SFTP)
   - WinSCP (Windows)
   - Command line SCP: `scp -r public/* user@server:/var/www/html/`

3. Verify deployment:
   ```bash
   curl -I https://markzap.online
   ```

### cPanel Deployment

```bash
# 1. Build
./scripts/deploy.sh --build-only

# 2. Create zip of public folder
cd public
zip -r ../markzap-deploy.zip .
cd ..

# 3. Upload via cPanel File Manager or FTP
#    Extract to public_html/
```

## 📋 Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (if any test suite exists)
- [ ] Security scan completed (check for secrets)
- [ ] Assets optimized (images compressed)
- [ ] index.html updated with latest content
- [ ] .gitignore updated with new sensitive files
- [ ] No uncommitted changes (or committed)
- [ ] Backup created (automatically by script)
- [ ] Domain DNS propagated (if recent changes)
- [ ] SSL certificate active
- [ ] CDN configured (if using)
- [ ] Environment variables set (if needed)

## 🔧 Platform-Specific Instructions

### Netlify

1. Connect GitHub repository (or use CLI)
2. Build settings:
   - Build command: `./scripts/deploy.sh`
   - Publish directory: `public`
3. Environment variables (Site settings → Build & deploy → Environment):
   - `NODE_ENV` = `production`
4. Enable:
   - HTTPS (auto)
   - HTTP → HTTPS redirect (auto)
   - Security headers (from `_redirects` file)

**Netlify.toml** (recommended):
```toml
[build]
  publish = "public"
  command = "./scripts/deploy.sh"

[[redirects]]
  from = "http://*/*"
  to = "https://:splat"
  status = 301
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Verification**:
- SSL auto-provisioned
- Edge network active
- Security headers inherited from `vercel.json` (if created)

### AWS S3 + CloudFront

1. **S3 bucket setup**:
```bash
aws s3 mb s3://markzap.online
aws s3 website s3://markzap.online --index-document index.html --error-document index.html
```

2. **Upload build**:
```bash
./scripts/deploy.sh --build-only
aws s3 sync public/ s3://markzap.online --delete --cache-control max-age=31536000,public
```

3. **CloudFront**:
   - Create distribution with S3 origin
   - Enable HTTPS
   - Configure security headers in behavior

### Traditional VPS (Apache/Nginx)

#### Apache
```bash
# Upload to /var/www/html/
scp -r public/* user@server:/var/www/html/

# Ensure .htaccess is present
scp .htaccess user@server:/var/www/html/

# Set permissions
ssh user@server "chmod -R 755 /var/www/html && chmod 644 /var/www/html/.htaccess"

# Test
curl -I https://markzap.online
```

#### Nginx
```nginx
server {
    listen 80;
    server_name markzap.online www.markzap.online;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name markzap.online www.markzap.online;

    root /var/www/markzap;
    index index.html;

    # SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/markzap.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/markzap.online/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Static assets caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff2|woff)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Deploy:
```bash
./scripts/deploy.sh --build-only
scp -r public/* user@server:/var/www/markzap/
```

## ⚡ Automated Deploys

### GitHub Actions (Netlify)

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.1
        with:
          publish-dir: './public'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          netlify-auth-token: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          netlify-site-id: ${{ secrets.NETLIFY_SITE_ID }}
```

### CI/CD Pipeline (Custom)

`scripts/deploy-ci.sh`:
```bash
#!/bin/bash
set -e

# 1. Test
./scripts/test.sh

# 2. Build
./scripts/deploy.sh --build-only

# 3. Security scan
./scripts/security-check.sh

# 4. Deploy (Netlify)
netlify deploy --prod --dir=public

# 5. Smoke tests
curl -f https://markzap.online || exit 1

# 6. Notify
./scripts/notify.sh "Deployment successful"
```

## 🔄 Rollback Procedure

If deployment breaks:

### Netlify
```bash
# View deploys
netlify deploy:list

# Rollback to previous
netlify deploy:rollback [deploy-id]
```

### Manual
```bash
# 1. Restore from pre-deploy backup
cd /path/to/project
ls -t backup/pre-deploy/

# 2. Extract latest good backup
tar -xzf backup/pre-deploy/pre-deploy_YYYY-MM-DD_HH-MM-SS.tar.gz -C .

# 3. Re-deploy
./scripts/deploy.sh
```

### Emergency
- Restore from daily full backup (7-day retention)
- Contact hosting support for immediate rollback

## 🧪 Staging Environment

**Recommended**:
1. Deploy to `staging.markzap.online` first
2. Run QA tests
3. Stakeholder approval
4. Deploy to production

**Config**:
Set `DEPLOY_ENV=staging` in Netlify/Vercel environment variables.

## 📊 Deployment Metrics

Monitor after deployment:

| Metric | Tool | Target |
|--------|------|--------|
| Page Load Time | Google PageSpeed | < 3s |
| First Contentful Paint | Lighthouse | < 1.5s |
| Largest Contentful Paint | Lighthouse | < 2.5s |
| Cumulative Layout Shift | Lighthouse | < 0.1 |
| SSL Grade | SSL Labs | A+ |
| Security Headers | securityheaders.com | A+ |
| Accessibility | WAVE, axe | 0 errors |

## 🚨 Rollback Triggers

Immediate rollback if:
- ❌ 5xx errors > 1%
- ❌ CSP violations in console
- ❌ Mixed content warnings
- ❌ SSL certificate invalid
- ❌ Core functionality broken

## 📞 Support

Deployment issues?
1. Check `scripts/deploy.log` (if running via cron)
2. Review hosting platform logs (Netlify: Deploys → Details)
3. Contact: devops@markzap.online

---

**Last Updated**: 2026-05-02
**Version**: 1.0
**Next Deployment**: [Scheduled]
