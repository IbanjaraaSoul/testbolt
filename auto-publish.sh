#!/bin/bash

# Auto-publish script for TestBolt

echo "🚀 TestBolt - Auto Publish Script"
echo "=================================="
echo ""

# Check login
echo "📋 Checking npm login status..."
if npm whoami > /dev/null 2>&1; then
    USER=$(npm whoami)
    echo "✅ Logged in as: $USER"
    echo ""
    
    # Build
    echo "📦 Building package..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
    echo "✅ Build successful!"
    echo ""
    
    # Publish
    echo "🚀 Publishing testbolt-mobile to npm..."
    npm publish --access public
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! TestBolt published to npm!"
        echo ""
        echo "📦 Package: testbolt-mobile@1.0.0"
        echo "🌐 URL: https://www.npmjs.com/package/testbolt-mobile"
        echo ""
        echo "Users can now install with:"
        echo "  npm install -g testbolt-mobile"
        echo ""
        echo "And use:"
        echo "  testbolt init"
        echo "  testbolt test"
    else
        echo ""
        echo "❌ Publishing failed!"
        exit 1
    fi
else
    echo "❌ Not logged in to npm"
    echo ""
    echo "Please login first:"
    echo "  npm login"
    echo ""
    echo "Then run this script again:"
    echo "  ./auto-publish.sh"
    exit 1
fi

