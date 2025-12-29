# Quick Reference: MobileAuto vs Raw Appium

Side-by-side comparison showing what the actual automation code looks like.

## Basic Element Finding

### MobileAuto (Simple):
```typescript
await app.find('Login Button').click();
```

### Raw Appium (Complex):
```typescript
let element;
try {
  element = await driver.$('~loginButton');
} catch {
  try {
    element = await driver.$('//*[@text="Login Button"]');
  } catch {
    element = await driver.$('//*[contains(@text,"Login")]');
  }
}
await element.click();
```

## Complete Login Flow

### MobileAuto:
```typescript
const app = new MobileAuto({
  device: 'auto',
  app: './app.apk'
});

await app.launch();
await app.find('Email').type('user@example.com');
await app.find('Password').type('password123');
await app.find('Sign In').click();
await app.expect(app.find('Dashboard')).toBeVisible();
await app.close();
```

### Raw Appium:
```typescript
const driver = await remote({
  hostname: 'localhost',
  port: 4723,
  capabilities: {
    platformName: 'Android',
    'appium:deviceName': 'emulator',
    'appium:app': './app.apk'
  }
});

// Find email field with retry
let emailField;
for (let i = 0; i < 3; i++) {
  try {
    emailField = await driver.$('~emailInput');
    break;
  } catch {
    await sleep(1000);
  }
}
await emailField.setValue('user@example.com');

// Find password field with retry
let passwordField;
for (let i = 0; i < 3; i++) {
  try {
    passwordField = await driver.$('~passwordInput');
    break;
  } catch {
    await sleep(1000);
  }
}
await passwordField.setValue('password123');

// Find and click submit
let submitButton;
for (let i = 0; i < 3; i++) {
  try {
    submitButton = await driver.$('//*[@text="Sign In"]');
    break;
  } catch {
    await sleep(1000);
  }
}
await submitButton.click();

// Wait for dashboard
let dashboard;
for (let i = 0; i < 10; i++) {
  try {
    dashboard = await driver.$('~dashboard');
    if (await dashboard.isDisplayed()) break;
  } catch {
    await sleep(1000);
  }
}

await driver.deleteSession();
```

## Element Finding Strategies

### MobileAuto (Automatic):
```typescript
// Tries all strategies automatically
await app.find('Login').click();
// 1. Try by ID: ~loginButton
// 2. Try by text: //*[@text="Login"]
// 3. Try by partial: //*[contains(@text,"Login")]
// 4. Try by image: login-button.png
```

### Raw Appium (Manual):
```typescript
// You must try each strategy manually
let element;
try {
  element = await driver.$('~loginButton');
} catch {
  try {
    element = await driver.$('//*[@text="Login"]');
  } catch {
    try {
      element = await driver.$('//*[contains(@text,"Login")]');
    } catch {
      // Give up or use image recognition library
    }
  }
}
```

## Error Handling

### MobileAuto (Automatic):
```typescript
// Automatic retry, screenshot on failure
await app.find('Button').click();
// If fails: retries 3 times, takes screenshot
```

### Raw Appium (Manual):
```typescript
// Manual retry and error handling
let element;
let attempts = 0;
while (attempts < 3) {
  try {
    element = await driver.$('~button');
    await element.click();
    break;
  } catch (error) {
    attempts++;
    if (attempts >= 3) {
      await driver.takeScreenshot();
      throw error;
    }
    await sleep(1000);
  }
}
```

## Device Management

### MobileAuto (Simple):
```typescript
// Works with any device type
new MobileAuto({ device: 'auto' }); // Auto-detect
new MobileAuto({ device: 'local:device-id' });
new MobileAuto({ device: 'cloud:iPhone-14' });
new MobileAuto({ device: 'emulator:android-30' });
```

### Raw Appium (Complex):
```typescript
// Different setup for each device type
// Local device
const localDriver = await remote({
  hostname: 'localhost',
  capabilities: { /* local config */ }
});

// Cloud device
const cloudDriver = await remote({
  hostname: 'hub.browserstack.com',
  user: 'user',
  key: 'key',
  capabilities: { /* cloud config */ }
});

// Emulator
const emulatorDriver = await remote({
  hostname: 'localhost',
  capabilities: { /* emulator config */ }
});
```

## Gestures

### MobileAuto (Simple):
```typescript
await app.gesture.swipe('up');
await app.gesture.longPress(100, 200);
await app.gesture.dragDrop(100, 100, 300, 300);
```

### Raw Appium (Complex):
```typescript
// Swipe
await driver.touchAction([
  { action: 'press', x: 200, y: 400 },
  { action: 'wait', ms: 500 },
  { action: 'moveTo', x: 200, y: 100 },
  { action: 'release' }
]);

// Long press
await driver.touchAction([
  { action: 'press', x: 100, y: 200 },
  { action: 'wait', ms: 2000 },
  { action: 'release' }
]);

// Drag and drop
await driver.touchAction([
  { action: 'press', x: 100, y: 100 },
  { action: 'wait', ms: 500 },
  { action: 'moveTo', x: 300, y: 300 },
  { action: 'release' }
]);
```

## WebView Handling

### MobileAuto (Simple):
```typescript
await app.switchToWebView();
await app.find('Web Element').click();
await app.switchToNative();
```

### Raw Appium (Complex):
```typescript
// Get contexts
const contexts = await driver.getContexts();
const webViewContext = contexts.find(ctx => ctx.includes('WEBVIEW'));

// Switch to WebView
await driver.switchContext(webViewContext);

// Find element
const element = await driver.$('#webElement');
await element.click();

// Switch back
await driver.switchContext('NATIVE_APP');
```

## Summary

| Task | MobileAuto | Raw Appium | Lines Saved |
|------|------------|------------|-------------|
| Find element | 1 line | 5-10 lines | 80-90% |
| Login flow | 5 lines | 30-40 lines | 85-90% |
| Error handling | Automatic | 10-15 lines | 100% |
| Device setup | 1 line | 10-20 lines | 90-95% |
| Gestures | 1 line | 5-10 lines | 80-90% |

**MobileAuto reduces code by 80-95% while adding intelligence!** 🚀

