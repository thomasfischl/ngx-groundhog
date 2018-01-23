import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {A11yModule} from '@angular/cdk/a11y';
import {GhButtonCssStyler, GhButton, GhAnchor} from './button';

@NgModule({
  imports: [
    CommonModule,
    A11yModule
  ],
  exports: [
    GhButtonCssStyler,
    GhButton,
    GhAnchor
  ],
  declarations: [
    GhButtonCssStyler,
    GhButton,
    GhAnchor
  ]
})
export class GhButtonModule {}
