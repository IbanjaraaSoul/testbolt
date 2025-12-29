/**
 * AI-Powered Element Finder
 * Uses multiple strategies to find elements, reducing flakiness
 */

import type { Device } from '../devices/Device';
import { Element } from './Element';
import { Logger } from '../utils/Logger';
import type { Config } from '../config/Config';

export interface FindOptions {
  timeout?: number;
  retries?: number;
}

export class ElementFinder {
  private logger: Logger;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.logger = new Logger(config.logLevel || 'info');
  }

  /**
   * Find element using multiple strategies
   * 1. Try by ID/accessibility ID
   * 2. Try by text content
   * 3. Try by image recognition (CV)
   * 4. Try by position/coordinates
   */
  async find(device: Device, selector: string, options?: FindOptions): Promise<Element> {
    const timeout = options?.timeout || this.config.timeout || 10000;
    const retries = options?.retries || this.config.retries || 3;
    const startTime = Date.now();

    this.logger.debug(`Finding element: ${selector} (timeout: ${timeout}ms, retries: ${retries})`);

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        // Strategy 1: Try by ID/Accessibility ID
        let element = await this.findById(device, selector);
        if (element && await element.exists()) {
          this.logger.debug(`Found element by ID: ${selector}`);
          return element;
        }

        // Strategy 2: Try by text content
        element = await this.findByText(device, selector);
        if (element && await element.exists()) {
          this.logger.debug(`Found element by text: ${selector}`);
          return element;
        }

        // Strategy 3: Try by image recognition (Computer Vision)
        element = await this.findByImage(device, selector);
        if (element && await element.exists()) {
          this.logger.debug(`Found element by image: ${selector}`);
          return element;
        }

        // Strategy 4: Try by partial text match
        element = await this.findByPartialText(device, selector);
        if (element && await element.exists()) {
          this.logger.debug(`Found element by partial text: ${selector}`);
          return element;
        }

      } catch (error) {
        this.logger.debug(`Attempt ${attempt + 1} failed: ${error}`);
      }

      // Wait before retry
      if (attempt < retries - 1) {
        const elapsed = Date.now() - startTime;
        if (elapsed < timeout) {
          await this.sleep(1000);
        }
      }
    }

    // Take screenshot for debugging
    const screenshot = await device.takeScreenshot(`element_not_found_${Date.now()}.png`);
    throw new Error(
      `Element not found: ${selector}. Screenshot saved: ${screenshot}`
    );
  }

  private async findById(device: Device, selector: string): Promise<Element | null> {
    try {
      const element = await device.findElement('id', selector);
      return element ? new Element(device, element) : null;
    } catch {
      return null;
    }
  }

  private async findByText(device: Device, selector: string): Promise<Element | null> {
    try {
      const element = await device.findElement('text', selector);
      return element ? new Element(device, element) : null;
    } catch {
      return null;
    }
  }

  private async findByPartialText(device: Device, selector: string): Promise<Element | null> {
    try {
      const element = await device.findElement('partial-text', selector);
      return element ? new Element(device, element) : null;
    } catch {
      return null;
    }
  }

  private async findByImage(device: Device, selector: string): Promise<Element | null> {
    try {
      // This would use computer vision to find elements by image
      // For now, we'll check if selector is an image path
      if (selector.endsWith('.png') || selector.endsWith('.jpg')) {
        const element = await device.findElementByImage(selector);
        return element ? new Element(device, element) : null;
      }
      return null;
    } catch {
      return null;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

