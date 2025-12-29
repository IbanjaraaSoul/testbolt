/**
 * Device Manager - Handles device selection and management
 * Supports local devices, emulators, and cloud providers
 */

import { LocalDevice } from './LocalDevice';
import { CloudDevice } from './CloudDevice';
import { EmulatorDevice } from './EmulatorDevice';
import type { Device } from './Device';
import type { Config } from '../config/Config';
import { Logger } from '../utils/Logger';

export class DeviceManager {
  private devices: Map<string, Device> = new Map();
  private logger: Logger;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.logger = new Logger(config.logLevel || 'info');
  }

  /**
   * Get device by identifier
   * Supports formats:
   * - "local:device-id"
   * - "cloud:device-name"
   * - "emulator:android-30"
   * - Device object directly
   */
  async getDevice(deviceIdentifier: string | Device): Promise<Device> {
    if (typeof deviceIdentifier !== 'string') {
      return deviceIdentifier;
    }

    // Check cache
    if (this.devices.has(deviceIdentifier)) {
      return this.devices.get(deviceIdentifier)!;
    }

    let device: Device;

    if (deviceIdentifier.startsWith('cloud:')) {
      const deviceName = deviceIdentifier.replace('cloud:', '');
      device = await this.getCloudDevice(deviceName);
    } else if (deviceIdentifier.startsWith('emulator:')) {
      const emulatorName = deviceIdentifier.replace('emulator:', '');
      device = await this.getEmulatorDevice(emulatorName);
    } else if (deviceIdentifier.startsWith('local:')) {
      const deviceId = deviceIdentifier.replace('local:', '');
      device = await this.getLocalDevice(deviceId);
    } else {
      // Auto-detect: try local first, then emulator, then cloud
      device = await this.autoDetectDevice(deviceIdentifier);
    }

    this.devices.set(deviceIdentifier, device);
    return device;
  }

  private async getCloudDevice(deviceName: string): Promise<Device> {
    this.logger.info(`Connecting to cloud device: ${deviceName}`);
    const cloudProvider = this.config.cloudProvider || 'browserstack';
    return new CloudDevice(deviceName, cloudProvider, this.config);
  }

  private async getEmulatorDevice(emulatorName: string): Promise<Device> {
    this.logger.info(`Starting emulator: ${emulatorName}`);
    return new EmulatorDevice(emulatorName, this.config);
  }

  private async getLocalDevice(deviceId: string): Promise<Device> {
    this.logger.info(`Connecting to local device: ${deviceId}`);
    return new LocalDevice(deviceId, this.config);
  }

  private async autoDetectDevice(identifier: string): Promise<Device> {
    this.logger.info(`Auto-detecting device: ${identifier}`);
    
    // Try local device first
    try {
      const localDevice = new LocalDevice(identifier, this.config);
      if (await localDevice.isAvailable()) {
        return localDevice;
      }
    } catch {
      // Continue to next option
    }

    // Try emulator
    try {
      return await this.getEmulatorDevice(identifier);
    } catch {
      // Continue to cloud
    }

    // Fallback to cloud
    return await this.getCloudDevice(identifier);
  }

  /**
   * List available devices
   */
  async listDevices(): Promise<Device[]> {
    const devices: Device[] = [];
    
    // List local devices
    const localDevices = await LocalDevice.listAvailable();
    devices.push(...localDevices);

    // List emulators
    const emulators = await EmulatorDevice.listAvailable();
    devices.push(...emulators);

    return devices;
  }

  /**
   * Release device
   */
  async releaseDevice(device: Device): Promise<void> {
    await device.disconnect();
    for (const [key, value] of this.devices.entries()) {
      if (value === device) {
        this.devices.delete(key);
        break;
      }
    }
  }
}

