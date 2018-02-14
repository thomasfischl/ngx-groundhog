import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {GhIconRegistry} from '@dynatrace/ngx-groundhog';

@Component({
  moduleId: module.id,
  selector: 'progress-circle-demo',
  templateUrl: 'progress-circle-demo.html',
  styleUrls: ['progress-circle-demo.css'],
})
export class ProgressCircleDemo {

  progress = 150;
  min = 100;
  max = 200;

  constructor(iconRegistry: GhIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry
      .addSvgIcon('ai',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/ai.svg'));
  }
}
