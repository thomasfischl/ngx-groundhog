import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { GhButtonModule } from '@dynatrace/ngx-groundhog/button';
import { GhIconModule } from '@dynatrace/ngx-groundhog/icon';
import { GhThemingModule } from '@dynatrace/ngx-groundhog/theming';

import { GhContextMenu, GhContextMenuItem } from './context-menu';

@NgModule({
  imports: [
    CommonModule,
    GhButtonModule,
    GhIconModule,
    GhThemingModule,
    OverlayModule,
    A11yModule,
  ],
  exports: [
    GhContextMenu,
    GhContextMenuItem,
  ],
  declarations: [
    GhContextMenu,
    GhContextMenuItem,
  ]
})
export class GhContextMenuModule {}
