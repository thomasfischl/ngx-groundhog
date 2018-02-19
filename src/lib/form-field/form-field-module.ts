import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhFormField, GhLabel, GhHint, GhError } from './form-field';

@NgModule({
  imports: [CommonModule],
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
