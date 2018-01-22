/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an 
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
import {resolve, dirname, join} from 'path';
import {existsSync} from 'fs';

/** Name of the build config file. */
const BUILD_CONFIG_FILENAME = 'build-config.js';

/** Method that searches for a build config file that will be used for packaging. */
export function findBuildConfig(): string | null {
  let currentDir = process.cwd();

  while (!existsSync(resolve(currentDir, BUILD_CONFIG_FILENAME))) {
    let parentDir = dirname(currentDir);

    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }

  return join(currentDir, BUILD_CONFIG_FILENAME);
}
