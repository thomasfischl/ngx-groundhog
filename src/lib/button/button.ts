import {
  Directive,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

/**
 * Directive whose purpose is to add the Groundhog CSS styling to this selector.
 */
@Directive({
  selector: 'button[gh-button], a[gh-button]',
  host: {'class': 'gh-button'}
})
export class GhButtonCssStyler {}

/**
 * Groundhog design button.
 *
 * TODO (@thomaspink): implement disable, focusmonitor (once the cdk has been added) & coloring
 */
@Component({
  moduleId: module.id,
  selector: `button[gh-button]`,
  exportAs: 'ghButton',
  host: {
    '[disabled]': 'disabled || null',
  },
  templateUrl: 'button.html',
  styleUrls: ['button.css'],
  inputs: ['disabled'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhButton /*extends _GhButtonMixinBase*/ {}
