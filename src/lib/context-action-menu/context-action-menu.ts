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
} from '@dynatrace/ngx-groundhog/core';
import { CdkConnectedOverlay, ConnectionPositionPair } from '@angular/cdk/overlay';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {map} from 'rxjs/operators/map';
import {filter} from 'rxjs/operators/filter';
import {merge} from 'rxjs/observable/merge';
import {Subject} from 'rxjs/Subject';

// Boilerplate for applying mixins to GhContextActionMenu.
export class GhContextActionMenuBase {
  constructor(
    public _elementRef: ElementRef
  ) { }
}
export const _GhContextActionMenuBase = mixinTabIndex(mixinDisabled(GhContextActionMenuBase));

@Component({
  moduleId: module.id,
  selector: 'gh-ca-menu, gh-context-action-menu',
  templateUrl: 'context-action-menu.html',
  styleUrls: ['context-action-menu.css'],
  inputs: ['disabled', 'tabIndex'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhContextActionMenu extends _GhContextActionMenuBase implements OnDestroy,
  AfterContentInit, HasTabIndex {

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  /** Emits whenever the component is destroyed. */
  private _destroy = new Subject();

  /** Last emitted position of the overlay */
  private _connectionPair: ConnectionPositionPair;

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
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    iconRegistry: GhIconRegistry,
    sanitizer: DomSanitizer,
    _elementRef: ElementRef,
    @Attribute('tabindex') tabIndex: string,
  ) {
    super(_elementRef);

    this.tabIndex = parseInt(tabIndex) || 0;

    iconRegistry
      // Registering an icon named 'more' in the default namespace
      .addSvgIcon('more',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/more.svg'));
  }

  /** Opens the panel */
  open() {
    if (!this.disabled && !this._panelOpen) {
      this._panelOpen = true;
      this.openedChange.emit(true);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Closes the panel */
  close() {
    if (this._panelOpen) {
      this._panelOpen = false;
      this.openedChange.emit(false);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** focuses the first non disabled item */
  _focusFirstItem(): void {
    /** search for the first enabled button */
    const firstFocusableItem = this.items.find(item => !item.disabled);
    /** focus the first one if found */
    if (firstFocusableItem) {
      firstFocusableItem.focus();
    }
  }

  /** Callback that is invoked when the overlay panel has been attached. */
  _onAttached(): void {
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
    this._focusFirstItem();
  }

  /** Hook thats triggered when all contentchildren (buttons) are initialized */
  ngAfterContentInit() {

    this.items.forEach((item) => {
      /** set the item color to secondary since only secondary
       * buttons are allowed within a context action menu */
      if (item.color !== 'secondary' && isDevMode()) {
        console.info('Buttons inside gh-ca-menu will get the color="secondary" set');
      }
      item.color = 'secondary';
      /** add the class to have proper item styling */
      item._elementRef.nativeElement.classList
        .add('gh-ca-menu-btn');
    });
  }

  /** Hook that trigger right before the component will be destroyed. */
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
