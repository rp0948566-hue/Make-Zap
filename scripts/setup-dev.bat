@echo off
REM MARKZAP DEVELOPMENT ENVIRONMENT SETUP - Windows

echo.
echo ========================================
echo   MARKZAP DEV ENVIRONMENT SETUP
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Download from https://nodejs.org/
    exit /b 1
)

echo [OK] Node.js installed: %node --version%
echo.

REM Check npm
npm --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not installed
    exit /b 1
)

echo [OK] npm installed: %npm --version%
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
npm ci

if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm ci failed
    exit /b 1
)

echo [OK] Dependencies installed
echo.

REM Create .env if not exists
if not exist ".env" (
    echo [INFO] Creating .env file from template...
    copy .env.example .env
    echo [OK] .env created
    echo.
    echo Note: .env is gitignored. Customize as needed.
) else (
    echo [OK] .env file already exists
)

echo.
echo [INFO] Building production assets...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed
    exit /b 1
)

echo [OK] Build successful
echo.

echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo   1. Start dev server:  npm run dev
echo   2. Open browser:      http://localhost:3000
echo   3. Production mode:   npm start
echo   4. Health check:      curl http://localhost:3000/health
echo.
echo Useful commands:
echo   npm run dev        - Start dev server with hot reload
echo   npm start          - Start production server
echo   npm test           - Run all checks
echo   npm run backup     - Create backup
echo   npm run clean      - Clean build
echo.
echo Documentation: README.md
echo.

pause
