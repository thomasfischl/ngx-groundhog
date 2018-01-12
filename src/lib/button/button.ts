import {Directive} from '@angular/core';

/**
 * Directive whose purpose is to add the Groundhog CSS styling to this selector.
 */
@Directive({
  selector: 'button[gh-button], a[gh-button]',
  host: {'class': 'gh-button'}
})
export class GhButtonCssStyler {}
