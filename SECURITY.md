# 🔒 MARKZAP SECURITY POLICY

## Security Overview

MarkZap Digital Agency website - Production security measures and best practices.

## 🔴 CRITICAL: Never Commit These

### Environment Secrets
```
.env
.jetro/daemon/credentials.json
*.key
*.pem
*.crt
secrets.json
API_KEYS*
```

### Sensitive Configurations
```
config/local.json
config/production.json (if contains secrets)
credentials/
secrets/
```

### Generated Files
```
node_modules/
dist/build/ (if generated)
*.log
coverage/
.DS_Store
```

## ✅ Implemented Security Measures

### 1. Content Security Policy (CSP)
- **Location**: `index.html` meta tag
- **Purpose**: Prevents XSS attacks by whitelisting resources
- **Policy**:
  - `default-src 'self'` - Only load from same origin
  - `script-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com 'unsafe-inline'`
  - `style-src 'self' https://fonts.googleapis.com 'unsafe-inline'`
  - `img-src 'self' data: https: blob:` - Images from self, data URIs, HTTPS
  - `connect-src 'self' https:` - AJAX only to HTTPS endpoints
  - `frame-ancestors 'none'` - Clickjacking protection
  - `upgrade-insecure-requests` - Force HTTPS

### 2. HTTPS Enforcement
- **Meta tag**: `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`
- **Script**: Automatic HTTPS redirect (non-localhost)
- **Server**: Netlify _redirects and .htaccess force HTTPS 301
- **HSTS**: `max-age=31536000; includeSubDomains; preload`

### 3. Security Headers (All Production)
| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer data |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Disable risky APIs |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Enforce HTTPS |

### 4. Credentials Protection
- **`.jetro/daemon/credentials.json`** - NEVER commit (gitignored)
- All API keys stored in environment variables only
- No secrets in HTML/JS/CSS files

### 5. Anti-Forgery
- CSRF tokens implemented where forms exist
- SameSite cookie policy enforced
- CORS restricted to same origin

## 🛡️ PHP & Server Hardening (if applicable)

### PHP Configuration (php.ini)
```ini
expose_php = Off
display_errors = Off
log_errors = On
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_strict_mode = 1
allow_url_fopen = Off
allow_url_include = Off
file_uploads = On
upload_max_filesize = 10M
post_max_size = 12M
max_execution_time = 30
memory_limit = 256M
```

### Apache Security (if using .htaccess)
Already configured in `.htaccess`:
- Directory listing disabled
- Sensitive files blocked
- .git access denied
- Request size limited

## 🔍 Security Scanning Checklist

Before deploying, run these checks:

- [ ] **CSP Violations**: Check browser console for violations
- [ ] **Mixed Content**: No HTTP resources on HTTPS page
- [ ] **Credential Leaks**: No API keys in source code
- [ ] **Git Clean**: `git status` shows only intentional changes
- [ ] **Vulnerability Scan**: Run `npm audit` if using npm
- [ ] **SSL Labs Test**: https://www.ssllabs.com/ssltest/
- [ ] **Security Headers Check**: https://securityheaders.com/
- [ ] **CSP Evaluator**: https://csp-evaluator.withgoogle.com/

## 🚨 Incident Response

If security breach suspected:

1. **Immediate**:
   - Revoke all exposed credentials
   - Generate new API keys
   - Change all passwords (email, hosting, domain)

2. **Assessment**:
   - Review access logs (last 24h)
   - Check for unauthorized changes
   - Scan for malware

3. **Notification**:
   - Email: security@markzap.online
   - Phone: +919752948832

4. **Recovery**:
   - Restore from clean backup
   - Rotate all secrets again
   - Enable 2FA on all accounts

5. **Post-Mortem**:
   - Document incident
   - Update security policies
   - Train team on findings

## 📋 Regular Security Tasks (Weekly/Monthly)

### Weekly
- [ ] Review access logs for anomalies
- [ ] Check SSL certificate validity
- [ ] Verify backup integrity
- [ ] Scan for exposed credentials (git-secrets, truffleHog)

### Monthly
- [ ] Update dependencies (if using Node.js, PHP packages)
- [ ] Rotate API keys (if policy requires)
- [ ] Security headers validation
- [ ] Pen test (basic)
- [ ] Review user access (FTP, SSH, hosting panels)

### Quarterly
- [ ] Full penetration test
- [ ] Code security audit
- [ ] Third-party library scan
- [ ] Disaster recovery drill
- [ ] Update this SECURITY.md

## 🔧 Security Tools & Commands

### Check for exposed secrets
```bash
# Git secrets (install and configure)
git secrets --scan

# TruffleHog (Python)
trufflehog --regex --entropy=False .

# Manual grep
grep -r "api_key\|secret\|password\|token" . --include="*.js" --include="*.html" --include="*.json"
```

### CSP Violation Monitoring
```javascript
// Add to index.html for CSP logging (remove in prod if not needed)
<script>
  window.addEventListener('securitypolicyviolation', (e) => {
    console.warn('CSP Violation:', e.violatedDirective);
    // Send to monitoring service
  });
</script>
```

### SSL Certificate Check
```bash
# Check SSL expiry
echo | openssl s_client -connect markzap.online:443 2>/dev/null | openssl x509 -noout -dates
```

## 📞 Security Contacts

- **Internal**: security@markzap.online
- **Hosting Provider**: (Check hosting support)
- **Domain Registrar**: (Check registrar support)
- **Emergency**: +919752948832

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Guide](https://content-security-policy.com/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/)
- [Google Web Fundamentals: Security](https://developers.google.com/web/fundamentals/security)

---

**Last Updated**: 2026-05-02
**Version**: 1.0
**Maintained By**: MarkZap Security Team
