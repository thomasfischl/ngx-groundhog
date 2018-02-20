import {
  Component,
  Directive,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  AfterContentInit,
  ChangeDetectorRef,
  AfterContentChecked,
  AfterViewInit,
} from '@angular/core';
import { startWith } from 'rxjs/operators/startWith';
import {
  getFormFieldDuplicatedHintError,
  getFormFieldMissingControlError
} from './form-field-errors';
import { GhFormFieldControl } from './form-field-control';
import { trigger, state, style, transition, animate } from '@angular/animations';

let nextUniqueId = 0;

/** Hint text to be shown underneath the form field control. */
@Directive({
  selector: 'gh-hint',
  host: {
    'class': 'gh-hint',
    '[class.gh-hint-right]': 'align == "end"',
    '[attr.id]': 'id',
    // Remove align attribute to prevent it from interfering with layout.
    '[attr.align]': 'null',
  }
})
export class GhHint {
  /** Whether to align the hint label at the start or end of the line. */
  @Input() align: 'start' | 'end' = 'start';

  /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
  @Input() id: string = `gh-hint-${nextUniqueId++}`;
}


@Directive({
  selector: 'gh-label'
})
export class GhLabel { }

/** Single error message to be shown underneath the form field. */
@Directive({
  selector: 'gh-error',
  host: {
    'class': 'gh-error',
    'role': 'alert',
    '[attr.id]': 'id',
  }
})
export class GhError {
  @Input() id: string = `gh-error-${nextUniqueId++}`;
}


@Component({
  moduleId: module.id,
  selector: 'gh-form-field',
  exportAs: 'ghFormField',
  templateUrl: 'form-field.html',
  styleUrls: [
    'form-field.css',
    // GhInput is a directive and can't have styles, so we need to include its styles here.
    '../input/input.css',
  ],
  host: {
    'class': 'gh-form-field',
    '[class.gh-form-field-invalid]': '_control.errorState',
    '[class.gh-form-field-disabled]': '_control.disabled',
    '[class.gh-focused]': '_control.focused',
    '[class.ng-untouched]': '_shouldForward("untouched")',
    '[class.ng-touched]': '_shouldForward("touched")',
    '[class.ng-pristine]': '_shouldForward("pristine")',
    '[class.ng-dirty]': '_shouldForward("dirty")',
    '[class.ng-valid]': '_shouldForward("valid")',
    '[class.ng-invalid]': '_shouldForward("invalid")',
    '[class.ng-pending]': '_shouldForward("pending")',
  },
  animations: [
    trigger('transitionErrors', [
      state('enter', style({ opacity: 1, transform: 'scaleY(1)' })),
      transition('void => enter', [
        style({ opacity: 0, transform: 'scaleY(0)' }),
        animate('150ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhFormField implements AfterContentInit, AfterContentChecked, AfterViewInit {

  /** Text for the form field hint. */
  @Input()
  get hintLabel(): string { return this._hintLabel; }
  set hintLabel(value: string) {
    this._hintLabel = value;
    this._processHints();
  }

  // Unique id for the hint label.
  _hintLabelId: string = `gh-hint-${nextUniqueId++}`;

  @ContentChild(GhLabel) _labelChild: GhLabel;
  @ContentChildren(GhHint) _hintChildren: QueryList<GhHint>;
  @ContentChildren(GhError) _errorChildren: QueryList<GhError>;
  @ContentChild(GhFormFieldControl) _control: GhFormFieldControl<any>;

  private _hintLabel = '';

  /** State of the gh-error animations. */
  _errorAnimationState: string = '';

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  ngAfterContentInit() {
    this._validateControlChild();
     // Subscribe to changes in the child control state in order to update the form field UI.
     this._control.stateChanges.pipe(startWith(null!)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });

    const ngControl = this._control.ngControl;
    if (ngControl && ngControl.valueChanges) {
      ngControl.valueChanges.subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
    }

    // Re-validate when the number of hints changes.
    this._hintChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });

    // Update the aria-described by when the number of errors changes.
    this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterContentChecked() {
    this._validateControlChild();
  }

  ngAfterViewInit() {
    // Avoid animations on load.
    this._errorAnimationState = 'enter';
    this._changeDetectorRef.detectChanges();
  }

  /** Determines whether a class from the NgControl should be forwarded to the host element. */
  _shouldForward(prop: string): boolean {
    let ngControl = this._control ? this._control.ngControl : null;
    return ngControl && (ngControl as any)[prop];
  }

  /** Determines whether to display hints or errors. */
  _getDisplayedError(): boolean {
    return this._errorChildren && this._errorChildren.length > 0 &&
      this._control.errorState;
  }

  /** Throws an error if the form field's control is missing. */
  private _validateControlChild() {
    if (!this._control) {
      throw getFormFieldMissingControlError();
    }
  }

  /** Does any extra processing that is required when handling the hints. */
  private _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }

  /**
   * Ensure that there is a maximum of one of each `<gh-hint>` alignment specified, with the
   * attribute being considered as `align="start"`.
   */
  private _validateHints() {
    if (this._hintChildren) {
      let startHint: GhHint;
      let endHint: GhHint;
      this._hintChildren.forEach((hint: GhHint) => {
        if (hint.align === 'start') {
          if (startHint || this.hintLabel) {
            throw getFormFieldDuplicatedHintError('start');
          }
          startHint = hint;
        } else if (hint.align === 'end') {
          if (endHint) {
            throw getFormFieldDuplicatedHintError('end');
          }
          endHint = hint;
        }
      });
    }
  }

  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  private _syncDescribedByIds() {
    if (this._control) {
      let ids: string[] = [];

      const startHint = this._hintChildren ?
        this._hintChildren.find(hint => hint.align === 'start') : null;
      const endHint = this._hintChildren ?
        this._hintChildren.find(hint => hint.align === 'end') : null;

      if (startHint) {
        ids.push(startHint.id);
      } else if (this._hintLabel) {
        ids.push(this._hintLabelId);
      }

      if (endHint) {
        ids.push(endHint.id);
      } else if (this._errorChildren) {
        ids = this._errorChildren.map(error => error.id);
      }
      this._control.setDescribedByIds(ids);
    }
  }
}
