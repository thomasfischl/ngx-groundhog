import {NgModule} from '@angular/core';
import {
  GhButtonModule,
} from '@dyntrace/ngx-groundhog';

/**
 * NgModule that includes all Groundhog modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    GhButtonModule,
  ]
})
export class DemoGroundhogModule {}
