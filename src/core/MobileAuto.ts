/**
 * Main MobileAuto class - provides high-level API for mobile automation
 */

import { DeviceManager } from '../devices/DeviceManager';
import { ElementFinder } from '../ai/ElementFinder';
import { GestureController } from '../features/GestureController';
import { BiometricController } from '../features/BiometricController';
import { WebViewHandler } from '../features/WebViewHandler';
import { Config } from '../config/Config';
import { Logger } from '../utils/Logger';
import type { Device } from '../devices/Device';
import type { Element } from '../ai/Element';

export interface MobileAutoOptions {
  device?: string | Device;
  app?: string;
  platform?: 'android' | 'ios';
  cloudProvider?: 'browserstack' | 'saucelabs' | 'local';
  timeout?: number;
  retries?: number;
  screenshotOnFailure?: boolean;
  videoRecording?: boolean;
}

export class MobileAuto {
  private deviceManager: DeviceManager;
  private elementFinder: ElementFinder;
  private gestureController: GestureController;
  private biometricController: BiometricController;
  private webViewHandler?: WebViewHandler;
  private config: Config;
  private logger: Logger;
  private currentDevice?: Device;
  private isLaunched: boolean = false;

  constructor(options: MobileAutoOptions = {}) {
    this.config = new Config(options);
    this.logger = new Logger(this.config.logLevel || 'info');
    this.deviceManager = new DeviceManager(this.config);
    this.elementFinder = new ElementFinder(this.config);
    this.gestureController = new GestureController();
    this.biometricController = new BiometricController();
  }

  /**
   * Initialize and connect to device
   */
  async init(): Promise<void> {
    this.logger.info('Initializing MobileAuto...');
    
    if (this.config.device) {
      this.currentDevice = await this.deviceManager.getDevice(this.config.device);
      await this.currentDevice.connect();
      this.logger.info(`Connected to device: ${this.currentDevice.id}`);
    }
  }

  /**
   * Launch the application
   */
  async launch(): Promise<void> {
    if (!this.currentDevice) {
      await this.init();
    }

    if (!this.currentDevice) {
      throw new Error('No device available. Please specify a device in options.');
    }

    this.logger.info('Launching application...');
    if (this.config.app) {
      await this.currentDevice.launchApp(this.config.app);
    } else {
      this.logger.warn('No app path specified, skipping app launch');
    }
    this.isLaunched = true;
    this.logger.info('Application launched successfully');
  }

  /**
   * Find element using AI-powered detection
   * Supports multiple strategies: text, id, image, position
   */
  async find(selector: string, options?: { timeout?: number; retries?: number }): Promise<Element> {
    if (!this.isLaunched) {
      await this.launch();
    }

    if (!this.currentDevice) {
      throw new Error('Device not initialized');
    }

    this.logger.debug(`Finding element: ${selector}`);
    const element = await this.elementFinder.find(
      this.currentDevice,
      selector,
      options
    );
    return element;
  }

  /**
   * Type text into an element
   */
  async type(selector: string, text: string): Promise<void> {
    const element = await this.find(selector);
    await element.type(text);
    this.logger.debug(`Typed "${text}" into ${selector}`);
  }

  /**
   * Click an element
   */
  async click(selector: string): Promise<void> {
    const element = await this.find(selector);
    await element.click();
    this.logger.debug(`Clicked ${selector}`);
  }

  /**
   * Wait for element to be visible
   */
  async waitFor(selector: string, timeout?: number): Promise<Element> {
    return await this.find(selector, { timeout });
  }

  /**
   * Take screenshot
   */
  async screenshot(filename?: string): Promise<string> {
    if (!this.currentDevice) {
      throw new Error('Device not initialized');
    }
    return await this.currentDevice.takeScreenshot(filename);
  }

  /**
   * Gesture controller for advanced gestures
   */
  get gesture() {
    return this.gestureController;
  }

  /**
   * Biometric authentication controller
   */
  get authenticate() {
    return this.biometricController;
  }

  /**
   * Switch to WebView context (for hybrid apps)
   */
  async switchToWebView(): Promise<void> {
    if (!this.currentDevice) {
      throw new Error('Device not initialized');
    }
    if (!this.webViewHandler) {
      this.webViewHandler = new WebViewHandler(this.currentDevice);
    }
    await this.webViewHandler.switchToWebView();
  }

  /**
   * Switch back to native context
   */
  async switchToNative(): Promise<void> {
    if (this.webViewHandler) {
      await this.webViewHandler.switchToNative();
    }
  }

  /**
   * Expect/Assert API for test assertions
   */
  expect(element: Element | Promise<Element>) {
    return {
      async toBeVisible(): Promise<void> {
        const el = await element;
        if (!(await el.isVisible())) {
          throw new Error(`Element is not visible`);
        }
      },
      async toHaveText(text: string): Promise<void> {
        const el = await element;
        const actualText = await el.getText();
        if (actualText !== text) {
          throw new Error(`Expected text "${text}" but got "${actualText}"`);
        }
      },
      async toExist(): Promise<void> {
        const el = await element;
        if (!(await el.exists())) {
          throw new Error(`Element does not exist`);
        }
      }
    };
  }

  /**
   * Cleanup and close connections
   */
  async close(): Promise<void> {
    this.logger.info('Closing MobileAuto...');
    if (this.currentDevice) {
      await this.currentDevice.disconnect();
    }
    this.isLaunched = false;
  }
}

