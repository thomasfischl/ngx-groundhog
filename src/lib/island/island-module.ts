import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GhIsland, GhIslandTitle,
  GhIslandSubtitle,
  GhIslandIcon,
  GhIslandActions
} from './island';

@NgModule({
  imports: [CommonModule],
  exports: [
    GhIsland,
    GhIslandTitle,
    GhIslandSubtitle,
    GhIslandIcon,
    GhIslandActions
  ],
  declarations: [
    GhIsland,
    GhIslandTitle,
    GhIslandSubtitle,
    GhIslandIcon,
    GhIslandActions
  ]
})
export class GhIslandModule { }
