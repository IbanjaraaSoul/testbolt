#!/bin/bash

# Publishing script for MobileAuto framework

echo "🚀 MobileAuto - npm Publishing Script"
echo "======================================"
echo ""

# Check if logged in
echo "📋 Step 1: Checking npm login status..."
if npm whoami > /dev/null 2>&1; then
    echo "✅ Logged in as: $(npm whoami)"
else
    echo "❌ Not logged in to npm"
    echo "   Run: npm login"
    exit 1
fi

# Check package name availability
echo ""
echo "📋 Step 2: Checking package name availability..."
if npm view mobileauto > /dev/null 2>&1; then
    echo "⚠️  Package name 'mobileauto' is already taken!"
    echo "   Consider using a different name or scoped package"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Package name 'mobileauto' is available!"
fi

# Build
echo ""
echo "📋 Step 3: Building package..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful!"

# Test package
echo ""
echo "📋 Step 4: Testing package (dry-run)..."
npm pack --dry-run > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  Package test failed, but continuing..."
else
    echo "✅ Package test passed!"
fi

# Confirm publish
echo ""
echo "📋 Step 5: Ready to publish!"
echo "   Package: mobileauto"
echo "   Version: $(node -p "require('./package.json').version")"
echo ""
read -p "Publish to npm? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publishing cancelled"
    exit 0
fi

# Publish
echo ""
echo "📋 Step 6: Publishing to npm..."
npm publish --access public

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Package published to npm!"
    echo ""
    echo "Users can now install with:"
    echo "  npm install -g mobileauto"
    echo ""
    echo "Or:"
    echo "  npm install mobileauto"
else
    echo ""
    echo "❌ Publishing failed!"
    echo "Check the error messages above"
    exit 1
fi

