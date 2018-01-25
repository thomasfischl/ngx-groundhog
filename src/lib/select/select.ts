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
  AfterContentInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { startWith } from 'rxjs/operators/startWith';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { switchMap } from 'rxjs/operators/switchMap';
import { take } from 'rxjs/operators/take';
import { merge } from 'rxjs/observable/merge';
import { defer } from 'rxjs/observable/defer';
import { Observable } from 'rxjs/Observable';
import { GhOption } from './option';
import { Subject } from 'rxjs/Subject';

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
export class GhSelect implements AfterContentInit, OnDestroy {

  /** The placeholder displayed in the trigger of the select. */
  private _placeholder: string;

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  private _selectedValue: any;

  /** Emits whenever the component is destroyed. */
  private _destroy = new Subject();

  /** Classes to be passed to the select panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | Set<string> | string[] | {[key: string]: any};

  /** Placeholder to be shown if no value has been selected. */
  @Input()
  get placeholder() { return this._placeholder; }
  set placeholder(newplaceholder: string) {
    this._placeholder = newplaceholder;
  }

  get empty() {
    return !this._selectedValue;
  }

  get triggerValue() {
    return this._selectedValue ? this._selectedValue.label : 'No value selected';
  }

  get panelOpen() {
    return this._panelOpen;
  }

  @ViewChild('panel')
  panel: ElementRef;

  @ContentChildren(GhOption, { descendants: true })
  options: QueryList<GhOption>;

  /** Combined stream of all of the child options' change events. */
  optionSelectionChanges: Observable<boolean> = defer(() => {
    if (this.options) {
      return merge(...this.options.map(option => option.onSelectionChange));
    }

    return this._ngZone.onStable
      .asObservable()
      .pipe(take(1), switchMap(() => this.optionSelectionChanges));
  });

  // constructor
  constructor(private _changeDetectionRef: ChangeDetectorRef, private _ngZone: NgZone ) {
  }

  ngAfterContentInit(): void {
    this.options.changes
      .pipe(startWith(null), takeUntil(this._destroy))
      .subscribe(() => this._resetOptions());
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /**
   * Opens the panel
   */
  open() {
    if (!this._panelOpen) {
      this._panelOpen = true;
      this._changeDetectionRef.markForCheck();
    }
  }

  /**
   * Closes the panel
   */
  close() {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._changeDetectionRef.markForCheck();
    }
  }

  /**
   * Toggles the panel
  */
  toggle() {
    this._panelOpen ? this.close() : this.open();
  }

  _resetOptions() {
    this.optionSelectionChanges
      .pipe(takeUntil(merge(this._destroy, this.options.changes)))
      .subscribe((evt) => {
        console.log(evt);
      });
  }
}
