#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "🚀 Starting Telemedicine App Setup..."

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js and npm found."

# Setup Backend
echo "-----------------------------------"
echo "🔧 Setting up Backend..."
if [ -d "backend" ]; then
    cd backend
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing Backend Dependencies..."
        npm install
    else
        echo "✅ Backend dependencies already installed."
    fi
    echo "▶️ Starting Backend Server..."
    npm run dev &
    BACKEND_PID=$!
    cd ..
else
    echo "❌ backend directory not found!"
    exit 1
fi

# Setup Frontend
echo "-----------------------------------"
echo "🎨 Setting up Frontend..."
if [ -d "Frontend" ]; then
    cd Frontend
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing Frontend Dependencies..."
        npm install
    else
        echo "✅ Frontend dependencies already installed."
    fi
    echo "▶️ Starting Frontend..."
    npm run dev &
    FRONTEND_PID=$!
    cd ..
else
    echo "❌ Frontend directory not found!"
    exit 1
fi

echo "-----------------------------------"
echo "🌟 App is running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press CTRL+C to stop both."

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
