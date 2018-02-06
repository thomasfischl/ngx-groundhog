import {
  Directive,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  OnDestroy
} from '@angular/core';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Platform} from '@angular/cdk/platform';
import {
  CanDisable,
  mixinDisabled,
  CanColor,
  mixinColor
} from '@dynatrace/ngx-groundhog/core';

/**
 * List of classes to add to GhButton instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
  'gh-button',
  'gh-icon-button'
];

// Boilerplate for applying mixins to GhButton.
export class GhButtonBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _GhButtonMixinBase = mixinDisabled(mixinColor(GhButtonBase, 'primary'));

/**
 * Groundhog design button.
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
  inputs: ['disabled', 'color'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhButton extends _GhButtonMixinBase implements OnDestroy, CanDisable, CanColor {

  /** Whether the button is icon button. */
  _isIconButton: boolean = this._hasHostAttributes('gh-icon-button');

  constructor(elementRef: ElementRef,
              private _platform: Platform,
              private _focusMonitor: FocusMonitor) {
    super(elementRef);

    // For each of the variant selectors that is prevent in the button's host
    // attributes, add the correct corresponding class.
    for (const attr of  BUTTON_HOST_ATTRIBUTES) {
      if (this._hasHostAttributes(attr)) {
        (elementRef.nativeElement as HTMLElement).classList.add(attr);
      }
    }

    this._focusMonitor.monitor(this._elementRef.nativeElement, true);
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  /** Focuses the button. */
  focus(): void {
    this._getHostElement().focus();
  }

  private _getHostElement() {
    return this._elementRef.nativeElement;
  }

  /** Gets whether the button has one of the given attributes. */
  private _hasHostAttributes(...attributes: string[]) {
    // If not on the browser, say that there are none of the attributes present.
    // Since these only affect how the ripple displays (and ripples only happen on the client),
    // detecting these attributes isn't necessary when not on the browser.
    if (!this._platform.isBrowser) {
      return false;
    }

    return attributes.some(attribute => this._getHostElement().hasAttribute(attribute));
  }

}

/**
 * Groundhog design button.
 */
@Component({
  moduleId: module.id,
  selector: `a[gh-button]`,
  exportAs: 'ghButton, ghAnchor',
  host: {
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '(click)': '_haltDisabledEvents($event)',
  },
  inputs: ['disabled'],
  templateUrl: 'button.html',
  styleUrls: ['button.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhAnchor extends GhButton {
  constructor(elementRef: ElementRef,
              platform: Platform,
              focusMonitor: FocusMonitor) {
    super(elementRef, platform, focusMonitor);
  }

  _haltDisabledEvents(event: Event) {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
