@echo off
echo 🚀 Starting Emergency Blood Bank Application...
echo.

echo 📡 Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run server"

echo.
echo ⚛️  Starting Frontend Server...
cd ../frontend  
start "Frontend Server" cmd /k "npm start"

echo.
echo ✅ Both servers are starting...
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔧 Backend API will be available at: http://localhost:5000
echo 📊 Backend Health Check: http://localhost:5000/health
echo.
pause
