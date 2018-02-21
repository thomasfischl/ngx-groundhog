import {NgModule} from '@angular/core';
import {
  GhButtonModule,
  GhFormFieldModule,
  GhIconModule,
  GhInputModule,
  GhProgressCircleModule,
  GhSelectModule,
  GhTileModule,
} from '@dynatrace/ngx-groundhog';

/**
 * NgModule that includes all Groundhog modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    GhButtonModule,
    GhFormFieldModule,
    GhIconModule,
    GhInputModule,
    GhProgressCircleModule,
    GhSelectModule,
    GhTileModule,
  ]
})
export class DemoGroundhogModule {}
