/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
import {createPackageBuildTasks} from 'ngx-groundhog-build-tools';
import {
  groundhogPackage,
  // examplesPackage,
} from './packages';

createPackageBuildTasks(groundhogPackage);
// createPackageBuildTasks(examplesPackage);

import './tasks/aot';
import './tasks/clean';
import './tasks/development';
import './tasks/lint';
import './tasks/publish';
import './tasks/unit-test';
