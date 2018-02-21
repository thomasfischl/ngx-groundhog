import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModule } from '@angular/cdk/platform';
import { GhFormField, GhLabel, GhHint, GhError } from './form-field';

@NgModule({
  imports: [
    CommonModule,
    PlatformModule,
  ],
  exports: [
    GhFormField,
    GhLabel,
    GhHint,
    GhError,
  ],
  declarations: [
    GhFormField,
    GhLabel,
    GhHint,
    GhError,
  ]
})
export class GhFormFieldModule { }
