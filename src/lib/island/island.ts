import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Directive,
  ContentChild
} from '@angular/core';

/** Title of a island, needed as it's used as a selector in the API. */
@Directive({
  selector: `gh-island-title, [gh-island-title], [ghIslandTitle]`,
  host: {
    'class': 'gh-island-title'
  }
})
export class GhIslandTitle { }

/** Icon of a island, needed as it's used as a selector in the API. */
@Directive({
  selector: `gh-island-icon, [gh-island-icon], [ghIslandIcon]`,
  host: {
    'class': 'gh-island-icon',
  }
})
export class GhIslandIcon { }

/** Sub-title of a island, needed as it's used as a selector in the API. */
@Directive({
  selector: `gh-island-subtitle, [gh-island-subtitle], [ghIslandSubtitle]`,
  host: {
    'class': 'gh-island-subtitle'
  }
})
export class GhIslandSubtitle { }

/** Sub-title of a island, needed as it's used as a selector in the API. */
@Directive({
  selector: `gh-island-actions, [gh-island-actions], [ghIslandActions]`,
  host: {
    'class': 'gh-island-actions'
  }
})
export class GhIslandActions { }


@Component({
  moduleId: module.id,
  selector: 'gh-island',
  exportAs: 'ghIsland',
  templateUrl: 'island.html',
  styleUrls: ['island.css'],
  host: {
    'class': 'gh-island',
    // We know that a header is present when the island has at least a title
    '[class.gh-island-has-header]': '!!_title'
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhIsland {
  @ContentChild(GhIslandTitle) _title: GhIslandTitle;
}
