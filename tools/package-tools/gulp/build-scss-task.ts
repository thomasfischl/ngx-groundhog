/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
import {src, dest} from 'gulp';
import {join} from 'path';

// These imports lack of type definitions.
const gulpSass = require('gulp-sass');
/** TODO: (ffr): add at a later stage */
// const gulpIf = require('gulp-if');
// const gulpCleanCss = require('gulp-clean-css');

/** Create a gulp task that builds SCSS files. */
export function buildScssTask(outputDir: string, sourceDir: string) {
  return () => {
    return src(join(sourceDir, '**/*.scss'))
      .pipe(gulpSass({
        // We need to include node_modules to the includePaths
        // so we can @import from @angular/cdk/...
        includePaths: ['node_modules/']
      }).on('error', gulpSass.logError))
      // .pipe(gulpIf(minifyOutput, gulpCleanCss()))
      .pipe(dest(outputDir));
  };
}
