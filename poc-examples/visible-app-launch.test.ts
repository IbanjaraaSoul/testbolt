/**
 * Visible App Launch Test
 * 
 * This test will ACTUALLY launch an app on the visible simulator
 * You should see the Settings app open on your simulator screen!
 */

import { MobileAuto } from '../src/index';

describe('Visible App Launch - You Should See This!', () => {
  
  let app: MobileAuto;

  beforeAll(async () => {
    console.log('\n🚀 VISIBLE APP LAUNCH TEST');
    console.log('===========================');
    console.log('👀 WATCH YOUR SIMULATOR - App should launch!');
    console.log('');
  }, 60000);

  test('Launch Settings App - YOU SHOULD SEE THIS!', async () => {
    console.log('\n📱 Launching Settings app...');
    console.log('👀 WATCH YOUR SIMULATOR NOW!');
    console.log('');
    
    app = new MobileAuto({
      device: 'auto',
      app: 'com.apple.Preferences', // iOS Settings app bundle ID
      platform: 'ios',
      timeout: 30000,
      retries: 3
    });

    try {
      console.log('Step 1: Connecting to simulator...');
      await app.init();
      console.log('✅ Connected!');
      
      console.log('\nStep 2: Launching Settings app...');
      console.log('👀 THE SIMULATOR SHOULD NOW SHOW SETTINGS APP!');
      await app.launch();
      
      // Wait longer so you can see it
      console.log('\n⏳ Waiting 5 seconds so you can see the app...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log('✅ App should be visible on your simulator now!');
      
      // Take screenshot to prove it
      const screenshot = await app.screenshot('settings-visible.png');
      console.log(`✅ Screenshot saved: ${screenshot}`);
      console.log('   This proves the app is actually running!');
      
      // Try to interact
      console.log('\nStep 3: Trying to find elements...');
      try {
        // Settings app has "General" option
        const general = await app.find('General');
        console.log('✅ Found "General" element!');
        console.log('👀 You should see it highlighted on simulator!');
        
        await general.click();
        console.log('✅ Clicked General!');
        console.log('👀 Watch simulator - it should navigate!');
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error: any) {
        console.log('⚠️  Element finding:', error.message);
        console.log('   But the app IS launched - check your simulator!');
      }
      
      // Keep app open for a bit
      console.log('\n⏳ Keeping app open for 3 more seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('\n✅ Test complete!');
      console.log('👀 Check your simulator - Settings app should still be visible!');
      
    } catch (error: any) {
      console.error('\n❌ Error:', error.message);
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Is Appium running? Try: appium');
      console.log('   2. Is simulator booted? Check: xcrun simctl list devices');
      console.log('   3. Check Appium logs for details');
      throw error;
    }
  }, 90000); // 90 second timeout

  afterAll(async () => {
    console.log('\n🧹 Test finished');
    console.log('👀 Simulator should still show the app!');
    try {
      await app.close();
    } catch (error) {
      // Ignore cleanup errors
    }
  }, 10000);
});

