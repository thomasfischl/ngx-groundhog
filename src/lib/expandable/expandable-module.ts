import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GhExpandable, GhExpandableTrigger} from './expandable';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GhExpandable,
    GhExpandableTrigger,
  ],
  declarations: [
    GhExpandable,
    GhExpandableTrigger,
  ]
})
export class GhExpandableModule {}
