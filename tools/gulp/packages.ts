import {BuildPackage, buildConfig} from 'ngx-groundhog-build-tools';
import {join} from 'path';

export const groundhogPackage = new BuildPackage('ngx-groundhog');
export const examplesPackage = new BuildPackage('ngx-groundhog-examples', [groundhogPackage]);

// The groundhog package re-exports its secondary entry-points at the root so that all of the
// components can still be imported through `@dynatrace/ngx-groundhog`.
groundhogPackage.exportsSecondaryEntryPointsAtRoot = true;

// To avoid refactoring of the project the material package will map to the source path `lib/`.
groundhogPackage.sourceDir = join(buildConfig.packagesDir, 'lib');
