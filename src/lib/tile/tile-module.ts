import { NgModule } from '@angular/core';
import { GhTile, GhTileContent, GhTileTitle, GhTileSubtitle, GhTileActions } from './tile';

@NgModule({
  exports: [
    GhTile,
    GhTileContent,
    GhTileTitle,
    GhTileSubtitle,
    GhTileActions
  ],
  declarations: [
    GhTile,
    GhTileContent,
    GhTileTitle,
    GhTileSubtitle,
    GhTileActions
  ]
})
export class TileModule { }
