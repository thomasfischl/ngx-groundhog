import { NgModule } from '@angular/core';
import { GhInput } from './input';
import { CommonModule } from '@angular/common';
import { PlatformModule } from '@angular/cdk/platform';
import { ErrorStateMatcher } from '@dynatrace/ngx-groundhog/core';
import { GhFormFieldModule } from '@dynatrace/ngx-groundhog/form-field';

@NgModule({
  imports: [
    CommonModule,
    PlatformModule,
    GhFormFieldModule,
  ],
  exports: [
    GhInput
  ],
  declarations: [
    GhInput
  ],
  providers: [ErrorStateMatcher],
})
export class GhInputModule { }
