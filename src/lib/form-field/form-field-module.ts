import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhFormField, GhLabel, GhHint } from './form-field';

@NgModule({
  imports: [CommonModule],
  exports: [
    GhFormField,
    GhLabel,
    GhHint,
  ],
  declarations: [
    GhFormField,
    GhLabel,
    GhHint,
  ]
})
export class GhFormFieldModule { }
