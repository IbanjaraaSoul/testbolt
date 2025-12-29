/**
 * Simple POC - Minimal Example
 * 
 * The simplest possible test to verify the framework works
 */

import { MobileAuto } from '../src/index';

const app = new MobileAuto({
  device: 'auto',
  app: './app.apk', // Replace with your app path
  platform: 'android'
});

test('Simple POC Test', async () => {
  // Launch app
  await app.launch();
  console.log('✅ App launched');
  
  // Take a screenshot to verify app is running
  const screenshot = await app.screenshot('app-launched.png');
  console.log(`✅ Screenshot: ${screenshot}`);
  
  // Try to find any element (replace with actual element from your app)
  try {
    const element = await app.find('Any Text or Button');
    await element.click();
    console.log('✅ Element found and clicked');
  } catch (error) {
    console.log('⚠️ Element not found - this is expected if selectors don\'t match your app');
    console.log('Update the selector to match your app\'s UI');
  }
  
  // Close app
  await app.close();
  console.log('✅ Test completed');
});

