/**
 * Local Device implementation using Appium
 */

import { Device } from './Device';
import type { Config } from '../config/Config';
import { Logger } from '../utils/Logger';
import { execSync } from 'child_process';

export class LocalDevice implements Device {
  public id: string;
  public name: string;
  public platform: 'android' | 'ios';
  public version: string;
  private driver: any; // WebDriverIO driver
  private config: Config;
  private logger: Logger;

  constructor(deviceId: string, config: Config) {
    this.id = deviceId;
    this.config = config;
    this.logger = new Logger(config.logLevel || 'info');
    this.platform = config.platform || 'android';
    this.name = deviceId;
    this.version = 'unknown';
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (this.platform === 'android') {
        const devices = execSync('adb devices', { encoding: 'utf-8' });
        return devices.includes(this.id);
      } else {
        const devices = execSync('xcrun simctl list devices', { encoding: 'utf-8' });
        return devices.includes(this.id);
      }
    } catch {
      return false;
    }
  }

  async connect(): Promise<void> {
    this.logger.info(`Connecting to local device: ${this.id}`);
    
    try {
      // Import WebDriverIO dynamically
      const { remote } = require('webdriverio');
      
      // Build capabilities based on platform
      const capabilities: any = {
        platformName: this.platform === 'ios' ? 'iOS' : 'Android',
        'appium:deviceName': this.name,
        'appium:automationName': this.platform === 'ios' ? 'XCUITest' : 'UIAutomator2'
      };
      
      // Add app path if provided
      if (this.config.app) {
        capabilities['appium:app'] = this.config.app;
      }
      
      // For iOS simulator
      if (this.platform === 'ios') {
        capabilities['appium:platformVersion'] = '18.1'; // Default, can be detected
        // Get actual simulator UDID
        try {
          const { execSync } = require('child_process');
          const devices = execSync('xcrun simctl list devices', { encoding: 'utf-8' });
          const match = devices.match(/iPhone 17 Pro.*\(([^)]+)\)/);
          if (match) {
            capabilities['appium:udid'] = match[1];
          } else {
            capabilities['appium:udid'] = this.id;
          }
        } catch {
          capabilities['appium:udid'] = this.id;
        }
      }
      
      // Connect to Appium server
      this.driver = await remote({
        hostname: 'localhost',
        port: 4723,
        path: '/',
        capabilities
      });
      
      this.logger.info(`✅ Connected to device via Appium`);
    } catch (error: any) {
      this.logger.error(`Failed to connect to device: ${error.message}`);
      throw new Error(`Device connection failed: ${error.message}. Make sure Appium is running (appium)`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.driver) {
      await this.driver.deleteSession();
      this.driver = null;
    }
  }

  async launchApp(appPath: string): Promise<void> {
    if (!this.driver) {
      await this.connect();
    }
    
    this.logger.info(`Launching app: ${appPath}`);
    
    try {
      if (this.platform === 'ios') {
        // For iOS, use bundle ID to launch app
        // If it's a bundle ID (like com.apple.Preferences), use activateApp
        // If it's a path, we need to install it first
        if (appPath.includes('.ipa') || appPath.includes('/')) {
          // It's a file path - would need to install first
          this.logger.warn('IPA file path provided - app installation not yet implemented');
          // For now, try to activate by bundle ID extracted from path
          await this.driver.activateApp(appPath);
        } else {
          // It's a bundle ID (like com.apple.Preferences)
          await this.driver.activateApp(appPath);
          // Wait a bit for app to fully launch
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } else {
        // For Android
        if (appPath.includes('.apk')) {
          // Install and launch APK
          await this.driver.activateApp(appPath);
        } else {
          // Package name
          await this.driver.activateApp(appPath);
        }
      }
      this.logger.info('✅ App launched successfully');
    } catch (error: any) {
      this.logger.error(`Failed to launch app: ${error.message}`);
      // Try alternative method
      try {
        if (this.platform === 'ios') {
          await this.driver.execute('mobile: launchApp', [{ bundleId: appPath }]);
          await new Promise(resolve => setTimeout(resolve, 2000));
          this.logger.info('✅ App launched using alternative method');
        }
      } catch (error2: any) {
        this.logger.error(`Alternative launch also failed: ${error2.message}`);
        throw error;
      }
    }
  }

  async findElement(strategy: string, selector: string): Promise<string | null> {
    if (!this.driver) return null;
    
    try {
      let element;
      switch (strategy) {
        case 'id':
          // Accessibility ID
          element = await this.driver.$(`~${selector}`);
          break;
        case 'text':
          // XPath by text
          if (this.platform === 'ios') {
            element = await this.driver.$(`//XCUIElementTypeButton[@name="${selector}"] | //XCUIElementTypeStaticText[@name="${selector}"]`);
          } else {
            element = await this.driver.$(`//*[@text="${selector}"]`);
          }
          break;
        case 'partial-text':
          // XPath by partial text
          if (this.platform === 'ios') {
            element = await this.driver.$(`//*[contains(@name,"${selector}")]`);
          } else {
            element = await this.driver.$(`//*[contains(@text,"${selector}")]`);
          }
          break;
        default:
          return null;
      }
      
      if (element && element.elementId) {
        return element.elementId;
      }
      return null;
    } catch (error: any) {
      this.logger.debug(`Element not found with strategy ${strategy}: ${error.message}`);
      return null;
    }
  }

  async findElementByImage(imagePath: string): Promise<string | null> {
    // Image-based element finding using OpenCV
    // This would use template matching
    return null;
  }

  async clickElement(elementId: string): Promise<void> {
    if (!this.driver) {
      throw new Error('Driver not connected');
    }
    try {
      const element = await this.driver.$(elementId);
      await element.click();
    } catch (error: any) {
      this.logger.error(`Failed to click element: ${error.message}`);
      throw error;
    }
  }

  async typeText(elementId: string, text: string): Promise<void> {
    if (!this.driver) {
      throw new Error('Driver not connected');
    }
    try {
      const element = await this.driver.$(elementId);
      await element.setValue(text);
    } catch (error: any) {
      this.logger.error(`Failed to type text: ${error.message}`);
      throw error;
    }
  }

  async getElementText(elementId: string): Promise<string> {
    if (!this.driver) {
      return '';
    }
    try {
      const element = await this.driver.$(elementId);
      return await element.getText();
    } catch {
      return '';
    }
  }

  async isElementVisible(elementId: string): Promise<boolean> {
    try {
      if (!this.driver) {
        return false;
      }
      const element = await this.driver.$(elementId);
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  async getElementInfo(elementId: string): Promise<any> {
    if (this.driver) {
      return await this.driver.$(elementId).getElementProperties();
    }
    return null;
  }

  async getElementLocation(elementId: string): Promise<{ x: number; y: number }> {
    if (this.driver) {
      const location = await this.driver.$(elementId).getLocation();
      return { x: location.x, y: location.y };
    }
    return { x: 0, y: 0 };
  }

  async getElementSize(elementId: string): Promise<{ width: number; height: number }> {
    if (this.driver) {
      const size = await this.driver.$(elementId).getSize();
      return { width: size.width, height: size.height };
    }
    return { width: 0, height: 0 };
  }

  async scrollToElement(elementId: string): Promise<void> {
    if (this.driver) {
      await this.driver.$(elementId).scrollIntoView();
    }
  }

  async takeScreenshot(filename?: string): Promise<string> {
    if (!this.driver) {
      throw new Error('Driver not connected');
    }
    
    try {
      const fs = require('fs');
      const path = require('path');
      
      const screenshot = await this.driver.takeScreenshot();
      const screenshotDir = path.join(process.cwd(), 'screenshots');
      
      // Create screenshots directory if it doesn't exist
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      const filePath = path.join(screenshotDir, filename || `screenshot_${Date.now()}.png`);
      fs.writeFileSync(filePath, screenshot, 'base64');
      
      this.logger.info(`Screenshot saved: ${filePath}`);
      return filePath;
    } catch (error: any) {
      this.logger.error(`Failed to take screenshot: ${error.message}`);
      throw error;
    }
  }

  async executeScript(script: string, args?: any[]): Promise<any> {
    if (this.driver) {
      return await this.driver.execute(script, args || []);
    }
    return null;
  }

  static async listAvailable(): Promise<LocalDevice[]> {
    const devices: LocalDevice[] = [];
    // List Android devices
    try {
      const output = execSync('adb devices', { encoding: 'utf-8' });
      const lines = output.split('\n').slice(1);
      for (const line of lines) {
        if (line.trim() && !line.includes('List')) {
          const deviceId = line.split('\t')[0];
          if (deviceId) {
            devices.push(new LocalDevice(deviceId, {} as Config));
          }
        }
      }
    } catch {
      // No Android devices
    }
    return devices;
  }
}

