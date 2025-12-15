@echo off
echo ========================================
echo Starting API Gateway
echo ========================================
echo.

cd /d "%~dp0server\api-gateway"

echo Checking if service is already running...
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %errorlevel% == 0 (
    echo API Gateway is already running on port 3000
    echo.
    echo If you want to restart, press Ctrl+C to stop current terminal
    echo then run this script again
    pause
    exit
)

echo Starting API Gateway on port 3000...
echo.
echo ========================================
echo SERVICE IS RUNNING
echo ========================================
echo.
echo You should see:
echo - API Gateway chay tai http://localhost:3000
echo.
echo KEEP THIS WINDOW OPEN!
echo.
echo To test: Open browser to http://localhost:3000/test
echo.
echo ========================================

npm start

pause



