import {Routes} from '@angular/router';
import {ButtonDemo} from '../button/button-demo';
import {IconDemo} from '../icon/icon-demo';
import {DemoApp, Home} from './demo-app';
import {SelectDemo} from '../select/select-demo';
import {DatepickerDemo} from '../datepicker/datepicker-demo';

export const DEMO_APP_ROUTES: Routes = [
  {path: '', component: DemoApp, children: [
    {path: '', component: Home},
    {path: 'button', component: ButtonDemo},
    {path: 'datepicker', component: DatepickerDemo},
    {path: 'icon', component: IconDemo},
    {path: 'select', component: SelectDemo},
  ]}
];

export const ALL_ROUTES: Routes = [
  {path: '',  component: DemoApp, children: DEMO_APP_ROUTES},
];
