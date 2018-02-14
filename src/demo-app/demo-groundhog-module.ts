import {NgModule} from '@angular/core';
import {
  GhButtonModule,
  GhIconModule,
  GhSelectModule,
  GhInputfieldModule,
} from '@dynatrace/ngx-groundhog';

/**
 * NgModule that includes all Groundhog modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    GhButtonModule,
    GhIconModule,
    GhSelectModule,
    GhInputfieldModule,
  ]
})
export class DemoGroundhogModule {}
