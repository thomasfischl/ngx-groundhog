import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhFormField, GhLabel, GhHint, GhPrefix, GhSuffix } from './form-field';

@NgModule({
  imports: [CommonModule],
  exports: [
    GhFormField,
    GhLabel,
    GhHint,
    GhPrefix,
    GhSuffix
  ],
  declarations: [
    GhFormField,
    GhLabel,
    GhHint,
    GhPrefix,
    GhSuffix
  ]
})
export class GhFormFieldModule { }
