import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {ErrorStateMatcher} from '@dynatrace/ngx-groundhog/core';
import {GhSelect} from './select';
import {GhOption} from './option';

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
  providers: [ErrorStateMatcher]
})
export class GhSelectModule {

}
