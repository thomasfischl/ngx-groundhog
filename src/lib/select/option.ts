import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'gh-option',
  moduleId: module.id,
  exportAs: 'ghOption',
  templateUrl: 'option.html',
  styleUrls: ['option.css'],
  host: {
    'role': 'option',
    '[attr.aria-selected]': 'selected.toString()',
    '(click)': '_toggle()',
    'class': 'gh-option',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhOption {
  private _selected = false;

  get selected() {
    return this._selected;
  }

  @Output()
  onSelectionChange = new EventEmitter<boolean>();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {

  }

  select() {
    if (!this._selected) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      this.onSelectionChange.emit(true);
    }
  }

  deselect() {
    if (this._selected) {
      this._selected = false;
      this._changeDetectorRef.markForCheck();
      this.onSelectionChange.emit(false);
    }
  }

  _toggle() {
    this._selected = !this._selected;
    this._changeDetectorRef.markForCheck();
    this.onSelectionChange.emit(this._selected);
  }
}
