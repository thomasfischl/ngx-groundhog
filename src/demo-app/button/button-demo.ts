import {Component} from '@angular/core';
import {GhIconRegistry} from '@dynatrace/ngx-groundhog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'button-demo',
  templateUrl: 'button-demo.html',
  styleUrls: ['button-demo.css'],
})
export class ButtonDemo {

  colors = [
    { name: 'Default', key: null},
    { name: 'Accent', key: 'accent'},
    { name: 'Warning', key: 'warning'},
    { name: 'Error', key: 'error'},
    { name: 'Call to action', key: 'cta'}
  ]

  constructor(iconRegistry: GhIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry
      .addSvgIcon('sensor',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/sensor.svg'))
      .addSvgIcon('ai',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/ai.svg'));
  }
}
