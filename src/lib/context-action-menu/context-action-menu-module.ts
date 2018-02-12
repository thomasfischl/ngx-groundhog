import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GhContextActionMenu} from './context-action-menu';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GhContextActionMenu,
  ],
  declarations: [
    GhContextActionMenu,
  ]
})
export class GhContextActionMenuModule {}
