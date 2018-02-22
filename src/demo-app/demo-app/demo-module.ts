import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DemoGroundhogModule} from '../demo-groundhog-module';
import {ButtonDemo} from '../button/button-demo';
import {IconDemo} from '../icon/icon-demo';
import {InputDemo} from 'input/input-demo';
import {IslandDemo} from 'island/island-demo';
import {DemoApp, Home} from './demo-app';
import {DEMO_APP_ROUTES} from './routes';
import {SelectDemo} from '../select/select-demo';
import {ProgressCircleDemo} from '../progress-circle/progress-circle-demo';
import {TileDemo} from 'tile/tile-demo';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DEMO_APP_ROUTES),
    DemoGroundhogModule
  ],
  declarations: [
    ButtonDemo,
    IconDemo,
    InputDemo,
    IslandDemo,
    ProgressCircleDemo,
    SelectDemo,
    TileDemo,
    DemoApp,
    Home,
  ],
  entryComponents: [
    DemoApp,
  ],
})
export class DemoModule {}
