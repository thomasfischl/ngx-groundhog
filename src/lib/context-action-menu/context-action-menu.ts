import {
  Directive,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  ContentChildren,
  QueryList,
  Output,
  EventEmitter,
  ElementRef,
  NgZone,
  Attribute,
  Self,
  Optional,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  AfterContentInit,
  isDevMode,
  Inject,
  Input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GhButton } from '@dynatrace/ngx-groundhog/button';
import { GhIconRegistry } from '@dynatrace/ngx-groundhog/icon';
import { NgForm, FormGroupDirective, NgControl } from '@angular/forms';
import {
  mixinDisabled,
  CanDisable,
  mixinTabIndex,
  HasTabIndex,
  CanColor,
  mixinColor,
} from '@dynatrace/ngx-groundhog/core';
import { CdkConnectedOverlay, ConnectionPositionPair } from '@angular/cdk/overlay';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {map} from 'rxjs/operators/map';
import {filter} from 'rxjs/operators/filter';
import {merge} from 'rxjs/observable/merge';
import {Subject} from 'rxjs/Subject';
import { FocusTrapFactory, FocusTrap } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';

// Boilerplate for applying mixins to GhContextActionMenu.
export class GhContextActionMenuBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _GhContextActionMenuBase =
  mixinTabIndex(mixinDisabled(mixinColor(GhContextActionMenuBase)));

@Component({
  moduleId: module.id,
  selector: 'gh-ca-menu, gh-context-action-menu',
  templateUrl: 'context-action-menu.html',
  styleUrls: ['context-action-menu.css'],
  inputs: ['disabled', 'tabIndex', 'color'],
  host: {
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-disabled]': 'disabled.toString()',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhContextActionMenu extends _GhContextActionMenuBase
  implements OnDestroy, HasTabIndex, CanDisable, CanColor {

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  /** Emits whenever the component is destroyed. */
  private _destroy = new Subject();

  /** Last emitted position of the overlay */
  private _connectionPair: ConnectionPositionPair;

  /** The class that traps and manages focus within the overlay. */
  private _focusTrap: FocusTrap | null;

  // Element that was focused before the context-action-menu was opened.
  // Save this to restore upon close.
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  /** Aria label of the select. If not specified,
   * the fallback to 'Context action menu will be used'. */
  @Input('aria-label') ariaLabel: string = 'Context action menu';

  /** Event emitted when the select has been opened. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _positions = [{
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  }, {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'bottom',
  }];

  /** Overlay pane containing the menu-items. */
  @ViewChild(CdkConnectedOverlay) overlayDir: CdkConnectedOverlay;

  /** Panel that holds the menu items */
  @ViewChild('panel') panel: ElementRef;

  /** List of the items inside of a menu. */
  @ContentChildren(GhButton) items: QueryList<GhButton>;

  /** Whether or not the overlay panel is open. */
  get panelOpen() {
    return this._panelOpen;
  }

  constructor(
    elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusTrapFactory: FocusTrapFactory,
    iconRegistry: GhIconRegistry,
    sanitizer: DomSanitizer,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    super(elementRef);

    this.tabIndex = parseInt(tabIndex) || 0;

    iconRegistry
      // Registering an icon named 'more' in the default namespace
      .addSvgIcon('more',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/more.svg'));
    iconRegistry
      // Registering an icon named 'abort' in the default namespace
      .addSvgIcon('abort',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/abort.svg'));
  }

  /** Opens the panel */
  open() {
    if (!this.disabled && !this._panelOpen) {
      this._panelOpen = true;
      this.openedChange.emit(true);
      this._savePreviouslyFocusedElement();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Closes the panel */
  close() {
    if (this._panelOpen) {
      this._panelOpen = false;
      this.openedChange.emit(false);
      this._restoreFocus();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Moves the focus inside the focus trap. */
  private _trapFocus() {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this.overlayDir.overlayRef.overlayElement);
    }
    this._focusTrap.focusInitialElementWhenReady();
  }

  /** Restores focus to the element that was focused before the overlay opened. */
  private _restoreFocus() {
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (toFocus && typeof toFocus.focus === 'function') {
      toFocus.focus();
    }

    if (this._focusTrap) {
      /** Destroy the focus trap */
      this._focusTrap.destroy();
      /** reset the focus trap to null to create a new one on subsequent open calls */
      this._focusTrap = null;
    }
  }

  /** Saves a reference to the element that was focused before the overlay was opened. */
  private _savePreviouslyFocusedElement() {
    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;
    }
  }

  /** Callback that is invoked when the overlay panel has been attached. */
  _onAttached(): void {
    /** trap focus within the overlay */
    this._trapFocus();

    const positionChange = this.overlayDir.positionChange;

    // Set classes depending on the position of the overlay
    positionChange
      // Stop listening when the component will be destroyed
      // or the overlay closes
      .pipe(takeUntil(merge(
        this._destroy,
        this.openedChange.pipe(filter(o => !o))
      )))
      // Map the change event to the provided ConnectionPositionPair
      .pipe(map(change => change.connectionPair))
      .subscribe(connectionPair => {
        // Set the classes to indicate the position of the overlay
        if (this._connectionPair) {
          this.panel.nativeElement.classList
            .remove(`gh-ca-menu-panel-${this._connectionPair.originY}`);
        }
        this.panel.nativeElement.classList.add(`gh-ca-menu-panel-${connectionPair.originY}`);
        this._connectionPair = connectionPair;
      });
  }

  /** Hook that trigger right before the component will be destroyed. */
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this.close();
  }
}

@Component({
  selector: 'gh-context-action-menu-item, gh-ca-menu-item',
  templateUrl: './context-action-menu-item.html',
  inputs: ['disabled', 'tabIndex', 'color'],
})
export class GhContextActionMenuItem extends _GhContextActionMenuBase
  implements CanDisable, HasTabIndex, CanColor {
  constructor(
    elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);
  }

  /** Event emitted when the item has been clicked. */
  @Output() onClick: EventEmitter<Event> = new EventEmitter<Event>();

  // Call is invoked when the button in the item is clicked
  _actionClicked(event: Event) {
    event.preventDefault();
    this.onClick.emit(event);
    this._changeDetectorRef.markForCheck();
  }
}
