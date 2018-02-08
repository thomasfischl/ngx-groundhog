import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';


/** Datepicker data that requires internationalization. */
@Injectable()
export class GhDatepickerIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();
  /** A label for the previous year button (used by screen readers). */
  prevYearLabel: string = 'Previous year';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel: string = 'Next year';
}
