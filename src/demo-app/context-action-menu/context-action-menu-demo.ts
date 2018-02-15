import {Component, ViewChild} from '@angular/core';
import { GhContextActionMenu } from '@dynatrace/ngx-groundhog';

@Component({
  moduleId: module.id,
  selector: 'context-action-menu-demo',
  templateUrl: 'context-action-menu-demo.html',
  styleUrls: ['context-action-menu-demo.css'],
})
export class ContextActionMenuDemo {
  deleteClickCount: number = 0;
  deleteClickEvent: string = '';
  opened: boolean = false;

  @ViewChild('caMenu') caMenu: GhContextActionMenu;

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
