import {
  Directive,
  Input,
  EventEmitter,
  ElementRef,
  Optional,
  Inject
} from '@angular/core';
import { DateAdapter, GhDateFormats, GH_DATE_FORMATS } from '@dynatrace/ngx-groundhog/core';
import { GhDatepicker } from './datepicker';
import { createMissingDateImplError } from './datepicker-errors';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW } from '@angular/cdk/keycodes';

/** Directive used to connect an input to a GhDatepicker. */
@Directive({
  selector: 'input[ghDatepicker]',
  host: {
    'aria-haspopup': 'true',
    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
    '[disabled]': 'disabled',
    '(input)': '_onInput($event.target.value)',
    // '(change)': '_onChange()',
    '(blur)': '_onTouched()',
    '(keydown)': '_onKeydown($event)',
  },
  exportAs: 'ghDatepickerInput',
})
export class GhDatepickerInput<D> {


  /** The datepicker that this input is associated with. */
  @Input()
  set ghDatepicker(value: GhDatepicker<D>) {
    if (value) {
      this._datepicker = value;
      this._datepicker._registerInput(this);
    }
  }
  _datepicker: GhDatepicker<D>;

  /** The value of the input. */
  @Input()
  get value(): D | null { return this._value; }
  set value(value: D | null) {
    const oldDate = this.value;
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = !value || this._dateAdapter.isValid(value);
    value = this._getValidDateOrNull(value);
    this._value = value;
    this._elementRef.nativeElement.value =
      value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
    if (!this._dateAdapter.sameDate(oldDate, value)) {
      this._valueChange.emit(value);
    }
  }

  /** The minimum valid date. */
  @Input()
  get min(): D | null { return this._min; }
  set min(value: D | null) {
    this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** The maximum valid date. */
  @Input()
  get max(): D | null { return this._max; }
  set max(value: D | null) {
    this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** Whether the datepicker-input is disabled. */
  @Input()
  get disabled(): boolean { return !!this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled) {
      // Normally, native input elements automatically blur if they turn disabled. This behavior
      // is problematic, because it would mean that it triggers another change detection cycle,
      // which then causes a changed after checked error if the input element was focused before.
      this._elementRef.nativeElement.blur();
    }
  }

  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<D | null>();

  _onTouched = () => {};

  private _value: D | null;
  private _min: D | null;
  private _max: D | null;
  private _disabled: boolean;

  /** Whether the last value set on the input was valid. */
  private _lastValueValid = false;

  constructor(private _elementRef: ElementRef,
    @Optional() public _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(GH_DATE_FORMATS) private _dateFormats: GhDateFormats) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('GH_DATE_FORMATS');
    }
  }

  _onInput(value: string) {
    let date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._getValidDateOrNull(date);
    this._value = date;
    this._valueChange.emit(date);
  }

  _onKeydown(event: KeyboardEvent) {
    if (event.altKey && event.keyCode === DOWN_ARROW) {
      this._datepicker.open();
      event.preventDefault();
    }
  }
  /** Gets the element that the datepicker popup should be connected to. */
  _getConnectedOverlayOrigin() { return this._elementRef; }

  private _getValidDateOrNull(obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }
}
