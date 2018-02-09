import {task} from 'gulp';
import {ngcBuildTask, tsBuildTask, copyTask, execTask} from '../util/task_helpers';
import {join} from 'path';
import {copySync} from 'fs-extra';
import {buildConfig, sequenceTask} from 'ngx-groundhog-build-tools';

const {outputDir, packagesDir} = buildConfig;

/** Path to the directory where all releases are created. */
const releasesDir = join(outputDir, 'releases');

const appDir = join(packagesDir, 'universal-app');
const outDir = join(outputDir, 'packages', 'universal-app');

const tsconfigAppPath = join(outDir, 'tsconfig-build.json');
const tsconfigPrerenderPath = join(outDir, 'tsconfig-prerender.json');

/** Path to the compiled prerender file. Running this file just dumps the HTML output for now. */
const prerenderOutFile = join(outDir, 'prerender.js');

/** Task that builds the universal-app and runs the prerender script. */
task('universal', ['universal:build'], execTask(
  // Runs node with the tsconfig-paths module to alias the @dynatrace/ngx-groundhog dependency.
  'node', ['-r', 'tsconfig-paths/register', prerenderOutFile], {
    env: {TS_NODE_PROJECT: tsconfigPrerenderPath},
    // Errors in lifecycle hooks will write to STDERR, but won't exit the process with an
    // error code, however we still want to catch those cases in the CI.
    failOnStderr: true
  }
));

task('universal:build', sequenceTask(
  'clean',
  'ngx-groundhog:build-release',
  ['universal:copy-release', 'universal:copy-files'],
  'universal:build-app-ts',
  'universal:build-prerender-ts'
));

/** Task that builds the universal app in the output directory. */
task('universal:build-app-ts', ngcBuildTask(tsconfigAppPath));

/** Task that copies all files to the output directory. */
task('universal:copy-files', copyTask(appDir, outDir));

/** Task that builds the prerender script in the output directory. */
task('universal:build-prerender-ts', tsBuildTask(tsconfigPrerenderPath));

task('universal:copy-release', () => {
  copySync(join(releasesDir, 'ngx-groundhog'), join(outDir, 'ngx-groundhog'));
});
