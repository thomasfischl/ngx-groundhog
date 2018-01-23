/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an 
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
import {sync as glob} from 'glob';
import {mkdirpSync, copySync} from 'fs-extra';
import {join, dirname} from 'path';

/** Function to copy files that match a glob to another directory. */
export function copyFiles(fromPath: string, fileGlob: string, outDir: string) {
  glob(fileGlob, {cwd: fromPath}).forEach(filePath => {
    const fileDestPath = join(outDir, filePath);
    mkdirpSync(dirname(fileDestPath));
    copySync(join(fromPath, filePath), fileDestPath);
  });
}
