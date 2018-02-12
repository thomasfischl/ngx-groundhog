import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ViewChild,
  AfterContentInit,
  ComponentRef,
  ViewContainerRef,
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Overlay, OverlayConfig, PositionStrategy, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {ESCAPE} from '@angular/cdk/keycodes';
import {Subscription} from 'rxjs/Subscription';
import {merge} from 'rxjs/observable/merge';
import {filter} from 'rxjs/operators/filter';
import {GhDatepickerInput} from './datepicker-input';
import {GhCalendar} from './calendar';

@Component({
  moduleId: module.id,
  selector: 'gh-datepicker',
  template: '',
  exportAs: 'ghDatepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class GhDatepicker<D> {

  /** Whether the calendar is open. */
  @Input()
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { value ? this.open() : this.close(); }

  /** Whether the datepicker pop-up should be disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this._datepickerInput ?
        this._datepickerInput.disabled : !!this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean;

  /** The currently selected date. */
  get _selected(): D | null { return this._validSelected; }
  set _selected(value: D | null) { this._validSelected = value; }

  /** The input element this datepicker is associated with. */
  _datepickerInput: GhDatepickerInput<D>;

  /** A portal containing the calendar for this datepicker. */
  private _calendarPortal: ComponentPortal<GhDatepickerContent<D>>;

  /** A reference to the overlay when the calendar is opened as a popup. */
  private _popupRef: OverlayRef;

  private _opened = false;
  private _validSelected: D | null = null;
  private _inputSubscription = Subscription.EMPTY;

  constructor (
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef) { }

  /** Open the calendar. */
  open() {
    if (this._opened || this.disabled) {
      return;
    }
    if (!this._datepickerInput) {
      throw Error('Attempted to open an GhDatepicker with no associated input.');
    }

    if (!this._calendarPortal) {
      this._calendarPortal =
        new ComponentPortal<GhDatepickerContent<D>>(GhDatepickerContent, this._viewContainerRef);
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      const componentRef = this._popupRef.attach<GhDatepickerContent<D>>(this._calendarPortal);
      componentRef.instance.datepicker = this;
    }

    this._opened = true;
  }

  /** Close the calendar. */
  close() {}

  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   */
  _registerInput(input: GhDatepickerInput<D>): void {
    if (this._datepickerInput) {
      throw Error('A MatDatepicker can only be associated with a single input.');
    }
    this._datepickerInput = input;
    this._inputSubscription =
      this._datepickerInput._valueChange.subscribe((value: D | null) => this._selected = value);
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      panelClass: 'gh-datepicker-popup',
    });

    this._popupRef = this._overlay.create(overlayConfig);

    merge(
      this._popupRef.backdropClick(),
      this._popupRef.detachments(),
      this._popupRef.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE))
    ).subscribe(() => this.close());
  }

  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .connectedTo(this._datepickerInput._getConnectedOverlayOrigin(),
        {originX: 'start', originY: 'bottom'},
        {overlayX: 'start', overlayY: 'bottom'}
      )
      .withFallbackPosition(
        {originX: 'start', originY: 'top'},
        {overlayX: 'start', overlayY: 'bottom'},
      );
  }
}

/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
@Component({
  moduleId: module.id,
  selector: 'gh-datepicker-content',
  templateUrl: 'datepicker-content.html',
  styleUrls: ['datepicker-content.css'],
  host: {
    'class': 'gh-datepicker-content'
  },
  exportAs: 'GhDatepickerContent',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhDatepickerContent<D> implements AfterContentInit {
  datepicker: GhDatepicker<D>;

  @ViewChild(GhCalendar) _calendar: GhCalendar<D>;

  ngAfterContentInit() {
    this._calendar._focusActiveCell();
  }
}
