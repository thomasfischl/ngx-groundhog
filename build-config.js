/**
 * Build configuration for the packaging tool. This file will be automatically detected and used
 * to build the different packages inside of ngx-groundhog.
 */
const {join} = require('path');

const package = require('./package.json');

/** Current version of the project*/
const buildVersion = package.version;

/**
 * Required Angular version for all Groundhog packages. This version will be used
 * as the peer dependency version for Angular in all release packages.
 */
const angularVersion = '^5.0.0';

/** License that will be placed inside of all created bundles. */
const buildLicense = `/**
 * @license
 * Copyright Dynatrace LLC All Rights Reserved.
 *
 * Use of this source code is governed by <ourlicense here>
 */`;

module.exports = {
  projectVersion: buildVersion,
  angularVersion: angularVersion,
  projectDir: __dirname,
  packagesDir: join(__dirname, 'src'),
  outputDir: join(__dirname, 'dist'),
  licenseBanner: buildLicense
};
