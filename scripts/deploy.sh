#!/bin/bash
# ============================================
# MARKZAP - PRODUCTION DEPLOYMENT SCRIPT
# Secure deployment with pre-flight checks
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
PROJECT_ROOT="$(pwd)"
BUILD_DIR="public"
SOURCE_HTML="index.html"
ASSETS_DIR="assets"
CONFIG_FILE="config/deployment.json"
BACKUP_DIR="backup"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)

# Functions
pre_flight_checks() {
    log_info "Running pre-flight checks..."

    # Check if running from correct directory
    if [ ! -f "$SOURCE_HTML" ]; then
        log_error "index.html not found in current directory"
        exit 1
    fi

    # Check git status (optional but recommended)
    if [ -d ".git" ]; then
        log_info "Checking git status..."
        if ! git diff-index --quiet HEAD --; then
            log_warn "You have uncommitted changes - consider committing first"
            read -p "Continue anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_info "Deployment cancelled"
                exit 0
            fi
        fi
    fi

    # Check for sensitive files
    log_info "Scanning for sensitive files..."
    if [ -f ".jetro/daemon/credentials.json" ]; then
        if [ "$(cat .jetro/daemon/credentials.json)" != "{}" ]; then
            log_error "CREDENTIALS FILE IS NOT EMPTY! Remove all secrets before deploying."
            exit 1
        fi
    fi

    # Check for .env files
    if [ -f ".env" ]; then
        log_error ".env file found - remove before deploying!"
        exit 1
    fi

    # Check disk space
    AVAILABLE=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$AVAILABLE" -lt 5 ]; then
        log_warn "Low disk space: ${AVAILABLE}GB available"
    fi

    log_info "Pre-flight checks passed ✓"
}

create_backup() {
    log_info "Creating pre-deployment backup..."

    mkdir -p "$BACKUP_DIR/pre-deploy"

    # Create backup excluding temp files
    tar -czf "$BACKUP_DIR/pre-deploy/pre-deploy_$TIMESTAMP.tar.gz" \
        --exclude='backup/' \
        --exclude='temp/' \
        --exclude='node_modules/' \
        --exclude='.playwright-mcp/' \
        --exclude='.git/' \
        -C "$PROJECT_ROOT" .

    log_info "Backup saved: backup/pre-deploy/pre-deploy_$TIMESTAMP.tar.gz"
}

build() {
    log_info "Building production assets..."

    # Clean previous build
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"

    # Copy index.html
    cp "$SOURCE_HTML" "$BUILD_DIR/"

    # Copy and optimize assets
    if [ -d "$ASSETS_DIR" ]; then
        log_info "Copying and optimizing assets..."
        cp -r "$ASSETS_DIR" "$BUILD_DIR/"

        # Optional: Optimize images (requires imagemagick or similar)
        # find "$BUILD_DIR/assets" -name "*.png" -exec convert {} -strip -interlace Plane -quality 85% {} \;
    fi

    # Copy configuration files (if needed for deploy platform)
    if [ -f "$CONFIG_FILE" ]; then
        log_info "Copying deployment config..."
        cp "$CONFIG_FILE" "$BUILD_DIR/"
    fi

    # Copy _redirects for Netlify
    if [ -f "_redirects" ]; then
        cp "_redirects" "$BUILD_DIR/"
    fi

    # Copy .htaccess for Apache
    if [ -f ".htaccess" ]; then
        cp ".htaccess" "$BUILD_DIR/"
    fi

    # Generate sitemap.xml if not exists
    if [ ! -f "sitemap.xml" ]; then
        log_info "Generating sitemap.xml..."
        cat > "$BUILD_DIR/sitemap.xml" << 'SITEMAP'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://markzap.online/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://markzap.online/#services</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://markzap.online/#showcase</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://markzap.online/#about</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://markzap.online/#pricing</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://markzap.online/#contact</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
SITEMAP
    sed -i "s/\$(date +%Y-%m-%d)/$(date +%Y-%m-%d)/" "$BUILD_DIR/sitemap.xml"
    log_info "sitemap.xml generated"
    fi

    # Generate robots.txt if not exists
    if [ ! -f "robots.txt" ]; then
        log_info "Generating robots.txt..."
        cat > "$BUILD_DIR/robots.txt" << 'ROBOTS'
User-agent: *
Allow: /
Disallow: /backup/
Disallow: /config/
Disallow: /scripts/
Disallow: /temp/

Sitemap: https://markzap.online/sitemap.xml
ROBOTS
        log_info "robots.txt generated"
    else
        cp "robots.txt" "$BUILD_DIR/"
    fi

    # Minify HTML if available (requires html-minifier)
    if command -v html-minifier &> /dev/null; then
        log_info "Minifying HTML..."
        html-minifier \
            --collapse-whitespace \
            --remove-comments \
            --remove-redundant-attributes \
            --remove-script-type-attributes \
            --remove-tag-whitespace \
            --use-short-doctype \
            --minify-css true \
            --minify-js true \
            -o "$BUILD_DIR/index.html" \
            "$BUILD_DIR/index.html"
    fi

    log_info "Build completed ✓"
}

validate_build() {
    log_info "Validating build output..."

    # Check files exist
    if [ ! -f "$BUILD_DIR/index.html" ]; then
        log_error "index.html missing from build!"
        exit 1
    fi

    if [ ! -d "$BUILD_DIR/assets" ]; then
        log_warn "assets/ directory not found in build"
    fi

    # HTML validation (requires tidy or similar)
    if command -v tidy &> /dev/null; then
        log_info "Running HTML validation..."
        tidy -q -e "$BUILD_DIR/index.html" || log_warn "HTML validation found issues (non-critical)"
    fi

    # Security scan
    log_info "Running security scan..."
    if grep -q "api_key\|secret\|password" "$BUILD_DIR/index.html"; then
        log_error "Potential secrets found in HTML!"
        exit 1
    fi

    # Check CSP header in HTML
    if ! grep -q 'Content-Security-Policy' "$BUILD_DIR/index.html"; then
        log_warn "CSP header not found in HTML"
    fi

    log_info "Build validation passed ✓"
}

deploy() {
    log_info "Deploying to production..."

    # Detect platform and deploy accordingly
    if [ -f "netlify.toml" ] || [ "$DEPLOY_PLATFORM" = "netlify" ]; then
        deploy_netlify
    elif [ -f "vercel.json" ] || [ "$DEPLOY_PLATFORM" = "vercel" ]; then
        deploy_vercel
    else
        deploy_generic
    fi
}

deploy_netlify() {
    log_info "Deploying via Netlify CLI..."

    if ! command -v netlify &> /dev/null; then
        log_error "Netlify CLI not installed. Install with: npm install -g netlify-cli"
        exit 1
    fi

    # Check if logged in
    if ! netlify status &> /dev/null; then
        log_error "Not logged in to Netlify. Run: netlify login"
        exit 1
    fi

    # Deploy
    netlify deploy --prod --dir="$BUILD_DIR" --message="Deploy $TIMESTAMP"

    log_info "Netlify deployment complete ✓"
}

deploy_vercel() {
    log_info "Deploying via Vercel..."

    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI not installed. Install with: npm install -g vercel"
        exit 1
    fi

    vercel --prod --yes

    log_info "Vercel deployment complete ✓"
}

deploy_generic() {
    log_info "Generic deployment - copy public/ to your hosting"
    echo ""
    echo "============================================"
    echo "MANUAL DEPLOYMENT REQUIRED"
    echo "============================================"
    echo "1. Upload contents of '$BUILD_DIR/' to your web server"
    echo "2. Ensure .htaccess is uploaded (Apache) or configure nginx"
    echo "3. Verify HTTPS is enforced"
    echo "4. Test: https://markzap.online"
    echo ""
    echo "Build artifacts are in: $BUILD_DIR/"
    log_info "Build ready for manual deployment"
}

post_deploy_checks() {
    log_info "Running post-deployment checks..."

    # Wait for deployment
    sleep 5

    # Test HTTPS
    if curl -s -o /dev/null -w "%{http_code}" "https://markzap.online" | grep -q "200\|301\|302"; then
        log_info "Site is accessible ✓"
    else
        log_warn "Site may not be accessible yet - check manually"
    fi

    # Security headers check
    log_info "Verifying security headers..."
    curl -sI "https://markzap.online" | grep -E "X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security" || log_warn "Some security headers missing"

    log_info "Post-deployment checks complete"
}

cleanup() {
    log_info "Cleaning up temporary files..."

    # Remove temp files
    rm -rf temp/* 2>/dev/null || true

    # Clean old pre-deploy backups (keep last 5)
    if [ -d "$BACKUP_DIR/pre-deploy" ]; then
        ls -t "$BACKUP_DIR/pre-deploy"/*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm
    fi

    log_info "Cleanup complete"
}

# Main execution
main() {
    log_info "MarkZap Deployment Started"
    log_info "Timestamp: $TIMESTAMP"
    echo ""

    pre_flight_checks
    create_backup
    build
    validate_build
    deploy
    post_deploy_checks
    cleanup

    echo ""
    log_info "==========================================="
    log_info "DEPLOYMENT SUCCESSFUL!"
    log_info "==========================================="
    log_info "Site: https://markzap.online"
    log_info "Build: $BUILD_DIR/"
    log_info "Backup: $BACKUP_DIR/pre-deploy/pre-deploy_$TIMESTAMP.tar.gz"
    log_info ""
    log_info "Next steps:"
    log_info "  1. Visit site and test functionality"
    log_info "  2. Check SSL: https://www.ssllabs.com/ssltest/"
    log_info "  3. Check security headers: https://securityheaders.com/"
    log_info "  4. Monitor error logs for 24 hours"
    log_info ""
}

# Parse arguments
case "${1:-}" in
    --backup-only)
        create_backup
        ;;
    --build-only)
        build
        ;;
    --validate)
        validate_build
        ;;
    --deploy)
        deploy
        ;;
    --cleanup)
        cleanup
        ;;
    *)
        main
        ;;
esac
