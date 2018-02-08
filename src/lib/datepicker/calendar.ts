import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Optional,
  Output,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter,
  Inject,
  AfterContentInit
} from '@angular/core';
import {DateAdapter, GH_DATE_FORMATS, GhDateFormats} from '@dynatrace/ngx-groundhog/core';
import {GhDatepickerIntl} from './datepicker-intl';
import {createMissingDateImplError} from './datepicker-errors';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'gh-calendar',
  templateUrl: 'calendar.html',
  styleUrls: ['calendar.scss'],
  exportAs: 'ghCalendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class GhCalendar<D> implements OnDestroy, AfterContentInit {
  private _intlChanges: Subscription;
  private _selected: D | null;
  private _startAt: D | null;
  private _minDate: D | null;
  private _maxDate: D | null;
  private _clampedActiveDate: D;

  /** The currently selected date. */
  @Input()
  get selected(): D | null { return this._selected; }
  set selected(value: D | null) {
    this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** A date representing the period (month or year) to start the calendar in. */
  @Input()
  get startAt(): D | null { return this._startAt; }
  set startAt(value: D | null) {
    this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** The minimum selectable date. */
  @Input()
  get minDate(): D | null { return this._minDate; }
  set minDate(value: D | null) {
    this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** The maximum selectable date. */
  @Input()
  get maxDate(): D | null { return this._maxDate; }
  set maxDate(value: D | null) {
    this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** A function used to filter which dates are selectable. */
  @Input() dateFilter: (date: D) => boolean;

  /** Emits when the currently selected date changes. */
  @Output() readonly selectedChange: EventEmitter<D> = new EventEmitter<D>();

  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get _activeDate(): D { return this._clampedActiveDate; }
  set _activeDate(value: D) {
    this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
  }

  /** The label for the the previous button. */
  get _prevButtonLabel(): string { return this._intl.prevYearLabel; }

  /** The label for the the next button. */
  get _nextButtonLabel(): string { return this._intl.nextYearLabel; }

  /** The label for the current period (month & year). */
  get _periodText(): string {
    return this._dateAdapter
      .format(this._activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  constructor(private _intl: GhDatepickerIntl,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(GH_DATE_FORMATS) private _dateFormats: GhDateFormats,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    this._intlChanges = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
  }

  ngAfterContentInit() {
    this._activeDate = this.startAt || this._dateAdapter.today();
  }

  ngOnDestroy() {
    this._intlChanges.unsubscribe();
  }

  /** Handles date selection in the month view. */
  _dateSelected(date: D) {
    if (!this._dateAdapter.sameDate(date, this.selected)) {
      this.selectedChange.emit(date);
    }
  }

  /** Handles user clicks on the previous button. */
  _previousClicked() {
    this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -1);
  }

  /** Handles user clicks on the next button. */
  _nextClicked() {
    this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 1);
  }

  /** Whether the previous period button is enabled. */
  _previousEnabled(): boolean {
    if (!this.minDate) {
      return true;
    }
    return !this.minDate || !this._isSame(this._activeDate, this.minDate);
  }

  /** Whether the next period button is enabled. */
  _nextEnabled(): boolean {
    return !this.maxDate || !this._isSame(this._activeDate, this.maxDate);
  }

  /** Whether the two dates represent the same month and year. */
  private _isSame(date1: D, date2: D): boolean {
      return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
          this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2);
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }
}
