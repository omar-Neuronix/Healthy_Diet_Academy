#!/bin/bash
# Quick Start Script for Healthy Diet Academy

echo "=================================="
echo "🎓 Healthy Diet Academy - Quick Start"
echo "=================================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please download from https://nodejs.org"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your settings:"
    echo "   - GOOGLE_ANALYTICS_ID"
    echo "   - ADMIN_KEY"
    echo "   - Other variables as needed"
fi

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "🚀 To start the server, run:"
echo "   npm start"
echo ""
echo "📚 Visit these URLs:"
echo "   - Home: http://localhost:3000"
echo "   - Verify: http://localhost:3000/verify.html"
echo "   - API Health: http://localhost:3000/api/health"
echo ""
echo "📖 Documentation:"
echo "   - README.md: Project overview"
echo "   - DEPLOYMENT.md: Deployment guide"
echo "   - PERFORMANCE.md: Performance tips"
echo "   - CMS.md: Content management"
echo "   - FAQ.md: Frequently asked questions"
echo ""
