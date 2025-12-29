# Publishing with 2FA Required

## Issue

npm requires **Two-Factor Authentication (2FA)** or a **granular access token** to publish packages.

## Solutions

### Option 1: Enable 2FA (Recommended)

1. Go to npm settings: https://www.npmjs.com/settings/ks2476/security
2. Enable Two-Factor Authentication
3. Follow the setup process
4. Then run: `./auto-publish.sh`

### Option 2: Create Granular Access Token

1. Go to: https://www.npmjs.com/settings/ks2476/tokens
2. Click "Generate New Token"
3. Select "Automation" type
4. Set permissions: **Publish** packages
5. Copy the token
6. Use it:
   ```bash
   npm publish --access public --//registry.npmjs.org/:_authToken=YOUR_TOKEN
   ```

### Option 3: Use npm token command

```bash
# Create token
npm token create --read-only=false

# Set as environment variable
export NPM_TOKEN=your_token_here

# Then publish
npm publish --access public
```

## After Setting Up

Once 2FA is enabled or token is configured, run:
```bash
./auto-publish.sh
```

The script will automatically publish the package!

## Current Status

- ✅ Logged in: ks2476
- ✅ Package built: testbolt-mobile@1.0.0
- ⚠️  Blocked by: 2FA requirement

Enable 2FA or create a token, then I can publish automatically!

