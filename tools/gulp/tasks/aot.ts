/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */

import {task} from 'gulp';
import {join} from 'path';
import {execNodeTask} from '../util/task_helpers';
import {buildConfig, sequenceTask} from 'ngx-groundhog-build-tools';

const {packagesDir} = buildConfig;

/** Path to the demo-app source directory. */
const demoAppSource = join(packagesDir, 'demo-app');

/** Path to the tsconfig file that builds the AOT files. */
const tsconfigFile = join(demoAppSource, 'tsconfig-aot.json');

/** Builds the demo-app assets and builds the required release packages. */
task('aot:deps', sequenceTask(
  ['ngx-groundhog:build-release'],
  // Build the assets after the releases have been built, because the demo-app assets import
  // SCSS files from the release packages.
  [':build:devapp:assets', ':build:devapp:scss'],
));

/** Build the demo-app and a release to confirm that the library is AOT-compatible. */
task('aot:build', sequenceTask('clean', 'aot:deps', 'aot:compiler-cli'));

/** Build the demo-app and a release to confirm that the library is AOT-compatible. */
task('aot:compiler-cli', execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', tsconfigFile]
));
