@echo off
echo ========================================
echo   Scan Good - External Access Setup
echo ========================================
echo.
echo 1. Backend should be running on port 3000
echo 2. ngrok should be running (ngrok http 3000)
echo 3. Update apiService.js with your ngrok URL
echo.
echo Starting Expo with tunnel mode...
echo.
npx expo start --tunnel



