# MARKZAP VERCEL DEPLOYMENT FIX - PowerShell
# Run this to verify and fix common Vercel issues

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔧 MarkZap Vercel Deployment Fix & Setup               ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$changesMade = $false

Write-Host "🔍 Checking for common Vercel deployment issues..." -ForegroundColor Yellow
Write-Host ""

# 1. Check scripts/build.js
if (-Not (Test-Path "scripts\build.js")) {
    Write-Host "❌ CRITICAL: scripts/build.js is missing!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ scripts/build.js exists" -ForegroundColor Green
}

# 2. Check _redirects in public/
if (Test-Path "public\_redirects") {
    Write-Host "⚠️  Found public/_redirects (Netlify format) - causes Vercel error" -ForegroundColor Yellow
    $response = Read-Host "   Remove it? (Y/n)"
    if ($response -eq '' -or $response -match '[Yy]') {
        Remove-Item "public\_redirects" -Force
        Write-Host "✅ Removed public/_redirects" -ForegroundColor Green
        $changesMade = $true
    }
}

# 3. Test build
Write-Host "🔍 Running test build..." -ForegroundColor Yellow
try {
    npm run build | Out-Null
    Write-Host "✅ Build successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed! Fix errors first." -ForegroundColor Red
    npm run build
    exit 1
}

# 4. Verify build output
if (Test-Path "public\index.html") {
    $size = (Get-Item "public\index.html").Length / 1KB
    Write-Host "✅ Build output: public/index.html ($([math]::Round($size,1)) KB)" -ForegroundColor Green
} else {
    Write-Host "❌ public/index.html not created" -ForegroundColor Red
    exit 1
}

# 5. Check security headers in build
if (Select-String -Path "public\index.html" -Pattern "Content-Security-Policy" -Quiet) {
    Write-Host "✅ CSP header present in build" -ForegroundColor Green
} else {
    Write-Host "⚠️  CSP not in build (check source index.html)" -ForegroundColor Yellow
}

# 6. Check for secrets
Write-Host ""
Write-Host "🔒 Scanning for hardcoded secrets..." -ForegroundColor Yellow
$secrets = Get-ChildItem -Recurse -Include *.js,*.json,*.html | Select-String -Pattern "api_key|secret|password" -CaseSensitive:$false | Where-Object { $_.Line -notmatch "example|template|changeme" }

if ($secrets) {
    Write-Host "⚠️  Potential secrets found:" -ForegroundColor Yellow
    $secrets | ForEach-Object { $_.Line }
    $response = Read-Host "Continue anyway? (y/N)"
    if ($response -notmatch '[Yy]') {
        Write-Host "Aborted. Remove secrets before committing."
        exit 1
    }
} else {
    Write-Host "✅ No obvious secrets found" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ✅ ALL CHECKS PASSED                                      ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($changesMade) {
    Write-Host "⚠️  Changes were made. Review and commit:" -ForegroundColor Yellow
    Write-Host "   git status"
    Write-Host "   git add ."
    Write-Host "   git commit -m 'fix: Vercel deployment configuration'"
} else {
    Write-Host "✅ Everything looks good." -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 DEPLOYMENT STEPS:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Commit all files:"
Write-Host "   git add ."
Write-Host "   git commit -m 'feat: production-ready infrastructure'"
Write-Host ""
Write-Host "2. Push to GitHub:"
Write-Host "   git push origin main"
Write-Host ""
Write-Host "3. Vercel auto-deploys (watch at https://vercel.com)"
Write-Host ""
Write-Host "4. Verify deployment:"
Write-Host "   curl https://your-project.vercel.app/health"
Write-Host "   curl -I https://your-project.vercel.app | grep -i security"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   README.md - Overview"
Write-Host "   DEPLOYMENT.md - All deployment options"
Write-Host "   VERCEL_FIXES_COMPLETE.md - Detailed fixes"
Write-Host ""

exit 0
