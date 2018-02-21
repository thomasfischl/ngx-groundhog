import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GhTile,
  GhTileTitle,
  GhTileSubtitle,
  GhTileIcon
} from './tile';

@NgModule({
  imports: [CommonModule],
  exports: [
    GhTile,
    GhTileTitle,
    GhTileSubtitle,
    GhTileIcon,
  ],
  declarations: [
    GhTile,
    GhTileTitle,
    GhTileSubtitle,
    GhTileIcon,
  ]
})
export class GhTileModule { }
