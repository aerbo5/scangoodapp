@echo off
echo ========================================
echo   Mobile API Test - Baslatma Scripti
echo ========================================
echo.

echo [1/3] Backend baslatiliyor...
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [2/3] Ngrok baslatiliyor...
echo.
echo ONEMLI: Ngrok URL'ini kopyalayin ve apiService.js dosyasina ekleyin!
echo.
start "Ngrok Tunnel" cmd /k "ngrok http 3000"
timeout /t 3 /nobreak >nul

echo [3/3] Frontend baslatiliyor...
echo.
echo Expo Go ile QR kodu tarayin!
echo.
start "Expo Frontend" cmd /k "npx expo start --tunnel"

echo.
echo ========================================
echo   Tum servisler baslatildi!
echo ========================================
echo.
echo Yapilacaklar:
echo 1. Ngrok URL'ini kopyalayin (ngrok penceresinde)
echo 2. src/services/apiService.js dosyasina URL'i ekleyin
echo 3. Frontend'i yeniden baslatin (Ctrl+C sonra npm start)
echo.
pause

