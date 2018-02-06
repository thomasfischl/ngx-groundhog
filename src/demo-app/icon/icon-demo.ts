import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {GhIconRegistry} from '@dynatrace/ngx-groundhog';

@Component({
  moduleId: module.id,
  selector: 'icon-demo',
  templateUrl: 'icon-demo.html',
  styleUrls: ['icon-demo.css'],
})
export class IconDemo {

  constructor(iconRegistry: GhIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry
      .addSvgIcon('agent',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/agent.svg'))
      .addSvgIconInNamespace('core', 'sensor',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/sensor.svg'))
      .addSvgIconInNamespace('core', 'ai',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/ai.svg'));
  }
}
