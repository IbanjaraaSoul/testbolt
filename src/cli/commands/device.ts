/**
 * Device command - List and manage devices
 */

import chalk from 'chalk';
import { DeviceManager } from '../../devices/DeviceManager';
import { Config } from '../../config/Config';

export async function deviceCommand(options: { list?: boolean }) {
  if (options.list) {
    console.log(chalk.blue('📱 Listing available devices...'));
    
    const config = new Config();
    const deviceManager = new DeviceManager(config);
    const devices = await deviceManager.listDevices();

    if (devices.length === 0) {
      console.log(chalk.yellow('No devices found.'));
    } else {
      devices.forEach(device => {
        console.log(chalk.green(`  • ${device.name} (${device.platform} ${device.version})`));
      });
    }
  } else {
    console.log(chalk.yellow('Use --list to see available devices'));
  }
}

