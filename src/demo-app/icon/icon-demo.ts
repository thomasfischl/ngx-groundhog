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
      .addSvgIcon('dynatrace',
        sanitizer.bypassSecurityTrustResourceUrl('/icon/assets/dynatrace.svg'))
      .addSvgIconInNamespace('core', 'angularjs',
        sanitizer.bypassSecurityTrustResourceUrl('/icon/assets/angularjs.svg'));
  }
}
