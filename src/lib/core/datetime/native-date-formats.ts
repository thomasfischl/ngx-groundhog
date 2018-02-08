// Note: This has been directly taken from @angular/material2
// util it will maybe be moved to the CDK
// Tracking issue: https://github.com/angular/material2/issues/9839

import {GhDateFormats} from './date-formats';

export const GH_NATIVE_DATE_FORMATS: GhDateFormats = {
  parse: {
    dateInput: null,
  },
  display: {
    dateInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
    monthYearLabel: {year: 'numeric', month: 'short'},
    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
};
