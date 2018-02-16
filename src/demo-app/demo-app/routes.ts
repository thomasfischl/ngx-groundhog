import {Routes} from '@angular/router';
import {ButtonDemo} from '../button/button-demo';
import {IconDemo} from '../icon/icon-demo';
import {DemoApp, Home} from './demo-app';
import {SelectDemo} from '../select/select-demo';
import { ExpandableDemo } from '../expandable/expandable-demo';

export const DEMO_APP_ROUTES: Routes = [
  {path: '', component: DemoApp, children: [
    {path: '', component: Home},
    {path: 'button', component: ButtonDemo},
    {path: 'icon', component: IconDemo},
    {path: 'select', component: SelectDemo},
    {path: 'expandable', component: ExpandableDemo},
  ]}
];

export const ALL_ROUTES: Routes = [
  {path: '',  component: DemoApp, children: DEMO_APP_ROUTES},
];
