import {Component} from '@angular/core';
import {GhIconRegistry} from '@dynatrace/ngx-groundhog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'island-demo',
  templateUrl: 'island-demo.html',
  styleUrls: ['island-demo.css'],
})
export class IslandDemo {
  constructor(iconRegistry: GhIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry
      .addSvgIcon('agent',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/agent.svg'));
  }
}
