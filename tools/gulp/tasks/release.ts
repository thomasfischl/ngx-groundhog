/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */

import {task, src, dest} from 'gulp';
import {join} from 'path';
import {writeFileSync, mkdirpSync} from 'fs-extra';
import {Bundler} from 'scss-bundle';
import {composeRelease, buildConfig, sequenceTask} from 'ngx-groundhog-build-tools';

import {groundhogPackage} from '../packages';

// There are no type definitions available for these imports.
const gulpRename = require('gulp-rename');

const distDir = buildConfig.outputDir;
const {sourceDir, outputDir} = groundhogPackage;

/** Path to the directory where all releases are created. */
const releasesDir = join(distDir, 'releases');

// Path to the release output of ngx-groundhog.
const releasePath = join(releasesDir, 'ngx-groundhog');
// The entry-point for the scss theming bundle.
const themingEntryPointPath = join(sourceDir, 'core', 'theming', '_all-theme.scss');
// Output path for the scss theming bundle.
const themingBundlePath = join(releasePath, '_theming.scss');
// Matches all pre-built theme css files
const prebuiltThemeGlob = join(outputDir, '**/theming/prebuilt/*.css?(.map)');
// Matches all SCSS files in the different packages.
const allScssGlob = join(buildConfig.packagesDir, '**/*.scss');


/**
 * Overwrite the release task for the ngx-groundhog package. The ngx-groundhog release will include special
 * files, like a bundled theming SCSS file or all prebuilt themes.
 */
task('ngx-groundhog:build-release', ['ngx-groundhog:prepare-release'], () => composeRelease(groundhogPackage));

/**
 * Task that will build the ngx-groundhog package. It will also copy all prebuilt themes and build
 * a bundled SCSS file for theming
 */
task('ngx-groundhog:prepare-release', sequenceTask(
  'ngx-groundhog:build',
  ['ngx-groundhog:copy-themes', 'ngx-groundhog:bundle-theming-scss']
));

/** Copies all prebuilt themes into the release package under `themes/` */
task('ngx-groundhog:copy-themes', () => {
  src(prebuiltThemeGlob)
    .pipe(gulpRename({dirname: ''}))
    .pipe(dest(join(releasePath, 'themes')));
});

/** Bundles all scss requires for theming into a single scss file in the root of the package. */
task('ngx-groundhog:bundle-theming-scss', () => {
  // Instantiates the SCSS bundler and bundles all imports of the specified entry point SCSS file.
  // A glob of all SCSS files in the library will be passed to the bundler. The bundler takes an
  // array of globs, which will match SCSS files that will be only included once in the bundle.
  return new Bundler().Bundle(themingEntryPointPath, [allScssGlob]).then(result => {
    // The release directory is not created yet because the composing of the release happens when
    // this task finishes.
    mkdirpSync(releasePath);
    writeFileSync(themingBundlePath, result.bundledContent);
  });
});
