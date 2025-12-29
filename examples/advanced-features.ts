/**
 * Advanced features example
 */

import { MobileAuto } from '../src/index';

const app = new MobileAuto({
  device: 'cloud:iPhone-14-Pro',
  app: './app.ipa',
  platform: 'ios'
});

test('Advanced Features Test', async () => {
  await app.launch();
  
  // Basic interactions
  await app.find('Login').click();
  
  // Biometric authentication
  await app.authenticate.biometric('face-id');
  
  // Gestures
  await app.gesture.swipe('up');
  await app.gesture.longPress(100, 200, 2000);
  await app.gesture.dragDrop(100, 100, 300, 300);
  
  // Screenshot
  await app.screenshot('after-login.png');
  
  // Assertions
  await app.expect(app.find('Dashboard')).toBeVisible();
  await app.expect(app.find('User Name')).toHaveText('John Doe');
  
  await app.close();
});

