import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {GhIconRegistry} from '@dynatrace/ngx-groundhog';

@Component({
  moduleId: module.id,
  selector: 'progresscircle-demo',
  templateUrl: 'progresscircle-demo.html',
  styleUrls: ['progresscircle-demo.css'],
})
export class ProgresscircleDemo {

  progress = 25;
  min = 0;
  max = 100;

  constructor(iconRegistry: GhIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry
      .addSvgIcon('ai',
        sanitizer.bypassSecurityTrustResourceUrl('/assets/ai.svg'));
  }
}
