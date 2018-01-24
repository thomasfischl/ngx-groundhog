import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { NgClass } from '@angular/common';

export interface GhSelectOption {
  key: string;
  label: string;
}

@Component({
  moduleId: module.id,
  selector: 'gh-select',
  exportAs: 'ghSelect',
  templateUrl: 'select.html',
  styleUrls: ['select.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhSelect {

  private _data: GhSelectOption[];
  private _placeholder: string;
  private _panelOpen = false;
  private _selectedValue: GhSelectOption;

  @Input()
  panelClass: string | Set<string> | string[] | {[key: string]: any};

  @Input()
  get data() {
    return this._data;
  }
  set data(newdata: GhSelectOption[]) {
    // TODO: @thomasheller do the parsing to Array
    this._data = newdata as GhSelectOption[];
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(newplaceholder: string) {
    this._placeholder = newplaceholder;
  }

  get empty() {
    return !this._selectedValue;
  }

  get triggerValue() {
    return this._selectedValue ? this._selectedValue.label : 'No value selected';
  }

  get panelOpen() {
    return this._panelOpen;
  }

  @ViewChild('panel')
  panel: ElementRef;

  // constructor
  constructor(private _changeDetectionRef: ChangeDetectorRef ) {
  }

  /**
   * Opens the panel
   */
  open() {
    if (!this._panelOpen) {
      this._panelOpen = true;
      this._changeDetectionRef.markForCheck();
    }
  }

  /**
   * Closes the panel
   */
  close() {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._changeDetectionRef.markForCheck();
    }
  }

  /**
   * Toggles the panel
  */
  toggle() {
    this._panelOpen ? this.close() : this.open();
  }

  /**
   * Selects a value
   */
  select(option: GhSelectOption) {
    this._selectedValue = option;
    this.close();
  }
}
