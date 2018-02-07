import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { E2EApp, Home } from './e2e-app/e2e-app';
import { E2E_APP_ROUTES } from './e2e-app/routes';
import {
  GhButtonModule,
} from '@dynatrace/ngx-groundhog';
import { ButtonE2E } from './button/button-e2e';

/**
 * NgModule that contains all Groundhog modules that are required to serve the e2e-app.
 */
@NgModule({
  exports: [
    GhButtonModule,
  ]
})
export class E2eNgxGroundhogModule {}

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(E2E_APP_ROUTES),
    E2eNgxGroundhogModule,
    NoopAnimationsModule,
    ReactiveFormsModule
  ],
  declarations: [
    E2EApp,
    Home,
    ButtonE2E,
  ],
  bootstrap: [E2EApp],
  entryComponents: [Home],
})
export class E2eAppModule { }
