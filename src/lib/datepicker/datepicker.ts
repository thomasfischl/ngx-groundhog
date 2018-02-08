import {Component, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'gh-datepicker',
  templateUrl: 'datepicker.html',
  styleUrls: ['datepicker.scss'],
  exportAs: 'ghDatepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class GhDatepicker { }
