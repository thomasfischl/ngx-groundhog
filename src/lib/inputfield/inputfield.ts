import {
  Directive,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'gh-inputfield',
  templateUrl: 'inputfield.html',
  styleUrls: ['inputfield.css'],
  host: {
    'class': 'gh-inputfield',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhInputfield {

}
