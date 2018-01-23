/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */

import {task} from 'gulp';
import {cleanTask} from '../util/task_helpers';
import {buildConfig} from 'ngx-groundhog-build-tools';


/** Deletes the dist/ directory. */
task('clean', cleanTask(buildConfig.outputDir));
