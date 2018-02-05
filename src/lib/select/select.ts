import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Output,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  OnInit,
  OnChanges,
  DoCheck,
  OnDestroy,
  AfterContentInit,
  NgZone,
  Attribute,
  EventEmitter,
  Self,
  Optional,
  isDevMode,
  SimpleChanges,
} from '@angular/core';
import {NgClass} from '@angular/common';
import {SelectionModel} from '@angular/cdk/collections';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {DOWN_ARROW} from '@angular/cdk/keycodes';
import {UP_ARROW} from '@angular/cdk/keycodes';
import {LEFT_ARROW} from '@angular/cdk/keycodes';
import {RIGHT_ARROW} from '@angular/cdk/keycodes';
import {HOME} from '@angular/cdk/keycodes';
import {END} from '@angular/cdk/keycodes';
import {ActiveDescendantKeyManager} from '@angular/cdk/a11y';
import {
  CdkConnectedOverlay,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair
} from '@angular/cdk/overlay';
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import {ControlValueAccessor, FormGroupDirective, NgControl, NgForm} from '@angular/forms';
import {startWith} from 'rxjs/operators/startWith';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {switchMap} from 'rxjs/operators/switchMap';
import {map} from 'rxjs/operators/map';
import {filter} from 'rxjs/operators/filter';
import {take} from 'rxjs/operators/take';
import {merge} from 'rxjs/observable/merge';
import {defer} from 'rxjs/observable/defer';
import {Observable} from 'rxjs/Observable';
import {
  mixinDisabled,
  CanDisable,
  mixinTabIndex,
  HasTabIndex,
  ErrorStateMatcher,
  CanUpdateErrorState,
  mixinErrorState
} from '@dynatrace/ngx-groundhog/core';
import {GhOption, GhOptionSelectionChange} from './option';
import {Subject} from 'rxjs/Subject';

/**
 * Select IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let nextUniqueId = 0;

/** The max height of the select's overlay panel */
export const SELECT_PANEL_MAX_HEIGHT = 256;

/** The height of the select items. */
export const SELECT_ITEM_HEIGHT = 18;

/** Change event object that is emitted when the select value has changed. */
export interface GhSelectChange {
  /** Reference to the select that emitted the change event. */
  source: GhSelect;
  /** Current value of the select that emitted the event. */
  value: any;
}

// Boilerplate for applying mixins to GhSelect.
export class GhSelectBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl) {}
}
export const _GhSelectMixinBase = mixinTabIndex(mixinDisabled(mixinErrorState(GhSelectBase)));

@Component({
  moduleId: module.id,
  selector: 'gh-select',
  exportAs: 'ghSelect',
  templateUrl: 'select.html',
  styleUrls: ['select.css'],
  inputs: ['disabled', 'tabIndex'],
  host: {
    'role': 'listbox',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-label]': '_ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-owns]': 'panelOpen ? _optionIds : null',
    'attr.aria-multiselectable': 'false',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[class.gh-select-disabled]': 'disabled',
    '[class.gh-select-required]': 'required',
    'class': 'gh-select',
    '(focus)': '_onFocus()',
    '(blur)': '_onBlur()',
    '(keydown)': '_handleKeydown($event)'
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhSelect extends _GhSelectMixinBase implements OnInit, OnChanges, DoCheck,
  AfterContentInit, OnDestroy, CanDisable, HasTabIndex, ControlValueAccessor, CanUpdateErrorState {

  /** The placeholder displayed in the trigger of the select. */
  private _placeholder: string;

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  /** Whether filling out the select is required in the form. */
  private _required = false;

  /** Unique id for this input. */
  private _uid = `gh-select-${nextUniqueId++}`;

  /** _uid or provided id via input */
  private _id: string;

  /** Current value of the select */
  private _value: any;

  /** Emits whenever the component is destroyed. */
  private _destroy = new Subject();

  /** Comparison function to specify which option is displayed. Defaults to object equality. */
  private _compareWith = (o1: any, o2: any) => o1 === o2;

  /** The scroll position of the overlay panel, calculated to center the selected option. */
  private _scrollTop = 0;

  private _connectionPair: ConnectionPositionPair;

  /** Deals with the selection logic. */
  _selectionModel: SelectionModel<GhOption>;

  /** The IDs of child options to be passed to the aria-owns attribute. */
  _optionIds: string = '';

  /** The aria-describedby attribute on the select for improved a11y. */
  _ariaDescribedby: string; // TODO @thomaspink: Implement when adding support for angular forms

  /** Whether the select is focused. */
  focused: boolean = false;

  /** Manages keyboard events for options in the panel. */
  _keyManager: ActiveDescendantKeyManager<GhOption>;

  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when select has been touched` */
  _onTouched = () => {};

  /** The last measured value for the trigger's client bounding rect. */
  _triggerRect: ClientRect;

  /**
   * The y-offset of the overlay panel in relation to the trigger's top start corner.
   * This must be adjusted to either -1 (if overlay opend below the trigger)
   * or 1 (if overlay opens on top) to overlap the border of the overlay and trigger.
   */
  _offsetY = -1;

  /** Classes to be passed to the select panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | Set<string> | string[] | {[key: string]: any};

  /** Placeholder to be shown if no value has been selected. */
  @Input()
  get placeholder() { return this._placeholder; }
  set placeholder(newplaceholder: string) {
    this._placeholder = newplaceholder;
    this.stateChanges.next();
  }

  /** Value of the select. */
  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    // Only set the new value if it differes from the old one
    if (newValue !== this._value) {
      this.writeValue(newValue);
      this._value = newValue;
    }
  }

  /** Unique id of the element. */
  @Input()
  get id(): string { return this._id; }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }

  /** Whether the component is required. */
  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /**
   * A function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  @Input()
  get compareWith() { return this._compareWith; }
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw new Error('`compareWith` must be a function.');
    }
    this._compareWith = fn;
    if (this._selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }

  /** Aria label of the select. If not specified, the placeholder will be used as label. */
  @Input('aria-label') ariaLabel: string = '';

  /** Input that can be used to specify the `aria-labelledby` attribute. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** Event emitted when the select has been opened. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Event emitted when the selected value has been changed by the user. */
  @Output() readonly selectionChange: EventEmitter<GhSelectChange> =
    new EventEmitter<GhSelectChange>();

  /**
   * Event that emits whenever the raw value of the select changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   */
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  /** The currently selected option. */
  get selected(): GhOption {
    return this._selectionModel.selected[0];
  }

  /** Whether the select has a value. */
  get empty() {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }

  /** The value displayed in the trigger. */
  get triggerValue() {
    return this.empty ? '' : this._selectionModel.selected[0].viewValue;
  }

  /** Whether or not the overlay panel is open. */
  get panelOpen() {
    return this._panelOpen;
  }

  /** Returns the aria-label of the select component. */
  get _ariaLabel(): string | null {
    // If an ariaLabelledby value has been set, the select should not overwrite the
    // `aria-labelledby` value by setting the ariaLabel to the placeholder.
    return this.ariaLabelledby ? null : this.ariaLabel || this.placeholder;
  }

  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      this._setSelectionByValue(this.ngControl ? this.ngControl.value : this._value);
    });
  }

  /** Panel containing the select options. */
  @ViewChild('panel') panel: ElementRef;

  /** Overlay pane containing the options. */
  @ViewChild(CdkConnectedOverlay) overlayDir: CdkConnectedOverlay;

  /** Trigger that opens the select. */
  @ViewChild('trigger') trigger: ElementRef;

  /** All of the defined select options. */
  @ContentChildren(GhOption, {descendants: true})
  options: QueryList<GhOption>;

  /** Combined stream of all of the child options' change events. */
  optionSelectionChanges: Observable<GhOptionSelectionChange> = defer(() => {
    if (this.options) {
      // This will create an array of onSelectionChange Observables and
      // then combine/merge them into one so we can later easily subscribe
      // to all at once and get the event (the option plus isUserEvent flag)
      // of the triggered option
      return merge(...this.options.map(option => option.onSelectionChange));
    }

    return this._ngZone.onStable
      .asObservable()
      .pipe(take(1), switchMap(() => this.optionSelectionChanges));
  });

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    _elementRef: ElementRef,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Self() @Optional() public ngControl: NgControl,
    @Attribute('tabindex') tabIndex: string,
  ) {
    super(_elementRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.tabIndex = parseInt(tabIndex) || 0;

    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  /**
   * Hook that triggers after the component has been initialized
   * and the first change detection has run.
   */
  ngOnInit() {
    this._selectionModel = new SelectionModel<GhOption>(false, undefined, false);
    this.stateChanges.next();
  }

  /** Hook that triggers when ng-content and all sub components (the options) are initialized. */
  ngAfterContentInit(): void {
    this._initKeyManager();

    // After the ng-content has been initialized we can start listening on
    // the options query list for changes (new options get added, removed,...)
    this.options.changes
      .pipe(startWith(null), takeUntil(this._destroy))
      // Everytime options change, we need to reset (resubscribe on their events, ...)
      .subscribe(() => {
        this._resetOptions();
        this._initializeSelection();
      });
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Updating the disabled state is handled by `mixinDisabled`, but we need to additionally let
    // the parent form field know to run change detection when the disabled state changes.
    if (changes.disabled) {
      this.stateChanges.next();
    }
  }

  /** Hook that trigger right before the component will be destroyed. */
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();
  }

  /** Opens the panel */
  open() {
    if (!this.disabled && !this._panelOpen) {
      this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
      this._panelOpen = true;
      this._highlightCorrectOption();
      this._calculateOverlayScroll();
      this._changeDetectorRef.markForCheck();

      // TODO @thomaspink: Move this if annimations are implemented
      this._onPanelDone();
    }
  }

  /** Closes the panel */
  close() {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._changeDetectorRef.markForCheck();
      this._onTouched();

      // TODO @thomaspink: Move this if annimations are implemented
      this._onPanelDone();
    }
  }

  /** Toggles the panel */
  toggle() {
    this._panelOpen ? this.close() : this.open();
  }

  /** Focuses the select element. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /**
   * Sets the select's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   */
  writeValue(value: any): void {
    if (this.options) {
      this._setSelectionByValue(value);
    }
  }

  /**
   * Saves a callback function to be invoked when the select's value
   * changes from user input. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   * @param fn Callback to be triggered when the value changes.
   */
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the select is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /**
   * Disables the select. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }


  /** Drops current option subscriptions and resets from scratch. */
  _resetOptions() {
    this.optionSelectionChanges
      .pipe(
      // Stop listening when the component will be destroyed
      // or the options have changed (new ones added or removed)
      takeUntil(merge(this._destroy, this.options.changes)),
      // We only need user events.
      // The other ones are triggered to select/deselect on GhSelect level
      filter(event => event.isUserInput))
      .subscribe(evt => {
        // Note: The event.source is the selected GhOption
        this._onSelect(evt.source);

        if (this._panelOpen) {
          this.close();
        }
      });

    this._setOptionIds();
  }

  /** Handles all keydown events on the select. */
  _handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled) {
      this.panelOpen ? this._handleOpenKeydown(event) : this._handleClosedKeydown(event);
    }
  }

  /** Handles keyboard events while the select is closed. */
  private _handleClosedKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW ||
      keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;

    // Open the select on ALT + arrow key to match the native <select>
    if (isOpenKey || (event.altKey && isArrowKey)) {
      // prevents the page from scrolling down when pressing space, enter or alt+arrow
      event.preventDefault();
      this.open();
    } else {
      this._keyManager.onKeydown(event);
    }
  }

  /** Handles keyboard events when the selected is open. */
  private _handleOpenKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const manager = this._keyManager;

    if (keyCode === HOME || keyCode === END) {
      event.preventDefault();
      keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
    } else if (isArrowKey && event.altKey) {
      // Close the select on ALT + arrow key to match the native <select>
      event.preventDefault();
      this.close();
    } else if ((keyCode === ENTER || keyCode === SPACE) && manager.activeItem) {
      event.preventDefault();
      manager.activeItem._toggleViaInteraction();
    } else {
      const previouslyFocusedIndex = manager.activeItemIndex;
      manager.onKeydown(event);
    }
  }

  /** Invoked when the control gains focus. */
  _onFocus() {
    if (!this.disabled) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  /** Invoked when the control looses focus. */
  _onBlur() {
    this.focused = false;

    if (!this.disabled && !this.panelOpen) {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  /** Callback that is invoked when the overlay panel has been attached. */
  _onAttached(): void {
    const positionChange = this.overlayDir.positionChange;

    // Set the scroll position of the panel when
    // it has been positioned correctly
    positionChange.pipe(take(1)).subscribe(() => {
      this._changeDetectorRef.detectChanges();
      this.panel.nativeElement.scrollTop = this._scrollTop;
    });

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
      // Filter out pairs that did not change
      .pipe(filter(connectionPair => !this._connectionPair ||
        connectionPair.originY !== this._connectionPair.originY))
      .subscribe(connectionPair => {
        // Set the classes to indicate the position of the overlay
        if (this._connectionPair) {
          this.panel.nativeElement.classList
            .remove(`gh-select-panel-${this._connectionPair.originY}`);
        }
        this.panel.nativeElement.classList.add(`gh-select-panel-${connectionPair.originY}`);
        this._connectionPair = connectionPair;
      });
  }

  /**
   * When the panel element is finished transforming in (though not fading in), it
   * emits an event and focuses an option if the panel is open.
   */
  _onPanelDone(): void {
    if (this.panelOpen) {
      this.openedChange.emit(true);
    } else {
      this.openedChange.emit(false);
      this._changeDetectorRef.markForCheck();
    }
  }

  private _calculateOverlayOffsetY(change: ConnectedOverlayPositionChange) {
    return change.connectionPair.originY === 'top' ? 1 : -1;
  }

  /**
   * Highlights the selected item. If no option is selected, it will highlight
   * the first item instead.
   */
  private _highlightCorrectOption(): void {
    if (this._keyManager) {
      if (this.empty) {
        this._keyManager.setFirstItemActive();
      } else {
        this._keyManager.setActiveItem(this._getOptionIndex(this._selectionModel.selected[0])!);
      }
    }
  }

  /** Gets the index of the provided option in the option list. */
  private _getOptionIndex(option: GhOption): number | undefined {
    return this.options.reduce((result: number, current: GhOption, index: number) => {
      return result === undefined ? (option === current ? index : undefined) : result;
    }, undefined);
  }

  /**
   * Calculates the scroll position of the select's overlay panel.
   * Attempts to center the selected option in the panel. If the option is
   * too high or too low in the panel to be scrolled to the center, it clamps the
   * scroll position to the min or max scroll positions respectively.
   */
  _calculateOverlayScroll() {
    const items = this.options.length;
    const itemHeight = SELECT_ITEM_HEIGHT;
    const scrollContainerHeight = items * itemHeight;
    const panelHeight = Math.min(scrollContainerHeight, SELECT_PANEL_MAX_HEIGHT);
    const scrollBuffer = panelHeight / 2;
    const halfOptionHeight = itemHeight / 2;

    // The farthest the panel can be scrolled before it hits the bottom
    const maxScroll = scrollContainerHeight - panelHeight;

    // If no value is selected we open the popup to the first item.
    const selectedIndex =
      this.empty ? 0 : this._getOptionIndex(this._selectionModel.selected[0])!;

    const optionOffsetFromScrollTop = itemHeight * selectedIndex;

    // Starts at the optionOffsetFromScrollTop, which scrolls the option to the top of the
    // scroll container, then subtracts the scroll buffer to scroll the option down to
    // the center of the overlay panel. Half the option height must be re-added to the
    // scrollTop so the option is centered based on its middle, not its top edge.
    const optimalScrollPosition = optionOffsetFromScrollTop - scrollBuffer + halfOptionHeight;
    this._scrollTop = Math.min(Math.max(0, optimalScrollPosition), maxScroll);
  }

  /** Scrolls the active option into view. */
  private _scrollActiveOptionIntoView(): void {
    const activeOptionIndex = this._keyManager.activeItemIndex || 0;
    const scrollOffset = activeOptionIndex * SELECT_ITEM_HEIGHT;
    const panelTop = this.panel.nativeElement.scrollTop;

    if (scrollOffset < panelTop) {
      this.panel.nativeElement.scrollTop = scrollOffset;
    } else if (scrollOffset + SELECT_ITEM_HEIGHT > panelTop + SELECT_PANEL_MAX_HEIGHT) {
      this.panel.nativeElement.scrollTop =
        Math.max(0, scrollOffset - SELECT_PANEL_MAX_HEIGHT + SELECT_ITEM_HEIGHT);
    }
  }

  /** Invoked when an option is clicked. */
  private _onSelect(option: GhOption): void {
    const wasSelected = this._selectionModel.isSelected(option);

    // Deselect all other options (than the one we just selected)
    // and clear all options from our selectionModel
    this._clearSelection(option);
    this._selectionModel.select(option);

    this.stateChanges.next();

    // Only propagate changes if the option has really changed.
    // We do not want change events triggerd if the same option
    // got selected twice in a row.
    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }
  }

  /** Clears the select trigger and deselects every option in the list. */
  private _clearSelection(skip?: GhOption): void {
    this._selectionModel.clear();
    this.options.forEach(option => {
      if (option !== skip) {
        option.deselect();
      }
    });
    this.stateChanges.next();
  }

  /**
   * Sets the selected option based on a value. If no option can be
   * found with the designated value, the select trigger is cleared.
   */
  private _setSelectionByValue(value: any | any[], isUserInput = false): void {

    this._clearSelection();

    const correspondingOption = this._selectValue(value, isUserInput);

    // Shift focus to the active item. Note that we shouldn't do this in multiple
    // mode, because we don't know what option the user interacted with last.
    if (correspondingOption) {
      this._keyManager.setActiveItem(this.options.toArray().indexOf(correspondingOption));
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * Finds and selects and option based on its value.
   * @returns Option that has the corresponding value.
   */
  private _selectValue(value: any, isUserInput = false): GhOption | undefined {
    const correspondingOption = this.options.find((option: GhOption) => {
      try {
        // Treat null as a special reset value.
        return option.value != null && this._compareWith(option.value, value);
      } catch (error) {
        if (isDevMode()) {
          // Notify developers of errors in their comparator.
          console.warn(error);
        }
        return false;
      }
    });

    if (correspondingOption) {
      isUserInput ? correspondingOption._toggleViaInteraction() : correspondingOption.select();
      this._selectionModel.select(correspondingOption);
      this.stateChanges.next();
    }

    return correspondingOption;
  }

  /** Sets up a key manager to listen to keyboard events on the overlay panel. */
  private _initKeyManager() {
    this._keyManager = new ActiveDescendantKeyManager<GhOption>(this.options)
      .withTypeAhead();

    this._keyManager.tabOut.pipe(takeUntil(this._destroy)).subscribe(() => this.close());
    this._keyManager.change.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._panelOpen && this.panel) {
        this._scrollActiveOptionIntoView();
      } else if (!this._panelOpen && this._keyManager.activeItem) {
        this._keyManager.activeItem._toggleViaInteraction();
      }
    });
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(fallbackValue?: any): void {
    const valueToEmit = this.selected ? (this.selected as GhOption).value : fallbackValue;
    this._value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this.selectionChange.emit({source: this, value: valueToEmit});
    this._changeDetectorRef.markForCheck();
  }

  /** Records option IDs to pass to the aria-owns property. */
  private _setOptionIds() {
    this._optionIds = this.options.map(option => option.id).join(' ');
  }
}
