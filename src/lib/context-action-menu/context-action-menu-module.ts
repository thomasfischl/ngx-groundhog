import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { GhButtonModule } from '@dynatrace/ngx-groundhog/button';
import { GhIconModule } from '@dynatrace/ngx-groundhog/icon';

import { GhContextActionMenu } from './context-action-menu';

@NgModule({
  imports: [
    CommonModule,
    GhButtonModule,
    GhIconModule,
    OverlayModule,
    A11yModule,
  ],
  exports: [
    GhContextActionMenu,
  ],
  declarations: [
    GhContextActionMenu,
  ]
})
export class GhContextActionMenuModule {}
