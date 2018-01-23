/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */

import {task} from 'gulp';
import {sequenceTask} from 'ngx-groundhog-build-tools';

/** Packages that will be published to NPM by the release task. */
export const releasePackages = [
  'ngx-groundhog',
];

/** Task that builds all releases that will be published. */
task(':publish:build-releases', sequenceTask(
  'clean',
  releasePackages.map(packageName => `${packageName}:build-release`)
));
