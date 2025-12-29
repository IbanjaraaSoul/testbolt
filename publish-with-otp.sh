#!/bin/bash

# Publish with OTP script

if [ -z "$1" ]; then
    echo "Usage: ./publish-with-otp.sh <OTP_CODE>"
    echo "Example: ./publish-with-otp.sh 123456"
    exit 1
fi

OTP=$1

echo "🚀 Publishing TestBolt with OTP..."
echo ""

npm run build
npm publish --access public --otp=$OTP

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! TestBolt published to npm!"
    echo ""
    echo "📦 Package: testbolt-mobile@1.0.0"
    echo "🌐 URL: https://www.npmjs.com/package/testbolt-mobile"
else
    echo ""
    echo "❌ Publishing failed!"
fi

