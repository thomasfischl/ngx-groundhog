import {
  Directive,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE, DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';

@Component({
  moduleId: module.id,
  selector: 'gh-expandable',
  templateUrl: 'expandable.html',
  styleUrls: ['expandable.css'],
  host: {
    'class': 'gh-expandable',
    '[class.gh-expandable-open]': 'opened'
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhExpandable {

  @Input()
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { this._opened = coerceBooleanProperty(value); }

  private _opened: boolean = false;

  constructor (private _changeDetectorRef: ChangeDetectorRef) {}

  toggle(): void {
    this._opened ? this.close() : this.open();
  }

  open(): void {
    this._opened = true;
    this._changeDetectorRef.markForCheck();
  }

  close(): void {
    this._opened = false;
    this._changeDetectorRef.markForCheck();
  }

}

@Directive({
  selector: '[ghExpandable]',
  host: {
    'tabindex': '0',
    'class': 'gh-expandable-trigger',
    '[class.gh-expandable-trigger-open]': 'opened',
    '(click)': '_onClick($event)',
    '(keydown)': '_handleKeydown($event)'
  }
})
export class GhExpandableTrigger {

  @Input()
  set ghExpandable(value: GhExpandable) {
    if (value) {
      this._expandable = value;
    }
  }
  private _expandable: GhExpandable;

  get opened(): boolean { return this._expandable.opened; }

  _onClick(event: MouseEvent) {
    if (this._expandable) {
      this._expandable.toggle();
    }
    event.preventDefault();
  }

  _handleKeydown(event: KeyboardEvent)  {
    const keyCode = event.keyCode;
    const isAltKey = event.altKey;
    if (keyCode === ENTER || keyCode === SPACE) {
      this._expandable.toggle();
    } else if (isAltKey && keyCode === DOWN_ARROW) {
      this._expandable.open();
    } else if(isAltKey && keyCode === UP_ARROW) {
      this._expandable.close();
    }
  }

}


// input
// output
// public prop
// template prop
// private
// constructor
// public methods
// template methods
// private methods
