import {Component, ViewChild} from '@angular/core';
import { GhContextMenu } from '@dynatrace/ngx-groundhog';

@Component({
  moduleId: module.id,
  selector: 'context-menu-demo',
  templateUrl: 'context-menu-demo.html',
  styleUrls: ['context-menu-demo.css'],
})
export class ContextMenuDemo {
  deleteClickCount: number = 0;
  deleteClickEvent: string = '';
  opened: boolean = false;
  disabled: boolean = false;
  editDisabled: boolean = false;

  @ViewChild('contextMenu') caMenu: GhContextMenu;

  handleDeleteClick(event: Event) {
    this.deleteClickCount++;
    this.deleteClickEvent = event.toString();
  }

  open() {
    this.caMenu.open();
  }

  close() {
    this.caMenu.close();
  }
}
