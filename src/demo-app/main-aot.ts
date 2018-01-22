import {platformBrowser} from '@angular/platform-browser';
import {DemoAppModuleNgFactory} from './demo-app-module.ngfactory';

platformBrowser().bootstrapModuleFactory(DemoAppModuleNgFactory);
