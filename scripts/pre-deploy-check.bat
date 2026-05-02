@echo off
REM MARKZAP PRE-DEPLOYMENT CHECK - Windows Version

echo.
echo ========================================
echo   MARKZAP PRE-DEPLOYMENT CHECK
echo ========================================
echo.

set ERRORS=0
set WARNINGS=0

REM Check files
echo Checking critical files...
for %%f in (
  "index.html"
  "server.js"
  "package.json"
  "vercel.json"
  "Dockerfile"
  "docker-compose.yml"
  "scripts\build.js"
  "scripts\deploy.sh"
  "scripts\backup.bat"
  ".gitignore"
  ".htaccess"
  "README.md"
) do (
  if exist %%f (
    echo [OK] %%f
  ) else (
    echo [MISSING] %%f
    set /a ERRORS+=1
  )
)

echo.
echo Checking security headers in index.html...
findstr /C:"Content-Security-Policy" index.html >nul && echo [OK] CSP found || echo [!] CSP missing & set /a WARNINGS+=1
findstr /C:"X-Frame-Options" index.html >nul && echo [OK] X-Frame-Options found || echo [!] X-Frame-Options missing & set /a WARNINGS+=1
findstr /C:"Strict-Transport-Security" index.html >nul && echo [OK] HSTS found || echo [!] HSTS missing & set /a WARNINGS+=1

echo.
echo Checking package.json...
findstr /C:"\"build\"" package.json >nul && echo [OK] build script found || echo [!] build script missing & set /a ERRORS+=1
findstr /C:"\"express\"" package.json >nul && echo [OK] express dependency found || echo [!] express missing & set /a ERRORS+=1
findstr /C:"\"helmet\"" package.json >nul && echo [OK] helmet dependency found || echo [!] helmet missing & set /a ERRORS+=1

echo.
echo Running build test...
call npm run build >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo [OK] Build successful
  if exist "public\" (
    echo [OK] public\ directory created
  )
) else (
  echo [ERROR] Build failed!
  set /a ERRORS+=1
)

echo.
echo ========================================
echo RESULTS
echo ========================================
echo Errors: %ERRORS%
echo Warnings: %WARNINGS%

if %ERRORS% equ 0 (
  echo.
  echo [SUCCESS] ALL CHECKS PASSED! Ready to deploy.
  echo.
  echo Next steps:
  echo   1. git add .
  echo   2. git commit -m "feat: production infrastructure"
  echo   3. git push origin main
  echo   4. Vercel auto-deploys
  exit /b 0
) else (
  echo.
  echo [FAILED] Fix errors before deploying!
  exit /b 1
)
