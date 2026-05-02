#!/bin/bash
# MARKZAP DEVELOPMENT ENVIRONMENT SETUP
# One-command setup for local development

set -e

echo "🚀 Setting up MarkZap development environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

if [ $? -ne 0 ]; then
    echo "❌ npm ci failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env created"
    echo ""
    echo "⚠️  Note: .env is gitignored. Customize as needed."
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is running (optional)
echo ""
echo "🗄️  Database setup:"
echo "   Option 1 (Recommended): Use Docker Compose (includes PostgreSQL + Redis + Monitoring)"
echo "   Run: docker-compose up -d"
echo ""
echo "   Option 2: Install PostgreSQL locally"
echo "   brew install postgresql (Mac) or apt-get install postgresql (Linux)"
echo "   createdb markzap -U postgres"
echo ""

# Check if Redis is running (optional)
echo "   Redis (caching):"
echo "   Docker: docker run -d -p 6379:6379 redis:7-alpine"
echo ""

# Build production assets
echo "🏗️  Building production assets..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Run security check
echo ""
echo "🔒 Running security check..."
npm run security-check || true  # Don't fail on warnings

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ✅ Development environment ready!         ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "3. Run in production mode:"
echo "   npm start"
echo ""
echo "4. View health endpoint:"
echo "   curl http://localhost:3000/health"
echo ""
echo "5. Run tests:"
echo "   npm test"
echo ""
echo "6. Create backup:"
echo "   npm run backup"
echo ""
echo "📚 Useful commands:"
echo "   npm run dev         - Start dev server with hot reload"
echo "   npm run build       - Build production assets"
echo "   npm start           - Start production server"
echo "   npm test            - Run all checks"
echo "   npm run lint        - Lint code (if configured)"
echo "   npm run backup      - Create backup"
echo "   npm run clean       - Clean build artifacts"
echo "   npm run status      - Check server status"
echo ""
echo "📖 Documentation:"
echo "   README.md           - Project overview"
echo "   DEPLOYMENT.md       - Deployment guides"
echo "   SECURITY.md         - Security policy"
echo "   INFRASTRUCTURE.md   - Architecture"
echo ""
echo "💡 Tip: Use 'vercel' command to deploy when ready"
echo "   npm install -g vercel"
echo "   vercel --prod"
echo ""
