import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { GhSelect } from './select';
import { GhOption } from './option';

@NgModule({
  exports: [
    GhSelect,
    GhOption,
  ],
  imports: [
    CommonModule,
    OverlayModule,
  ],
  declarations: [
    GhSelect,
    GhOption,
  ],
})
export class GhSelectModule {

}
