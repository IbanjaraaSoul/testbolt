/**
 * Configuration management with smart defaults
 */

import type { MobileAutoOptions } from '../core/MobileAuto';

export class Config {
  device?: string;
  app?: string;
  platform?: 'android' | 'ios';
  cloudProvider?: 'browserstack' | 'saucelabs' | 'local';
  timeout: number;
  retries: number;
  screenshotOnFailure: boolean;
  videoRecording: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  parallel: boolean;
  maxParallel: number;

  constructor(options: MobileAutoOptions = {}) {
    // Smart defaults
    this.device = typeof options.device === 'string' ? options.device : undefined;
    this.app = options.app;
    this.platform = options.platform || 'android';
    this.cloudProvider = options.cloudProvider || 'local';
    this.timeout = options.timeout || 10000;
    this.retries = options.retries || 3;
    this.screenshotOnFailure = options.screenshotOnFailure !== false;
    this.videoRecording = options.videoRecording || false;
    this.logLevel = 'info';
    this.parallel = false;
    this.maxParallel = 5;
  }

  /**
   * Load config from file
   */
  static fromFile(filePath: string): Config {
    // Load from JSON/YAML file
    // For now, return default
    return new Config();
  }

  /**
   * Merge with another config
   */
  merge(other: Partial<Config>): Config {
    return Object.assign(new Config(), this, other);
  }
}

