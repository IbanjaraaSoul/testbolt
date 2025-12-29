#!/bin/bash

# POC Setup Script
# This script helps set up the environment for running POC tests

echo "🚀 MobileAuto POC Setup"
echo "========================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm $(npm --version) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Build project
echo ""
echo "🔨 Building project..."
npm run build

# Check Appium
if ! command -v appium &> /dev/null; then
    echo ""
    echo "⚠️  Appium not found. Installing globally..."
    npm install -g appium
    echo "✅ Appium installed"
else
    echo "✅ Appium found"
fi

# Check Android SDK (for Android testing)
if command -v adb &> /dev/null; then
    echo "✅ Android SDK tools found"
    echo "   Connected devices:"
    adb devices | grep -v "List" | grep "device" || echo "   No devices connected"
else
    echo "⚠️  Android SDK not found (optional for iOS testing)"
fi

# Check iOS Simulator (for iOS testing)
if command -v xcrun &> /dev/null; then
    echo "✅ Xcode tools found"
    echo "   Available simulators:"
    xcrun simctl list devices | grep "Booted" || echo "   No simulators running"
else
    echo "⚠️  Xcode not found (optional for Android testing)"
fi

# Create directories
echo ""
echo "📁 Creating directories..."
mkdir -p screenshots
mkdir -p videos
mkdir -p tests

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Place your app file (APK/IPA) in the project root"
echo "2. Update selectors in poc-examples/*.test.ts"
echo "3. Run: npm test poc-examples/simple-poc.test.ts"
echo ""
echo "For detailed instructions, see: poc-examples/README.md"

