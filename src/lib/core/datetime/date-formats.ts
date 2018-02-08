// Note: This has been directly taken from @angular/material2
// util it will maybe be moved to the CDK
// Tracking issue: https://github.com/angular/material2/issues/9839

import {InjectionToken} from '@angular/core';

export type GhDateFormats = {
  parse: {
    dateInput: any
  },
  display: {
    dateInput: any,
    monthYearLabel: any,
    dateA11yLabel: any,
    monthYearA11yLabel: any,
  }
};


export const GH_DATE_FORMATS = new InjectionToken<GhDateFormats>('gh-date-formats');
