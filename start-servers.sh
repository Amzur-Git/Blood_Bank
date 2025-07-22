#!/bin/bash

echo "🚀 Starting Emergency Blood Bank Application..."
echo

echo "📡 Starting Backend Server..."
cd backend
npm run server &
BACKEND_PID=$!

echo
echo "⚛️  Starting Frontend Server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo
echo "✅ Both servers are starting..."
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:5000"
echo "📊 Backend Health Check: http://localhost:5000/health"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
