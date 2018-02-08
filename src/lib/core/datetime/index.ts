// Note: This has been directly taken from @angular/material2
// util it will maybe be moved to the CDK
// Tracking issue: https://github.com/angular/material2/issues/9839

import {NgModule} from '@angular/core';
import {DateAdapter, GH_DATE_LOCALE_PROVIDER} from './date-adapter';
import {GH_DATE_FORMATS} from './date-formats';
import {NativeDateAdapter} from './native-date-adapter';
import {GH_NATIVE_DATE_FORMATS} from './native-date-formats';

export * from './date-adapter';
export * from './date-formats';
export * from './native-date-adapter';
export * from './native-date-formats';


@NgModule({
  providers: [
    {provide: DateAdapter, useClass: NativeDateAdapter},
    GH_DATE_LOCALE_PROVIDER
  ],
})
export class NativeDateModule {}


@NgModule({
  imports: [NativeDateModule],
  providers: [{provide: GH_DATE_FORMATS, useValue: GH_NATIVE_DATE_FORMATS}],
})
export class GhNativeDateModule {}
