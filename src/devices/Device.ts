/**
 * Base Device interface
 */

export interface Device {
  id: string;
  name: string;
  platform: 'android' | 'ios';
  version: string;
  isAvailable(): Promise<boolean>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  launchApp(appPath: string): Promise<void>;
  findElement(strategy: string, selector: string): Promise<string | null>;
  findElementByImage(imagePath: string): Promise<string | null>;
  clickElement(elementId: string): Promise<void>;
  typeText(elementId: string, text: string): Promise<void>;
  getElementText(elementId: string): Promise<string>;
  isElementVisible(elementId: string): Promise<boolean>;
  getElementInfo(elementId: string): Promise<any>;
  getElementLocation(elementId: string): Promise<{ x: number; y: number }>;
  getElementSize(elementId: string): Promise<{ width: number; height: number }>;
  scrollToElement(elementId: string): Promise<void>;
  takeScreenshot(filename?: string): Promise<string>;
  executeScript(script: string, args?: any[]): Promise<any>;
}

