import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GhButtonCssStyler} from './button';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GhButtonCssStyler
  ],
  declarations: [
    GhButtonCssStyler
  ]
})
export class GhButtonModule {}
