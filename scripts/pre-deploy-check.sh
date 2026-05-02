#!/bin/bash
# MARKZAP PRE-DEPLOYMENT VERIFICATION
# Ensures all files are ready for Vercel/GitHub deployment

set -e

echo "🔍 MarkZap Pre-Deployment Check"
echo "================================"
echo ""

ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1"
  else
    echo "❌ MISSING: $1"
    ((ERRORS++))
  fi
}

# Function to check content contains string
check_content() {
  if grep -q "$2" "$1" 2>/dev/null; then
    echo "✅ $1 contains '$2'"
  else
    echo "⚠️  $1 missing '$2'"
    ((WARNINGS++))
  fi
}

echo "📁 Checking critical files..."
check_file "index.html"
check_file "server.js"
check_file "package.json"
check_file "vercel.json"
check_file "Dockerfile"
check_file "docker-compose.yml"
check_file "scripts/build.js"
check_file "scripts/deploy.sh"
check_file "scripts/backup.sh"
check_file ".gitignore"
check_file ".htaccess"
check_file "README.md"

echo ""
echo "🔐 Checking security headers in index.html..."
check_content "index.html" "Content-Security-Policy"
check_content "index.html" "X-Frame-Options"
check_content "index.html" "Strict-Transport-Security"
check_content "index.html" "X-Content-Type-Options"
check_content "index.html" "Referrer-Policy"
check_content "index.html" "Permissions-Policy"

echo ""
echo "🔧 Checking server.js security..."
check_content "server.js" "helmet"
check_content "server.js" "compression"
check_content "server.js" "health"

echo ""
echo "📦 Checking package.json..."
check_content "package.json" '"build"'
check_content "package.json" '"start"'
check_content "package.json" '"express"'
check_content "package.json" '"helmet"'
check_content "package.json" '"compression"'

echo ""
echo "🚀 Checking Vercel config..."
check_content "vercel.json" '"builds"'
check_content "vercel.json" '"routes"'
check_content "vercel.json" '"headers"'
check_content "vercel.json" '"redirects"'

echo ""
echo "💾 Checking backup scripts..."
check_file "scripts/backup.sh"
check_file "scripts/backup.bat"
check_content "scripts/backup.sh" "tar -czf"
check_content "scripts/backup.sh" "manifest"

echo ""
echo "📊 Checking documentation..."
check_file "README.md"
check_file "SECURITY.md"
check_file "BACKUP.md"
check_file "DEPLOYMENT.md"
check_file "INFRASTRUCTURE.md"
check_file "CHECKLIST.md"

echo ""
echo "🗂️  Directory structure check..."
if [ -d "assets" ]; then
  echo "✅ assets/ directory exists"
else
  echo "⚠️  assets/ directory missing"
  ((WARNINGS++))
fi

if [ -d "images" ]; then
  echo "✅ images/ directory exists"
else
  echo "⚠️  images/ directory missing (optional)"
fi

if [ -d "node_modules" ]; then
  echo "✅ node_modules/ exists (dependencies installed)"
else
  echo "ℹ️  node_modules/ not found - run 'npm ci' to install"
fi

echo ""
echo "🔒 Checking .gitignore protection..."
check_content ".gitignore" ".jetro/"
check_content ".gitignore" "credentials"
check_content ".gitignore" ".env"
check_content ".gitignore" "backup/"
check_content ".gitignore" "temp/"
check_content ".gitignore" "node_modules/"

echo ""
echo "🧪 Running build test..."
if npm run build > /dev/null 2>&1; then
  echo "✅ Build successful"
  if [ -d "public" ]; then
    echo "✅ public/ directory created"
    ls -lh public/ | tail -n +2 | awk '{print "   ", $9, "("$5")"}'
  fi
else
  echo "❌ Build failed!"
  ((ERRORS++))
fi

echo ""
echo "================================"
echo "📊 RESULTS"
echo "================================"
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"

if [ $ERRORS -eq 0 ]; then
  echo ""
  echo "✅ ALL CHECKS PASSED! Ready to deploy."
  echo ""
  echo "🚀 Next steps:"
  echo "   1. git add ."
  echo "   2. git commit -m 'feat: production-ready infrastructure'"
  echo "   3. git push origin main"
  echo "   4. Vercel auto-deploys → https://markzap.online"
  exit 0
else
  echo ""
  echo "❌ Fix errors before deploying!"
  exit 1
fi
