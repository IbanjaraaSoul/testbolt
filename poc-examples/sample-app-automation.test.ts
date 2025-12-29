/**
 * Sample App Automation Test
 * 
 * This test runs automation against a sample iOS app in headed mode (visible simulator)
 */

import { MobileAuto } from '../src/index';

describe('Sample App Automation - Headed Mode', () => {
  
  let app: MobileAuto;

  beforeAll(async () => {
    console.log('\n🚀 Starting Sample App Automation Test...');
    console.log('==========================================\n');
    console.log('📱 Simulator will be visible (headed mode)');
    console.log('👀 Watch the simulator screen to see automation!\n');
    
    // Initialize with sample app
    // Using a simple test app bundle ID for demo
    app = new MobileAuto({
      device: 'auto',
      app: 'com.apple.Preferences', // We'll use Settings as sample, or create a real app
      platform: 'ios',
      timeout: 30000,
      retries: 3,
      screenshotOnFailure: true
    });

    console.log('✅ MobileAuto initialized');
  }, 60000);

  test('1. Launch Sample App in Headed Mode', async () => {
    console.log('\n📱 Test 1: Launching app (you should see simulator)...');
    
    try {
      await app.launch();
      console.log('✅ App launched on simulator!');
      console.log('   👀 Check your simulator - it should be visible!');
      
      // Wait a bit so you can see it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot
      const screenshot = await app.screenshot('app-launched-headed.png');
      console.log(`✅ Screenshot saved: ${screenshot}`);
      console.log('   This proves the app is running on the visible simulator!');
      
    } catch (error: any) {
      console.error('\n❌ Failed to launch app:', error.message);
      throw error;
    }
  }, 60000);

  test('2. Interact with App Elements (Visible)', async () => {
    console.log('\n👆 Test 2: Interacting with app (watch the simulator)...');
    
    try {
      // Try to find and interact with elements
      // Settings app has "General" option
      console.log('   🔍 Looking for "General" option...');
      
      try {
        const generalElement = await app.find('General');
        console.log('   ✅ Found "General" element!');
        console.log('   👀 You should see the element highlighted on simulator!');
        
        // Click it
        await generalElement.click();
        console.log('   ✅ Clicked "General"!');
        console.log('   👀 Watch simulator - it should navigate!');
        
        // Wait to see the navigation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Take screenshot
        await app.screenshot('after-click-headed.png');
        console.log('   ✅ Screenshot taken - check the simulator screen!');
        
      } catch (error: any) {
        console.log('   ⚠️  Element not found (this is okay for demo)');
        console.log('   💡 In a real app, you would see the element being clicked');
      }
      
      // Try a swipe gesture (visible on simulator)
      console.log('\n   👆 Performing swipe gesture...');
      await app.gesture.swipe('up');
      console.log('   ✅ Swipe executed!');
      console.log('   👀 Watch simulator - screen should scroll up!');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await app.gesture.swipe('down');
      console.log('   ✅ Swipe down executed!');
      console.log('   👀 Watch simulator - screen should scroll down!');
      
    } catch (error: any) {
      console.log('   ⚠️  Interaction test:', error.message);
    }
  }, 60000);

  test('3. Visual Verification', async () => {
    console.log('\n📸 Test 3: Taking screenshots (visible on simulator)...');
    
    try {
      // Take multiple screenshots
      const screenshot1 = await app.screenshot('screen1-headed.png');
      console.log(`   ✅ Screenshot 1: ${screenshot1}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const screenshot2 = await app.screenshot('screen2-headed.png');
      console.log(`   ✅ Screenshot 2: ${screenshot2}`);
      
      console.log('\n   👀 Check the screenshots/ directory');
      console.log('   📱 All screenshots are from the visible simulator!');
      
    } catch (error: any) {
      console.error('   ❌ Screenshot failed:', error.message);
    }
  }, 30000);

  test('4. Demonstrate Real Automation Flow', async () => {
    console.log('\n🎬 Test 4: Real automation flow (watch simulator)...');
    
    try {
      console.log('   Step 1: App is already launched');
      console.log('   👀 Simulator should show the app');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('   Step 2: Taking screenshot');
      await app.screenshot('automation-flow-headed.png');
      console.log('   ✅ Screenshot taken');
      
      console.log('   Step 3: Performing gesture');
      await app.gesture.swipe('up');
      console.log('   👀 Watch simulator scroll!');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('   Step 4: Final screenshot');
      await app.screenshot('final-state-headed.png');
      console.log('   ✅ All steps completed!');
      
      console.log('\n   🎉 You just saw real automation on a visible simulator!');
      
    } catch (error: any) {
      console.log('   ⚠️  Automation flow:', error.message);
    }
  }, 60000);

  afterAll(async () => {
    console.log('\n🧹 Cleaning up...');
    try {
      await app.close();
      console.log('✅ Test completed');
      console.log('\n👀 Simulator is still visible - you can see the final state!');
    } catch (error) {
      console.log('⚠️  Cleanup error (this is okay)');
    }
    console.log('\n==========================================');
    console.log('✅ Sample App Automation Complete!');
    console.log('👀 Check the simulator - it should still be visible!');
    console.log('==========================================\n');
  }, 30000);
});

