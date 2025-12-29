# POC Step-by-Step Guide

Follow these steps to run your first POC with MobileAuto framework.

## Step 1: Setup Environment

```bash
# Run the setup script
./poc-setup.sh

# Or manually:
npm install
npm run build
npm install -g appium
```

## Step 2: Prepare Your Mobile App

### Option A: Use an Existing App
1. Get an APK file (Android) or IPA file (iOS)
2. Place it in the project root as `app.apk` or `app.ipa`

### Option B: Use a Test App
Download a sample app:
- Android: [Sample APK](https://github.com/appium/sample-apps)
- iOS: Use Xcode to build a sample app

## Step 3: Connect Device/Emulator

### For Android:
```bash
# Check connected devices
adb devices

# Start emulator (if using)
emulator -avd <emulator-name>
```

### For iOS:
```bash
# List simulators
xcrun simctl list devices

# Boot a simulator
xcrun simctl boot "iPhone 14"
```

## Step 4: Start Appium

```bash
# In a separate terminal
appium
```

Keep this running while you execute tests.

## Step 5: Create Your First Test

Copy `poc-examples/simple-poc.test.ts` and modify it:

```typescript
import { MobileAuto } from '../src/index';

const app = new MobileAuto({
  device: 'auto',
  app: './app.apk', // Your app path
  platform: 'android'
});

test('My First POC', async () => {
  await app.launch();
  
  // Replace with actual element from your app
  await app.find('Login').click();
  
  await app.close();
});
```

## Step 6: Find Elements in Your App

### Using Appium Inspector (Recommended)

1. **Start Appium Inspector:**
   ```bash
   appium --allow-insecure chromedriver_autodownload
   ```

2. **Open Appium Inspector:**
   - Download from: https://github.com/appium/appium-inspector/releases
   - Or use web version: http://localhost:4723

3. **Connect to your device:**
   - Platform: Android or iOS
   - Device Name: Your device name
   - App Path: Path to your APK/IPA
   - Click "Start Session"

4. **Inspect Elements:**
   - Click on elements in the app
   - See their properties (ID, text, etc.)
   - Use these in your tests

### Using UI Automator Viewer (Android Only)

```bash
# Launch UI Automator Viewer
uiautomatorviewer

# Connect to device and take screenshot
# Inspect elements to find IDs and text
```

## Step 7: Update Test with Real Selectors

Based on what you found in Appium Inspector:

```typescript
// If element has accessibility ID:
await app.find('loginButton').click();

// If element has text:
await app.find('Sign In').click();

// If element has partial text:
await app.find('Sign').click(); // Matches "Sign In", "Sign Up"

// If using image recognition:
await app.find('./images/login-button.png').click();
```

## Step 8: Run Your POC

```bash
# Run simple POC
npm test poc-examples/simple-poc.test.ts

# Run all POC examples
npm test poc-examples/

# Run with verbose output
npm test -- --verbose poc-examples/simple-poc.test.ts
```

## Step 9: View Results

- **Console Output**: See test execution in terminal
- **Screenshots**: Check `screenshots/` directory
- **Logs**: Check console for detailed logs

## Example: Complete POC Test

Here's what a complete POC looks like:

```typescript
import { MobileAuto } from '../src/index';

const app = new MobileAuto({
  device: 'auto',
  app: './app.apk',
  platform: 'android',
  timeout: 15000,
  retries: 3
});

describe('E-commerce App POC', () => {
  
  beforeAll(async () => {
    await app.launch();
    console.log('✅ App launched');
  });

  test('Login Flow', async () => {
    // Step 1: Navigate to login
    await app.find('Login').click();
    
    // Step 2: Enter credentials
    await app.find('Email').type('user@example.com');
    await app.find('Password').type('password123');
    
    // Step 3: Submit
    await app.find('Sign In').click();
    
    // Step 4: Verify
    await app.expect(app.find('Dashboard')).toBeVisible();
    
    console.log('✅ Login successful');
  });

  test('Take Screenshot', async () => {
    const screenshot = await app.screenshot('dashboard.png');
    console.log(`Screenshot: ${screenshot}`);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## What You'll See

When you run the POC, you'll see:

```
🚀 MobileAuto Test Execution
============================

[INFO] Initializing MobileAuto...
[INFO] Connected to device: emulator-5554
[INFO] Launching application...
[INFO] Application launched successfully
[DEBUG] Finding element: Login
[DEBUG] Found element by text: Login
[DEBUG] Clicked Login
[INFO] ✅ Test passed: Login Flow (2345ms)

============================
✅ All tests passed
```

## Troubleshooting

### "Device not found"
```bash
# List available devices
adb devices  # Android
xcrun simctl list devices  # iOS

# Specify device explicitly
device: 'local:emulator-5554'
```

### "App won't launch"
- Check app path is correct
- Verify app is compatible with device/emulator
- Ensure Appium is running

### "Element not found"
- Use Appium Inspector to find correct selectors
- Try different strategies (text, ID, partial)
- Enable accessibility in your app
- Use image recognition as fallback

### "Connection refused"
- Ensure Appium is running: `appium`
- Check Appium is on default port 4723
- Verify device is connected

## Next Steps

1. ✅ Run simple POC to verify setup
2. ✅ Try ecommerce-login example
3. ✅ Explore advanced features
4. ✅ Create your own test scenarios

## Tips for Success

1. **Start Simple**: Begin with `simple-poc.test.ts`
2. **Use Appium Inspector**: It's the best way to find elements
3. **Test One Thing at a Time**: Don't try to automate everything at once
4. **Take Screenshots**: Helps debug when things go wrong
5. **Read Logs**: Framework provides detailed logging

## What Makes This Different?

Compare with raw Appium:

**Raw Appium:**
```typescript
// Complex, error-prone
const driver = await remote({...});
let element;
try {
  element = await driver.$('~loginButton');
} catch {
  try {
    element = await driver.$('//*[@text="Login"]');
  } catch {
    // Manual retry needed
  }
}
await element.click();
```

**MobileAuto:**
```typescript
// Simple, auto-retry, multi-strategy
await app.find('Login').click();
```

That's the power of the framework! 🚀

