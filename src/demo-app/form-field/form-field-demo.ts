import {Component} from '@angular/core';
import {GhIconRegistry} from '@dynatrace/ngx-groundhog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'form-field-demo',
  templateUrl: 'form-field-demo.html',
  styleUrls: ['form-field-demo.css'],
})
export class FormFieldDemo {
  constructor(iconRegistry: GhIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry
      .addSvgIcon('sensor',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/sensor.svg'))
      .addSvgIcon('ai',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/ai.svg'));
  }
}
