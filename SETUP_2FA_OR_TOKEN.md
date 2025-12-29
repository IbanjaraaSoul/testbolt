# Setting Up npm 2FA or Access Token

## Issue: Can't see npm in authenticator

If you don't see "npm" in your authenticator app, you need to set it up first.

## Option 1: Set Up 2FA (Recommended)

1. **Go to npm security settings:**
   https://www.npmjs.com/settings/ks2476/security

2. **Enable Two-Factor Authentication:**
   - Click "Enable Two-Factor Authentication"
   - Choose "Authenticator App" (not SMS)
   - Scan the QR code with your authenticator app
   - Enter the code to verify
   - Save the backup codes!

3. **After setup:**
   - You'll see "npm" or "npmjs.com" in your authenticator app
   - Get the 6-digit code
   - Share it with me to publish

## Option 2: Use Access Token (Easier - No 2FA!)

This is easier - no OTP codes needed!

1. **Go to npm tokens:**
   https://www.npmjs.com/settings/ks2476/tokens

2. **Create new token:**
   - Click "Generate New Token"
   - Type: "Automation"
   - Permissions: Check "Publish packages"
   - Click "Generate Token"

3. **Copy the token** (you'll only see it once!)

4. **Share the token with me**, and I'll publish immediately!

## Which to Choose?

- **2FA**: More secure, but requires OTP each time
- **Access Token**: Easier, works automatically, still secure

**Recommendation**: Use Access Token for publishing - it's simpler!

