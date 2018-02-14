import {NgModule} from '@angular/core';
import {
  GhButtonModule,
  GhFormFieldModule,
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
    GhFormFieldModule,
    GhIconModule,
    GhProgressCircleModule,
    GhSelectModule,
  ]
})
export class DemoGroundhogModule {}
