@echo off
echo ========================================
echo Starting Forum Service
echo ========================================
echo.

cd /d "%~dp0server\forum-service"

echo Checking if service is already running...
netstat -ano | findstr ":3005" >nul
if %errorlevel% == 0 (
    echo Forum service is already running on port 3005
    echo.
    echo If you want to restart, press Ctrl+C to stop current terminal
    echo then run this script again
    pause
    exit
)

echo Starting Forum Service on port 3005...
echo.
echo ========================================
echo SERVICE IS RUNNING
echo ========================================
echo.
echo You should see these messages:
echo - MongoDB CONNECTED
echo - Forum-Service dang lang nghe tai http://localhost:3005
echo.
echo KEEP THIS WINDOW OPEN!
echo.
echo To test: Open browser to http://localhost:3005/test
echo.
echo ========================================

node index.js

pause



