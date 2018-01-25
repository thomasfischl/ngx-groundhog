import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  Input,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import {mixinDisabled, CanDisable} from '@dynatrace/ngx-groundhog/core';

/** Event object emitted by MatOption when selected or deselected. */
export interface GhOptionSelectionChange {
    /** Reference to the option that emitted the event. */
    source: GhOption;
    /** Whether the change in the option's value was a result of a user action. */
    isUserInput: boolean;
}

// Boilerplate for applying mixins to GhOption.
export class GhOptionBase {
  constructor() {}
}
export const _GhOptionMixinBase = mixinDisabled(GhOptionBase);

@Component({
  selector: 'gh-option',
  moduleId: module.id,
  exportAs: 'ghOption',
  templateUrl: 'option.html',
  styleUrls: ['option.css'],
  inputs: ['disabled'],
  host: {
    'role': 'option',
    '[attr.aria-selected]': 'selected.toString()',
    '(click)': '_toggleViaInteraction()',
    'class': 'gh-option',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhOption extends _GhOptionMixinBase implements CanDisable {
  private _selected = false;

  get selected() { return this._selected; }

  /** The displayed value of the option. */
  get viewValue(): string {
    return (this._element.nativeElement.textContent || '').trim();
  }


  /** The form value of the option. */
  @Input() value: any;

  /** Event emitted when the option is selected or deselected. */
  @Output() onSelectionChange = new EventEmitter<GhOptionSelectionChange>();

  constructor (private _changeDetectorRef: ChangeDetectorRef,
               private _element: ElementRef
  ) {
    super();
  }

  /** Selects the option. */
  select() {
    if (!this._selected) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /** Deselects the option. */
  deselect() {
    if (this._selected) {
      this._selected = false;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent();
    }
  }

  /**
   * Selects the option while indicating the selection came from the user. Used to
   * determine if the select's view -> model callback should be invoked.
   */
  _toggleViaInteraction() {
    if (!this.disabled) {
      this._selected = !this._selected;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  /** Emits the selection change event. */
  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit({source: this, isUserInput});
  }
}
