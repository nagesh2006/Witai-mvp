@echo off
echo Starting Witai MVP...
echo.

echo Starting Backend Server...
cd backend
start cmd /k "python run.py"

echo.
echo Starting Frontend Server...
cd ..\frontend
start cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul