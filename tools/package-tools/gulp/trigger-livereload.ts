/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an 
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
import {yellow} from 'chalk';
import {src} from 'gulp';

// This import does not have any type definitions.
const gulpConnect = require('gulp-connect');

/** Triggers a reload when livereload is enabled and a gulp-connect server is running. */
export function triggerLivereload() {
  console.log(yellow('Server: Changes were detected and a livereload was triggered.'));
  return src('dist').pipe(gulpConnect.reload());
}
