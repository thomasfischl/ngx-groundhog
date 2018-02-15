import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  mixinTabIndex,
  mixinDisabled,
  CanDisable,
  HasTabIndex
} from '@dynatrace/ngx-groundhog/core';

/**
 * Checkbox IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let nextUniqueId = 0;

// Boilerplate for applying mixins to GhCheckbox.
export class GhCheckboxBase {
  constructor() { }
}
export const _GhCheckboxMixinBase = mixinTabIndex(mixinDisabled(GhCheckboxBase));

@Component({
  moduleId: module.id,
  selector: 'gh-checkbox',
  templateUrl: 'checkbox.html',
  styleUrls: ['checkbox.css'],
  exportAs: 'ghCheckbox',
  host: {
    'class': 'gh-checkbox',
    '[class.gh-checkbox-checked]': 'checked',
  },
  inputs: ['disabled', 'tabIndex'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhCheckbox extends _GhCheckboxMixinBase implements CanDisable, HasTabIndex {

  // TODO: aria attributes, required

  @Input()
  get checked(): boolean { return this._checked; }
  set checked(value: boolean) {
    value = coerceBooleanProperty(value);
    if (value !== this._checked) {
      this._checked = value;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Unique id of the element. */
  @Input()
  get id(): string { return this._id; }
  set id(value: string) {
    this._id = value || this._uid;
  }

  @Input() name: string;

  @Input() value: string;

  @Output() readonly change = new EventEmitter<boolean>();

  /** Whether or not the checkbox is checked. */
  private _checked: boolean = false;

  /** Unique id for this checkbox. */
  private _uid = `gh-checkbox-${nextUniqueId++}`;

  /** _uid or provided id via input */
  private _id: string;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    super();

    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

}
