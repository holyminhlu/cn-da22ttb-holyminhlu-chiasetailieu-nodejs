@echo off
echo ========================================
echo Starting ALL Required Services
echo ========================================
echo.
echo This will start:
echo 1. Forum Service (Port 3005)
echo 2. API Gateway (Port 3000)
echo.
echo You need 2 terminal windows!
echo.
pause
echo.

echo ========================================
echo STEP 1: Check MongoDB
echo ========================================
netstat -ano | findstr ":27017" | findstr "LISTENING" >nul
if %errorlevel% == 0 (
    echo [OK] MongoDB is running
) else (
    echo [ERROR] MongoDB is NOT running!
    echo Please start MongoDB first
    pause
    exit
)
echo.

echo ========================================
echo STEP 2: Forum Service
echo ========================================
echo Opening Forum Service in new window...
start "Forum Service - Port 3005" cmd /k "cd /d %~dp0 && START_FORUM.bat"
timeout /t 3 /nobreak
echo.

echo ========================================
echo STEP 3: API Gateway
echo ========================================
echo Opening API Gateway in new window...
start "API Gateway - Port 3000" cmd /k "cd /d %~dp0 && START_API_GATEWAY.bat"
timeout /t 3 /nobreak
echo.

echo ========================================
echo ALL SERVICES STARTED!
echo ========================================
echo.
echo Two new windows have opened:
echo 1. Forum Service - http://localhost:3005
echo 2. API Gateway - http://localhost:3000
echo.
echo KEEP THOSE WINDOWS OPEN!
echo.
echo Now you can:
echo - Open browser to http://localhost:8080/diendan
echo - Try creating a post
echo.
echo Press any key to test services...
pause
echo.

echo Testing services...
curl -s http://localhost:3005/test
echo.
echo.
curl -s http://localhost:3000/test
echo.
echo.
echo ========================================
echo If you see JSON responses above, services are working!
echo ========================================
pause



