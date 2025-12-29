# POC Examples

These are practical examples showing how MobileAuto framework works with real mobile apps.

## Files

1. **simple-poc.test.ts** - Minimal example to get started
2. **ecommerce-login.test.ts** - Real-world login flow example
3. **advanced-features-poc.test.ts** - Demonstrates advanced features

## How to Run POC

### Step 1: Prepare Your App

Place your mobile app file in the project root:
- Android: `app.apk`
- iOS: `app.ipa`

Or update the path in the test file:
```typescript
app: './path/to/your/app.apk'
```

### Step 2: Update Selectors

Replace the selectors in the test files with actual elements from your app:

```typescript
// Instead of:
await app.find('Login').click();

// Use actual text/ID from your app:
await app.find('Sign In').click();
// or
await app.find('com.yourapp:id/loginButton').click();
```

### Step 3: Run the Test

```bash
# Build the project first
npm run build

# Run a specific test
npx jest poc-examples/simple-poc.test.ts

# Or run all POC tests
npx jest poc-examples/
```

## Finding Elements in Your App

### Method 1: Use Appium Inspector
1. Start Appium: `appium`
2. Open Appium Inspector
3. Connect to your device
4. Inspect elements to find IDs/text

### Method 2: Use UI Automator Viewer (Android)
```bash
# Android only
uiautomatorviewer
```

### Method 3: Use Accessibility Inspector (iOS)
- Xcode → Open Developer Tools → Accessibility Inspector

### Method 4: Use Image Recognition
Take a screenshot of the element and use:
```typescript
await app.find('./images/login-button.png').click();
```

## Common Selectors

```typescript
// By text content
await app.find('Login').click();

// By accessibility ID (recommended)
await app.find('loginButton').click();

// By partial text
await app.find('Sign').click(); // Matches "Sign In", "Sign Up", etc.

// By image (if text/ID not available)
await app.find('./images/button.png').click();
```

## Troubleshooting

### App Won't Launch
- Check app path is correct
- Verify device is connected: `adb devices` (Android) or `xcrun simctl list` (iOS)
- Ensure Appium is running: `appium`

### Elements Not Found
- Use Appium Inspector to find correct selectors
- Try different strategies (text, ID, partial text)
- Enable accessibility features in your app
- Use image recognition as fallback

### Device Not Found
- List devices: `mobileauto device --list`
- Specify device explicitly:
  ```typescript
  device: 'local:device-id'
  ```

## Next Steps

1. Start with `simple-poc.test.ts` to verify setup
2. Move to `ecommerce-login.test.ts` for real-world example
3. Explore `advanced-features-poc.test.ts` for advanced capabilities

