import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';

const CIRCLE_CIRCUMFERENCE = 1514;

@Component({
  selector: 'gh-progresscircle',
  templateUrl: 'progresscircle.html',
  styleUrls: ['progresscircle.css'],
  exportAs: 'ghProgressCircle',
  host: {
    'role': 'progressbar',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'value',
    'class': 'gh-progresscircle',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhProgressCircle {

  /** Value of the progress circle. */
  @Input()
  get value(): number | null {
    // If the value needs to be read and it is still uninitialized,
    // or if the value is smaller than the min set it to the min.
    if (this._value === null || this._value < this._min) {
      this.value = this._min;
    } else
    // Also check for the upper bound and set the value to the max
    if (this._value > this._max) {
      this.value = this._max;
    }
    return this._value;
  }
  set value(v: number | null) {
    if (v !== this._value) {
      this._value = coerceNumberProperty(v);
      this._calculateViewParams();
    }
  }

  /** The maximum value that the progress circle can have. */
  @Input()
  get max(): number { return this._max; }
  set max(v: number) {
    this._max = coerceNumberProperty(v, this._max);
    this._calculateViewParams();
  }

  /** The minimum value that the slider can have. */
  @Input()
  get min(): number { return this._min; }
  set min(v: number) {
    this._min = coerceNumberProperty(v, this._min);

    // If the value wasn't explicitly set by the user, set it to the min.
    if (this._value === null) {
      this.value = this._min;
    }
    this._calculateViewParams();
  }

  /** The percentage of the progress circle that coincides with the value. */
  get percent(): number { return clamp(this._percent); }

  /** @internal Dash offset base on the values percentage */
  _dashOffset: number = CIRCLE_CIRCUMFERENCE;

  private _value: number | null = null;
  private _percent: number = 0;
  private _min: number = 0;
  private _max: number = 100;

  constructor (private _changeDetectorRef: ChangeDetectorRef) { }

  /** Updates all view parameters */
  private _calculateViewParams() {
    this._percent = this._calculatePercentage(this._value);
    this._dashOffset = this._calculateDashOffset(this._percent);

    // Since this also modifies the percentage and dashOffset,
    // we need to let the change detection know.
    this._changeDetectorRef.markForCheck();
  }

  /** Calculates the percentage of the progress circle that a value is. */
  private _calculatePercentage(value: number | null) {
    return ((value || 0) - this.min) / (this.max - this.min) * 100;
  }

  /** Calculates the dash offset of the progress circle based on the calculated percent */
  private _calculateDashOffset(percent: number) {
    return CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE / 100 * percent);
  }
}

/** Clamps a value to be between two numbers, by default 0 and 100. */
function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}
