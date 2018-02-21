import { Component, ChangeDetectionStrategy, ViewEncapsulation, Directive } from '@angular/core';

/** Content of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: 'gh-tile-content',
  host: { 'class': 'gh-tile-content' }
})
export class GhTileContent { }

/** Title of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `gh-tile-title, [gh-tile-title], [ghTileTitle]`,
  host: {
    'class': 'gh-tile-title'
  }
})
export class GhTileTitle { }

/** Sub-title of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `gh-tile-subtitle, [gh-tile-subtitle], [ghTileSubtitle]`,
  host: {
    'class': 'gh-tile-subtitle'
  }
})
export class GhTileSubtitle { }

/** Action section of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: 'gh-tile-actions',
  exportAs: 'ghTileActions',
  host: {
    'class': 'gh-tile-actions',
  }
})
export class GhTileActions { }

@Component({
  moduleId: module.id,
  selector: 'gh-tile',
  exportAs: 'ghTile',
  templateUrl: 'tile.html',
  styleUrls: ['tile.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhTile { }

