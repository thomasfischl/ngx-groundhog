import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
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
  get value(): number { return this._value; }
  set value(value: number) {
    value = coerceNumberProperty(value, this._value);
    value = clamp(value, this.min, this.max);
    if (this._value !== value) {
      this._value = value;
    }
  }

  /** Min value of the progress circle. */
  @Input()
  get min(): number { return this._min; }
  set min(minValue: number) {
    minValue = coerceNumberProperty(minValue, this._value);
    if (this._min !== minValue && minValue < this.max) {
      this._min = minValue;
      this._adjustValue();
    }
  }

  /** Max value of the progress circle. */
  @Input()
  get max(): number { return this._max; }
  set max(maxValue: number) {
    maxValue = coerceNumberProperty(maxValue, this._value);
    if (this._max !== maxValue && maxValue > this.min) {
      this._max = maxValue;
      this._adjustValue();
    }
  }

  /** @internal Calculates the values percentage base on the min and max */
  get _percentage() {
    return (this.value - this.min) / (this.max - this.min) * 100;
  }

  /** @internal Calculates the dash offset base on the values percentage */
  get _dashOffset(): number {
    return CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE / 100 * this._percentage);
  }

  private _value: number = 0;
  private _min: number = 0;
  private _max: number = 100;

  /** Adjusts the value if it moves out of the min/max boundaries */
  private _adjustValue() {
    const value = clamp(this._value, this.min, this.max);
    if (this._value !== value) {
      this._value = value;
    }
  }
}

/** Clamps a value to be between two numbers, by default 0 and 100. */
function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}
