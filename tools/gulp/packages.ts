/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an 
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
import {BuildPackage, buildConfig} from 'ngx-groundhog-build-tools';
import {join} from 'path';

export const groundhogPackage = new BuildPackage('ngx-groundhog');
// export const examplesPackage = new BuildPackage('ngx-groundhog-examples', [groundhogPackage]);

// The groundhog package re-exports its secondary entry-points at the root so that all of the
// components can still be imported through `@dynatrace/ngx-groundhog`.
groundhogPackage.exportsSecondaryEntryPointsAtRoot = true;

// To avoid refactoring of the project the groundhog package will map to the source path `lib/`.
groundhogPackage.sourceDir = join(buildConfig.packagesDir, 'lib');
