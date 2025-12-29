# Real Device Test Setup

This guide will help you run the framework on an actual mobile device/emulator.

## Quick Start

### Step 1: Install Appium
```bash
npm install -g appium
```

### Step 2: Start Appium Server
```bash
# In a separate terminal window
appium
```

Keep this running while you execute tests.

### Step 3: Connect Device/Emulator

#### For iOS (macOS):
```bash
# List available simulators
xcrun simctl list devices

# Boot a simulator
xcrun simctl boot "iPhone 17 Pro"

# Or use Xcode to start a simulator
```

#### For Android:
```bash
# Check connected devices
adb devices

# Start emulator (if you have one)
emulator -avd <emulator-name>
```

### Step 4: Prepare Your App

Place your app file in the project root:
- iOS: `app.ipa` or specify path in test
- Android: `app.apk` or specify path in test

### Step 5: Update Test File

Edit `poc-examples/real-device-test.test.ts`:
```typescript
app = new MobileAuto({
  device: 'emulator:iPhone-17-Pro', // or your device
  app: './your-app.ipa', // Your app path
  platform: 'ios' // or 'android'
});
```

### Step 6: Find Element Selectors

Use Appium Inspector to find elements:
1. Download Appium Inspector: https://github.com/appium/appium-inspector/releases
2. Start Appium server: `appium`
3. Open Appium Inspector
4. Connect to your device
5. Inspect elements to find IDs/text

### Step 7: Run the Test

```bash
npm test poc-examples/real-device-test.test.ts
```

## What You'll See

When the test runs successfully:

```
🚀 Starting Real Device Test...
==================================

✅ MobileAuto initialized

📱 Test 1: Launching app...
[INFO] Initializing MobileAuto...
[INFO] Connected to device: iPhone-17-Pro
[INFO] Launching application...
[INFO] Application launched successfully
✅ App launched successfully on device!
✅ Screenshot saved: screenshots/app-launched.png

🔍 Test 2: Finding elements...
[DEBUG] Finding element: Login
[DEBUG] Found element by text: Login
✅ Element found: Login
✅ Element clicked successfully!

📸 Test 3: Taking screenshot...
✅ Screenshot saved: screenshots/current-screen.png

👆 Test 4: Testing gestures...
✅ Swipe gesture executed
✅ Swipe down executed

🧹 Cleaning up...
✅ App closed, test completed

==================================
✅ Real Device Test Complete!
==================================
```

## Troubleshooting

### "Appium not found"
```bash
npm install -g appium
```

### "Device not found"
- For iOS: Boot simulator first: `xcrun simctl boot "iPhone 17 Pro"`
- For Android: Check `adb devices` and ensure device is listed

### "App won't launch"
- Verify app path is correct
- Check app is compatible with device/emulator
- Ensure Appium is running

### "Element not found"
- Use Appium Inspector to find correct selectors
- Update selectors in test file
- Try different strategies (text, ID, partial text)

### "Connection refused"
- Ensure Appium is running: `appium`
- Check Appium is on default port 4723
- Verify device is connected

## Example: Complete Real Test

```typescript
import { MobileAuto } from '../src/index';

const app = new MobileAuto({
  device: 'auto', // Auto-detect
  app: './my-app.ipa',
  platform: 'ios'
});

test('Real App Test', async () => {
  // Launch app on real device
  await app.launch();
  
  // Find and click login
  await app.find('Login').click();
  
  // Enter credentials
  await app.type('Email', 'user@example.com');
  await app.type('Password', 'password123');
  
  // Submit
  await app.click('Sign In');
  
  // Verify
  await app.expect(app.find('Dashboard')).toBeVisible();
  
  // Screenshot
  await app.screenshot('dashboard.png');
  
  // Close
  await app.close();
});
```

## Next Steps

1. ✅ Install Appium
2. ✅ Start Appium server
3. ✅ Boot simulator/connect device
4. ✅ Place your app file
5. ✅ Update test with your app's selectors
6. ✅ Run the test!

The framework is ready - you just need a device and app to test with! 🚀

