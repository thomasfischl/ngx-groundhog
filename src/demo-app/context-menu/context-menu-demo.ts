import {Component, ViewChild, ContentChild} from '@angular/core';
import { GhContextMenu, GhContextMenuItem } from '@dynatrace/ngx-groundhog';

@Component({
  moduleId: module.id,
  selector: 'context-menu-demo',
  templateUrl: 'context-menu-demo.html',
})
export class ContextMenuDemo {
  deleteClickCount: number = 0;
  deleteClickEvent: string = '';
  opened: boolean = false;
  disabled: boolean = false;
  editDisabled: boolean = false;
  color: string = 'error';

  @ViewChild('contextMenu') caMenu: GhContextMenu;

  handleDeleteClick(event: Event) {
    this.deleteClickCount++;
    this.deleteClickEvent = event.toString();
    this.color = 'accent';
  }


  open() {
    this.caMenu.open();
  }

  close() {
    this.caMenu.close();
  }
}
