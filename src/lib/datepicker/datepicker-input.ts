import {
  Directive,
  Input,
  EventEmitter
} from '@angular/core';
import {GhDatepicker} from './datepicker';

/** Directive used to connect an input to a GhDatepicker. */
@Directive({
  selector: 'input[ghDatepicker]',
  host: {
    'aria-haspopup': 'true',
    // '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
    // '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
    // '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
    // '[disabled]': 'disabled',
    // '(input)': '_onInput($event.target.value)',
    // '(change)': '_onChange()',
    // '(blur)': '_onTouched()',
    // '(keydown)': '_onKeydown($event)',
  },
  exportAs: 'ghDatepickerInput',
})
export class GhDatepickerInput<D> {

  /** The datepicker that this input is associated with. */
  @Input()
  set ghDatepicker(value: GhDatepicker<D>) {
    if (value) {
      this._datepicker = value;
      // this._datepicker._registerInput(this);
    }
  }
  _datepicker: GhDatepicker<D>;

  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<D | null>();

}
