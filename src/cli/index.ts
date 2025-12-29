#!/usr/bin/env node

/**
 * MobileAuto CLI
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { testCommand } from './commands/test';
import { recordCommand } from './commands/record';
import { deviceCommand } from './commands/device';

const program = new Command();

program
  .name('mobileauto')
  .description('Next-generation mobile automation tool')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new MobileAuto project')
  .action(initCommand);

program
  .command('test')
  .description('Run tests')
  .option('-f, --file <file>', 'Test file to run')
  .option('-d, --device <device>', 'Device to use')
  .option('-p, --parallel', 'Run tests in parallel')
  .action(testCommand);

program
  .command('record')
  .description('Record a test by interacting with the app')
  .option('-o, --output <file>', 'Output file for recorded test')
  .action(recordCommand);

program
  .command('device')
  .description('Manage devices')
  .option('-l, --list', 'List available devices')
  .action(deviceCommand);

program.parse();

