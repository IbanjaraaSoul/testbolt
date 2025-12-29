/**
 * Basic test example
 */

import { MobileAuto } from '../src/index';

const app = new MobileAuto({
  device: 'auto', // Auto-detect device
  app: './app.apk',
  platform: 'android'
});

test('Login Flow', async () => {
  await app.launch();
  
  // AI-powered element finding - adapts to UI changes
  await app.find('Login Button').click();
  await app.find('Email Input').type('user@example.com');
  await app.find('Password Input').type('password123');
  await app.find('Submit').click();
  
  // Wait for dashboard
  await app.waitFor('Dashboard');
  
  // Assertions with auto-retry
  await app.expect(app.find('Welcome Message')).toBeVisible();
  
  await app.close();
});

