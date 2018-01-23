import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GhButtonCssStyler, GhButton} from './button';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GhButtonCssStyler,
    GhButton
  ],
  declarations: [
    GhButtonCssStyler,
    GhButton
  ]
})
export class GhButtonModule {}
