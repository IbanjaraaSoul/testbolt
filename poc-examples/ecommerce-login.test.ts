/**
 * POC Example: E-commerce App Login Flow
 * 
 * This demonstrates how MobileAuto framework works with a real mobile app.
 * Replace the selectors and app path with your actual app.
 */

import { MobileAuto } from '../src/index';

// Initialize MobileAuto with your app
const app = new MobileAuto({
  device: 'auto', // Auto-detect available device
  app: './app.apk', // Path to your APK file (or .ipa for iOS)
  platform: 'android', // or 'ios'
  timeout: 15000, // 15 seconds timeout
  retries: 3, // Retry 3 times if element not found
  screenshotOnFailure: true // Take screenshot on failure
});

describe('E-commerce App - Login Flow POC', () => {
  
  beforeAll(async () => {
    // Launch the app
    await app.launch();
    console.log('✅ App launched successfully');
  });

  afterAll(async () => {
    // Cleanup
    await app.close();
    console.log('✅ Test completed, app closed');
  });

  test('1. Navigate to Login Screen', async () => {
    // Find and click login button using AI-powered detection
    // Framework tries multiple strategies: ID → Text → Image → Partial
    const loginButton = await app.find('Login');
    await loginButton.click();
    // or
    // await app.click('Sign In');
    // or even
    // await app.find('login-button.png').click(); // Image recognition
    
    // Wait for login screen to appear
    await app.waitFor('Email', 10000);
    console.log('✅ Navigated to login screen');
  });

  test('2. Enter Login Credentials', async () => {
    // Enter email - framework finds element by text, ID, or image
    await app.type('Email', 'testuser@example.com');
    // or
    // await app.type('Email Input', 'testuser@example.com');
    
    // Enter password
    await app.type('Password', 'TestPassword123');
    
    console.log('✅ Credentials entered');
  });

  test('3. Submit Login Form', async () => {
    // Click submit button
    await app.click('Sign In');
    // or
    // await app.click('Login Button');
    // or
    // await app.click('Submit');
    
    console.log('✅ Login form submitted');
  });

  test('4. Verify Successful Login', async () => {
    // Wait for dashboard/home screen
    await app.waitFor('Dashboard', 15000);
    
    // Verify user is logged in
    const welcomeElement = await app.find('Welcome');
    await app.expect(welcomeElement).toBeVisible();
    // or
    // const userNameElement = await app.find('User Name');
    // await app.expect(userNameElement).toHaveText('Test User');
    
    console.log('✅ Login successful, dashboard visible');
  });

  test('5. Take Screenshot for Verification', async () => {
    // Take screenshot of the dashboard
    const screenshot = await app.screenshot('dashboard-after-login.png');
    console.log(`✅ Screenshot saved: ${screenshot}`);
  });
});

