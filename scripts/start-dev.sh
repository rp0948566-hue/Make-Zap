#!/bin/bash
# MARKZAP DEVELOPMENT SERVER - Unix/Mac Quick Start

echo "🚀 Starting MarkZap development server..."
echo ""

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm ci
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from template..."
    cp .env.example .env
fi

# Start dev server
echo "Starting server on http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""

npx nodemon server.js
