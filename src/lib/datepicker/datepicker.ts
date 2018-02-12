import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import {GhDatepickerInput} from './datepicker-input';
import { Subscription } from 'rxjs/Subscription';

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
  private _validSelected: D | null = null;
  private _inputSubscription = Subscription.EMPTY;

  /** The currently selected date. */
  get _selected(): D | null { return this._validSelected; }
  set _selected(value: D | null) { this._validSelected = value; }

  /** The input element this datepicker is associated with. */
  _datepickerInput: GhDatepickerInput<D>;

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
}
