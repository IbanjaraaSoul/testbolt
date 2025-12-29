/**
 * Init command - Initialize new project
 */

import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

export async function initCommand() {
  console.log(chalk.blue('🚀 Initializing MobileAuto project...'));

  // Create directory structure
  const dirs = ['tests', 'screenshots', 'videos'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.green(`✓ Created directory: ${dir}`));
    }
  });

  // Create config file
  const config = {
    device: 'auto',
    platform: 'android',
    timeout: 10000,
    retries: 3,
    screenshotOnFailure: true
  };

  fs.writeFileSync(
    'mobileauto.config.json',
    JSON.stringify(config, null, 2)
  );
  console.log(chalk.green('✓ Created mobileauto.config.json'));

  // Create example test
  const exampleTest = `import { MobileAuto } from 'mobileauto';

const app = new MobileAuto({
  device: 'auto',
  app: './app.apk'
});

test('Example Test', async () => {
  await app.launch();
  await app.find('Login Button').click();
  await app.expect(app.find('Welcome Screen')).toBeVisible();
  await app.close();
});
`;

  fs.writeFileSync(
    'tests/example.test.ts',
    exampleTest
  );
  console.log(chalk.green('✓ Created example test: tests/example.test.ts'));

  console.log(chalk.blue('\n✨ Project initialized successfully!'));
  console.log(chalk.yellow('\nNext steps:'));
  console.log('  1. Add your app file (.apk or .ipa)');
  console.log('  2. Edit tests/example.test.ts');
  console.log('  3. Run: mobileauto test');
}

