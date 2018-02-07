import {Routes} from '@angular/router';
import {Home} from './e2e-app';
import {ButtonE2E} from '../button/button-e2e';

export const E2E_APP_ROUTES: Routes = [
  {path: '', component: Home},
  {path: 'button', component: ButtonE2E},
];
