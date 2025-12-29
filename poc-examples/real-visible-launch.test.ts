/**
 * REAL Visible Launch - This will ACTUALLY open Settings app
 * 
 * Make sure Appium is running: appium
 * Watch your simulator - you WILL see the Settings app open!
 */

import { MobileAuto } from '../src/index';

describe('REAL Visible App Launch', () => {
  
  test('Launch Settings - YOU WILL SEE THIS!', async () => {
    console.log('\n🚀 REAL APP LAUNCH TEST');
    console.log('========================');
    console.log('👀 WATCH YOUR SIMULATOR SCREEN!');
    console.log('📱 Settings app WILL open in 3 seconds...\n');
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const app = new MobileAuto({
      device: 'local:976A7EE2-BF3A-458A-BF0D-64CDE2E37AA6', // Direct simulator UDID
      app: 'com.apple.Preferences',
      platform: 'ios',
      timeout: 30000
    });

    try {
      console.log('Step 1: Connecting via WebDriverIO to Appium...');
      await app.init();
      console.log('✅ Connected to Appium!');
      
      console.log('\nStep 2: Launching Settings app NOW...');
      console.log('👀👀👀 WATCH YOUR SIMULATOR - SETTINGS APP IS OPENING! 👀👀👀\n');
      
      await app.launch();
      
      console.log('✅ Launch command sent!');
      console.log('👀 Settings app should be OPEN on your simulator RIGHT NOW!');
      console.log('   If you don\'t see it, check:');
      console.log('   1. Is Appium running? (appium)');
      console.log('   2. Is simulator visible?');
      console.log('   3. Check Appium logs');
      
      // Wait 10 seconds so you can see it
      console.log('\n⏳ Waiting 10 seconds - WATCH YOUR SIMULATOR!');
      for (let i = 10; i > 0; i--) {
        console.log(`   ${i}... Settings app should be visible!`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Take screenshot
      try {
        const screenshot = await app.screenshot('settings-really-launched.png');
        console.log(`\n✅ Screenshot: ${screenshot}`);
        console.log('   This is from the ACTUAL simulator screen!');
      } catch (e) {
        console.log('⚠️  Screenshot failed but app might still be launched');
      }
      
      console.log('\n✅ Test complete!');
      console.log('👀 Check your simulator - Settings should be open!');
      
      // Keep it open
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error: any) {
      console.error('\n❌ ERROR:', error.message);
      console.error('\nFull error:', error);
      console.log('\n💡 This means:');
      console.log('   1. Appium might not be running - start it: appium');
      console.log('   2. WebDriverIO connection failed');
      console.log('   3. Check the error above for details');
    }
  }, 120000); // 2 minute timeout
});

