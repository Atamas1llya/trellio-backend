import chalk from 'chalk';

import devConfig from './envs/dev';
import testConfig from './envs/test';
import prodConfig from './envs/production';
import stagingConfig from './envs/staging';

const env = process.env.NODE_ENV || 'dev';

const config = {
  dev: devConfig,
  test: testConfig,
  production: prodConfig,
  staging: stagingConfig,
};

console.log(chalk.cyan(`Using environment: ${env}\n`));

module.exports = config[env];
