@echo off
setlocal

echo 🚀 Starting Telemedicine App Setup...

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed.

REM Setup Backend
echo -----------------------------------
echo 🔧 Setting up Backend...
if exist "backend" (
    cd backend
    if not exist "node_modules" (
        echo 📦 Installing Backend Dependencies...
        call npm install
    ) else (
        echo ✅ Backend dependencies already installed.
    )
    echo ▶️ Starting Backend Server...
    start "Telemedicine Backend" npm run dev
    cd ..
) else (
    echo ❌ backend directory not found!
    pause
    exit /b 1
)

REM Setup Frontend
echo -----------------------------------
echo 🎨 Setting up Frontend...
if exist "Frontend" (
    cd Frontend
    if not exist "node_modules" (
        echo 📦 Installing Frontend Dependencies...
        call npm install
    ) else (
        echo ✅ Frontend dependencies already installed.
    )
    echo ▶️ Starting Frontend...
    start "Telemedicine Frontend" npm run dev
    cd ..
) else (
    echo ❌ Frontend directory not found!
    pause
    exit /b 1
)

echo -----------------------------------
echo 🌟 App is running!
echo Backend and Frontend windows should appear shortly.
echo Press any key to exit this launcher (servers will keep running).
pause
