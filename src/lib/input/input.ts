import {
  Directive,
  Input,
  Optional,
  Self,
  OnChanges,
  OnDestroy,
  ElementRef,
  DoCheck
} from '@angular/core';
import { NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform, getSupportedInputTypes } from '@angular/cdk/platform';
import { Subject } from 'rxjs/Subject';
import {
  ErrorStateMatcher,
  mixinErrorState,
  CanUpdateErrorState
} from '@dynatrace/ngx-groundhog/core';
import { GhFormFieldControl } from '@dynatrace/ngx-groundhog/form-field';

let nextUniqueId = 0;

// Invalid input type. Using one of these will throw an error.
const INPUT_INVALID_TYPES = [
  'button',
  'checkbox',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit'
];

const NEVER_EMPTY_INPUT_TYPES = [
  'date',
  'datetime',
  'datetime-local',
  'month',
  'time',
  'week'
].filter(t => getSupportedInputTypes().has(t));

const INPUT_VALIDATION_DELAY = 250;

// Boilerplate for applying mixins to GhInput.
export class GhInputBase {
  constructor(public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl) { }
}
export const _GhInputMixinBase = mixinErrorState(GhInputBase);

@Directive({
  selector: `input[ghInput], textarea[ghInput]`,
  exportAs: 'ghInput',
  host: {
    'class': 'gh-input',
    '[class.gh-input-invalid]': 'errorState',
    '[attr.id]': 'id',
    '[placeholder]': 'placeholder',
    '[disabled]': 'disabled',
    '[required]': 'required',
    '[readonly]': 'readonly',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-required]': 'required.toString()',
    '(blur)': '_focusChanged(false)',
    '(focus)': '_focusChanged(true)',
    '(input)': '_onInput()',
  },
  providers: [{provide: GhFormFieldControl, useExisting: GhInput}],
})
export class GhInput extends _GhInputMixinBase
  implements OnChanges, OnDestroy, DoCheck, GhFormFieldControl<any>, CanUpdateErrorState {

  /** Implemented as part of GhFormFieldControl. */
  @Input()
  get id(): string { return this._id; }
  set id(value: string) { this._id = value || this._uid; }

  /** Implemented as part of GhFormFieldControl. */
  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  /** Implemented as part of GhFormFieldControl. */
  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) { this._required = coerceBooleanProperty(value); }

  @Input() placeholder: string = '';

  /** Input type of the element. */
  @Input()
  get type(): string { return this._type; }
  set type(value: string) {
    this._type = value || 'text';
    this._validateType();

    // When using Angular inputs, developers are no longer able to set the properties on the native
    // input element. To ensure that bindings for `type` work, we need to sync the setter
    // with the native property. Textarea elements don't support the type property or attribute.
    if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
      this._elementRef.nativeElement.type = this._type;
    }
  }

  @Input()
  get value(): string { return this._inputValueAccessor.value; }
  set value(value: string) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean { return this._readonly; }
  set readonly(value: boolean) { this._readonly = coerceBooleanProperty(value); }
  private _readonly = false;

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /** Implemented as part of MatFormFieldControl.*/
  get empty(): boolean {
    return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput();
  }

  /** Implemented as part of GhFormFieldControl. */
  readonly stateChanges: Subject<void> = new Subject<void>();

  /** Implemented as part of GhFormFieldControl. */
  focused: boolean = false;

  /** The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  private get _inputValueAccessor(): {value: any} { return this._elementRef.nativeElement; }
  private _uid = `gh-input-${nextUniqueId++}`;
  private _id: string;
  private _disabled = false;
  private _required = false;
  private _type = 'text';
  private _previousNativeValue: any;
  private _inputTimer: number | null;

  constructor(private _elementRef: ElementRef,
    private _platform: Platform,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    // Force setter to be called in case id was not specified.
    this.id = this.id;

    this._previousNativeValue = this.value;
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this._stopInputTimer();
    this.stateChanges.complete();
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }

    // We need to dirty-check the native element's value, because there are some cases where
    // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
    // updating the value using `emitEvent: false`).
    this._dirtyCheckNativeValue();
  }

  /** Focuses the input. */
  focus(): void { this._elementRef.nativeElement.focus(); }

  /** Implemented as part of GhFormFieldControl. */
  setDescribedByIds(ids: string[]) { this._ariaDescribedby = ids.join(' '); }

  /** Implemented as part of GhFormFieldControl. */
  onContainerClick() { this.focus(); }

  _onInput() {
    // _onInput is basically just a noop function to trigger change detection
    // when the user types.
    // Note: Never remove this function, even if it's empty.


    // Stop the ongoing timeout
    this._stopInputTimer();

    // We want to override the default behaviour on angular forms
    // to also show the error when the user starts typing and then
    // waits. In this case the form control has to be manually marked
    // as touched.
    if (!this.ngControl.touched) {
      this._inputTimer = setTimeout(() => {
        if (this.ngControl.control) {
          // Per default touched will only be updated on the blur event
          // but as we need to set it manually and setting touched outside
          // of angular forms is exposed we need this hacky line of code
          (this.ngControl.control as{touched: boolean}).touched = true;
          this.stateChanges.next();
        }
      }, INPUT_VALIDATION_DELAY);
    }
  }

  /** Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && !this.readonly) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  /** Determines if the component host is a textarea. If not recognizable it returns false. */
  private _isTextarea() {
    let nativeElement = this._elementRef.nativeElement;

    // In Universal, we don't have access to `nodeName`, but the same can be achieved with `name`.
    let nodeName = this._platform.isBrowser ? nativeElement.nodeName : nativeElement.name;
    return nodeName ? nodeName.toLowerCase() === 'textarea' : false;
  }

  /** Make sure the input is a supported type. */
  private _validateType() {
    if (INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
      throw new Error(`Input type "${this._type}" isn't supported by ghInput.`);
    }
  }

  /** Does some manual dirty checking on the native input `value` property. */
  private _dirtyCheckNativeValue() {
    const newValue = this.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Stops the current input timeout and resets it */
  private _stopInputTimer() {
    if (this._inputTimer) {
      clearTimeout(this._inputTimer);
      this._inputTimer = null;
    }
  }

  /** Checks whether the input type is one of the types that are never empty. */
  private _isNeverEmpty() {
    return NEVER_EMPTY_INPUT_TYPES.indexOf(this._type) > -1;
  }

  /** Checks whether the input is invalid based on the native validation. */
  protected _isBadInput() {
    // The `validity` property won't be present on platform-server.
    let validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

}
