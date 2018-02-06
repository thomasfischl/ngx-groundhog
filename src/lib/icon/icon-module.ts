import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GhIcon} from './icon';
import {ICON_REGISTRY_PROVIDER} from './icon-registry';

@NgModule({
  exports: [
    GhIcon
  ],
  declarations: [
    GhIcon
  ],
  providers: [
    ICON_REGISTRY_PROVIDER
  ]
})
export class GhIconModule {}
