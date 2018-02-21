import { Component } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {GhIconRegistry} from '@dynatrace/ngx-groundhog';

@Component({
  moduleId: module.id,
  selector: 'tile-demo',
  templateUrl: 'tile-demo.html',
  styleUrls: ['tile-demo.css'],
})
export class TileDemo {

  constructor (iconRegistry: GhIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('agent',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/agent.svg'));
  }
}
