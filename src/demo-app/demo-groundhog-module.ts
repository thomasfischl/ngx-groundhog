import {NgModule} from '@angular/core';
import {
  GhButtonModule,
  GhCheckboxModule,
  GhIconModule,
  GhProgressCircleModule,
  GhSelectModule,
} from '@dynatrace/ngx-groundhog';

/**
 * NgModule that includes all Groundhog modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    GhButtonModule,
    GhCheckboxModule,
    GhIconModule,
    GhProgressCircleModule,
    GhSelectModule,
  ]
})
export class DemoGroundhogModule {}
