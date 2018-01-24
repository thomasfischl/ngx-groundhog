import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'gh-option',
  moduleId: module.id,
  exportAs: 'ghOption',
  templateUrl: 'option.html',
  styleUrls: ['option.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhOption {

}