import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GhCalendar} from './calendar';
import {GhDatepicker} from './datepicker';
import {GhDatepickerIntl} from './datepicker-intl';
import {GhButtonModule} from '@dynatrace/ngx-groundhog/button';

@NgModule({
  imports: [
    CommonModule,
    GhButtonModule,
  ],
  exports: [
    GhCalendar,
    GhDatepicker,
  ],
  declarations: [
    GhCalendar,
    GhDatepicker,
  ],
  providers: [GhDatepickerIntl]
})
export class GhDatepickerModule {}
