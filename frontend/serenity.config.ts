import { Configuration } from '@serenity-js/core';
import { WebdriverIOConfig } from '@serenity-js/webdriverio';
import { ChromeOptions } from 'webdriverio';

export const config: Configuration = {
  runner: 'local',
  port: 4444,
  specs: ['./serenity/features/**/*.feature'],
  capabilities: [
    {
      maxInstances: 5,
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      },
    } as ChromeOptions,
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost:3000',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'cucumber',
  cucumberOpts: {
    require: ['./serenity/step-definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'html:./target/cucumber-report.html'],
    parallel: 2,
  },
  reporters: ['spec', '@serenity-js/webdriverio'],
  onPrepare: () => {
    console.log('Starting Serenity/JS tests...');
  },
  onComplete: () => {
    console.log('Serenity/JS tests completed!');
  },
};
