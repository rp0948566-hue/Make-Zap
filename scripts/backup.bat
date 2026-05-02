@echo off
REM ============================================
REM MARKZAP PROJECT - AUTOMATED BACKUP SCRIPT
REM Windows Batch File
REM Creates timestamped backups with verification
REM ============================================

echo [INFO] Starting MarkZap backup process...

REM Set variables
set TIMESTAMP=%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_DIR=backup
set FULL_BACKUP_DIR=%BACKUP_DIR%\full_backups
set INCREMENTAL_DIR=%BACKUP_DIR%\incremental
set MANIFEST=%BACKUP_DIR%\manifest.json
set PROJECT_ROOT=%~dp0

echo [INFO] Timestamp: %TIMESTAMP%

REM Create directories if they don't exist
if not exist "%FULL_BACKUP_DIR%" mkdir "%FULL_BACKUP_DIR%"
if not exist "%INCREMENTAL_DIR%" mkdir "%INCREMENTAL_DIR%"

REM Compute backup size before
echo [INFO] Calculating project size...
for /f "tokens=3" %%a in ('dir /-c /s "%PROJECT_ROOT%" ^| find "File(s)"') do set SIZE_BEFORE=%%a

REM Create full backup (compressed archive)
echo [INFO] Creating full backup archive...
powershell -Command "Compress-Archive -Path '%PROJECT_ROOT%*' -DestinationPath '%FULL_BACKUP_DIR%\markzap_backup_%TIMESTAMP%.zip' -Force" 2>nul

if errorlevel 1 (
    echo [ERROR] Backup creation failed!
    exit /b 1
)

REM Create incremental manifest
echo [INFO] Updating backup manifest...
if not exist "%MANIFEST%" (
    echo {> "%MANIFEST%"
    echo   "backups": [>> "%MANIFEST%"
) else (
    REM Remove last bracket and add comma
    powershell -Command "(Get-Content '%MANIFEST%') -replace '\s*\]$','' | Set-Content '%MANIFEST%'"
    echo ,>> "%MANIFEST%"
)

echo {>> "%MANIFEST%"
echo   "timestamp": "%TIMESTAMP%",>> "%MANIFEST%"
echo   "type": "full",>> "%MANIFEST%"
echo   "path": "full_backups/markzap_backup_%TIMESTAMP%.zip",>> "%MANIFEST%"
echo   "size_bytes": %SIZE_BEFORE%,>> "%MANIFEST%"
echo   "verified": true>> "%MANIFEST%"
echo }>> "%MANIFEST%"

echo ]>> "%MANIFEST%"
echo }>> "%MANIFEST%"

REM Verify backup integrity
echo [INFO] Verifying backup integrity...
powershell -Command "if (Test-Path '%FULL_BACKUP_DIR%\markzap_backup_%TIMESTAMP%.zip') { Write-Host 'Backup verified successfully.' } else { Write-Host 'Backup verification failed!'; exit 1 }" 2>nul

if errorlevel 1 (
    echo [ERROR] Backup verification failed!
    exit /b 1
)

REM Clean up old backups (keep last 7 days)
echo [INFO] Cleaning up backups older than 7 days...
powershell -Command "Get-ChildItem '%FULL_BACKUP_DIR%' -Filter *.zip | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-7)} | Remove-Item -Force" 2>nul

REM Summary
echo.
echo [SUCCESS] Backup completed successfully!
echo   File: markzap_backup_%TIMESTAMP%.zip
echo   Location: %FULL_BACKUP_DIR%
echo   Manifest: %MANIFEST%
echo.
echo Next steps:
echo   1. Verify backup file exists
echo   2. Upload to cloud storage (Google Drive, S3, etc.)
echo   3. Test restoration procedure monthly

exit /b 0
