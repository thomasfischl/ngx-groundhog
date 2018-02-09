const fs = require('fs');
const path = require('path');

// Load ts-node to be able to execute TypeScript files with protractor.
require('ts-node').register({
  project: path.join(__dirname, '../e2e/')
});

const E2E_BASE_URL = process.env['E2E_BASE_URL'] || 'http://localhost:4200';
const config = {
  useAllAngular2AppRoots: true,
  specs: [ path.join(__dirname, '../e2e/**/*.spec.ts') ],
  baseUrl: E2E_BASE_URL,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000,
  },
  directConnect: true,

  // plugins: [
  //   {
  //     // Runs the axe-core accessibility checks each time the e2e page changes and
  //     // Angular is ready.
  //     path: '../tools/axe-protractor/axe-protractor.js',

  //     rules: [
  //       // Exclude mat-menu elements because those are empty if not active.
  //       { id: 'aria-required-children', selector: '*:not(mat-menu)' },

  //       // Disable color constrast checks since the final colors will vary based on the theme.
  //       { id: 'color-contrast', enabled: false },
  //     ]
  //   }
  // ]
};

if (process.env['TRAVIS']) {
  config.capabilities = {
    'browserName': 'chrome',
    chromeOptions: {
      args: [ "--headless", "--disable-gpu", "--window-size=800x600", '--no-sandbox'],
    },
    name: 'NGX Groundhog E2E Tests',
  };
}


exports.config = config;