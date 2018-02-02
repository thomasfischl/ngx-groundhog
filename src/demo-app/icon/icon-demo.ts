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
      .addSvgIcon('chrome',
        sanitizer.bypassSecurityTrustResourceUrl('/icon/assets/chrome.svg'))
      .addSvgIconInNamespace('core', 'angularjs',
        sanitizer.bypassSecurityTrustResourceUrl('/icon/assets/angularjs.svg'))
      .addSvgIconInNamespace('core', 'firefox',
        sanitizer.bypassSecurityTrustResourceUrl('/icon/assets/firefox.svg'))
      .addSvgIconInNamespace('core', 'docker',
        sanitizer.bypassSecurityTrustResourceUrl('/icon/assets/docker.svg'));
  }
}
