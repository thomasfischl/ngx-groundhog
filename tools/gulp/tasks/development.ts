/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an 
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
import {task} from 'gulp';
import {join} from 'path';
import {tsBuildTask, copyTask, serverTask} from '../util/task_helpers';
import {
  buildConfig, buildScssTask, sequenceTask, watchFiles
} from 'ngx-groundhog-build-tools';
import {
  groundhogPackage,
} from '../packages';

const {outputDir, packagesDir, projectDir} = buildConfig;

/** Array of vendors that are required to serve the demo-app. */
const appVendors = [
  '@angular',
  'systemjs',
  'zone.js',
  'rxjs',
  'core-js',
  'web-animations-js',
  'tslib',
];

/** Glob that matches all required vendors for the demo-app. */
const vendorGlob = `+(${appVendors.join('|')})/**/*.+(html|css|js|map)`;

/** Path to the directory where all bundles live. */
const bundlesDir = join(outputDir, 'bundles');

const appDir = join(packagesDir, 'demo-app');
const outDir = join(outputDir, 'packages', 'demo-app');

/** Glob that matches all assets that need to be copied to the output. */
const assetsGlob = join(appDir, `**/*.+(html|css|svg)`);

task(':watch:devapp', () => {
  watchFiles(join(appDir, '**/*.ts'), [':build:devapp:ts']);
  watchFiles(join(appDir, '**/*.scss'), [':build:devapp:scss']);
  watchFiles(join(appDir, '**/*.html'), [':build:devapp:assets']);

  // Custom watchers for all packages that are used inside of the demo-app. This is necessary
  // because we only want to build the changed package (using the build-no-bundles task).
  watchFiles(join(groundhogPackage.sourceDir, '**/!(*.scss)'), ['ngx-groundhog:build-no-bundles']);
  watchFiles(join(groundhogPackage.sourceDir, '**/*.scss'), [':build:devapp:ngx-groundhog-with-styles']);
});

/** Path to the demo-app tsconfig file. */
const tsconfigPath = join(appDir, 'tsconfig-build.json');

task(':build:devapp:ts', tsBuildTask(tsconfigPath));
task(':build:devapp:scss', buildScssTask(outDir, appDir));
task(':build:devapp:assets', copyTask(assetsGlob, outDir));

task(':serve:devapp', serverTask(outDir, true));

// The themes for the demo-app are built by using the SCSS mixins from Groundhog.
// Therefore when SCSS files have been changed, the custom theme needs to be rebuilt.
task(':build:devapp:ngx-groundhog-with-styles', sequenceTask(
  'ngx-groundhog:build-no-bundles', ':build:devapp:scss'
));

task('build:devapp', sequenceTask(
  'ngx-groundhog:build-no-bundles',
  [':build:devapp:assets', ':build:devapp:scss', ':build:devapp:ts']
));

task('serve:devapp', ['build:devapp'], sequenceTask([':serve:devapp', ':watch:devapp']));
