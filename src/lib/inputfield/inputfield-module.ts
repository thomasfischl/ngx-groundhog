import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GhInputfield} from './inputfield';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GhInputfield,
  ],
  declarations: [
    GhInputfield,
  ]
})
export class GhInputfieldModule {}
