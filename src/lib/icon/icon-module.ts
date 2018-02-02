import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GhIcon} from './icon';
import {GhIconRegistry} from './icon-registry';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    GhIcon
  ],
  declarations: [
    GhIcon
  ],
  providers: [
    GhIconRegistry
  ]
})
export class GhIconModule {}
