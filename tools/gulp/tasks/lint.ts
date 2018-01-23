import {task} from 'gulp';
import {execNodeTask} from '../util/task_helpers';

/** Glob that matches all SCSS or CSS files that should be linted. */
const stylesGlob = '+(tools|src)/**/!(*.bundle).+(css|scss)';

task('lint', ['stylelint']);

/** Task to lint Angular Material's scss stylesheets. */
task('stylelint', execNodeTask(
  'stylelint', [stylesGlob, '--config', 'stylelint-config.json', '--syntax', 'scss']
));
