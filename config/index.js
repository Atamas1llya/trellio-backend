import chalk from 'chalk';

import devConfig from './envs/dev';

const env = process.NODE_ENV || 'dev';

const config = {
  dev: devConfig,
};

console.log(chalk.cyan(`Using environment: ${env}\n`));

module.exports = config[env];
