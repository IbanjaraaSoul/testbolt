# Visual Example: What Automation Looks Like

This document shows what the actual automation execution looks like when running MobileAuto tests.

## Example 1: Simple Login Flow

### Test Code:
```typescript
const app = new MobileAuto({
  device: 'auto',
  app: './app.apk'
});

test('Login Flow', async () => {
  await app.launch();
  await app.find('Login').click();
  await app.find('Email').type('user@example.com');
  await app.find('Password').type('password123');
  await app.find('Sign In').click();
  await app.expect(app.find('Dashboard')).toBeVisible();
  await app.close();
});
```

### Console Output:
```
🚀 MobileAuto Test Execution
============================

[INFO] Initializing MobileAuto...
[INFO] Auto-detecting device...
[INFO] Found device: emulator-5554 (Android 13)
[INFO] Connected to device: emulator-5554
[INFO] Launching application: ./app.apk
[INFO] Application launched successfully

[DEBUG] Finding element: Login
[DEBUG] Trying strategy: id
[DEBUG] Strategy 'id' failed, trying: text
[DEBUG] Found element by text: Login
[DEBUG] Clicked Login

[DEBUG] Finding element: Email
[DEBUG] Found element by id: emailInput
[DEBUG] Typed "user@example.com" into Email

[DEBUG] Finding element: Password
[DEBUG] Found element by id: passwordInput
[DEBUG] Typed "password123" into Password

[DEBUG] Finding element: Sign In
[DEBUG] Found element by text: Sign In
[DEBUG] Clicked Sign In

[DEBUG] Finding element: Dashboard
[DEBUG] Found element by id: dashboard
[DEBUG] Element is visible
[INFO] ✅ Test passed: Login Flow (3456ms)

[INFO] Closing MobileAuto...
[INFO] Disconnected from device
============================
✅ All tests passed (1/1)
```

## Example 2: With Retry Logic

### Test Code:
```typescript
test('Flaky Element Test', async () => {
  await app.launch();
  // Element might not be ready immediately
  await app.find('Slow Loading Button', { retries: 5, timeout: 20000 });
});
```

### Console Output:
```
[DEBUG] Finding element: Slow Loading Button
[DEBUG] Trying strategy: id (attempt 1/5)
[DEBUG] Strategy 'id' failed, trying: text
[DEBUG] Strategy 'text' failed, trying: partial-text
[DEBUG] Strategy 'partial-text' failed, trying: image
[DEBUG] Element not found, retrying in 1s...
[DEBUG] Trying strategy: id (attempt 2/5)
[DEBUG] Found element by text: Slow Loading Button
[INFO] ✅ Element found after 2 attempts
```

## Example 3: Error Handling

### Test Code:
```typescript
test('Element Not Found', async () => {
  await app.launch();
  try {
    await app.find('Non-existent Element').click();
  } catch (error) {
    // Screenshot automatically taken
    console.log('Element not found, screenshot saved');
  }
});
```

### Console Output:
```
[DEBUG] Finding element: Non-existent Element
[DEBUG] Trying strategy: id (attempt 1/3)
[DEBUG] Strategy 'id' failed, trying: text
[DEBUG] Strategy 'text' failed, trying: partial-text
[DEBUG] Strategy 'partial-text' failed, trying: image
[DEBUG] Element not found, retrying in 1s...
[DEBUG] Trying strategy: id (attempt 2/3)
[DEBUG] All strategies failed after 3 attempts
[ERROR] Element not found: Non-existent Element
[INFO] Screenshot saved: screenshot_element_not_found_1234567890.png
[ERROR] Test failed: Element Not Found
```

## Example 4: Advanced Features

### Test Code:
```typescript
test('Advanced Features', async () => {
  await app.launch();
  
  // Gestures
  await app.gesture.swipe('up');
  await app.gesture.longPress(100, 200);
  
  // Biometric
  await app.authenticate.biometric('face-id');
  
  // WebView
  await app.switchToWebView();
  await app.find('Web Element').click();
  await app.switchToNative();
});
```

### Console Output:
```
[INFO] Application launched successfully

[DEBUG] Swiping up
[INFO] Gesture executed: swipe up

[DEBUG] Long pressing at (100, 200)
[INFO] Gesture executed: longPress

[DEBUG] Authenticating with face-id
[INFO] Biometric authentication completed

[DEBUG] Switching to WebView context
[INFO] Switched to WebView: WEBVIEW_com.example.app
[DEBUG] Finding element: Web Element
[DEBUG] Found element in WebView
[DEBUG] Clicked Web Element
[DEBUG] Switching to native context
[INFO] Switched to native context

[INFO] ✅ Test passed: Advanced Features (5678ms)
```

## Example 5: Parallel Execution

### Test Code:
```typescript
// Running multiple tests in parallel
const tests = [
  { name: 'Test 1', fn: async () => { /* ... */ } },
  { name: 'Test 2', fn: async () => { /* ... */ } },
  { name: 'Test 3', fn: async () => { /* ... */ } }
];

await runner.runTests(tests);
```

### Console Output:
```
[INFO] Running tests in parallel (max: 5)
[INFO] Starting test batch 1/1 (3 tests)

[INFO] Test 1: Started
[INFO] Test 2: Started
[INFO] Test 3: Started

[INFO] Test 1: ✅ Passed (2345ms)
[INFO] Test 2: ✅ Passed (3456ms)
[INFO] Test 3: ✅ Passed (4567ms)

============================
✅ All tests passed (3/3)
Total time: 4567ms (parallel execution)
```

## Visual Flow Diagram

```
User Code
    ↓
MobileAuto API
    ↓
┌─────────────────────────┐
│  ElementFinder (AI)     │
│  - Try ID               │
│  - Try Text             │
│  - Try Partial Text     │
│  - Try Image            │
│  - Retry if needed      │
└─────────────────────────┘
    ↓
DeviceManager
    ↓
┌─────────────────────────┐
│  LocalDevice            │
│  CloudDevice            │
│  EmulatorDevice         │
└─────────────────────────┘
    ↓
WebDriverIO
    ↓
Appium Server
    ↓
Native Framework
    ↓
Mobile Device/Emulator
```

## Real-World Scenario

### E-commerce App Checkout Flow:

```typescript
// What you write:
await app.launch();
await app.find('Add to Cart').click();
await app.find('Cart').click();
await app.find('Checkout').click();
await app.find('Payment').type('1234567890');
await app.find('Place Order').click();
await app.expect(app.find('Order Confirmed')).toBeVisible();
```

### What Actually Happens:

1. **App Launch**: Framework connects to device, installs/launches app
2. **Find "Add to Cart"**: Tries multiple strategies, finds by text
3. **Click**: Executes click via Appium
4. **Find "Cart"**: Uses cached element or finds again
5. **Find "Checkout"**: Multi-strategy finding with retry
6. **Type Payment**: Enters text character by character
7. **Find "Place Order"**: Image recognition fallback if text not found
8. **Assert**: Waits for element, retries if not visible
9. **Screenshot**: Automatically saved on success/failure

## Key Differences from Raw Appium

### Raw Appium:
```typescript
// You write:
const driver = await remote({...});
let element;
try {
  element = await driver.$('~addToCart');
} catch {
  try {
    element = await driver.$('//*[@text="Add to Cart"]');
  } catch {
    // Manual retry logic
    await sleep(1000);
    element = await driver.$('~addToCart');
  }
}
await element.click();
```

### MobileAuto:
```typescript
// You write:
await app.find('Add to Cart').click();

// Framework handles:
// - Multiple finding strategies
// - Automatic retries
// - Error handling
// - Screenshots on failure
// - Detailed logging
```

## Summary

The framework provides:
- ✅ **Simple API**: Write less code
- ✅ **Intelligent Finding**: Multiple strategies automatically
- ✅ **Auto-Retry**: Handles flakiness
- ✅ **Better Logging**: See what's happening
- ✅ **Error Handling**: Screenshots and debugging info
- ✅ **Parallel Execution**: Run tests faster

This is what makes MobileAuto different from raw Appium! 🚀

