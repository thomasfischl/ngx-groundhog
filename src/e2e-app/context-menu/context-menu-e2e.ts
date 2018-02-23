import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'context-menu-e2e',
  templateUrl: 'context-menu-e2e.html',
})
export class ContextMenuE2E {
  disabled: boolean = false;
  clickCounter: number = 0;
}
