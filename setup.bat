@echo off
REM Quick Start Script for Healthy Diet Academy (Windows)
setlocal enabledelayedexpansion

echo ==================================
echo.
echo ^^ Healthy Diet Academy - Quick Start
echo.
echo ==================================
echo.

REM Check if Node is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please download from https://nodejs.org
    pause
    exit /b 1
)

REM Check if npm is installed
npm -v >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node -v
echo ✅ npm version:
npm -v
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please update .env with your settings:
    echo    - GOOGLE_ANALYTICS_ID
    echo    - ADMIN_KEY
    echo    - Other variables as needed
)

echo.
echo ==================================
echo ✅ Setup Complete!
echo ==================================
echo.
echo 🚀 To start the server, run:
echo    npm start
echo.
echo 📚 Visit these URLs:
echo    - Home: http://localhost:3000
echo    - Verify: http://localhost:3000/verify.html
echo    - API Health: http://localhost:3000/api/health
echo.
echo 📖 Documentation:
echo    - README.md: Project overview
echo    - DEPLOYMENT.md: Deployment guide
echo    - PERFORMANCE.md: Performance tips
echo    - CMS.md: Content management
echo    - FAQ.md: Frequently asked questions
echo.
pause
