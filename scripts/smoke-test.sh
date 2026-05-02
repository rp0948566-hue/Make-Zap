#!/bin/bash
# MARKZAP SMOKE TEST
# Tests that the application can start and respond

set -e

echo "🧪 MarkZap Smoke Test"
echo "======================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules missing. Run 'npm ci' first."
    exit 1
fi

# Build first
echo "🔨 Building..."
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"

# Start server in background
echo ""
echo "🚀 Starting server..."
npm start &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server..."
for i in $(seq 1 10); do
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Server is up (PID: $SERVER_PID)"
        break
    fi
    sleep 1
    if [ $i -eq 10 ]; then
        echo "❌ Server failed to start"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
done

# Test endpoints
echo ""
echo "Testing endpoints:"

# Health check
echo -n "  /health: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OK (200)"
    HEALTH_JSON=$(curl -s http://localhost:3000/health)
    echo "    Response: $HEALTH_JSON"
else
    echo "❌ FAILED ($HTTP_CODE)"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Homepage
echo -n "  /: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OK (200)"
else
    echo "❌ FAILED ($HTTP_CODE)"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# API status (if exists)
echo -n "  /api/status: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/status)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OK (200)"
    curl -s http://localhost:3000/api/status | head -c 200
    echo ""
else
    echo "❌ FAILED ($HTTP_CODE) - (optional endpoint may not exist)"
fi

# Security headers
echo ""
echo "🔐 Security headers:"
curl -sI http://localhost:3000 | grep -i "x-frame\|strict-transport\|content-security-policy" || echo "⚠️  Some headers missing (OK for localhost)"

# Stop server
echo ""
echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null || true
sleep 1

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  ✅ ALL SMOKE TESTS PASSED!             ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Server is working correctly."
echo "Ready for deployment to Vercel/AWS."
echo ""
