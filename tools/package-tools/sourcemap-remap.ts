/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an 
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
// There are no type definitions available for these imports.
const sorcery = require('sorcery');

/**
 * Finds the original sourcemap of the file and maps it to the current file.
 * This is useful when multiple transformation happen (e.g TSC -> Rollup -> Uglify)
 **/
export async function remapSourcemap(sourceFile: string) {
  // Once sorcery loaded the chain of sourcemaps, the new sourcemap will be written asynchronously.
  return (await sorcery.load(sourceFile)).write();
}

