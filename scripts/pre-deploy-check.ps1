# MARKZAP QUICK DEPLOYMENT CHECK
# Run this before pushing to GitHub/Vercel

Write-Host "`n🔍 MarkZap Pre-Deployment Verification" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$errors = 0
$warnings = 0

function Test-File {
    param($path)
    if (Test-Path $path) {
        Write-Host "✅ $path" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ MISSING: $path" -ForegroundColor Red
        $global:errors++
        return $false
    }
}

function Test-Content {
    param($file, $pattern)
    if (Get-Content $file -Raw | Select-String -Pattern $pattern -Quiet) {
        Write-Host "✅ $file contains '$pattern'" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $file missing '$pattern'" -ForegroundColor Yellow
        $global:warnings++
    }
}

Write-Host "`n📁 Critical Files:" -ForegroundColor Yellow
Test-File "index.html"
Test-File "server.js"
Test-File "package.json"
Test-File "vercel.json"
Test-File "Dockerfile"
Test-File "scripts\build.js"
Test-File "scripts\deploy.sh"
Test-File "scripts\backup.bat"
Test-File ".gitignore"

Write-Host "`n🔐 Security Headers (index.html):" -ForegroundColor Yellow
Test-Content "index.html" "Content-Security-Policy"
Test-Content "index.html" "X-Frame-Options"
Test-Content "index.html" "Strict-Transport-Security"
Test-Content "index.html" "X-Content-Type-Options"

Write-Host "`n🔧 Server Configuration (server.js):" -ForegroundColor Yellow
Test-Content "server.js" "helmet"
Test-Content "server.js" "compression"
Test-Content "server.js" "health"

Write-Host "`n📦 Package.json:" -ForegroundColor Yellow
Test-Content "package.json" '"build"'
Test-Content "package.json" '"start"'
Test-Content "package.json" '"express"'
Test-Content "package.json" '"helmet"'

Write-Host "`n🚀 Vercel Config:" -ForegroundColor Yellow
Test-Content "vercel.json" '"builds"'
Test-Content "vercel.json" '"routes"'
Test-Content "vercel.json" '"headers"'

Write-Host "`n💾 Backup Scripts:" -ForegroundColor Yellow
Test-File "scripts\backup.sh"
Test-File "scripts\backup.bat"

Write-Host "`n📚 Documentation:" -ForegroundColor Yellow
Test-File "README.md"
Test-File "SECURITY.md"
Test-File "BACKUP.md"
Test-File "DEPLOYMENT.md"

Write-Host "`n🗂️  Directories:" -ForegroundColor Yellow
if (Test-Path "assets") { Write-Host "✅ assets/" -ForegroundColor Green } else { Write-Host "⚠️  assets/ missing" -ForegroundColor Yellow; $warnings++ }
if (Test-Path "images") { Write-Host "✅ images/" -ForegroundColor Green } else { Write-Host "⚠️  images/ missing (optional)" -ForegroundColor Yellow }

Write-Host "`n🔒 .gitignore Protection:" -ForegroundColor Yellow
Test-Content ".gitignore" ".jetro/"
Test-Content ".gitignore" "credentials"
Test-Content ".gitignore" ".env"
Test-Content ".gitignore" "backup/"
Test-Content ".gitignore" "node_modules/"

Write-Host "`n🏗️  Build Test:" -ForegroundColor Yellow
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful" -ForegroundColor Green
        if (Test-Path "public") {
            Write-Host "✅ public/ directory created" -ForegroundColor Green
            Write-Host "`n   Build output:" -ForegroundColor Gray
            Get-ChildItem public | ForEach-Object { Write-Host "     $($_.Name) ($([math]::Round($_.Length/1KB,1)) KB)" }
        }
    } else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        $global:errors++
    }
} catch {
    Write-Host "❌ Build error: $_" -ForegroundColor Red
    $global:errors++
}

Write-Host "`n" "=" * 50 -ForegroundColor Cyan
Write-Host "📊 FINAL RESULTS" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "Errors  : $errors" -ForegroundColor ($errors -eq 0 ? "Green" : "Red")
Write-Host "Warnings: $warnings" -ForegroundColor ($warnings -eq 0 ? "Green" : "Yellow")

if ($errors -eq 0) {
    Write-Host "`n✅ ALL CHECKS PASSED! Ready for deployment." -ForegroundColor Green
    Write-Host "`n🚀 DEPLOY NOW:" -ForegroundColor Green
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'feat: production infrastructure'" -ForegroundColor Gray
    Write-Host "   git push origin main" -ForegroundColor Gray
    Write-Host "`n   Vercel auto-deploys → https://markzap.online" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "`n❌ FIX ERRORS BEFORE DEPLOYING!" -ForegroundColor Red
    exit 1
}
