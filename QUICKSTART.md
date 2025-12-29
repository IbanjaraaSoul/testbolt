# Quick Start Guide

Get started with MobileAuto in 5 minutes!

## Installation

```bash
npm install -g mobileauto
```

Or use locally in your project:

```bash
npm install mobileauto
```

## Prerequisites

- Node.js 16+ 
- For Android: Android SDK, ADB
- For iOS: Xcode, iOS Simulator
- Appium (will be auto-installed if missing)

## Step 1: Initialize Project

```bash
mobileauto init
```

This creates:
- `mobileauto.config.json` - Configuration file
- `tests/` - Test directory
- `screenshots/` - Screenshot directory
- Example test file

## Step 2: Add Your App

Place your app file in the project root:
- Android: `app.apk`
- iOS: `app.ipa`

Or specify the path in config:
```json
{
  "app": "./path/to/your/app.apk"
}
```

## Step 3: Write Your First Test

Edit `tests/example.test.ts`:

```typescript
import { MobileAuto } from 'mobileauto';

const app = new MobileAuto({
  device: 'auto', // Auto-detect available device
  app: './app.apk'
});

test('My First Test', async () => {
  await app.launch();
  
  // Find and click login button
  await app.find('Login').click();
  
  // Type credentials
  await app.find('Email').type('user@example.com');
  await app.find('Password').type('password123');
  
  // Submit
  await app.find('Submit').click();
  
  // Assert
  await app.expect(app.find('Dashboard')).toBeVisible();
  
  await app.close();
});
```

## Step 4: Run Tests

```bash
mobileauto test
```

Or run a specific test:

```bash
mobileauto test -f tests/example.test.ts
```

## Step 5: View Results

- Screenshots are saved in `screenshots/` directory
- Test results are displayed in console
- Failed tests include screenshots automatically

## Advanced Usage

### Using Cloud Devices

```typescript
const app = new MobileAuto({
  device: 'cloud:iPhone-14-Pro',
  cloudProvider: 'browserstack',
  app: './app.ipa'
});
```

### Using Local Device

```typescript
const app = new MobileAuto({
  device: 'local:device-id',
  app: './app.apk'
});
```

### Using Emulator

```typescript
const app = new MobileAuto({
  device: 'emulator:android-30',
  app: './app.apk'
});
```

### Advanced Features

```typescript
// Biometric authentication
await app.authenticate.biometric('face-id');

// Gestures
await app.gesture.swipe('up');
await app.gesture.longPress(100, 200);

// Screenshots
await app.screenshot('my-screenshot.png');
```

### Parallel Execution

```bash
mobileauto test --parallel
```

### List Available Devices

```bash
mobileauto device --list
```

## Configuration

Edit `mobileauto.config.json`:

```json
{
  "device": "auto",
  "platform": "android",
  "timeout": 10000,
  "retries": 3,
  "screenshotOnFailure": true,
  "videoRecording": false,
  "parallel": false,
  "maxParallel": 5
}
```

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for architecture details
- Check [PAIN_POINTS_SOLUTION.md](./PAIN_POINTS_SOLUTION.md) for how we solve common problems
- See `examples/` directory for more examples

## Troubleshooting

### Device Not Found
```bash
# List available devices
mobileauto device --list

# Or specify device explicitly
mobileauto test -d local:device-id
```

### App Not Launching
- Ensure app path is correct
- Check app is compatible with device/emulator
- Verify Appium is running

### Tests Failing
- Check screenshots in `screenshots/` directory
- Increase timeout in config
- Enable debug logging: `logLevel: "debug"`

## Getting Help

- Check documentation in `docs/`
- Review examples in `examples/`
- Open an issue on GitHub

