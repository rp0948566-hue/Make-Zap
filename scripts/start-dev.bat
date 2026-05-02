@echo off
REM MARKZAP DEVELOPMENT SERVER - Windows Quick Start

echo.
echo ========================================
echo   MARKZAP DEVELOPMENT SERVER
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Dependencies not installed.
    echo [INFO] Running setup first...
    call scripts\setup-dev.bat
    echo.
)

echo [INFO] Starting development server...
echo [INFO] Server will run on http://localhost:3000
echo [INFO] Press Ctrl+C to stop
echo.

REM Start nodemon
npx nodemon server.js
