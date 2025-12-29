/**
 * WebView Handler - For hybrid and web apps
 */

import type { Device } from '../devices/Device';
import { Logger } from '../utils/Logger';

export class WebViewHandler {
  private device: Device;
  private logger: Logger;
  private currentContext: string = 'NATIVE_APP';

  constructor(device: Device) {
    this.device = device;
    this.logger = new Logger('info');
  }

  /**
   * Switch to WebView context
   */
  async switchToWebView(): Promise<void> {
    this.logger.debug('Switching to WebView context');
    
    // Get all available contexts
    const contexts = await this.getAvailableContexts();
    
    // Find WebView context
    const webViewContext = contexts.find(ctx => 
      ctx.includes('WEBVIEW') || ctx.includes('CHROMIUM')
    );

    if (webViewContext) {
      await this.device.executeScript('mobile: switchContext', [webViewContext]);
      this.currentContext = webViewContext;
      this.logger.info(`Switched to WebView: ${webViewContext}`);
    } else {
      throw new Error('No WebView context found');
    }
  }

  /**
   * Switch back to native context
   */
  async switchToNative(): Promise<void> {
    this.logger.debug('Switching to native context');
    await this.device.executeScript('mobile: switchContext', ['NATIVE_APP']);
    this.currentContext = 'NATIVE_APP';
    this.logger.info('Switched to native context');
  }

  /**
   * Get available contexts
   */
  async getAvailableContexts(): Promise<string[]> {
    try {
      const contexts = await this.device.executeScript('mobile: getContexts', []);
      return contexts || ['NATIVE_APP'];
    } catch {
      return ['NATIVE_APP'];
    }
  }

  /**
   * Check if WebView is available
   */
  async isWebViewAvailable(): Promise<boolean> {
    const contexts = await this.getAvailableContexts();
    return contexts.some(ctx => ctx.includes('WEBVIEW') || ctx.includes('CHROMIUM'));
  }

  /**
   * Get current context
   */
  getCurrentContext(): string {
    return this.currentContext;
  }
}

