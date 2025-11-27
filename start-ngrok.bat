@echo off
echo Starting ngrok tunnel for backend...
echo.
echo Make sure your backend is running on port 3000 first!
echo Run: cd backend && npm start
echo.
echo Press any key to start ngrok...
pause
ngrok http 3000




