import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  OnInit,
  OnDestroy,
  AfterContentInit,
  NgZone,
} from '@angular/core';
import {NgClass} from '@angular/common';
import {SelectionModel} from '@angular/cdk/collections';
import {startWith} from 'rxjs/operators/startWith';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {switchMap} from 'rxjs/operators/switchMap';
import {filter} from 'rxjs/operators/filter';
import {take} from 'rxjs/operators/take';
import {merge} from 'rxjs/observable/merge';
import {defer} from 'rxjs/observable/defer';
import {Observable} from 'rxjs/Observable';
import {GhOption, GhOptionSelectionChange} from './option';
import {Subject} from 'rxjs/Subject';

@Component({
  moduleId: module.id,
  selector: 'gh-select',
  exportAs: 'ghSelect',
  templateUrl: 'select.html',
  styleUrls: ['select.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhSelect implements OnInit, AfterContentInit, OnDestroy {

  /** The placeholder displayed in the trigger of the select. */
  private _placeholder: string;

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  private _value: any;

  /** Emits whenever the component is destroyed. */
  private _destroy = new Subject();

  /** Deals with the selection logic. */
  _selectionModel: SelectionModel<GhOption>;

  /** Classes to be passed to the select panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | Set<string> | string[] | {[key: string]: any};

  /** Placeholder to be shown if no value has been selected. */
  @Input()
  get placeholder() { return this._placeholder; }
  set placeholder(newplaceholder: string) {
    this._placeholder = newplaceholder;
  }

  /** Value of the select. */
  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    // Only set the new value if it differes from the old one
    if (newValue !== this._value) {
      this._value = newValue;
    }
  }

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

  /** Panel containing the select options. */
  @ViewChild('panel') panel: ElementRef;

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

  constructor(private _changeDetectiorRef: ChangeDetectorRef, private _ngZone: NgZone) { }

  /**
   * Hook that triggers after the component has been initialized
   * and the first change detection has run.
   */
  ngOnInit() {
    this._selectionModel = new SelectionModel<GhOption>(false, undefined, false);
  }

  /** Hook that triggers when ng-content and all sub components (the options) are initialized. */
  ngAfterContentInit(): void {
    // After the ng-content has been initialized we can start listening on
    // the options query list for changes (new options get added, removed,...)
    this.options.changes
      .pipe(startWith(null), takeUntil(this._destroy))
      // Everytime options change, we need to reset (resubscribe on their events, ...)
      .subscribe(() => this._resetOptions());
  }

  /** Hook that trigger right before the component will be destroyed. */
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /** Opens the panel */
  open() {
    if (!this._panelOpen) {
      this._panelOpen = true;
      this._changeDetectiorRef.markForCheck();
    }
  }

  /** Closes the panel */
  close() {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._changeDetectiorRef.markForCheck();
    }
  }

  /** Toggles the panel */
  toggle() {
    this._panelOpen ? this.close() : this.open();
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
  }

  /** Invoked when an option is clicked. */
  private _onSelect(option: GhOption): void {
    const wasSelected = this._selectionModel.isSelected(option);

    // Deselect all other options (than the one we just selected)
    // and clear all options from our selectionModel
    this._clearSelection(option);
    this._selectionModel.select(option);

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
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(fallbackValue?: any): void {
    const valueToEmit = this.selected ? (this.selected as GhOption).value : fallbackValue;
    this._value = valueToEmit;
    this._changeDetectiorRef.markForCheck();
  }
}
