import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GhTile,
  GhTileContent,
  GhTileTitle,
  GhTileSubtitle,
  GhTileIcon
} from './tile';

@NgModule({
  imports: [CommonModule],
  exports: [
    GhTile,
    GhTileContent,
    GhTileTitle,
    GhTileSubtitle,
    GhTileIcon,
  ],
  declarations: [
    GhTile,
    GhTileContent,
    GhTileTitle,
    GhTileSubtitle,
    GhTileIcon,
  ]
})
export class GhTileModule { }
