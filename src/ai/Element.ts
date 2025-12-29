/**
 * Element wrapper with actions and properties
 */

import type { Device } from '../devices/Device';

export class Element {
  constructor(
    private device: Device,
    private elementId: string
  ) {}

  /**
   * Click the element
   */
  async click(): Promise<void> {
    await this.device.clickElement(this.elementId);
  }

  /**
   * Type text into the element
   */
  async type(text: string): Promise<void> {
    await this.device.typeText(this.elementId, text);
  }

  /**
   * Get text content of the element
   */
  async getText(): Promise<string> {
    return await this.device.getElementText(this.elementId);
  }

  /**
   * Check if element is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.device.isElementVisible(this.elementId);
  }

  /**
   * Check if element exists
   */
  async exists(): Promise<boolean> {
    try {
      await this.device.getElementInfo(this.elementId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element location
   */
  async getLocation(): Promise<{ x: number; y: number }> {
    return await this.device.getElementLocation(this.elementId);
  }

  /**
   * Get element size
   */
  async getSize(): Promise<{ width: number; height: number }> {
    return await this.device.getElementSize(this.elementId);
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(): Promise<void> {
    await this.device.scrollToElement(this.elementId);
  }
}

