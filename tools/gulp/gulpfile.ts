import {createPackageBuildTasks} from 'ngx-groundhog-build-tools';
import {
  groundhogPackage,
  examplesPackage,
} from './packages';
createPackageBuildTasks(groundhogPackage);
createPackageBuildTasks(examplesPackage);

import './tasks/development';
