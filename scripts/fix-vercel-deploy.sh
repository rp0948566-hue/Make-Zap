#!/bin/bash
# MARKZAP ONE-CLICK SETUP & DEPLOYMENT FIX
# This script fixes all Vercel issues and prepares for deployment

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🔧 MarkZap Vercel Deployment Fix & Setup               ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Track if we made changes
CHANGES_MADE=0

echo "🔍 Checking for common Vercel deployment issues..."
echo ""

# 1. Check if scripts/build.js exists
if [ ! -f "scripts/build.js" ]; then
    echo -e "${RED}❌ CRITICAL: scripts/build.js is missing!${NC}"
    echo "   This is needed for Vercel to build the project."
    exit 1
else
    echo -e "${GREEN}✅ scripts/build.js exists${NC}"
fi

# 2. Check if _redirects exists in public/ (causes Vercel error)
if [ -f "public/_redirects" ]; then
    echo -e "${YELLOW}⚠️  Found public/_redirects (Netlify format)${NC}"
    echo "   This causes 'Invalid redirect pattern' error on Vercel."
    read -p "   Remove it? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
        rm public/_redirects
        echo -e "${GREEN}   ✅ Removed public/_redirects${NC}"
        CHANGES_MADE=1
    fi
fi

# 3. Verify build script syntax
echo "🔍 Verifying build script syntax..."
if node -c scripts/build.js 2>/dev/null; then
    echo -e "${GREEN}✅ scripts/build.js syntax valid${NC}"
else
    echo -e "${RED}❌ scripts/build.js has syntax errors${NC}"
    exit 1
fi

# 4. Ensure public/ is gitignored
if ! grep -q "^public/?$" .gitignore && ! grep -q "^public/" .gitignore; then
    echo -e "${YELLOW}ℹ️  Adding public/ to .gitignore${NC}"
    echo "public/" >> .gitignore
    CHANGES_MADE=1
fi

# 5. Check package.json build script
if ! grep -q '"build":\s*"node scripts/build.js"' package.json; then
    echo -e "${RED}❌ package.json missing build script!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Build script configured in package.json${NC}"
fi

# 6. Check vercel.json redirects syntax
if [ -f "vercel.json" ]; then
    echo "🔍 Verifying vercel.json syntax..."
    if node -e "JSON.parse(require('fs').readFileSync('vercel.json'))" 2>/dev/null; then
        echo -e "${GREEN}✅ vercel.json is valid JSON${NC}"
    else
        echo -e "${RED}❌ vercel.json has invalid JSON${NC}"
        exit 1
    fi
fi

# 7. Test build
echo ""
echo "🏗️  Running test build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed! Fix errors first.${NC}"
    npm run build
    exit 1
fi

# 8. Check build output
if [ -f "public/index.html" ]; then
    SIZE=$(du -h public/index.html | cut -f1)
    echo -e "${GREEN}✅ Build output: public/index.html ($SIZE)${NC}"
else
    echo -e "${RED}❌ public/index.html not created${NC}"
    exit 1
fi

# 9. Verify security headers in built file
if grep -q "Content-Security-Policy" public/index.html; then
    echo -e "${GREEN}✅ CSP header present in build${NC}"
else
    echo -e "${YELLOW}⚠️  CSP not in build (check source index.html)${NC}"
fi

# 10. Check for secrets in code
echo ""
echo "🔒 Scanning for hardcoded secrets..."
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    SECRETS=$(git grep -i "api_key\|secret\|password" -- '*.js' '*.json' '*.html' 2>/dev/null | grep -v "example" | grep -v "template" || true)
else
    SECRETS=$(grep -ri "api_key\|secret\|password" --include="*.js" --include="*.json" --include="*.html" . 2>/dev/null | grep -v "example" | grep -v "template" || true)
fi

if [ -n "$SECRETS" ]; then
    echo -e "${RED}⚠️  Potential secrets found:${NC}"
    echo "$SECRETS"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted. Remove secrets before committing."
        exit 1
    fi
else
    echo -e "${GREEN}✅ No obvious secrets found${NC}"
fi

# Summary
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  ✅ ALL CHECKS PASSED                                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

if [ $CHANGES_MADE -eq 1 ]; then
    echo -e "${YELLOW}⚠️  Changes were made. Review and commit:${NC}"
    echo "   git status"
    echo "   git add ."
    echo "   git commit -m 'fix: Vercel deployment configuration'"
else
    echo -e "${GREEN}✓ Everything looks good.${NC}"
fi

echo ""
echo "🚀 DEPLOYMENT STEPS:"
echo ""
echo "1. Commit all files:"
echo "   git add ."
echo "   git commit -m 'feat: production-ready infrastructure'"
echo ""
echo "2. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "3. Vercel auto-deploys (watch at https://vercel.com)"
echo ""
echo "4. Verify deployment:"
echo "   curl https://your-project.vercel.app/health"
echo "   curl -I https://your-project.vercel.app | grep -i security"
echo ""
echo "📚 Documentation:"
echo "   README.md - Overview"
echo "   DEPLOYMENT.md - All deployment options"
echo "   VERCEL_FIXES_COMPLETE.md - Detailed fixes"
echo ""

exit 0
