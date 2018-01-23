import {
  Directive,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  OnDestroy
} from '@angular/core';
import {FocusMonitor} from '@angular/cdk/a11y';
import {
  CanDisable,
  mixinDisabled
} from '@dynatrace/ngx-groundhog/core';

/**
 * Directive whose purpose is to add the Groundhog CSS styling to this selector.
 */
@Directive({
  selector: 'button[gh-button], a[gh-button]',
  host: {'class': 'gh-button'}
})
export class GhButtonCssStyler {}

// Boilerplate for applying mixins to MatButton.
export class GhButtonBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _MatButtonMixinBase = mixinDisabled(GhButtonBase);

/**
 * Groundhog design button.
 *
 * TODO (@thomaspink): coloring
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
export class GhButton extends _MatButtonMixinBase implements OnDestroy, CanDisable {
  constructor(elementRef: ElementRef,
              private _focusMonitor: FocusMonitor) {
    super(elementRef);
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
              focusMonitor: FocusMonitor) {
    super(elementRef, focusMonitor);
  }

  _haltDisabledEvents(event: Event) {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      console.log('disabled');
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
