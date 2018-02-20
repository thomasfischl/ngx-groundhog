import { NgModule } from '@angular/core';
import { ErrorStateMatcher } from '@dynatrace/ngx-groundhog/core';
import { GhInput } from './input';

@NgModule({
  exports: [
    GhInput
  ],
  declarations: [
    GhInput
  ],
  providers: [ErrorStateMatcher],
})
export class GhInputModule { }
