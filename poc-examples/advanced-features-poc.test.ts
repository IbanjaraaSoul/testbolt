/**
 * POC Example: Advanced Features Demonstration
 * 
 * Shows how to use advanced features like gestures, biometrics, and WebView
 */

import { MobileAuto } from '../src/index';

const app = new MobileAuto({
  device: 'auto',
  app: './app.apk',
  platform: 'android'
});

describe('Advanced Features POC', () => {
  
  beforeAll(async () => {
    await app.launch();
  });

  afterAll(async () => {
    await app.close();
  });

  test('1. Basic Interactions', async () => {
    // Click
    await app.find('Button').click();
    
    // Type text
    await app.find('Input Field').type('Hello MobileAuto');
    
    // Wait for element
    await app.waitFor('Element', { timeout: 10000 });
  });

  test('2. Gesture Controls', async () => {
    // Swipe up
    await app.gesture.swipe('up');
    
    // Swipe down
    await app.gesture.swipe('down');
    
    // Long press
    await app.gesture.longPress(200, 300, 2000); // x, y, duration
    
    // Drag and drop
    await app.gesture.dragDrop(100, 100, 300, 300);
    
    // Double tap
    await app.gesture.doubleTap(150, 200);
    
    console.log('✅ All gestures executed');
  });

  test('3. Biometric Authentication', async () => {
    // Trigger biometric prompt (if app supports it)
    await app.find('Login with Face ID').click();
    
    // Authenticate using Face ID
    await app.authenticate.biometric('face-id');
    // or
    // await app.authenticate.biometric('fingerprint');
    
    console.log('✅ Biometric authentication completed');
  });

  test('4. WebView Handling (for Hybrid Apps)', async () => {
    // Switch to WebView context
    await app.switchToWebView();
    
    // Interact with web elements
    await app.find('Web Element').click();
    
    // Switch back to native
    await app.switchToNative();
    
    console.log('✅ WebView interactions completed');
  });

  test('5. Assertions with Auto-Retry', async () => {
    // These assertions automatically retry if element not found
    await app.expect(app.find('Dashboard')).toBeVisible();
    await app.expect(app.find('User Name')).toHaveText('John Doe');
    await app.expect(app.find('Status')).toExist();
    
    console.log('✅ All assertions passed');
  });

  test('6. Error Handling with Screenshots', async () => {
    try {
      await app.find('Non-existent Element').click();
    } catch (error) {
      // Screenshot automatically taken on failure (if configured)
      const screenshot = await app.screenshot('error-screenshot.png');
      console.log(`Screenshot saved: ${screenshot}`);
      throw error;
    }
  });
});

