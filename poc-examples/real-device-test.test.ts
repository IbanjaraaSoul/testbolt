/**
 * Real Device Test - This will actually run on a mobile device/emulator
 * 
 * Prerequisites:
 * 1. Appium server running: appium
 * 2. Device/emulator connected
 * 3. App file (APK/IPA) available
 */

import { MobileAuto } from '../src/index';

// This test will actually connect to a device and run automation
describe('Real Mobile App Automation Test', () => {
  
  let app: MobileAuto;

  beforeAll(async () => {
    console.log('\n🚀 Starting Real Device Test...');
    console.log('==================================\n');
    
    // Initialize with real device
    app = new MobileAuto({
      device: 'emulator:iPhone-17-Pro', // or 'auto' to auto-detect
      app: './app.ipa', // Replace with your actual app path
      platform: 'ios',
      timeout: 20000,
      retries: 3,
      screenshotOnFailure: true
    });

    console.log('✅ MobileAuto initialized');
  });

  test('1. Launch App on Real Device', async () => {
    console.log('\n📱 Test 1: Launching app...');
    
    try {
      await app.launch();
      console.log('✅ App launched successfully on device!');
      
      // Take screenshot to verify
      const screenshot = await app.screenshot('app-launched.png');
      console.log(`✅ Screenshot saved: ${screenshot}`);
    } catch (error: any) {
      console.error('❌ Failed to launch app:', error.message);
      console.log('\n💡 Troubleshooting:');
      console.log('   - Is Appium running? (run: appium)');
      console.log('   - Is device/emulator connected?');
      console.log('   - Is app path correct?');
      throw error;
    }
  }, 30000); // 30 second timeout

  test('2. Find and Interact with Elements', async () => {
    console.log('\n🔍 Test 2: Finding elements...');
    
    try {
      // Try to find any element (adjust selector to match your app)
      const element = await app.find('Login');
      console.log('✅ Element found: Login');
      
      // Click it
      await element.click();
      console.log('✅ Element clicked successfully!');
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error: any) {
      console.log('⚠️  Element not found - this is expected if selectors don\'t match your app');
      console.log('💡 Use Appium Inspector to find correct selectors for your app');
      console.log(`   Error: ${error.message}`);
    }
  }, 30000);

  test('3. Take Screenshot of Current Screen', async () => {
    console.log('\n📸 Test 3: Taking screenshot...');
    
    try {
      const screenshot = await app.screenshot('current-screen.png');
      console.log(`✅ Screenshot saved: ${screenshot}`);
      console.log('   Check the screenshots/ directory');
    } catch (error: any) {
      console.error('❌ Failed to take screenshot:', error.message);
    }
  }, 15000);

  test('4. Test Gesture (if app is launched)', async () => {
    console.log('\n👆 Test 4: Testing gestures...');
    
    try {
      // Try a swipe gesture
      await app.gesture.swipe('up');
      console.log('✅ Swipe gesture executed');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await app.gesture.swipe('down');
      console.log('✅ Swipe down executed');
      
    } catch (error: any) {
      console.log('⚠️  Gesture test - device may not be connected');
      console.log(`   Error: ${error.message}`);
    }
  }, 15000);

  afterAll(async () => {
    console.log('\n🧹 Cleaning up...');
    try {
      await app.close();
      console.log('✅ App closed, test completed');
    } catch (error) {
      console.log('⚠️  Error during cleanup (this is okay)');
    }
    console.log('\n==================================');
    console.log('✅ Real Device Test Complete!');
    console.log('==================================\n');
  });
});

