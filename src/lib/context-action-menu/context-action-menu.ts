import {
  Directive,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'context-action-menu',
  templateUrl: 'context-action-menu.html',
  styleUrls: ['context-action-menu.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhContextActionMenu {

}
