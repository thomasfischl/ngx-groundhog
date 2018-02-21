import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Directive,
  ContentChild,
  Input
} from '@angular/core';
import {
  CanDisable,
  mixinDisabled,
  HasTabIndex,
  mixinTabIndex
} from '@dynatrace/ngx-groundhog/core';

/** Content of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: 'gh-tile-content',
  host: { 'class': 'gh-tile-content' }
})
export class GhTileContent { }

/** Title of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: `gh-tile-title, [gh-tile-title], [ghTileTitle]`,
  host: {
    'class': 'gh-tile-title'
  }
})
export class GhTileTitle { }

/** Icon of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: `gh-tile-icon, [gh-tile-icon], [ghTileIcon]`,
  host: {
    'class': 'gh-tile-icon',
    '[class.gh-tile-icon-end]': 'align === "end"'
  }
})
export class GhTileIcon {
  @Input() align: 'start' | 'end' = 'start';
}

/** Sub-title of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: `gh-tile-subtitle, [gh-tile-subtitle], [ghTileSubtitle]`,
  host: {
    'class': 'gh-tile-subtitle'
  }
})
export class GhTileSubtitle { }

// Boilerplate for applying mixins to GhTile.
export class GhTileBase {
  constructor() {}
}
export const _GhTileMixinBase = mixinTabIndex(mixinDisabled(GhTileBase));

@Component({
  moduleId: module.id,
  selector: 'gh-tile',
  exportAs: 'ghTile',
  templateUrl: 'tile.html',
  styleUrls: ['tile.css'],
  inputs: ['disabled', 'tabIndex'],
  host: {
    'role': 'button',
    '[attr.tabindex]': 'tabIndex',
    'class': 'gh-tile',
    '[class.gh-tile-small]': '!_subTitle',
    '[class.gh-tile-disabled]': 'disabled'
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhTile extends _GhTileMixinBase implements CanDisable, HasTabIndex {
  @ContentChild(GhTileSubtitle) _subTitle: GhTileSubtitle;
  @ContentChild(GhTileIcon) _icon: GhTileIcon;
}

